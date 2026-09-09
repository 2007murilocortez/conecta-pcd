export function formatPostedAt(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);

  if (days <= 0) return "Publicada hoje";
  if (days === 1) return "Publicada há 1 dia";
  return `Publicada há ${days} dias`;
}

export function formatSalary(min: number | null, max: number | null) {
  const format = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

  if (min && max) return `${format(min)} a ${format(max)}`;
  if (min) return `A partir de ${format(min)}`;
  if (max) return `Até ${format(max)}`;
  return null;
}

export function formatLocation(city: string | null, state: string | null) {
  if (city && state) return `${city}, ${state}`;
  return city || state || "Local a combinar";
}

export function toSearchArray(value: string | string[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value];
}
