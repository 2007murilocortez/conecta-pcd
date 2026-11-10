import { PageHeading, PageShell } from "@/components/shared";
import { CompanyForm } from "@/components/empresas/CompanyForm";

export const dynamic = "force-dynamic";

export default async function NovaEmpresaPage({
  searchParams,
}: {
  searchParams: Promise<{ motivo?: string }>;
}) {
  const { motivo } = await searchParams;

  return (
    <PageShell width="narrow">
      <PageHeading
        eyebrow="Empresa"
        title="Criar página de empresa"
        description="Isso não muda o tipo da sua conta. Você continua sendo a mesma pessoa e passa a gerenciar esta empresa pelo vínculo em company_members."
      />
      {motivo === "vaga" ? (
        <p role="status" className="mb-6 rounded-[1.15rem] border border-border bg-brand-light p-4">
          Para publicar uma vaga você precisa de uma página de empresa primeiro.
          Crie-a agora — em seguida você cai direto no formulário da vaga.
        </p>
      ) : null}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <div className="surface-card p-6">
          <CompanyForm />
        </div>
        <aside className="h-fit rounded-2xl bg-neutral-100 p-4 text-sm text-neutral-600">
          <p className="mb-2 font-medium text-primary-dark">O que sua página vai mostrar</p>
          <p className="mb-0">
            Nome, descrição, setor, recursos de acessibilidade declarados, vagas abertas e avaliações.
            O selo inclusivo não é automático: só a administração concede depois de validar.
          </p>
        </aside>
      </div>
    </PageShell>
  );
}
