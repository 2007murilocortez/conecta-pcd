"use server";

import { revalidatePath } from "next/cache";
import { getAuthedUser } from "@/lib/supabase/user";
import {
  requestConnectionSchema,
  respondConnectionSchema,
} from "@/lib/validations/network";
import type { Database, Tables } from "@/types/database.types";

type ActionResult<T = undefined> = {
  error?: string;
  data?: T;
};

type ConnectionStatus = Database["public"]["Enums"]["connection_status"];

export type PublicPerson = {
  id: string;
  full_name: string;
  headline: string | null;
};

export type ConnectionItem = {
  id: string;
  status: ConnectionStatus;
  created_at: string;
  person: PublicPerson;
};

function unwrapOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function toPerson(
  profile: Pick<Tables<"profiles_public">, "id" | "full_name" | "headline"> | null,
): PublicPerson | null {
  if (!profile?.id) return null;
  return {
    id: profile.id,
    full_name: profile.full_name?.trim() || "Profissional",
    headline: profile.headline,
  };
}

async function findConnectionBetween(
  supabase: Awaited<ReturnType<typeof getAuthedUser>>["supabase"],
  userId: string,
  otherId: string,
) {
  const { data } = await supabase
    .from("connections")
    .select("id, requester_id, addressee_id, status")
    .or(
      `and(requester_id.eq.${userId},addressee_id.eq.${otherId}),and(requester_id.eq.${otherId},addressee_id.eq.${userId})`,
    );

  return data ?? [];
}

export async function getConnectionState(otherId: string) {
  const { supabase, userId } = await getAuthedUser();

  if (!userId || userId === otherId) {
    return { data: { isSelf: userId === otherId, relation: null as ConnectionItem | null, incoming: false } };
  }

  const rows = await findConnectionBetween(supabase, userId, otherId);
  const row = rows[0];
  if (!row) {
    return { data: { isSelf: false, relation: null, incoming: false } };
  }

  return {
    data: {
      isSelf: false,
      relation: {
        id: row.id,
        status: row.status,
        created_at: "",
        person: { id: otherId, full_name: "", headline: null },
      },
      incoming: row.addressee_id === userId && row.status === "pendente",
      outgoing: row.requester_id === userId && row.status === "pendente",
    },
  };
}

export async function requestConnection(input: unknown): Promise<ActionResult> {
  const parsed = requestConnectionSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { supabase, userId } = await getAuthedUser();

  if (!userId) {
    return { error: "Você precisa entrar para enviar um pedido de conexão." };
  }

  if (parsed.data.addressee_id === userId) {
    return { error: "Você não pode conectar-se com o próprio perfil." };
  }

  const existing = await findConnectionBetween(supabase, userId, parsed.data.addressee_id);
  const mine = existing.find(
    (row) => row.requester_id === userId && row.addressee_id === parsed.data.addressee_id,
  );
  const theirs = existing.find(
    (row) => row.requester_id === parsed.data.addressee_id && row.addressee_id === userId,
  );

  if (mine?.status === "aceita" || theirs?.status === "aceita") {
    return { error: "Vocês já estão conectados." };
  }

  if (theirs?.status === "pendente") {
    return { error: "Essa pessoa já te enviou um pedido. Responda em Conexões." };
  }

  if (mine?.status === "pendente") {
    return { error: "Você já enviou um pedido para esta pessoa." };
  }

  if (mine?.status === "recusada") {
    const { error } = await supabase
      .from("connections")
      .update({ status: "pendente" })
      .eq("id", mine.id)
      .eq("requester_id", userId);

    if (error) {
      return { error: "Não foi possível reenviar o pedido." };
    }
  } else {
    const { error } = await supabase.from("connections").insert({
      requester_id: userId,
      addressee_id: parsed.data.addressee_id,
      status: "pendente",
    });

    if (error) {
      if (error.code === "23505") {
        return { error: "Você já enviou um pedido para esta pessoa." };
      }
      return { error: "Não foi possível enviar o pedido." };
    }
  }

  const { error: notificationError } = await supabase.from("notifications").insert({
    profile_id: parsed.data.addressee_id,
    type: "connection_request",
    title: "Novo pedido de conexão",
    body: "Alguém quer se conectar com você.",
    link: "/conexoes",
  });

  if (notificationError) {
    revalidatePath("/conexoes");
    revalidatePath(`/perfil/${parsed.data.addressee_id}`);
    return {
      error:
        "O pedido foi enviado, mas a notificação não pôde ser criada. Falta a policy de insert em notifications para conexão.",
    };
  }

  revalidatePath("/conexoes");
  revalidatePath(`/perfil/${parsed.data.addressee_id}`);
  return {};
}

