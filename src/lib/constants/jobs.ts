export const JOB_TYPES = [
  { value: "CLT", label: "CLT" },
  { value: "PJ", label: "PJ" },
  { value: "Estagio", label: "Estágio" },
  { value: "Jovem Aprendiz", label: "Jovem aprendiz" },
  { value: "Temporario", label: "Temporário" },
] as const;

export const WORK_MODES = [
  { value: "presencial", label: "Presencial" },
  { value: "remoto", label: "Remoto" },
  { value: "hibrido", label: "Híbrido" },
] as const;

export const COMPANY_SIZES = [
  { value: "1-50", label: "1 a 50 pessoas" },
  { value: "51-200", label: "51 a 200 pessoas" },
  { value: "201-1000", label: "201 a 1.000 pessoas" },
  { value: "1000+", label: "Mais de 1.000 pessoas" },
] as const;

export const ACCESSIBILITY_RESOURCES = [
  { value: "leitor_de_tela", label: "Leitor de tela" },
  { value: "libras", label: "Libras" },
  { value: "alto_contraste", label: "Alto contraste" },
  { value: "interprete_entrevista", label: "Intérprete em entrevista" },
  { value: "horario_flexivel", label: "Horário flexível" },
  { value: "outro", label: "Outro" },
] as const;

export const APPLICATION_STATUSES = [
  { value: "enviada", label: "Enviada" },
  { value: "em_analise", label: "Em análise" },
  { value: "entrevista", label: "Entrevista" },
  { value: "aprovado", label: "Aprovado" },
  { value: "rejeitado", label: "Rejeitado" },
] as const;

export function labelFor<T extends { value: string; label: string }>(
  items: readonly T[],
  value: string,
) {
  return items.find((item) => item.value === value)?.label ?? value;
}
