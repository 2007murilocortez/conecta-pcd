"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  educationSchema,
  experienceSchema,
  idSchema,
  skillNameSchema,
  updateProfileSchema,
} from "@/lib/validations/profile";

type ActionResult<T = undefined> = {
  error?: string;
  data?: T;
};

async function getUserId() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return { supabase, userId: null as string | null };
  }

  return { supabase, userId: data.claims.sub };
}

export async function getProfileEditorData() {
  const { supabase, userId } = await getUserId();

  if (!userId) {
    return { error: "Você precisa entrar para editar o perfil." };
  }

  const [profileResult, educationsResult, experiencesResult, skillsResult, catalogResult] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).single(),
      supabase
        .from("educations")
        .select("*")
        .eq("profile_id", userId)
        .order("start_date", { ascending: false }),
      supabase
        .from("experiences")
        .select("*")
        .eq("profile_id", userId)
        .order("start_date", { ascending: false }),
      supabase
        .from("profile_skills")
        .select("skill_id, skills(id, name)")
        .eq("profile_id", userId),
      supabase.from("skills").select("id, name").order("name"),
    ]);

  if (profileResult.error || !profileResult.data) {
    return { error: "Não foi possível carregar o seu perfil." };
  }

  const skills = (skillsResult.data ?? []).flatMap((row) => {
    const skill = row.skills;
    if (!skill) return [];
    const item = Array.isArray(skill) ? skill[0] : skill;
    return item ? [{ id: item.id, name: item.name }] : [];
  });

  return {
    data: {
      profile: profileResult.data,
      educations: educationsResult.data ?? [],
      experiences: experiencesResult.data ?? [],
      skills,
      skillCatalog: catalogResult.data ?? [],
    },
  };
}

export async function updateProfile(
  input: unknown,
): Promise<ActionResult> {
  const parsed = updateProfileSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { supabase, userId } = await getUserId();

  if (!userId) {
    return { error: "Você precisa entrar para salvar o perfil." };
  }

  const emptyToNull = (value?: string) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
  };

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.full_name,
      headline: parsed.data.headline,
      bio: emptyToNull(parsed.data.bio),
      phone: emptyToNull(parsed.data.phone),
      location_city: emptyToNull(parsed.data.location_city),
      location_state: emptyToNull(parsed.data.location_state),
      discloses_disability: parsed.data.discloses_disability,
      disability_types: parsed.data.discloses_disability
        ? parsed.data.disability_types
        : [],
      disability_types_other:
        parsed.data.discloses_disability &&
        parsed.data.disability_types.includes("outra")
          ? emptyToNull(parsed.data.disability_types_other)
          : null,
      accessibility_needs: parsed.data.accessibility_needs,
      accessibility_needs_other: parsed.data.accessibility_needs.includes("outro")
        ? emptyToNull(parsed.data.accessibility_needs_other)
        : null,
      open_to_mentor: parsed.data.open_to_mentor,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    return { error: "Não foi possível salvar o perfil." };
  }

  revalidatePath("/perfil/editar");
  return {};
}

export async function addEducation(
  input: unknown,
): Promise<ActionResult> {
  const parsed = educationSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { supabase, userId } = await getUserId();

  if (!userId) {
    return { error: "Você precisa entrar para adicionar formação." };
  }

  const emptyToNull = (value?: string) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
  };

  const { error } = await supabase.from("educations").insert({
    profile_id: userId,
    institution: parsed.data.institution,
    course: parsed.data.course,
    level: emptyToNull(parsed.data.level),
    start_date: emptyToNull(parsed.data.start_date),
    end_date: parsed.data.is_current ? null : emptyToNull(parsed.data.end_date),
    is_current: parsed.data.is_current,
  });

  if (error) {
    return { error: "Não foi possível adicionar a formação." };
  }

  revalidatePath("/perfil/editar");
  return {};
}

export async function removeEducation(
  input: unknown,
): Promise<ActionResult> {
  const parsed = idSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Identificador inválido." };
  }

  const { supabase, userId } = await getUserId();

  if (!userId) {
    return { error: "Você precisa entrar para remover formação." };
  }

  const { error } = await supabase
    .from("educations")
    .delete()
    .eq("id", parsed.data.id)
    .eq("profile_id", userId);

  if (error) {
    return { error: "Não foi possível remover a formação." };
  }

  revalidatePath("/perfil/editar");
  return {};
}

