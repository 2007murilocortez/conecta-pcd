import Link from "next/link";
import { ConnectionActions } from "@/components/conexoes/ConnectionActions";
import { listConnections } from "@/lib/actions/connections";

export const dynamic = "force-dynamic";

export default async function ConexoesPage() {
  const result = await listConnections();

  if (result.error || !result.data) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-12">
        <h1 className="text-primary">Conexões</h1>
        <p role="alert">{result.error ?? "Não foi possível carregar as conexões."}</p>
      </div>
    );
  }

  const { accepted, incoming, outgoing } = result.data;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-10 px-4 py-12">
      <h1 className="text-primary">Conexões</h1>

      <section>
        <h2>Pedidos recebidos</h2>
        {incoming.length === 0 ? (
          <p>Nenhum pedido pendente.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {incoming.map((item) => (
              <li key={item.id} className="space-y-3 rounded-xl border border-border p-4">
                <PersonLink person={item.person} />
                <ConnectionActions connectionId={item.id} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Pedidos enviados</h2>
        {outgoing.length === 0 ? (
          <p>Nenhum pedido aguardando resposta.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {outgoing.map((item) => (
              <li key={item.id} className="rounded-xl border border-border p-4">
                <PersonLink person={item.person} />
                <p className="text-sm text-neutral-600">Aguardando resposta</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Conexões aceitas</h2>
        {accepted.length === 0 ? (
          <p>
            Você ainda não tem conexões aceitas. Visite perfis e use Conectar, ou
            acompanhe os pedidos acima.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {accepted.map((item) => (
              <li key={item.id} className="rounded-xl border border-border p-4">
                <PersonLink person={item.person} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function PersonLink({
  person,
}: {
  person: { id: string; full_name: string; headline: string | null };
}) {
  return (
    <div>
      <p className="font-medium">
        <Link href={`/perfil/${person.id}`} className="text-primary focus-visible:outline-offset-1">
          {person.full_name}
        </Link>
      </p>
      {person.headline ? <p className="text-neutral-600">{person.headline}</p> : null}
    </div>
  );
}
