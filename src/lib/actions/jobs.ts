"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { APPLICATION_STATUSES, labelFor } from "@/lib/constants/jobs";
import {
  applicationStatusEmail,
  sendTransactionalEmail,
  siteUrl,
} from "@/lib/email/resend";
import { VIEWED_JOBS_COOKIE, parseViewedJobIds } from "@/lib/job-views";
import { emptyToNull, getAuthedUser } from "@/lib/supabase/user";
import {
  applyToJobSchema,
  jobIdSchema,
  jobSchema,
  updateApplicationStatusSchema,
} from "@/lib/validations/jobs";
import type { Database, Tables } from "@/types/database.types";

type ActionResult<T = undefined> = {
  error?: string;
  data?: T;
};

type JobType = Database["public"]["Enums"]["job_type"];
type WorkMode = Database["public"]["Enums"]["work_mode"];
type ApplicationStatus = Database["public"]["Enums"]["application_status"];

export type JobWithCompany = Tables<"jobs"> & {
  companies: Pick<Tables<"companies">, "id" | "name" | "logo_url" | "is_verified_inclusive"> | null;
};

export type JobFilters = {
  type?: string;
  workMode?: string;
  resources?: string[];
  companyId?: string;
};

export type MyApplication = Tables<"applications"> & {
  jobs: (Tables<"jobs"> & {
    companies: Pick<Tables<"companies">, "id" | "name"> | null;
  }) | null;
};

export type ReceivedApplication = Tables<"applications"> & {
  jobs: (Pick<Tables<"jobs">, "id" | "title" | "company_id"> & {
    companies: Pick<Tables<"companies">, "id" | "name"> | null;
  }) | null;
  profiles_public: Pick<
    Tables<"profiles_public">,
    "id" | "full_name" | "headline"
  > | null;
};

function unwrapOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

async function assertCompanyMember(
  supabase: Awaited<ReturnType<typeof getAuthedUser>>["supabase"],
  companyId: string,
) {
  const { data, error } = await supabase.rpc("is_company_member", {
    target_company_id: companyId,
  });

  return !error && data === true;
}

export async function listOpenJobs(filters: JobFilters = {}) {
  const { supabase } = await getAuthedUser();

  let query = supabase
    .from("jobs")
    .select(
      "*, companies(id, name, logo_url, is_verified_inclusive)",
    )
    .eq("status", "aberta")
    .order("created_at", { ascending: false });

  if (filters.type) {
    query = query.eq("type", filters.type as JobType);
  }

  if (filters.workMode) {
    query = query.eq("work_mode", filters.workMode as WorkMode);
  }

  if (filters.companyId) {
    query = query.eq("company_id", filters.companyId);
  }

  if (filters.resources && filters.resources.length > 0) {
    query = query.overlaps("accessibility_resources", filters.resources);
  }

  const { data, error } = await query;

  if (error) {
    return { error: "Não foi possível carregar as vagas.", data: [] as JobWithCompany[] };
  }

  const jobs = (data ?? []).map((row) => ({
    ...row,
    companies: unwrapOne(row.companies),
  })) as JobWithCompany[];

  return { data: jobs };
}

export async function getJobById(id: string) {
  const { supabase, userId } = await getAuthedUser();

  const { data, error } = await supabase
    .from("jobs")
    .select("*, companies(id, name, logo_url, is_verified_inclusive, website)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return { error: "Vaga não encontrada." };
  }

  const company = unwrapOne(data.companies);
  const isMember = company
    ? await assertCompanyMember(supabase, data.company_id)
    : false;

  let hasApplied = false;
  if (userId) {
    const { data: application } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", id)
      .eq("profile_id", userId)
      .maybeSingle();
    hasApplied = Boolean(application);
  }

  return {
    data: {
      job: { ...data, companies: company } as JobWithCompany & {
        companies: (JobWithCompany["companies"] & { website?: string | null }) | null;
      },
      isMember,
      hasApplied,
      userId,
    },
  };
}

export async function createJob(input: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = jobSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { supabase, userId } = await getAuthedUser();

  if (!userId) {
    return { error: "Você precisa entrar para publicar uma vaga." };
  }

  const isMember = await assertCompanyMember(supabase, parsed.data.company_id);
  if (!isMember) {
    return { error: "Só quem faz parte da empresa pode publicar vaga." };
  }

  const { data, error } = await supabase
    .from("jobs")
    .insert({
      company_id: parsed.data.company_id,
      title: parsed.data.title,
      description: parsed.data.description,
      requirements: emptyToNull(parsed.data.requirements),
      type: parsed.data.type as JobType,
      work_mode: parsed.data.work_mode as WorkMode,
      location_city: emptyToNull(parsed.data.location_city),
      location_state: emptyToNull(parsed.data.location_state),
      salary_min: parsed.data.salary_min ?? null,
      salary_max: parsed.data.salary_max ?? null,
      salary_visible: parsed.data.salary_visible,
      accessibility_resources: parsed.data.accessibility_resources,
      status: "aberta",
      posted_by: userId,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: "Não foi possível publicar a vaga." };
  }

  revalidatePath("/vagas");
  revalidatePath(`/vagas/${data.id}`);
  return { data: { id: data.id } };
}

