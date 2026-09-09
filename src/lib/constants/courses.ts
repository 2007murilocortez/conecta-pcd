export const COURSE_STATUSES = [
  { value: "em_andamento", label: "Em andamento" },
  { value: "concluido", label: "Concluído" },
] as const;

export function courseStatusLabel(status: string | null | undefined) {
  return COURSE_STATUSES.find((item) => item.value === status)?.label ?? status ?? "";
}
