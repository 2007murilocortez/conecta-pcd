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
};

export function JobFilters({ type, workMode, resources, companyId }: JobFiltersProps) {
  return (
    <form method="get" className="space-y-6 rounded-xl border border-border p-4">
      {companyId ? <input type="hidden" name="empresa" value={companyId} /> : null}

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

      <fieldset className="rounded-lg border border-secondary/40 bg-secondary/10 p-4">
        <legend className="px-1 font-medium text-secondary">
          Recursos de acessibilidade
        </legend>
        <p className="mb-3 text-sm text-neutral-600">
          Destaque do produto: filtre pelas condições que a vaga realmente oferece.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
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

      <Button type="submit">Aplicar filtros</Button>
    </form>
  );
}
