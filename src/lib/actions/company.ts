"use server";

import { revalidatePath } from "next/cache";
import { listOpenJobs, type JobWithCompany } from "@/lib/actions/jobs";
import { emptyToNull, getAuthedUser } from "@/lib/supabase/user";
import {
  addCompanyMemberSchema,
  companyReviewSchema,
  companySealSchema,
  createCompanySchema,
  ownPcdBadgeSchema,
  removeCompanyMemberSchema,
} from "@/lib/validations/company";
import type { Tables } from "@/types/database.types";

type ActionResult<T = undefined> = {
  error?: string;
  code?: "already_reviewed";
  data?: T;
};

export type CompanyMembership = {
  company_id: string;
  member_role: Tables<"company_members">["member_role"];
  company: Pick<Tables<"companies">, "id" | "name" | "is_verified_inclusive">;
};

export type CompanyListItem = Tables<"companies"> & {
  rating_avg: number | null;
  accessibility_rating_avg: number | null;
  review_count: number;
};

export type PublicTeamMember = {
  id: string;
  profile_id: string;
  member_role: Tables<"company_members">["member_role"];
  show_pcd_badge: boolean;
  full_name: string;
};

export type PublicReview = {
  id: string;
  rating: number;
  accessibility_rating: number;
  comment: string | null;
  created_at: string;
  author_label: string;
};

export type OwnReview = {
  id: string;
  rating: number;
  accessibility_rating: number;
  comment: string | null;
  is_anonymous: boolean;
};

function unwrapOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function average(values: number[]) {
  if (values.length === 0) return null;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
}

function summarizeReviews(
  reviews: Pick<Tables<"company_reviews">, "rating" | "accessibility_rating">[],
) {
  return {
    rating_avg: average(reviews.map((item) => item.rating)),
    accessibility_rating_avg: average(reviews.map((item) => item.accessibility_rating)),
    review_count: reviews.length,
  };
}

async function assertOwner(
  supabase: Awaited<ReturnType<typeof getAuthedUser>>["supabase"],
  companyId: string,
) {
  const { data, error } = await supabase.rpc("is_company_owner", {
    target_company_id: companyId,
  });
  return !error && data === true;
}

async function assertAdmin(
  supabase: Awaited<ReturnType<typeof getAuthedUser>>["supabase"],
) {
  const { data, error } = await supabase.rpc("is_admin");
  return !error && data === true;
}

export async function getMyCompanies(): Promise<CompanyMembership[]> {
  const { supabase, userId } = await getAuthedUser();

  if (!userId) return [];

  const { data, error } = await supabase
    .from("company_members")
    .select("company_id, member_role, companies(id, name, is_verified_inclusive)")
    .eq("profile_id", userId);

  if (error || !data) return [];

  return data.flatMap((row) => {
    const company = unwrapOne(row.companies);
    if (!company) return [];
    return [
      {
        company_id: row.company_id,
        member_role: row.member_role,
        company: {
          id: company.id,
          name: company.name,
          is_verified_inclusive: company.is_verified_inclusive,
        },
      },
    ];
  });
}

export async function listCompanies(onlyMine = false) {
  const { supabase, userId } = await getAuthedUser();

  if (onlyMine && !userId) {
    return { error: "Você precisa entrar para ver suas empresas.", data: [] as CompanyListItem[] };
  }

  const memberships = onlyMine ? await getMyCompanies() : [];
  const mineIds = memberships.map((item) => item.company_id);

  if (onlyMine && mineIds.length === 0) {
    return { data: [] as CompanyListItem[] };
  }

  let companiesQuery = supabase.from("companies").select("*").order("name");
  if (onlyMine) {
    companiesQuery = companiesQuery.in("id", mineIds);
  }

  const [companiesResult, reviewsResult] = await Promise.all([
    companiesQuery,
    supabase.from("company_reviews").select("company_id, rating, accessibility_rating"),
  ]);

  if (companiesResult.error) {
    return {
      error: onlyMine
        ? "Não foi possível carregar suas empresas."
        : "Não foi possível carregar as empresas.",
      data: [] as CompanyListItem[],
    };
  }

  const reviewsByCompany = new Map<string, { rating: number; accessibility_rating: number }[]>();
  for (const review of reviewsResult.data ?? []) {
    const list = reviewsByCompany.get(review.company_id) ?? [];
    list.push(review);
    reviewsByCompany.set(review.company_id, list);
  }

  const items = (companiesResult.data ?? []).map((company) => ({
    ...company,
    ...summarizeReviews(reviewsByCompany.get(company.id) ?? []),
  }));

  return { data: items };
}

