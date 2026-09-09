"use server";

import { revalidatePath } from "next/cache";
import { getAuthedUser } from "@/lib/supabase/user";
import type { Tables } from "@/types/database.types";

export type NotificationItem = Tables<"notifications">;

export async function listMyNotifications() {
  const { supabase, userId } = await getAuthedUser();

  if (!userId) {
    return { error: "Você precisa entrar para ver as notificações.", data: [] as NotificationItem[], unreadCount: 0 };
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("profile_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return { error: "Não foi possível carregar as notificações.", data: [] as NotificationItem[], unreadCount: 0 };
  }

  const items = data ?? [];
  return {
    data: items,
    unreadCount: items.filter((item) => !item.is_read).length,
  };
}

export async function countUnreadNotifications() {
  const { supabase, userId } = await getAuthedUser();
  if (!userId) return 0;

  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("profile_id", userId)
    .eq("is_read", false);

  return count ?? 0;
}

export async function markNotificationRead(notificationId: string) {
  const { supabase, userId } = await getAuthedUser();
  if (!userId) return;

  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("profile_id", userId);

  revalidatePath("/notificacoes");
}

export async function markAllNotificationsRead() {
  const { supabase, userId } = await getAuthedUser();
  if (!userId) {
    return { error: "Você precisa entrar para marcar as notificações." };
  }

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("profile_id", userId)
    .eq("is_read", false);

  if (error) {
    return { error: "Não foi possível marcar as notificações como lidas." };
  }

  revalidatePath("/notificacoes");
  return {};
}
