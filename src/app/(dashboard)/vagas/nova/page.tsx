import { redirect } from "next/navigation";
import { PageHeading, PageShell } from "@/components/shared";
import { JobForm } from "@/components/vagas/JobForm";
import { getMyCompanies } from "@/lib/actions/company";

export const dynamic = "force-dynamic";

export default async function NovaVagaPage({
  searchParams,
}: {
  searchParams: Promise<{ empresa?: string }>;
}) {
  const { empresa } = await searchParams;
  const memberships = await getMyCompanies();

  if (memberships.length === 0) {
    redirect("/empresas/nova?motivo=vaga");
  }

  const companies = memberships.map((item) => ({
    id: item.company.id,
    name: item.company.name,
  }));

  const defaultCompanyId =
    empresa && companies.some((company) => company.id === empresa)
      ? empresa
      : companies[0]?.id;

  return (
    <PageShell width="narrow">
      <PageHeading
        eyebrow="Publicação"
        title="Publicar vaga"
        description="A vaga é publicada em nome da empresa. Informe os recursos de acessibilidade no anúncio — não só no discurso."
      />
      <div className="surface-card p-6">
        <JobForm companies={companies} defaultCompanyId={defaultCompanyId} />
      </div>
    </PageShell>
  );
}