export async function createCompany(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const parsed = createCompanySchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { supabase, userId } = await getAuthedUser();

  if (!userId) {
    return { error: "Você precisa entrar para criar uma empresa." };
  }

  const emptyToUndef = (value?: string | null) => value?.trim() || undefined;

  const { data: companyId, error } = await supabase.rpc("create_company", {
    p_name: parsed.data.name,
    p_description: emptyToUndef(parsed.data.description),
    p_website: emptyToUndef(parsed.data.website),
    p_sector: emptyToUndef(parsed.data.sector),
    p_size: emptyToUndef(parsed.data.size),
    p_show_pcd_badge: parsed.data.show_pcd_badge,
  });

  if (error || !companyId) {
    return { error: "Não foi possível criar a empresa." };
  }

  if (parsed.data.accessibility_features.length > 0) {
    const { error: updateError } = await supabase
      .from("companies")
      .update({ accessibility_features: parsed.data.accessibility_features })
      .eq("id", companyId);

    if (updateError) {
      return {
        error:
          "A empresa foi criada, mas os recursos de acessibilidade não puderam ser salvos. Edite-os depois.",
        data: { id: companyId },
      };
    }
  }

  revalidatePath("/empresas");
  revalidatePath("/vagas/nova");
  return { data: { id: companyId } };
}

export async function getCompanyPublicPage(companyId: string) {
  const { supabase, userId } = await getAuthedUser();

  const [companyResult, membersResult, reviewsResult, jobsResult] = await Promise.all([
    supabase.from("companies").select("*").eq("id", companyId).maybeSingle(),
    supabase
      .from("company_members")
      .select("id, profile_id, member_role, show_pcd_badge, profiles_public(id, full_name)")
      .eq("company_id", companyId)
      .order("created_at"),
    supabase
      .from("company_reviews")
      .select(
        "id, rating, accessibility_rating, comment, is_anonymous, created_at, profile_id, profiles_public(id, full_name)",
      )
      .eq("company_id", companyId)
      .order("created_at", { ascending: false }),
    listOpenJobs({ companyId }),
  ]);

  if (!companyResult.data) {
    return { error: "Empresa não encontrada." };
  }

  const [isOwner, isMember] = userId
    ? await Promise.all([
        assertOwner(supabase, companyId),
        supabase
          .rpc("is_company_member", { target_company_id: companyId })
          .then((result) => result.data === true),
      ])
    : [false, false];

  const team: PublicTeamMember[] = (membersResult.data ?? []).flatMap((row) => {
    const profile = unwrapOne(row.profiles_public);
    if (!profile) return [];
    return [
      {
        id: row.id,
        profile_id: row.profile_id,
        member_role: row.member_role,
        show_pcd_badge: row.show_pcd_badge,
        full_name: profile.full_name?.trim() || "Pessoa da equipe",
      },
    ];
  });

  const reviews: PublicReview[] = (reviewsResult.data ?? []).map((row) => {
    const profile = unwrapOne(row.profiles_public);
    return {
      id: row.id,
      rating: row.rating,
      accessibility_rating: row.accessibility_rating,
      comment: row.comment,
      created_at: row.created_at,
      author_label: row.is_anonymous
        ? "Profissional PCD (anônimo)"
        : (profile?.full_name ?? "Profissional PCD"),
    };
  });

  const ownRow = userId
    ? (reviewsResult.data ?? []).find((row) => row.profile_id === userId)
    : undefined;

  const ownReview: OwnReview | null = ownRow
    ? {
        id: ownRow.id,
        rating: ownRow.rating,
        accessibility_rating: ownRow.accessibility_rating,
        comment: ownRow.comment,
        is_anonymous: ownRow.is_anonymous,
      }
    : null;

  const ownMembership = userId
    ? team.find((member) => member.profile_id === userId)
    : undefined;

  return {
    data: {
      company: companyResult.data,
      team,
      reviews,
      ratings: summarizeReviews(reviewsResult.data ?? []),
      jobs: (jobsResult.data ?? []) as JobWithCompany[],
      isOwner,
      isMember,
      ownReview,
      ownPcdBadge: ownMembership?.show_pcd_badge ?? false,
    },
  };
}

