import { notFound } from "next/navigation";
import { GrantSealButton } from "@/components/empresas/GrantSealButton";
import { EmptyState, PageHeading, PageShell } from "@/components/shared";
import { listAdminCompanies } from "@/lib/actions/company";

export const dynamic = "force-dynamic";

export default async function AdminEmpresasPage() {
  const result = await listAdminCompanies();

  if (result.error === "forbidden") {
    notFound();
  }

  if (result.error || !result.data) {
    notFound();
  }

  const pending = result.data.filter((company) => !company.is_verified_inclusive);
  const verified = result.data.filter((company) => company.is_verified_inclusive);

  return (
    <PageShell width="narrow" className="space-y-8">
      <PageHeading
        eyebrow="Administração"
        title="Selo de empresa inclusiva"
        description="Ferramenta interna. O selo nunca é autodeclarado pela empresa."
      />

      <section className="surface-card p-6">
        <h2>Sem selo</h2>
        {pending.length === 0 ? (
          <p className="mb-0 text-neutral-600">Nenhuma empresa pendente.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {pending.map((company) => (
              <li key={company.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white p-4">
                <p className="mb-0 font-medium">{company.name}</p>
                <GrantSealButton companyId={company.id} isVerified={false} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="surface-card p-6">
        <h2>Com selo</h2>
        {verified.length === 0 ? (
          <EmptyState
            title="Nenhuma empresa verificada"
            description="Quando o selo for concedido, a empresa aparece nesta lista."
          />
        ) : (
          <ul className="mt-3 space-y-3">
            {verified.map((company) => (
              <li key={company.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white p-4">
                <p className="mb-0 font-medium">{company.name}</p>
                <GrantSealButton companyId={company.id} isVerified />
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageShell>
  );
}
