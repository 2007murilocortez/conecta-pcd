import Link from "next/link";
import { ConnectionActions } from "@/components/conexoes/ConnectionActions";
import { EmptyState, PageHeading, PageShell } from "@/components/shared";
import { listConnections } from "@/lib/actions/connections";

export const dynamic = "force-dynamic";

export default async function ConexoesPage() {
  const result = await listConnections();

  if (result.error || !result.data) {
    return (
      <PageShell width="narrow">
        <PageHeading title="Conexões" />
        <p role="alert">{result.error ?? "Não foi possível carregar as conexões."}</p>
      </PageShell>
    );
  }

  const { accepted, incoming, outgoing } = result.data;

  return (
    <PageShell width="narrow" className="space-y-10">
      <PageHeading
        eyebrow="Rede"
        title="Conexões"
        description="Aceite pedidos, acompanhe os que você enviou e veja quem já faz parte da sua rede."
      />

      <section className="surface-card p-6">
        <h2 className="text-xl">Pedidos recebidos</h2>
        {incoming.length === 0 ? (
          <p className="mb-0 text-neutral-600">Nenhum pedido pendente.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {incoming.map((item) => (
              <li key={item.id} className="space-y-3 rounded-2xl border border-border bg-white p-4">
                <PersonLink person={item.person} />
                <ConnectionActions connectionId={item.id} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="surface-card p-6">
        <h2 className="text-xl">Pedidos enviados</h2>
        {outgoing.length === 0 ? (
          <p className="mb-0 text-neutral-600">Nenhum pedido aguardando resposta.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {outgoing.map((item) => (
              <li key={item.id} className="rounded-2xl border border-border bg-white p-4">
                <PersonLink person={item.person} />
                <p className="mb-0 text-sm text-neutral-600">Aguardando resposta</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="surface-card p-6">
        <h2 className="text-xl">Conexões aceitas</h2>
        {accepted.length === 0 ? (
          <EmptyState
            title="Você ainda não tem conexões aceitas"
            description="Visite perfis e use Conectar, ou acompanhe os pedidos acima."
          />
        ) : (
          <ul className="mt-4 space-y-3">
            {accepted.map((item) => (
              <li key={item.id} className="rounded-2xl border border-border bg-white p-4">
                <PersonLink person={item.person} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageShell>
  );
}

function PersonLink({
  person,
}: {
  person: { id: string; full_name: string; headline: string | null };
}) {
  return (
    <div>
      <p className="mb-0 font-medium">
        <Link href={`/perfil/${person.id}`} className="text-primary-dark focus-visible:outline-offset-1">
          {person.full_name}
        </Link>
      </p>
      {person.headline ? <p className="mb-0 text-neutral-600">{person.headline}</p> : null}
    </div>
  );
}