export async function getCompanyTeamPage(companyId: string) {
  const { supabase, userId } = await getAuthedUser();

  if (!userId) {
    return { error: "Você precisa entrar para gerenciar a equipe." };
  }

  const isOwner = await assertOwner(supabase, companyId);
  if (!isOwner) {
    return { error: "forbidden" };
  }

  const { data, error } = await supabase
    .from("company_members")
    .select("id, profile_id, member_role, show_pcd_badge, profiles_public(id, full_name)")
    .eq("company_id", companyId)
    .order("created_at");

  if (error) {
    return { error: "Não foi possível carregar a equipe." };
  }

  const members: PublicTeamMember[] = (data ?? []).flatMap((row) => {
    const profile = unwrapOne(row.profiles_public);
    if (!profile) return [];
    return [
      {
        id: row.id,
        profile_id: row.profile_id,
        member_role: row.member_role,
        show_pcd_badge: row.show_pcd_badge,
        full_name: profile.full_name?.trim() || "Pessoa da equipe",
      },
    ];
  });

  const ownerCount = members.filter((member) => member.member_role === "dono").length;

  return {
    data: {
      members,
      ownerCount,
      userId,
    },
  };
}

export async function addCompanyMember(
  input: unknown,
): Promise<ActionResult<{ message: string }>> {
  const parsed = addCompanyMemberSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { supabase, userId } = await getAuthedUser();

  if (!userId) {
    return { error: "Você precisa entrar para adicionar alguém à equipe." };
  }

  if (!(await assertOwner(supabase, parsed.data.company_id))) {
    return { error: "Só o dono da empresa pode adicionar recrutadores." };
  }

  const { data: profileId, error: lookupError } = await supabase.rpc(
    "profile_id_by_email",
    {
      p_email: parsed.data.email,
      p_company_id: parsed.data.company_id,
    },
  );

  if (lookupError) {
    return { error: "Não foi possível buscar essa pessoa." };
  }

  if (profileId) {
    const { error } = await supabase.from("company_members").insert({
      company_id: parsed.data.company_id,
      profile_id: profileId,
      member_role: "recrutador",
      show_pcd_badge: false,
    });

    if (error) {
      if (error.code === "23505") {
        return { error: "Essa pessoa já faz parte da equipe." };
      }
      return { error: "Não foi possível adicionar a pessoa." };
    }
  }

  revalidatePath(`/empresas/${parsed.data.company_id}`);
  revalidatePath(`/empresas/${parsed.data.company_id}/equipe`);
  return {
    data: {
      message:
        "Se houver uma conta com esse e-mail, a pessoa foi adicionada à equipe.",
    },
  };
}

