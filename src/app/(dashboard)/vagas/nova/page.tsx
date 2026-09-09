import { redirect } from "next/navigation";
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
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-primary">Publicar vaga</h1>
      <p>
        A vaga é publicada em nome da empresa. Quem está logado fica registrado
        como a pessoa que publicou.
      </p>
      <div className="mt-8">
        <JobForm companies={companies} defaultCompanyId={defaultCompanyId} />
      </div>
    </div>
  );
}
