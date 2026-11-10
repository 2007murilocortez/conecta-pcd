import { EmptyState, PageHeading, PageShell } from "@/components/shared";
import { JobCard } from "@/components/vagas/JobCard";
import { JobFilters } from "@/components/vagas/JobFilters";
import { listOpenJobs } from "@/lib/actions/jobs";
import { toSearchArray } from "@/lib/jobs/format";

export const dynamic = "force-dynamic";

export default async function VagasPage({
  searchParams,
}: {
  searchParams: Promise<{
    tipo?: string;
    modalidade?: string;
    acessibilidade?: string | string[];
    empresa?: string;
  }>;
}) {
  const params = await searchParams;
  const resources = toSearchArray(params.acessibilidade);
  const result = await listOpenJobs({
    type: params.tipo || undefined,
    workMode: params.modalidade || undefined,
    resources,
    companyId: params.empresa,
  });

  return (
    <PageShell width="wide">
      <PageHeading
        eyebrow="Oportunidades"
        title="Encontre oportunidades que consideram suas necessidades"
        description="Administrativo, atendimento, caixa, recepção, estoque e digitação — cargos em que muita gente com deficiência entra no mercado. O filtro em destaque é a acessibilidade da vaga, não um detalhe escondido."
      />

      <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <JobFilters
            type={params.tipo}
            workMode={params.modalidade}
            resources={resources}
            companyId={params.empresa}
            resultCount={result.error ? undefined : result.data.length}
          />
        </div>

        <div>
          {result.error ? (
            <p role="alert">{result.error}</p>
          ) : result.data.length === 0 ? (
            <EmptyState
              title="Nenhuma vaga com esses filtros"
              description="Tente limpar os filtros ou explorar outra modalidade. Novas oportunidades aparecem aqui quando as empresas publicam."
            />
          ) : (
            <ul className="space-y-4">
              {result.data.map((job) => (
                <li key={job.id}>
                  <JobCard job={job} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PageShell>
  );
}
