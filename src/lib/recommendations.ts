/**
 * Recomendações v1 (Módulo 8) — regra de negócio simples, sem IA.
 *
 * Vagas para você:
 * 1. Cruza o nome de cada skill em `profile_skills` com `jobs.title` e
 *    `jobs.requirements` (busca textual case-insensitive, tipo ilike).
 * 2. Só entra na lista se também for da mesma `location_state` do perfil
 *    OU `work_mode = 'remoto'`.
 * 3. Ordena remoto / mesmo estado primeiro; depois por data da vaga.
 *
 * Cursos recomendados:
 * 1. Junta vagas em que a pessoa se candidatou com vagas que ela abriu
 *    nesta sessão (cookie `conecta_viewed_jobs` — não existe tabela de
 *    visualização no schema; não inventei `job_views`).
 * 2. Skills que aparecem no título/requisitos dessas vagas e que a pessoa
 *    ainda NÃO tem em `profile_skills` viram "lacunas".
 * 3. Cada lacuna (e o texto da vaga) é alinhada a uma categoria de curso
 *    por palavras-chave. Cursos dessas categorias, em que a pessoa ainda
 *    não se inscreveu, são sugeridos.
 *
 * Evolução futura (não implementar agora): embeddings para matching
 * semântico entre bio/skills e a descrição da vaga.
 */

import { cookies } from "next/headers";
import { getAuthedUser } from "@/lib/supabase/user";
import { VIEWED_JOBS_COOKIE, parseViewedJobIds } from "@/lib/job-views";
import type { JobWithCompany } from "@/lib/actions/jobs";
import type { CourseCard } from "@/lib/actions/courses";
import type { Tables } from "@/types/database.types";

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "Acessibilidade e Comunicação": [
    "libras",
    "audiodescri",
    "acessibilidade",
    "comunicação",
    "comunicacao",
    "braille",
    "emag",
    "leitor",
  ],
  "Gestão e Tecnologia": [
    "gestão",
    "gestao",
    "excel",
    "dados",
    "sql",
    "scrum",
    "projeto",
    "administração",
    "administracao",
  ],
  Tecnologia: [
    "python",
    "javascript",
    "react",
    "programação",
    "programacao",
    "desenvolvimento",
    "software",
    "cloud",
    "ti",
    "ia",
    "front",
    "back",
  ],
  "Educação Profissional": ["técnico", "tecnico", "profissional", "senai", "senac"],
  Empreendedorismo: [
    "empreendedor",
    "negócio",
    "negocio",
    "sebrae",
    "finanças",
    "financas",
    "vendas",
    "marketing",
  ],
  "Inclusão no Trabalho": [
    "inclusão",
    "inclusao",
    "diversidade",
    "deficiência",
    "deficiencia",
    "pcd",
    "rh",
    "contratação",
    "contratacao",
    "recrut",
  ],
};

function unwrapOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function textHasSkill(haystack: string, skill: string) {
  const needle = normalize(skill);
  if (needle.length < 2) return false;
  return normalize(haystack).includes(needle);
}

function categoriesForText(text: string) {
  const hay = normalize(text);
  return Object.entries(CATEGORY_KEYWORDS)
    .filter(([, keywords]) => keywords.some((keyword) => hay.includes(normalize(keyword))))
    .map(([category]) => category);
}

export async function getRecommendations() {
  const { supabase, userId } = await getAuthedUser();

  if (!userId) {
    return {
      jobs: [] as JobWithCompany[],
      courses: [] as CourseCard[],
      missingSkills: [] as string[],
    };
  }

  const cookieStore = await cookies();
  const viewedIds = parseViewedJobIds(cookieStore.get(VIEWED_JOBS_COOKIE)?.value);

  const [profileResult, skillRowsResult, catalogResult, jobsResult, applicationsResult, coursesResult, enrollmentsResult] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("location_state")
        .eq("id", userId)
        .maybeSingle(),
      supabase.from("profile_skills").select("skills(name)").eq("profile_id", userId),
      supabase.from("skills").select("name"),
      supabase
        .from("jobs")
        .select("*, companies(id, name, logo_url, is_verified_inclusive)")
        .eq("status", "aberta")
        .order("created_at", { ascending: false }),
      supabase.from("applications").select("job_id").eq("profile_id", userId),
      supabase.from("courses").select("*").order("title"),
      supabase.from("course_enrollments").select("course_id").eq("profile_id", userId),
    ]);

  const mySkills = (skillRowsResult.data ?? []).flatMap((row) => {
    const skill = unwrapOne(row.skills);
    return skill?.name ? [skill.name] : [];
  });
  const mySkillSet = new Set(mySkills.map(normalize));
  const locationState = profileResult.data?.location_state ?? null;

  const jobs = (jobsResult.data ?? []).map((row) => ({
    ...row,
    companies: unwrapOne(row.companies),
  })) as JobWithCompany[];

  const recommendedJobs = jobs
    .filter((job) => {
      const hay = `${job.title}\n${job.requirements ?? ""}`;
      const skillHit = mySkills.some((skill) => textHasSkill(hay, skill));
      if (!skillHit) return false;
      const remote = job.work_mode === "remoto";
      const sameState = Boolean(locationState && job.location_state === locationState);
      return remote || sameState;
    })
    .sort((a, b) => {
      const score = (job: JobWithCompany) =>
        job.work_mode === "remoto" ? 2 : job.location_state === locationState ? 1 : 0;
      return score(b) - score(a);
    })
    .slice(0, 6);

  const interestJobIds = new Set([
    ...viewedIds,
    ...(applicationsResult.data ?? []).map((row) => row.job_id),
  ]);
  const interestJobs = jobs.filter((job) => interestJobIds.has(job.id));
  const interestText = interestJobs
    .map((job) => `${job.title}\n${job.requirements ?? ""}`)
    .join("\n");

  const catalogNames = (catalogResult.data ?? []).map((row) => row.name);
  const missingSkills = catalogNames.filter(
    (name) => !mySkillSet.has(normalize(name)) && textHasSkill(interestText, name),
  );

  const categories = new Set<string>();
  for (const skill of missingSkills) {
    for (const category of categoriesForText(skill)) {
      categories.add(category);
    }
  }
  for (const category of categoriesForText(interestText)) {
    if (missingSkills.length > 0) categories.add(category);
  }

  const enrolled = new Set((enrollmentsResult.data ?? []).map((row) => row.course_id));
  const recommendedCourses = ((coursesResult.data ?? []) as Tables<"courses">[])
    .filter((course) => course.category && categories.has(course.category) && !enrolled.has(course.id))
    .slice(0, 6)
    .map((course) => ({
      ...course,
      enrollmentStatus: null,
    })) as CourseCard[];

  return {
    jobs: recommendedJobs,
    courses: recommendedCourses,
    missingSkills,
  };
}