export async function respondConnection(input: unknown): Promise<ActionResult> {
  const parsed = respondConnectionSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { supabase, userId } = await getAuthedUser();

  if (!userId) {
    return { error: "Você precisa entrar para responder o pedido." };
  }

  const { data: current, error: currentError } = await supabase
    .from("connections")
    .select("id, addressee_id, requester_id, status")
    .eq("id", parsed.data.connection_id)
    .maybeSingle();

  if (currentError || !current) {
    return { error: "Pedido não encontrado." };
  }

  if (current.addressee_id !== userId) {
    return { error: "Só quem recebeu o pedido pode responder." };
  }

  const { error } = await supabase
    .from("connections")
    .update({ status: parsed.data.status })
    .eq("id", current.id)
    .eq("addressee_id", userId);

  if (error) {
    return { error: "Não foi possível atualizar o pedido." };
  }

  revalidatePath("/conexoes");
  revalidatePath("/feed");
  revalidatePath(`/perfil/${current.requester_id}`);
  return {};
}

export async function listConnections() {
  const { supabase, userId } = await getAuthedUser();

  if (!userId) {
    return { error: "Você precisa entrar para ver as conexões." };
  }

  const { data, error } = await supabase
    .from("connections")
    .select(
      "id, status, created_at, requester_id, addressee_id, requester:profiles_public!connections_requester_id_fkey(id, full_name, headline), addressee:profiles_public!connections_addressee_id_fkey(id, full_name, headline)",
    )
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) {
    return { error: "Não foi possível carregar as conexões." };
  }

  const accepted: ConnectionItem[] = [];
  const incoming: ConnectionItem[] = [];
  const outgoing: ConnectionItem[] = [];

  for (const row of data ?? []) {
    const other =
      row.requester_id === userId
        ? toPerson(unwrapOne(row.addressee))
        : toPerson(unwrapOne(row.requester));
    if (!other) continue;

    const item: ConnectionItem = {
      id: row.id,
      status: row.status,
      created_at: row.created_at,
      person: other,
    };

    if (row.status === "aceita") {
      accepted.push(item);
    } else if (row.status === "pendente" && row.addressee_id === userId) {
      incoming.push(item);
    } else if (row.status === "pendente" && row.requester_id === userId) {
      outgoing.push(item);
    }
  }

  return { data: { accepted, incoming, outgoing } };
}

export async function getPublicProfile(id: string) {
  const { supabase, userId } = await getAuthedUser();

  const { data: profile } = await supabase
    .from("profiles_public")
    .select(
      "id, full_name, headline, bio, avatar_url, location_city, location_state, open_to_mentor, accessibility_needs, disability_types",
    )
    .eq("id", id)
    .maybeSingle();

  if (!profile?.id) {
    return { error: "Perfil não encontrado." };
  }

  const { data: skillRows } = await supabase
    .from("profile_skills")
    .select("skills(name)")
    .eq("profile_id", id);

  const skills = (skillRows ?? []).flatMap((row) => {
    const skill = unwrapOne(row.skills);
    return skill?.name ? [skill.name] : [];
  });

  const connection = userId && userId !== id ? await getConnectionState(id) : null;

  return {
    data: {
      profile: {
        id: profile.id,
        full_name: profile.full_name?.trim() || "Profissional",
        headline: profile.headline,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        location_city: profile.location_city,
        location_state: profile.location_state,
        open_to_mentor: profile.open_to_mentor,
        accessibility_needs: profile.accessibility_needs,
        disability_types: profile.disability_types,
      },
      skills,
      isSelf: userId === id,
      connection: connection?.data ?? null,
    },
  };
}

export async function getAcceptedConnectionIds(userId: string) {
  const { supabase } = await getAuthedUser();
  const { data } = await supabase
    .from("connections")
    .select("requester_id, addressee_id")
    .eq("status", "aceita")
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);

  return (data ?? []).map((row) =>
    row.requester_id === userId ? row.addressee_id : row.requester_id,
  );
}
