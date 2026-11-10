import Link from "next/link";
import { JOB_TYPES, WORK_MODES, labelFor } from "@/lib/constants/jobs";
import { formatLocation } from "@/lib/jobs/format";
import type { JobWithCompany } from "@/lib/actions/jobs";

export function FeedJobSuggestion({ job }: { job: JobWithCompany }) {
  const companyName = job.companies?.name ?? "Empresa";

  return (
    <article className="rounded-2xl border border-border bg-white p-4">
      <p className="mb-1 text-xs font-medium text-neutral-600">
        {companyName} · {formatLocation(job.location_city, job.location_state)}
      </p>
      <h3 className="text-base">
        <Link href={`/vagas/${job.id}`} className="text-primary-dark focus-visible:outline-offset-1">
          {job.title}
        </Link>
      </h3>
      <p className="mb-0 mt-2 text-sm text-neutral-600">
        {labelFor(JOB_TYPES, job.type)} · {labelFor(WORK_MODES, job.work_mode)}
      </p>
    </article>
  );
}