export async function addExperience(
  input: unknown,
): Promise<ActionResult> {
  const parsed = experienceSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { supabase, userId } = await getUserId();

  if (!userId) {
    return { error: "Você precisa entrar para adicionar experiência." };
  }

  const emptyToNull = (value?: string) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
  };

  const { error } = await supabase.from("experiences").insert({
    profile_id: userId,
    company_name: parsed.data.company_name,
    role_title: parsed.data.role_title,
    description: emptyToNull(parsed.data.description),
    start_date: emptyToNull(parsed.data.start_date),
    end_date: parsed.data.is_current ? null : emptyToNull(parsed.data.end_date),
    is_current: parsed.data.is_current,
  });

  if (error) {
    return { error: "Não foi possível adicionar a experiência." };
  }

  revalidatePath("/perfil/editar");
  return {};
}

export async function removeExperience(
  input: unknown,
): Promise<ActionResult> {
  const parsed = idSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Identificador inválido." };
  }

  const { supabase, userId } = await getUserId();

  if (!userId) {
    return { error: "Você precisa entrar para remover experiência." };
  }

  const { error } = await supabase
    .from("experiences")
    .delete()
    .eq("id", parsed.data.id)
    .eq("profile_id", userId);

  if (error) {
    return { error: "Não foi possível remover a experiência." };
  }

  revalidatePath("/perfil/editar");
  return {};
}

export async function addSkillToProfile(
  input: unknown,
): Promise<ActionResult> {
  const parsed = skillNameSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Informe a habilidade." };
  }

  const { supabase, userId } = await getUserId();

  if (!userId) {
    return { error: "Você precisa entrar para adicionar habilidade." };
  }

  const skillName = parsed.data.name;
  const { data: existing } = await supabase
    .from("skills")
    .select("id")
    .ilike("name", skillName)
    .maybeSingle();

  let skillId = existing?.id;

  if (!skillId) {
    const { data: created, error: createError } = await supabase
      .from("skills")
      .insert({ name: skillName })
      .select("id")
      .single();

    if (createError || !created) {
      const { data: retry } = await supabase
        .from("skills")
        .select("id")
        .ilike("name", skillName)
        .maybeSingle();

      if (!retry) {
        return { error: "Não foi possível cadastrar a habilidade." };
      }

      skillId = retry.id;
    } else {
      skillId = created.id;
    }
  }

  const { error } = await supabase.from("profile_skills").upsert({
    profile_id: userId,
    skill_id: skillId,
  });

  if (error) {
    return { error: "Não foi possível vincular a habilidade ao perfil." };
  }

  revalidatePath("/perfil/editar");
  return {};
}

export async function removeSkillFromProfile(
  input: unknown,
): Promise<ActionResult> {
  const parsed = idSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Identificador inválido." };
  }

  const { supabase, userId } = await getUserId();

  if (!userId) {
    return { error: "Você precisa entrar para remover habilidade." };
  }

  const { error } = await supabase
    .from("profile_skills")
    .delete()
    .eq("profile_id", userId)
    .eq("skill_id", parsed.data.id);

  if (error) {
    return { error: "Não foi possível remover a habilidade." };
  }

  revalidatePath("/perfil/editar");
  return {};
}

export async function uploadAvatar(
  formData: FormData,
): Promise<ActionResult<{ url: string }>> {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Selecione uma imagem para o avatar." };
  }

  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    return { error: "Use uma imagem JPG, PNG ou WebP." };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { error: "A imagem precisa ter no máximo 5 MB." };
  }

  const { supabase, userId } = await getUserId();

  if (!userId) {
    return { error: "Você precisa entrar para enviar o avatar." };
  }

  const extension = file.type.split("/")[1] ?? "jpg";
  const path = `${userId}/avatar.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    return { error: "Não foi possível enviar o avatar." };
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  const url = `${data.publicUrl}?t=${Date.now()}`;

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: url, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) {
    return { error: "O arquivo foi enviado, mas o perfil não foi atualizado." };
  }

  revalidatePath("/perfil/editar");
  return { data: { url } };
}

export async function uploadResume(
  formData: FormData,
): Promise<ActionResult<{ path: string }>> {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Selecione um PDF do currículo." };
  }

  if (file.type !== "application/pdf") {
    return { error: "O currículo precisa ser um arquivo PDF." };
  }

  if (file.size > 10 * 1024 * 1024) {
    return { error: "O PDF precisa ter no máximo 10 MB." };
  }

  const { supabase, userId } = await getUserId();

  if (!userId) {
    return { error: "Você precisa entrar para enviar o currículo." };
  }

  const path = `${userId}/curriculo.pdf`;

  const { error: uploadError } = await supabase.storage
    .from("resumes")
    .upload(path, file, { upsert: true, contentType: "application/pdf" });

  if (uploadError) {
    return { error: "Não foi possível enviar o currículo." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ resume_url: path, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) {
    return { error: "O arquivo foi enviado, mas o perfil não foi atualizado." };
  }

  revalidatePath("/perfil/editar");
  return { data: { path } };
}
