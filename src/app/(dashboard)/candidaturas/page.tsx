import Link from "next/link";
import { ApplicationStatusForm } from "@/components/candidaturas/ApplicationStatusForm";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeading, PageShell, StatusBadge, applicationStatusTone } from "@/components/shared";
import { getMyCompanies } from "@/lib/actions/company";
import {
  listCompanyJobs,
  listMyApplications,
  listReceivedApplications,
} from "@/lib/actions/jobs";
import { APPLICATION_STATUSES, labelFor } from "@/lib/constants/jobs";

export const dynamic = "force-dynamic";

export default async function CandidaturasPage({
  searchParams,
}: {
  searchParams: Promise<{ empresa?: string; vaga?: string }>;
}) {
  const { empresa, vaga } = await searchParams;
  const [mine, memberships] = await Promise.all([
    listMyApplications(),
    getMyCompanies(),
  ]);

  const selectedCompany =
    empresa && memberships.some((item) => item.company_id === empresa)
      ? empresa
      : memberships[0]?.company_id;

  const companyJobs = selectedCompany
    ? await listCompanyJobs(selectedCompany)
    : { data: [] };
  const received = selectedCompany
    ? await listReceivedApplications(selectedCompany, vaga)
    : { data: [] };

  return (
    <PageShell width="wide" className="space-y-12">
      <section>
        <PageHeading
          eyebrow="Acompanhamento"
          title="Minhas candidaturas"
          description="Veja o andamento das vagas às quais você se candidatou."
        />
        {mine.error ? <p role="alert">{mine.error}</p> : null}
        {mine.data.length === 0 ? (
          <EmptyState
            title="Você ainda não se candidatou"
            description="Explore vagas com recursos de acessibilidade informados e envie sua primeira candidatura."
            action={
              <Button asChild>
                <Link href="/vagas">Ver vagas</Link>
              </Button>
            }
          />
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {mine.data.map((application) => (
              <li key={application.id} className="surface-card p-5">
                <h2 className="text-lg">
                  <Link
                    href={`/vagas/${application.job_id}`}
                    className="text-primary-dark focus-visible:outline-offset-1"
                  >
                    {application.jobs?.title ?? "Vaga"}
                  </Link>
                </h2>
                <p className="mb-3 text-neutral-600">
                  {application.jobs?.companies?.name ?? "Empresa"}
                </p>
                <StatusBadge tone={applicationStatusTone(application.status)}>
                  {labelFor(APPLICATION_STATUSES, application.status)}
                </StatusBadge>
              </li>
            ))}
          </ul>
        )}
      </section>

      {memberships.length > 0 ? (
        <section>
          <h2>Candidaturas recebidas</h2>
          <form method="get" className="surface-card mt-4 grid gap-4 p-5 sm:grid-cols-2">
            <div>
              <label htmlFor="empresa" className="mb-1 block font-medium">
                Empresa
              </label>
              <select
                id="empresa"
                name="empresa"
                className="form-select"
                defaultValue={selectedCompany}
              >
                {memberships.map((item) => (
                  <option key={item.company_id} value={item.company_id}>
                    {item.company.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="vaga" className="mb-1 block font-medium">
                Vaga
              </label>
              <select
                id="vaga"
                name="vaga"
                className="form-select"
                defaultValue={vaga ?? ""}
              >
                <option value="">Todas as vagas</option>
                {companyJobs.data.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} ({job.status})
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">Filtrar recebidas</Button>
            </div>
          </form>

          {received.error ? <p role="alert">{received.error}</p> : null}
          {received.data.length === 0 ? (
            <EmptyState
              title="Nenhuma candidatura recebida"
              description="Quando alguém se candidatar às vagas desta empresa, o pedido aparece aqui."
            />
          ) : (
            <ul className="mt-4 space-y-4">
              {received.data.map((application) => (
                <li key={application.id} className="surface-card space-y-3 p-5">
                  <div>
                    <h3>
                      {application.profiles_public?.full_name ?? "Pessoa candidata"}
                    </h3>
                    <p className="text-neutral-600">
                      {application.jobs?.title ?? "Vaga"}
                      {application.profiles_public?.headline
                        ? ` · ${application.profiles_public.headline}`
                        : ""}
                    </p>
                    {application.cover_letter ? (
                      <p className="mt-2 whitespace-pre-wrap">{application.cover_letter}</p>
                    ) : null}
                  </div>
                  <ApplicationStatusForm
                    applicationId={application.id}
                    currentStatus={application.status}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}
    </PageShell>
  );
}