export async function updateJob(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  const parsed = jobSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { supabase, userId } = await getAuthedUser();

  if (!userId) {
    return { error: "Você precisa entrar para editar a vaga." };
  }

  const { data: current, error: currentError } = await supabase
    .from("jobs")
    .select("id, company_id")
    .eq("id", id)
    .maybeSingle();

  if (currentError || !current) {
    return { error: "Vaga não encontrada." };
  }

  if (current.company_id !== parsed.data.company_id) {
    return { error: "Não é possível mover a vaga para outra empresa." };
  }

  const isMember = await assertCompanyMember(supabase, current.company_id);
  if (!isMember) {
    return { error: "Só quem faz parte da empresa pode editar esta vaga." };
  }

  const { error } = await supabase
    .from("jobs")
    .update({
      title: parsed.data.title,
      description: parsed.data.description,
      requirements: emptyToNull(parsed.data.requirements),
      type: parsed.data.type as JobType,
      work_mode: parsed.data.work_mode as WorkMode,
      location_city: emptyToNull(parsed.data.location_city),
      location_state: emptyToNull(parsed.data.location_state),
      salary_min: parsed.data.salary_min ?? null,
      salary_max: parsed.data.salary_max ?? null,
      salary_visible: parsed.data.salary_visible,
      accessibility_resources: parsed.data.accessibility_resources,
    })
    .eq("id", id)
    .eq("company_id", current.company_id);

  if (error) {
    return { error: "Não foi possível salvar a vaga." };
  }

  revalidatePath("/vagas");
  revalidatePath(`/vagas/${id}`);
  revalidatePath(`/vagas/${id}/editar`);
  return {};
}

export async function closeJob(input: unknown): Promise<ActionResult> {
  const parsed = jobIdSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Vaga inválida." };
  }

  const { supabase, userId } = await getAuthedUser();

  if (!userId) {
    return { error: "Você precisa entrar para encerrar a vaga." };
  }

  const { data: current, error: currentError } = await supabase
    .from("jobs")
    .select("id, company_id")
    .eq("id", parsed.data.id)
    .maybeSingle();

  if (currentError || !current) {
    return { error: "Vaga não encontrada." };
  }

  const isMember = await assertCompanyMember(supabase, current.company_id);
  if (!isMember) {
    return { error: "Só quem faz parte da empresa pode encerrar esta vaga." };
  }

  const { error } = await supabase
    .from("jobs")
    .update({
      status: "encerrada",
      closes_at: new Date().toISOString(),
    })
    .eq("id", current.id)
    .eq("company_id", current.company_id);

  if (error) {
    return { error: "Não foi possível encerrar a vaga." };
  }

  revalidatePath("/vagas");
  revalidatePath(`/vagas/${current.id}`);
  return {};
}

export async function applyToJob(input: unknown): Promise<ActionResult> {
  const parsed = applyToJobSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { supabase, userId } = await getAuthedUser();

  if (!userId) {
    return { error: "Você precisa entrar para se candidatar." };
  }

  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("id, status")
    .eq("id", parsed.data.job_id)
    .maybeSingle();

  if (jobError || !job || job.status !== "aberta") {
    return { error: "Esta vaga não está aberta para candidaturas." };
  }

  const { error } = await supabase.from("applications").insert({
    job_id: parsed.data.job_id,
    profile_id: userId,
    cover_letter: emptyToNull(parsed.data.cover_letter),
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Você já se candidatou a esta vaga." };
    }
    return { error: "Não foi possível enviar a candidatura." };
  }

  revalidatePath(`/vagas/${parsed.data.job_id}`);
  revalidatePath("/candidaturas");
  return {};
}

export async function listMyApplications() {
  const { supabase, userId } = await getAuthedUser();

  if (!userId) {
    return { error: "Você precisa entrar para ver suas candidaturas.", data: [] as MyApplication[] };
  }

  const { data, error } = await supabase
    .from("applications")
    .select("*, jobs(*, companies(id, name))")
    .eq("profile_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return { error: "Não foi possível carregar suas candidaturas.", data: [] as MyApplication[] };
  }

  const applications = (data ?? []).map((row) => {
    const job = unwrapOne(row.jobs);
    return {
      ...row,
      jobs: job
        ? { ...job, companies: unwrapOne(job.companies) }
        : null,
    };
  }) as MyApplication[];

  return { data: applications };
}

