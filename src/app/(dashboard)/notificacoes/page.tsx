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
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-12">
      <div>
        <h1 className="text-primary">Notificações</h1>
        <p>
          Aviso dentro do app para o que importa no dia a dia. E-mail só sai
          para mudança de candidatura e aceite de mentoria — sem spam de
          conexão ou curtida.
        </p>
      </div>

      {result.unreadCount > 0 ? <MarkAllReadButton /> : null}

      {result.error ? <p role="alert">{result.error}</p> : null}

      {result.data.length === 0 ? (
        <p role="status" className="rounded-md border border-border bg-neutral-100 p-4">
          Você ainda não tem notificações.
        </p>
      ) : (
        <ul className="space-y-3">
          {result.data.map((item) => (
            <li key={item.id}>
              <article
                className={
                  item.is_read
                    ? "rounded-xl border border-border p-4"
                    : "rounded-xl border border-secondary bg-secondary/10 p-4"
                }
              >
                <header className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-base">{item.title}</h2>
                  <p className="text-sm text-neutral-600">
                    {formatWhen(item.created_at)}
                    {item.is_read ? "" : " · Não lida"}
                  </p>
                </header>
                {item.body ? <p>{item.body}</p> : null}
                {item.link ? (
                  <p className="mt-2">
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
    </div>
  );
}
