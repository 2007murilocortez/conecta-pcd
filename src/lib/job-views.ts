export const VIEWED_JOBS_COOKIE = "conecta_viewed_jobs";

export function parseViewedJobIds(raw: string | undefined) {
  if (!raw) return [] as string[];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}
