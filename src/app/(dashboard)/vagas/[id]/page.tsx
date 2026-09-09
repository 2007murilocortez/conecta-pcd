import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplyForm } from "@/components/vagas/ApplyForm";
import { JobViewTracker } from "@/components/vagas/JobViewTracker";
import { AccessibilityChips } from "@/components/vagas/AccessibilityChips";
import { JobManageActions } from "@/components/vagas/JobManageActions";
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
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-12">
      <JobViewTracker jobId={job.id} />
      <div>
        <p className="text-neutral-600">
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
        <h1 className="text-primary">{job.title}</h1>
        <p>
          {labelFor(JOB_TYPES, job.type)} · {labelFor(WORK_MODES, job.work_mode)} ·{" "}
          {formatLocation(job.location_city, job.location_state)}
        </p>
        <p className="text-sm text-neutral-600">{formatPostedAt(job.created_at)}</p>
        {salary ? <p className="mt-2 font-medium">{salary}</p> : null}
        {!isOpen ? (
          <p role="status" className="mt-3 font-medium">
            Esta vaga está encerrada.
          </p>
        ) : null}
      </div>

      <section>
        <h2>Sobre a vaga</h2>
        <p className="whitespace-pre-wrap">{job.description}</p>
      </section>

      {job.requirements ? (
        <section>
          <h2>Requisitos</h2>
          <p className="whitespace-pre-wrap">{job.requirements}</p>
        </section>
      ) : null}

      <AccessibilityChips resources={job.accessibility_resources} />

      {isMember ? <JobManageActions jobId={job.id} isOpen={isOpen} /> : null}

      <section>
        <h2>Candidatar-se</h2>
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
      </section>
    </div>
  );
}
