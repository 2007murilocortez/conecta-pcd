import { notFound } from "next/navigation";
import { GrantSealButton } from "@/components/empresas/GrantSealButton";
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
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-12">
      <h1>Admin · selo de empresa inclusiva</h1>
      <p>Ferramenta interna. O selo nunca é autodeclarado pela empresa.</p>

      <section>
        <h2>Sem selo</h2>
        {pending.length === 0 ? (
          <p>Nenhuma empresa pendente.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {pending.map((company) => (
              <li key={company.id} className="flex flex-wrap items-center justify-between gap-3 border border-border p-3">
                <p>{company.name}</p>
                <GrantSealButton companyId={company.id} isVerified={false} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Com selo</h2>
        {verified.length === 0 ? (
          <p>Nenhuma empresa verificada.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {verified.map((company) => (
              <li key={company.id} className="flex flex-wrap items-center justify-between gap-3 border border-border p-3">
                <p>{company.name}</p>
                <GrantSealButton companyId={company.id} isVerified />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
