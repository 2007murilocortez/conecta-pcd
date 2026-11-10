import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplyForm } from "@/components/vagas/ApplyForm";
import { JobViewTracker } from "@/components/vagas/JobViewTracker";
import { AccessibilityChips } from "@/components/vagas/AccessibilityChips";
import { JobManageActions } from "@/components/vagas/JobManageActions";
import { StatusBadge } from "@/components/shared";
import { getJobById } from "@/lib/actions/jobs";
import { JOB_TYPES, WORK_MODES, labelFor } from "@/lib/constants/jobs";
import { formatLocation, formatPostedAt, formatSalary } from "@/lib/jobs/format";

export const dynamic = "force-dynamic";

export default async function VagaDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getJobById(id);

  if (result.error || !result.data) {
    notFound();
  }

  const { job, isMember, hasApplied } = result.data;
  const company = job.companies;
  const salary =
    job.salary_visible ? formatSalary(job.salary_min, job.salary_max) : null;
  const isOpen = job.status === "aberta";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10 lg:py-12">
      <JobViewTracker jobId={job.id} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="space-y-8">
          <header className="surface-card p-6 sm:p-8">
            <p className="mb-2 text-sm text-neutral-600">
              {company ? (
                <Link
                  href={`/empresas/${company.id}`}
                  className="text-primary underline underline-offset-4"
                >
                  {company.name}
                </Link>
              ) : (
                "Empresa"
              )}
              {company?.is_verified_inclusive ? " · Empresa inclusiva verificada" : ""}
            </p>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <StatusBadge tone={isOpen ? "success" : "neutral"}>
                {isOpen ? "Vaga aberta" : "Vaga encerrada"}
              </StatusBadge>
            </div>
            <h1>{job.title}</h1>
            <p className="mt-2 mb-0">
              {labelFor(JOB_TYPES, job.type)} · {labelFor(WORK_MODES, job.work_mode)} ·{" "}
              {formatLocation(job.location_city, job.location_state)}
            </p>
            <p className="mt-2 mb-0 text-sm text-neutral-600">{formatPostedAt(job.created_at)}</p>
            {salary ? <p className="mt-3 mb-0 font-medium text-primary-dark">{salary}</p> : null}
            {!isOpen ? (
              <p role="status" className="mt-3 mb-0 font-medium">
                Esta vaga está encerrada.
              </p>
            ) : null}
          </header>

          <section className="surface-card p-6 sm:p-8">
            <h2>Sobre a vaga</h2>
            <p className="whitespace-pre-wrap">{job.description}</p>
          </section>

          {job.requirements ? (
            <section className="surface-card p-6 sm:p-8">
              <h2>Requisitos</h2>
              <p className="whitespace-pre-wrap">{job.requirements}</p>
            </section>
          ) : null}

          <section className="surface-card p-6 sm:p-8">
            <AccessibilityChips resources={job.accessibility_resources} />
          </section>

          {isMember ? <JobManageActions jobId={job.id} isOpen={isOpen} /> : null}

          <p className="lg:hidden">
            <a href="#candidatura" className="text-primary underline underline-offset-4">
              Ir para candidatura
            </a>
          </p>
        </div>

        <aside id="candidatura" className="scroll-mt-24 lg:sticky lg:top-24">
          <section className="rounded-[1.15rem] bg-primary-dark p-6 text-white">
            <h2 className="text-white">Candidatar-se</h2>
            <p className="text-white/85">
              Envie sua candidatura por este formulário. O status aparece depois em Candidaturas.
            </p>
            <div className="rounded-2xl bg-white p-4 text-neutral-900">
              <ApplyForm
                jobId={job.id}
                disabled={!isOpen || hasApplied}
                disabledReason={
                  hasApplied
                    ? "Você já se candidatou a esta vaga."
                    : !isOpen
                      ? "Esta vaga não aceita novas candidaturas."
                      : undefined
                }
              />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
