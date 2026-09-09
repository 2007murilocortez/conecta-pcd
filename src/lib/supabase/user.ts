import { createClient } from "@/lib/supabase/server";

export async function getAuthedUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return { supabase, userId: null as string | null };
  }

  return { supabase, userId: data.claims.sub };
}

export function emptyToNull(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}
