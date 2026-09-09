"use server";

import { revalidatePath } from "next/cache";
import { getAuthedUser } from "@/lib/supabase/user";
import { courseIdSchema } from "@/lib/validations/courses";
import type { Tables } from "@/types/database.types";

type ActionResult<T = undefined> = {
  error?: string;
  data?: T;
};

export type CourseCard = Tables<"courses"> & {
  enrollmentStatus: "em_andamento" | "concluido" | null;
};

export type CompletedCourse = {
  id: string;
  title: string;
  provider: string | null;
  url: string | null;
  completed_at: string | null;
};

function unwrapOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function listCourses(category?: string) {
  const { supabase, userId } = await getAuthedUser();

  let query = supabase.from("courses").select("*").order("title");
  if (category) {
    query = query.eq("category", category);
  }

  const [{ data, error }, enrollmentsResult] = await Promise.all([
    query,
    userId
      ? supabase
          .from("course_enrollments")
          .select("course_id, status")
          .eq("profile_id", userId)
      : Promise.resolve({ data: [] as { course_id: string; status: string | null }[] }),
  ]);

  if (error) {
    return { error: "Não foi possível carregar os cursos.", data: [] as CourseCard[], categories: [] as string[] };
  }

  const statusByCourse = new Map(
    (enrollmentsResult.data ?? []).map((row) => [row.course_id, row.status]),
  );

  const courses = (data ?? []).map((course) => {
    const status = statusByCourse.get(course.id);
    return {
      ...course,
      enrollmentStatus:
        status === "concluido" || status === "em_andamento" ? status : null,
    };
  }) as CourseCard[];

  const { data: categoryRows } = await supabase
    .from("courses")
    .select("category")
    .not("category", "is", null);

  const categories = [
    ...new Set(
      (categoryRows ?? [])
        .map((row) => row.category)
        .filter((item): item is string => Boolean(item)),
    ),
  ].sort((a, b) => a.localeCompare(b, "pt-BR"));

  return { data: courses, categories };
}

export async function enrollInCourse(input: unknown): Promise<ActionResult> {
  const parsed = courseIdSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Curso inválido." };
  }

  const { supabase, userId } = await getAuthedUser();
  if (!userId) {
    return { error: "Você precisa entrar para se inscrever." };
  }

  const { error } = await supabase.from("course_enrollments").insert({
    profile_id: userId,
    course_id: parsed.data.course_id,
    status: "em_andamento",
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Você já está inscrito neste curso." };
    }
    return { error: "Não foi possível inscrever. Confira se o curso ainda existe." };
  }

  revalidatePath("/cursos");
  revalidatePath("/feed");
  return {};
}

export async function completeCourse(input: unknown): Promise<ActionResult> {
  const parsed = courseIdSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Curso inválido." };
  }

  const { supabase, userId } = await getAuthedUser();
  if (!userId) {
    return { error: "Você precisa entrar para marcar o curso." };
  }

  const { data, error } = await supabase
    .from("course_enrollments")
    .update({
      status: "concluido",
      completed_at: new Date().toISOString(),
    })
    .eq("profile_id", userId)
    .eq("course_id", parsed.data.course_id)
    .select("course_id")
    .maybeSingle();

  if (error || !data) {
    return { error: "Inscreva-se no curso antes de marcar como concluído." };
  }

  revalidatePath("/cursos");
  revalidatePath("/feed");
  revalidatePath(`/perfil/${userId}`);
  return {};
}

export async function listCompletedCourses(profileId: string) {
  const { supabase } = await getAuthedUser();

  const { data, error } = await supabase
    .from("course_enrollments")
    .select("completed_at, courses(id, title, provider, url)")
    .eq("profile_id", profileId)
    .eq("status", "concluido")
    .order("completed_at", { ascending: false });

  if (error) {
    return { data: [] as CompletedCourse[] };
  }

  const courses = (data ?? []).flatMap((row) => {
    const course = unwrapOne(row.courses);
    if (!course?.id) return [];
    return [
      {
        id: course.id,
        title: course.title,
        provider: course.provider,
        url: course.url,
        completed_at: row.completed_at,
      } satisfies CompletedCourse,
    ];
  });

  return { data: courses };
}
