import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MentorshipActions } from "@/components/mentoria/MentorshipActions";
import { MentorshipRequestForm } from "@/components/mentoria/MentorshipRequestForm";
import { listMentors, listMyMentorships } from "@/lib/actions/mentorship";

export const dynamic = "force-dynamic";

export default async function MentoriaPage() {
  const [mentors, mine] = await Promise.all([listMentors(), listMyMentorships()]);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-10 px-4 py-12">
      <div>
        <h1 className="text-primary">Mentoria</h1>
        <p>
          Marque-se como disponível no seu{" "}
          <Link href="/perfil/editar" className="text-primary underline underline-offset-4">
            perfil
          </Link>
          . Depois do aceite, o contato é o perfil da outra pessoa — sem chat neste MVP.
        </p>
      </div>

      <section>
        <h2>Pedidos recebidos</h2>
        {mine.error ? <p role="alert">{mine.error}</p> : null}
        {mine.data?.incoming.length ? (
          <ul className="mt-3 space-y-3">
            {mine.data.incoming.map((item) => (
              <li key={item.id} className="space-y-3 rounded-xl border border-border p-4">
                <Person person={item.other} />
                {item.message ? <p className="whitespace-pre-wrap">{item.message}</p> : null}
                <MentorshipActions mentorshipId={item.id} />
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum pedido recebido.</p>
        )}
      </section>

      <section>
        <h2>Pedidos enviados</h2>
        {mine.data?.outgoing.length ? (
          <ul className="mt-3 space-y-3">
            {mine.data.outgoing.map((item) => (
              <li key={item.id} className="rounded-xl border border-border p-4">
                <Person person={item.other} />
                <p className="text-sm text-neutral-600">Status: pendente</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Você não enviou pedidos pendentes.</p>
        )}
      </section>

      <section>
        <h2>Mentorias ativas</h2>
        {mine.data?.active.length ? (
          <ul className="mt-3 space-y-3">
            {mine.data.active.map((item) => (
              <li key={item.id} className="rounded-xl border border-border p-4">
                <Person person={item.other} />
                <p>
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
          <p>Nenhuma mentoria ativa ainda.</p>
        )}
      </section>

      <section>
        <h2>Profissionais disponíveis</h2>
        {mentors.error ? <p role="alert">{mentors.error}</p> : null}
        {mentors.data.length === 0 ? (
          <p>Ninguém se marcou como disponível para mentoria no momento.</p>
        ) : (
          <ul className="mt-3 space-y-4">
            {mentors.data.map((mentor) => (
              <li key={mentor.id} className="space-y-3 rounded-xl border border-border p-4">
                <Person person={mentor} />
                <MentorshipRequestForm mentorId={mentor.id} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
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
        <p className="font-medium">
          <Link href={`/perfil/${person.id}`} className="text-primary focus-visible:outline-offset-1">
            {person.full_name}
          </Link>
        </p>
        {person.headline ? <p className="text-sm text-neutral-600">{person.headline}</p> : null}
      </div>
    </div>
  );
}