export async function removeCompanyMember(input: unknown): Promise<ActionResult> {
  const parsed = removeCompanyMemberSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { supabase, userId } = await getAuthedUser();

  if (!userId) {
    return { error: "Você precisa entrar para remover alguém da equipe." };
  }

  if (!(await assertOwner(supabase, parsed.data.company_id))) {
    return { error: "Só o dono da empresa pode remover membros." };
  }

  const { data: target, error: targetError } = await supabase
    .from("company_members")
    .select("id, member_role, company_id")
    .eq("id", parsed.data.member_id)
    .eq("company_id", parsed.data.company_id)
    .maybeSingle();

  if (targetError || !target) {
    return { error: "Membro não encontrado nesta empresa." };
  }

  if (target.member_role === "dono") {
    const { count, error: countError } = await supabase
      .from("company_members")
      .select("id", { count: "exact", head: true })
      .eq("company_id", parsed.data.company_id)
      .eq("member_role", "dono");

    if (countError) {
      return { error: "Não foi possível verificar os donos da empresa." };
    }

    if ((count ?? 0) <= 1) {
      return {
        error:
          "Não é possível remover o único dono. Adicione outra pessoa como dona antes, ou a empresa fica sem quem gerenciar.",
      };
    }
  }

  const { error } = await supabase
    .from("company_members")
    .delete()
    .eq("id", target.id)
    .eq("company_id", parsed.data.company_id);

  if (error) {
    return { error: "Não foi possível remover o membro." };
  }

  revalidatePath(`/empresas/${parsed.data.company_id}`);
  revalidatePath(`/empresas/${parsed.data.company_id}/equipe`);
  return {};
}

export async function updateOwnPcdBadge(input: unknown): Promise<ActionResult> {
  const parsed = ownPcdBadgeSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { supabase, userId } = await getAuthedUser();

  if (!userId) {
    return { error: "Você precisa entrar para atualizar essa opção." };
  }

  const { data, error } = await supabase
    .from("company_members")
    .update({ show_pcd_badge: parsed.data.show_pcd_badge })
    .eq("company_id", parsed.data.company_id)
    .eq("profile_id", userId)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return { error: "Só você pode ligar ou desligar a sua estrela." };
  }

  revalidatePath(`/empresas/${parsed.data.company_id}`);
  revalidatePath(`/empresas/${parsed.data.company_id}/equipe`);
  return {};
}

export async function saveCompanyReview(input: unknown): Promise<ActionResult> {
  const parsed = companyReviewSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { supabase, userId } = await getAuthedUser();

  if (!userId) {
    return { error: "Você precisa entrar para avaliar a empresa." };
  }

  const payload = {
    rating: parsed.data.rating,
    accessibility_rating: parsed.data.accessibility_rating,
    comment: emptyToNull(parsed.data.comment),
    is_anonymous: parsed.data.is_anonymous,
  };

  if (parsed.data.id) {
    const { error } = await supabase
      .from("company_reviews")
      .update(payload)
      .eq("id", parsed.data.id)
      .eq("profile_id", userId)
      .eq("company_id", parsed.data.company_id);

    if (error) {
      return { error: "Não foi possível atualizar a avaliação." };
    }
  } else {
    const { error } = await supabase.from("company_reviews").insert({
      ...payload,
      company_id: parsed.data.company_id,
      profile_id: userId,
    });

    if (error) {
      if (error.code === "23505") {
        return {
          error: "Você já avaliou esta empresa. Use o formulário para editar a avaliação existente.",
          code: "already_reviewed",
        };
      }
      return { error: "Não foi possível publicar a avaliação." };
    }
  }

  revalidatePath("/empresas");
  revalidatePath(`/empresas/${parsed.data.company_id}`);
  return {};
}

export async function listAdminCompanies() {
  const { supabase, userId } = await getAuthedUser();

  if (!userId || !(await assertAdmin(supabase))) {
    return { error: "forbidden" as const };
  }

  const { data, error } = await supabase
    .from("companies")
    .select("id, name, is_verified_inclusive, created_at")
    .order("name");

  if (error) {
    return { error: "Não foi possível carregar as empresas." };
  }

  return { data: data ?? [] };
}

export async function setCompanyInclusiveSeal(
  input: unknown,
): Promise<ActionResult> {
  const parsed = companySealSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { supabase, userId } = await getAuthedUser();

  if (!userId || !(await assertAdmin(supabase))) {
    return { error: "forbidden" };
  }

  const { error } = await supabase
    .from("companies")
    .update({ is_verified_inclusive: parsed.data.is_verified_inclusive })
    .eq("id", parsed.data.company_id);

  if (error) {
    return { error: "Não foi possível atualizar o selo." };
  }

  revalidatePath("/empresas");
  revalidatePath(`/empresas/${parsed.data.company_id}`);
  revalidatePath("/admin/empresas");
  return {};
}
