export function formatRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);

  if (minutes < 1) return "Agora";
  if (minutes < 60) return `Há ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours === 1 ? "Há 1 hora" : `Há ${hours} horas`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Há 1 dia";
  return `Há ${days} dias`;
}

export function formatPostedAt(iso: string) {
  const relative = formatRelativeTime(iso);
  if (relative === "Agora") return "Publicada agora";
  return `Publicada ${relative.replace(/^Há/, "há")}`;
}

export function formatExcerpt(text: string, max = 160) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).replace(/\s+\S*$/, "")}…`;
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
