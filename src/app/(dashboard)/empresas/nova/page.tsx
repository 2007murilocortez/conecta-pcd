import { CompanyForm } from "@/components/empresas/CompanyForm";

export const dynamic = "force-dynamic";

export default async function NovaEmpresaPage({
  searchParams,
}: {
  searchParams: Promise<{ motivo?: string }>;
}) {
  const { motivo } = await searchParams;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-primary">Criar página de empresa</h1>
      <p>
        Isso não muda o tipo da sua conta. Você continua sendo a mesma pessoa e
        passa a gerenciar esta empresa pelo vínculo em company_members.
      </p>
      {motivo === "vaga" ? (
        <p role="status" className="mt-4 rounded-md border border-border bg-neutral-100 p-4">
          Para publicar uma vaga você precisa de uma página de empresa primeiro.
          Crie-a agora — em seguida você cai direto no formulário da vaga.
        </p>
      ) : null}
      <div className="mt-8">
        <CompanyForm />
      </div>
    </div>
  );
}
