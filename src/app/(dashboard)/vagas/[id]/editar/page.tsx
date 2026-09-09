import { notFound, redirect } from "next/navigation";
import { JobForm } from "@/components/vagas/JobForm";
import { getMyCompanies } from "@/lib/actions/company";
import { getJobById } from "@/lib/actions/jobs";

export const dynamic = "force-dynamic";

export default async function EditarVagaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [jobResult, memberships] = await Promise.all([getJobById(id), getMyCompanies()]);

  if (jobResult.error || !jobResult.data) {
    notFound();
  }

  if (!jobResult.data.isMember) {
    redirect(`/vagas/${id}`);
  }

  const companies = memberships.map((item) => ({
    id: item.company.id,
    name: item.company.name,
  }));

  const { job } = jobResult.data;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-primary">Editar vaga</h1>
      <p>As mudanças valem na hora para quem estiver vendo a listagem.</p>
      <div className="mt-8">
        <JobForm
          companies={companies}
          jobId={job.id}
          defaultValues={{
            company_id: job.company_id,
            title: job.title,
            description: job.description,
            requirements: job.requirements ?? "",
            type: job.type,
            work_mode: job.work_mode,
            location_city: job.location_city ?? "",
            location_state: job.location_state ?? "",
            salary_min: job.salary_min ?? undefined,
            salary_max: job.salary_max ?? undefined,
            salary_visible: Boolean(job.salary_visible),
            accessibility_resources: job.accessibility_resources ?? [],
          }}
        />
      </div>
    </div>
  );
}
