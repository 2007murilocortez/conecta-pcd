import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AccessibilityChips } from "@/components/vagas/AccessibilityChips";
import { JOB_TYPES, WORK_MODES, labelFor } from "@/lib/constants/jobs";
import { formatExcerpt, formatLocation, formatPostedAt, formatSalary } from "@/lib/jobs/format";
import type { JobWithCompany } from "@/lib/actions/jobs";

export function JobCard({ job }: { job: JobWithCompany }) {
  const companyName = job.companies?.name ?? "Empresa";
  const salary = job.salary_visible ? formatSalary(job.salary_min, job.salary_max) : null;

  return (
    <article className="surface-card surface-card-hover p-6">
      <p className="mb-1 text-sm text-neutral-600">
        {companyName} · {formatLocation(job.location_city, job.location_state)}
      </p>
      <h2 className="text-xl">
        <Link
          href={`/vagas/${job.id}`}
          className="text-primary-dark focus-visible:outline-offset-1"
        >
          {job.title}
        </Link>
      </h2>
      <ul className="mt-3 mb-4 flex flex-wrap gap-2" aria-label="Tipo e modalidade">
        <li className="rounded-full border border-border bg-white px-3 py-1 text-sm">
          {labelFor(JOB_TYPES, job.type)}
        </li>
        <li className="rounded-full border border-border bg-white px-3 py-1 text-sm">
          {labelFor(WORK_MODES, job.work_mode)}
        </li>
        {job.companies?.is_verified_inclusive ? (
          <li className="rounded-full bg-success-surface px-3 py-1 text-sm font-medium text-success-text">
            Empresa inclusiva verificada
          </li>
        ) : null}
      </ul>
      <p className="text-neutral-900">{formatExcerpt(job.description)}</p>
      {salary ? <p className="font-medium text-primary-dark">{salary}</p> : null}
      <div className="mt-4">
        <AccessibilityChips resources={job.accessibility_resources} />
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="mb-0 text-sm text-neutral-600">{formatPostedAt(job.created_at)}</p>
        <Button asChild>
          <Link href={`/vagas/${job.id}`}>Ver vaga</Link>
        </Button>
      </div>
    </article>
  );
}
