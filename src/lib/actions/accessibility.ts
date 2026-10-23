"use server";

import { getAuthedUser } from "@/lib/supabase/user";

export type AccessibilityPrefs = {
  font_scale: number;
  high_contrast: boolean;
  reduce_motion: boolean;
};

const DEFAULT_PREFS: AccessibilityPrefs = {
  font_scale: 1,
  high_contrast: false,
  reduce_motion: false,
};

export async function getAccessibilityPrefs() {
  const { supabase, userId } = await getAuthedUser();
  if (!userId) return { data: DEFAULT_PREFS, persisted: false };

  const { data } = await supabase
    .from("accessibility_settings")
    .select("font_scale, high_contrast, reduce_motion")
    .eq("profile_id", userId)
    .maybeSingle();

  if (!data) return { data: DEFAULT_PREFS, persisted: true };

  return {
    data: {
      font_scale: Number(data.font_scale) || 1,
      high_contrast: Boolean(data.high_contrast),
      reduce_motion: Boolean(data.reduce_motion),
    },
    persisted: true,
  };
}

export async function saveAccessibilityPrefs(input: AccessibilityPrefs) {
  const { supabase, userId } = await getAuthedUser();
  if (!userId) return;

  const scale = Math.min(1.5, Math.max(1, Number(input.font_scale) || 1));

  await supabase.from("accessibility_settings").upsert({
    profile_id: userId,
    font_scale: scale,
    high_contrast: Boolean(input.high_contrast),
    reduce_motion: Boolean(input.reduce_motion),
    updated_at: new Date().toISOString(),
  });
}
