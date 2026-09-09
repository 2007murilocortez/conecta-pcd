"use server";

import { revalidatePath } from "next/cache";
import {
  mentorshipAcceptedEmail,
  sendTransactionalEmail,
  siteUrl,
} from "@/lib/email/resend";
import { getAuthedUser } from "@/lib/supabase/user";
import {
  requestMentorshipSchema,
  respondMentorshipSchema,
} from "@/lib/validations/network";
import type { Database } from "@/types/database.types";

type ActionResult<T = undefined> = {
  error?: string;
  data?: T;
};

type MentorshipStatus = Database["public"]["Enums"]["mentorship_status"];

export type MentorCard = {
  id: string;
  full_name: string;
  headline: string | null;
  avatar_url: string | null;
};

export type MentorshipItem = {
  id: string;
  status: MentorshipStatus;
  message: string | null;
  created_at: string;
  other: MentorCard;
  role: "mentor" | "mentee";
};

function unwrapOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function toCard(profile: {
  id: string | null;
  full_name: string | null;
  headline: string | null;
  avatar_url: string | null;
} | null): MentorCard | null {
  if (!profile?.id) return null;
  return {
    id: profile.id,
    full_name: profile.full_name?.trim() || "Profissional",
    headline: profile.headline,
    avatar_url: profile.avatar_url,
  };
}

export async function listMentors() {
  const { supabase, userId } = await getAuthedUser();

  const { data, error } = await supabase
    .from("profiles_public")
    .select("id, full_name, headline, avatar_url")
    .eq("open_to_mentor", true)
    .order("full_name");

  if (error) {
    return { error: "Não foi possível carregar mentores.", data: [] as MentorCard[] };
  }

  const mentors = (data ?? [])
    .filter((row) => row.id && row.id !== userId)
    .flatMap((row) => {
      const card = toCard(row);
      return card ? [card] : [];
    });

  return { data: mentors };
}

export async function requestMentorship(input: unknown): Promise<ActionResult> {
  const parsed = requestMentorshipSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { supabase, userId } = await getAuthedUser();

  if (!userId) {
    return { error: "Você precisa entrar para solicitar mentoria." };
  }

  if (parsed.data.mentor_id === userId) {
    return { error: "Você não pode solicitar mentoria a si mesmo." };
  }

  const { data: mentor } = await supabase
    .from("profiles_public")
    .select("id, open_to_mentor")
    .eq("id", parsed.data.mentor_id)
    .maybeSingle();

  if (!mentor?.open_to_mentor) {
    return { error: "Esta pessoa não está disponível para mentoria." };
  }

  const { error } = await supabase.from("mentorships").insert({
    mentor_id: parsed.data.mentor_id,
    mentee_id: userId,
    message: parsed.data.message,
    status: "pendente",
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Você já tem um pedido de mentoria com esta pessoa." };
    }
    return { error: "Não foi possível enviar o pedido." };
  }

  const { error: notificationError } = await supabase.from("notifications").insert({
    profile_id: parsed.data.mentor_id,
    type: "mentorship_request",
    title: "Novo pedido de mentoria",
    body: "Alguém pediu mentoria a você.",
    link: "/mentoria",
  });

  if (notificationError) {
    console.error("[mentoria] notificação do pedido falhou", notificationError);
  }

  revalidatePath("/mentoria");
  revalidatePath("/notificacoes");
  return {};
}

export async function respondMentorship(input: unknown): Promise<ActionResult> {
  const parsed = respondMentorshipSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { supabase, userId } = await getAuthedUser();

  if (!userId) {
    return { error: "Você precisa entrar para responder o pedido." };
  }

  const { data: current, error: currentError } = await supabase
    .from("mentorships")
    .select("id, mentor_id, mentee_id, status")
    .eq("id", parsed.data.mentorship_id)
    .maybeSingle();

  if (currentError || !current) {
    return { error: "Pedido não encontrado." };
  }

  if (current.mentor_id !== userId) {
    return { error: "Só quem recebeu o pedido de mentoria pode responder." };
  }

  if (parsed.data.accept) {
    const { error } = await supabase
      .from("mentorships")
      .update({ status: "ativa" })
      .eq("id", current.id)
      .eq("mentor_id", userId);

    if (error) {
      return { error: "Não foi possível aceitar o pedido." };
    }

    const { data: mentorPublic } = await supabase
      .from("profiles_public")
      .select("full_name")
      .eq("id", userId)
      .maybeSingle();
    const mentorName = mentorPublic?.full_name?.trim() || "Sua mentora ou mentor";

    const { error: notificationError } = await supabase.from("notifications").insert({
      profile_id: current.mentee_id,
      type: "mentorship_accepted",
      title: "Mentoria aceita",
      body: `${mentorName} aceitou seu pedido de mentoria.`,
      link: "/mentoria",
    });

    if (notificationError) {
      console.error("[mentoria] notificação do aceite falhou", notificationError);
    }

    const email = mentorshipAcceptedEmail({
      mentorName,
      siteUrl: siteUrl(),
      mentorProfileId: userId,
    });
    await sendTransactionalEmail({
      profileId: current.mentee_id,
      ...email,
    });
  } else {
    const { error } = await supabase
      .from("mentorships")
      .delete()
      .eq("id", current.id)
      .eq("mentor_id", userId);

    if (error) {
      return { error: "Não foi possível recusar o pedido." };
    }
  }

  revalidatePath("/mentoria");
  revalidatePath("/notificacoes");
  return {};
}

export async function listMyMentorships() {
  const { supabase, userId } = await getAuthedUser();

  if (!userId) {
    return { error: "Você precisa entrar para ver suas mentorias." };
  }

  const { data, error } = await supabase
    .from("mentorships")
    .select(
      "id, status, message, created_at, mentor_id, mentee_id, mentor:profiles_public!mentorships_mentor_id_fkey(id, full_name, headline, avatar_url), mentee:profiles_public!mentorships_mentee_id_fkey(id, full_name, headline, avatar_url)",
    )
    .or(`mentor_id.eq.${userId},mentee_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) {
    return { error: "Não foi possível carregar as mentorias." };
  }

  const incoming: MentorshipItem[] = [];
  const outgoing: MentorshipItem[] = [];
  const active: MentorshipItem[] = [];

  for (const row of data ?? []) {
    const isMentor = row.mentor_id === userId;
    const other = toCard(unwrapOne(isMentor ? row.mentee : row.mentor));
    if (!other) continue;

    const item: MentorshipItem = {
      id: row.id,
      status: row.status,
      message: row.message,
      created_at: row.created_at,
      other,
      role: isMentor ? "mentor" : "mentee",
    };

    if (row.status === "pendente" && isMentor) {
      incoming.push(item);
    } else if (row.status === "pendente" && !isMentor) {
      outgoing.push(item);
    } else if (row.status === "ativa") {
      active.push(item);
    }
  }

  return { data: { incoming, outgoing, active } };
}
