import Link from "next/link";
import { ApplicationStatusForm } from "@/components/candidaturas/ApplicationStatusForm";
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
    <div className="mx-auto w-full max-w-5xl space-y-12 px-4 py-12">
      <section>
        <h1 className="text-primary">Minhas candidaturas</h1>
        {mine.error ? <p role="alert">{mine.error}</p> : null}
        {mine.data.length === 0 ? (
          <p>Você ainda não se candidatou a nenhuma vaga.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {mine.data.map((application) => (
              <li key={application.id} className="rounded-xl border border-border p-4">
                <h2 className="text-lg font-semibold">
                  <Link
                    href={`/vagas/${application.job_id}`}
                    className="text-primary focus-visible:outline-offset-1"
                  >
                    {application.jobs?.title ?? "Vaga"}
                  </Link>
                </h2>
                <p className="text-neutral-600">
                  {application.jobs?.companies?.name ?? "Empresa"} ·{" "}
                  {labelFor(APPLICATION_STATUSES, application.status)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {memberships.length > 0 ? (
        <section>
          <h2>Candidaturas recebidas</h2>
          <form method="get" className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="empresa" className="mb-1 block font-medium">
                Empresa
              </label>
              <select
                id="empresa"
                name="empresa"
                className="min-h-11 w-full rounded-lg border border-input bg-transparent px-2.5"
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
                className="min-h-11 w-full rounded-lg border border-input bg-transparent px-2.5"
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
              <button
                type="submit"
                className="inline-flex min-h-11 items-center rounded-lg bg-primary px-3 font-medium text-primary-foreground focus-visible:outline-offset-1"
              >
                Filtrar recebidas
              </button>
            </div>
          </form>

          {received.error ? <p role="alert">{received.error}</p> : null}
          {received.data.length === 0 ? (
            <p className="mt-4">Nenhuma candidatura recebida com esse filtro.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {received.data.map((application) => (
                <li key={application.id} className="space-y-3 rounded-xl border border-border p-4">
                  <div>
                    <h3 className="text-lg font-semibold">
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
    </div>
  );
}
