import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ACCESSIBILITY_RESOURCES,
  JOB_TYPES,
  WORK_MODES,
} from "@/lib/constants/jobs";

type JobFiltersProps = {
  type?: string;
  workMode?: string;
  resources: string[];
  companyId?: string;
  resultCount?: number;
};

export function JobFilters({
  type,
  workMode,
  resources,
  companyId,
  resultCount,
}: JobFiltersProps) {
  const hasActiveFilters = Boolean(type || workMode || resources.length > 0);
  const clearHref = companyId ? `/vagas?empresa=${companyId}` : "/vagas";

  return (
    <details className="job-filters surface-card p-4 lg:p-5" open>
      <summary>Filtros{hasActiveFilters ? " (ativos)" : ""}</summary>
      <form method="get" className="space-y-6">
        {companyId ? <input type="hidden" name="empresa" value={companyId} /> : null}

        {typeof resultCount === "number" ? (
          <p className="mb-0 text-sm text-neutral-600" aria-live="polite">
            {resultCount === 1 ? "1 vaga encontrada" : `${resultCount} vagas encontradas`}
          </p>
        ) : null}

        <fieldset>
          <legend className="mb-2 font-medium">Tipo</legend>
          <div className="flex flex-wrap gap-3">
            <label className="flex min-h-11 items-center gap-2">
              <input type="radio" name="tipo" value="" defaultChecked={!type} />
              Todas
            </label>
            {JOB_TYPES.map((item) => (
              <label key={item.value} className="flex min-h-11 items-center gap-2">
                <input
                  type="radio"
                  name="tipo"
                  value={item.value}
                  defaultChecked={type === item.value}
                />
                {item.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 font-medium">Modalidade</legend>
          <div className="flex flex-wrap gap-3">
            <label className="flex min-h-11 items-center gap-2">
              <input type="radio" name="modalidade" value="" defaultChecked={!workMode} />
              Todas
            </label>
            {WORK_MODES.map((item) => (
              <label key={item.value} className="flex min-h-11 items-center gap-2">
                <input
                  type="radio"
                  name="modalidade"
                  value={item.value}
                  defaultChecked={workMode === item.value}
                />
                {item.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="rounded-2xl border border-success-text/25 bg-success-surface p-4">
          <legend className="px-1 font-medium text-success-text">
            Recursos de acessibilidade
          </legend>
          <p className="mb-3 text-sm text-neutral-600">
            Destaque do produto: filtre pelas condições que a vaga realmente oferece.
          </p>
          <div className="grid gap-2">
            {ACCESSIBILITY_RESOURCES.filter((item) => item.value !== "outro").map((item) => (
              <label key={item.value} className="flex min-h-11 items-center gap-2">
                <input
                  type="checkbox"
                  name="acessibilidade"
                  value={item.value}
                  defaultChecked={resources.includes(item.value)}
                />
                {item.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-wrap gap-3">
          <Button type="submit">Aplicar filtros</Button>
          {hasActiveFilters ? (
            <Button asChild variant="outline">
              <Link href={clearHref}>Limpar filtros</Link>
            </Button>
          ) : null}
        </div>
      </form>
    </details>
  );
}
