import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState, PageHeading, PageShell } from "@/components/shared";
import { MentorshipActions } from "@/components/mentoria/MentorshipActions";
import { MentorshipRequestForm } from "@/components/mentoria/MentorshipRequestForm";
import { listMentors, listMyMentorships } from "@/lib/actions/mentorship";

export const dynamic = "force-dynamic";

export default async function MentoriaPage() {
  const [mentors, mine] = await Promise.all([listMentors(), listMyMentorships()]);

  return (
    <PageShell width="narrow" className="space-y-8">
      <PageHeading
        eyebrow="Aprendizado"
        title="Mentoria"
        description="Encontre quem está aberto a orientar, envie uma solicitação e combine o contato pelo perfil depois do aceite. Não há chat interno neste MVP."
      />

      <ol className="grid gap-3 sm:grid-cols-3">
        <li className="rounded-2xl bg-brand-light p-4">
          <p className="mb-1 text-sm font-medium text-primary">01</p>
          <p className="mb-0 font-medium text-primary-dark">Encontre mentor(a)</p>
        </li>
        <li className="rounded-2xl bg-brand-light p-4">
          <p className="mb-1 text-sm font-medium text-primary">02</p>
          <p className="mb-0 font-medium text-primary-dark">Envie a solicitação</p>
        </li>
        <li className="rounded-2xl bg-brand-light p-4">
          <p className="mb-1 text-sm font-medium text-primary">03</p>
          <p className="mb-0 font-medium text-primary-dark">Combine pelo perfil</p>
        </li>
      </ol>

      <p>
        Marque-se como disponível no seu{" "}
        <Link href="/perfil/editar" className="text-primary underline underline-offset-4">
          perfil
        </Link>
        .
      </p>

      <section className="surface-card p-6">
        <h2 className="text-xl">Pedidos recebidos</h2>
        {mine.error ? <p role="alert">{mine.error}</p> : null}
        {mine.data?.incoming.length ? (
          <ul className="mt-4 space-y-3">
            {mine.data.incoming.map((item) => (
              <li key={item.id} className="space-y-3 rounded-2xl border border-border bg-white p-4">
                <Person person={item.other} />
                {item.message ? <p className="whitespace-pre-wrap">{item.message}</p> : null}
                <MentorshipActions mentorshipId={item.id} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-0 text-neutral-600">Nenhum pedido recebido.</p>
        )}
      </section>

      <section className="surface-card p-6">
        <h2 className="text-xl">Pedidos enviados</h2>
        {mine.data?.outgoing.length ? (
          <ul className="mt-4 space-y-3">
            {mine.data.outgoing.map((item) => (
              <li key={item.id} className="rounded-2xl border border-border bg-white p-4">
                <Person person={item.other} />
                <p className="mb-0 text-sm text-neutral-600">Status: pendente</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-0 text-neutral-600">Você não enviou pedidos pendentes.</p>
        )}
      </section>

      <section className="surface-card p-6">
        <h2 className="text-xl">Mentorias ativas</h2>
        {mine.data?.active.length ? (
          <ul className="mt-4 space-y-3">
            {mine.data.active.map((item) => (
              <li key={item.id} className="rounded-2xl border border-border bg-white p-4">
                <Person person={item.other} />
                <p className="mb-0">
                  Contato liberado:{" "}
                  <Link
                    href={`/perfil/${item.other.id}`}
                    className="text-primary underline underline-offset-4"
                  >
                    ver perfil
                  </Link>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-0 text-neutral-600">Nenhuma mentoria ativa ainda.</p>
        )}
      </section>

      <section className="surface-card p-6">
        <h2 className="text-xl">Profissionais disponíveis</h2>
        {mentors.error ? <p role="alert">{mentors.error}</p> : null}
        {mentors.data.length === 0 ? (
          <EmptyState
            title="Ninguém disponível no momento"
            description="Quando alguém marcar o perfil como aberto à mentoria, a pessoa aparece aqui."
          />
        ) : (
          <ul className="mt-4 space-y-4">
            {mentors.data.map((mentor) => (
              <li key={mentor.id} className="space-y-3 rounded-2xl border border-border bg-white p-4">
                <Person person={mentor} />
                <MentorshipRequestForm mentorId={mentor.id} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageShell>
  );
}

function Person({
  person,
}: {
  person: { id: string; full_name: string; headline: string | null; avatar_url: string | null };
}) {
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        {person.avatar_url ? <AvatarImage src={person.avatar_url} alt="" /> : null}
        <AvatarFallback>{person.full_name.slice(0, 1).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <p className="mb-0 font-medium">
          <Link href={`/perfil/${person.id}`} className="text-primary-dark focus-visible:outline-offset-1">
            {person.full_name}
          </Link>
        </p>
        {person.headline ? <p className="mb-0 text-sm text-neutral-600">{person.headline}</p> : null}
      </div>
    </div>
  );
}
