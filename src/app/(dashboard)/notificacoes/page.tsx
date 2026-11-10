import { EmptyState, PageHeading, PageShell } from "@/components/shared";
import { MarkAllReadButton } from "@/components/notificacoes/MarkAllReadButton";
import { NotificationLink } from "@/components/notificacoes/NotificationLink";
import { listMyNotifications } from "@/lib/actions/notifications";

export const dynamic = "force-dynamic";

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

export default async function NotificacoesPage() {
  const result = await listMyNotifications();

  return (
    <PageShell width="narrow">
      <PageHeading
        eyebrow="Atualizações"
        title="Notificações"
        description="Aviso dentro do app para o que importa no dia a dia. E-mail só sai para mudança de candidatura e aceite de mentoria — sem spam de conexão ou curtida."
        actions={result.unreadCount > 0 ? <MarkAllReadButton /> : undefined}
      />

      {result.error ? <p role="alert">{result.error}</p> : null}

      {result.data.length === 0 ? (
        <EmptyState
          title="Você ainda não tem notificações"
          description="Quando houver pedido de conexão, candidatura ou mentoria, o aviso aparece aqui."
        />
      ) : (
        <ul className="space-y-3">
          {result.data.map((item) => (
            <li key={item.id}>
              <article
                className={
                  item.is_read
                    ? "surface-card p-5"
                    : "rounded-[1.15rem] border border-primary/30 bg-brand-light p-5"
                }
              >
                <header className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-base">{item.title}</h2>
                  <p className="mb-0 text-sm text-neutral-600">
                    {formatWhen(item.created_at)}
                    {item.is_read ? "" : " · Não lida"}
                  </p>
                </header>
                {item.body ? <p>{item.body}</p> : null}
                {item.link ? (
                  <p className="mt-2 mb-0">
                    <NotificationLink id={item.id} href={item.link}>
                      Abrir
                    </NotificationLink>
                  </p>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