export async function listReceivedApplications(companyId?: string, jobId?: string) {
  const { supabase, userId } = await getAuthedUser();

  if (!userId) {
    return {
      error: "Você precisa entrar para ver as candidaturas recebidas.",
      data: [] as ReceivedApplication[],
    };
  }

  if (!companyId) {
    return { data: [] as ReceivedApplication[] };
  }

  const isMember = await assertCompanyMember(supabase, companyId);
  if (!isMember) {
    return {
      error: "Só quem faz parte da empresa vê essas candidaturas.",
      data: [] as ReceivedApplication[],
    };
  }

  let query = supabase
    .from("applications")
    .select(
      "*, jobs!inner(id, title, company_id, companies(id, name)), profiles_public(id, full_name, headline)",
    )
    .eq("jobs.company_id", companyId)
    .order("created_at", { ascending: false });

  if (jobId) {
    query = query.eq("job_id", jobId);
  }

  const { data, error } = await query;

  if (error) {
    return {
      error: "Não foi possível carregar as candidaturas recebidas.",
      data: [] as ReceivedApplication[],
    };
  }

  const applications = (data ?? []).map((row) => {
    const job = unwrapOne(row.jobs);
    return {
      ...row,
      jobs: job
        ? { ...job, companies: unwrapOne(job.companies) }
        : null,
      profiles_public: unwrapOne(row.profiles_public),
    };
  }) as ReceivedApplication[];

  return { data: applications };
}

export async function listCompanyJobs(companyId: string) {
  const { supabase, userId } = await getAuthedUser();

  if (!userId) {
    return { data: [] as Pick<Tables<"jobs">, "id" | "title" | "status">[] };
  }

  const isMember = await assertCompanyMember(supabase, companyId);
  if (!isMember) {
    return { data: [] as Pick<Tables<"jobs">, "id" | "title" | "status">[] };
  }

  const { data, error } = await supabase
    .from("jobs")
    .select("id, title, status")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [] as Pick<Tables<"jobs">, "id" | "title" | "status">[] };
  }

  return { data: data ?? [] };
}

export async function updateApplicationStatus(
  input: unknown,
): Promise<ActionResult> {
  const parsed = updateApplicationStatusSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { supabase, userId } = await getAuthedUser();

  if (!userId) {
    return { error: "Você precisa entrar para atualizar a candidatura." };
  }

  const { data: application, error: applicationError } = await supabase
    .from("applications")
    .select("id, profile_id, job_id, jobs(id, title, company_id)")
    .eq("id", parsed.data.application_id)
    .maybeSingle();

  if (applicationError || !application) {
    return { error: "Candidatura não encontrada." };
  }

  const job = unwrapOne(application.jobs);
  if (!job) {
    return { error: "Vaga da candidatura não encontrada." };
  }

  const isMember = await assertCompanyMember(supabase, job.company_id);
  if (!isMember) {
    return { error: "Só a equipe da empresa pode mudar o status." };
  }

  const { error } = await supabase
    .from("applications")
    .update({
      status: parsed.data.status as ApplicationStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", application.id)
    .eq("job_id", job.id);

  if (error) {
    return { error: "Não foi possível atualizar o status." };
  }

  const statusLabel = labelFor(APPLICATION_STATUSES, parsed.data.status);
  const { error: notificationError } = await supabase.from("notifications").insert({
    profile_id: application.profile_id,
    type: "application_status",
    title: "Candidatura atualizada",
    body: `Sua candidatura para ${job.title} mudou para ${statusLabel}.`,
    link: "/candidaturas",
  });

  if (notificationError) {
    console.error("[jobs] notificação de candidatura falhou", notificationError);
  }

  const email = applicationStatusEmail({
    jobTitle: job.title,
    statusLabel,
    siteUrl: siteUrl(),
  });
  await sendTransactionalEmail({
    profileId: application.profile_id,
    ...email,
  });

  revalidatePath("/candidaturas");
  revalidatePath("/notificacoes");
  return {};
}

export async function rememberJobView(jobId: string) {
  const parsed = jobIdSchema.safeParse({ id: jobId });
  if (!parsed.success) return;

  const { userId } = await getAuthedUser();
  if (!userId) return;

  const store = await cookies();
  const current = parseViewedJobIds(store.get(VIEWED_JOBS_COOKIE)?.value);
  const next = [parsed.data.id, ...current.filter((id) => id !== parsed.data.id)].slice(0, 20);

  store.set(VIEWED_JOBS_COOKIE, JSON.stringify(next), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}
