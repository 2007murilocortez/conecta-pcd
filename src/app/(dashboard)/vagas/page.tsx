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
    <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-12">
      <div>
        <h1 className="text-primary">Vagas</h1>
        <p>
          Filtre pelo que a vaga oferece de acessibilidade — esse é o filtro em
          destaque, não um detalhe escondido.
        </p>
      </div>

      <JobFilters
        type={params.tipo}
        workMode={params.modalidade}
        resources={resources}
        companyId={params.empresa}
      />

      {result.error ? (
        <p role="alert">{result.error}</p>
      ) : result.data.length === 0 ? (
        <p>Nenhuma vaga aberta com esses filtros.</p>
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
  );
}
