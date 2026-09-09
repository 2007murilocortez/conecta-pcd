import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AccessibilityChips } from "@/components/vagas/AccessibilityChips";
import { JOB_TYPES, WORK_MODES, labelFor } from "@/lib/constants/jobs";
import { formatLocation, formatPostedAt } from "@/lib/jobs/format";
import type { JobWithCompany } from "@/lib/actions/jobs";

export function JobCard({ job }: { job: JobWithCompany }) {
  const companyName = job.companies?.name ?? "Empresa";

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link
            href={`/vagas/${job.id}`}
            className="text-primary focus-visible:outline-offset-1"
          >
            {job.title}
          </Link>
        </CardTitle>
        <p className="text-neutral-600">
          {companyName} · {formatLocation(job.location_city, job.location_state)}
        </p>
        <p className="flex flex-wrap gap-2">
          <span className="rounded-full border border-border px-2 py-0.5 text-sm">
            {labelFor(JOB_TYPES, job.type)}
          </span>
          <span className="rounded-full border border-border px-2 py-0.5 text-sm">
            {labelFor(WORK_MODES, job.work_mode)}
          </span>
          {job.companies?.is_verified_inclusive ? (
            <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-sm text-secondary">
              Empresa inclusiva verificada
            </span>
          ) : null}
        </p>
      </CardHeader>
      <CardContent>
        <AccessibilityChips resources={job.accessibility_resources} />
      </CardContent>
      <CardFooter className="justify-between gap-3">
        <p className="text-sm text-neutral-600">{formatPostedAt(job.created_at)}</p>
        <Button asChild>
          <Link href={`/vagas/${job.id}`}>Candidatar-se</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
