import { ACCESSIBILITY_RESOURCES, labelFor } from "@/lib/constants/jobs";

export function AccessibilityChips({
  resources,
  emptyLabel = "Nenhum recurso informado",
}: {
  resources: string[] | null;
  emptyLabel?: string;
}) {
  const items = resources ?? [];

  return (
    <div>
      <p className="mb-2 font-medium text-success-text">Recursos de acessibilidade</p>
      {items.length === 0 ? (
        <p className="mb-0 text-sm text-neutral-600">{emptyLabel}</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {items.map((resource) => (
            <li
              key={resource}
              className="rounded-full bg-success-surface px-3 py-1 text-sm font-medium text-success-text"
            >
              {labelFor(ACCESSIBILITY_RESOURCES, resource)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
