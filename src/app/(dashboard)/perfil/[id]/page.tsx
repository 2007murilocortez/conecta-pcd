import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConnectButton } from "@/components/conexoes/ConnectButton";
import { listCompletedCourses } from "@/lib/actions/courses";
import { getPublicProfile } from "@/lib/actions/connections";
import { ACCESSIBILITY_NEEDS, DISABILITY_TYPES } from "@/lib/constants/profile";
import { ACCESSIBILITY_RESOURCES, labelFor } from "@/lib/constants/jobs";

export const dynamic = "force-dynamic";

export default async function PerfilPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [result, completed] = await Promise.all([
    getPublicProfile(id),
    listCompletedCourses(id),
  ]);

  if (result.error || !result.data) {
    notFound();
  }

  const { profile, skills, isSelf, connection } = result.data;
  const location = [profile.location_city, profile.location_state].filter(Boolean).join(", ");

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 sm:py-10 lg:py-12">
      <header className="overflow-hidden rounded-[1.25rem] border border-border bg-white shadow-[var(--shadow-card)]">
        <div className="h-28 bg-linear-to-r from-primary-dark via-primary to-brand-sky" />
        <div className="flex flex-wrap items-end gap-4 px-6 pb-6">
          <Avatar className="-mt-10 size-20 border-4 border-white" size="lg">
            {profile.avatar_url ? <AvatarImage src={profile.avatar_url} alt="" /> : null}
            <AvatarFallback>{profile.full_name.slice(0, 1).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-2 pt-4">
            <h1>{profile.full_name}</h1>
            {profile.headline ? <p className="mb-0">{profile.headline}</p> : null}
            {location ? <p className="mb-0 text-neutral-600">{location}</p> : null}
            {isSelf ? (
              <p className="mb-0">
                <Link href="/perfil/editar" className="text-primary underline underline-offset-4">
                  Editar meu perfil
                </Link>
              </p>
            ) : (
              <ConnectButton
                profileId={profile.id}
                connectionId={connection?.relation?.id}
                status={connection?.relation?.status}
                incoming={connection?.incoming}
              />
            )}
          </div>
        </div>
      </header>

      {profile.bio ? (
        <section className="surface-card p-6">
          <h2>Sobre</h2>
          <p className="mb-0 whitespace-pre-wrap">{profile.bio}</p>
        </section>
      ) : null}

      {completed.data.length > 0 ? (
        <section className="surface-card p-6">
          <h2>Capacitação</h2>
          <p className="text-neutral-600">
            Cursos concluídos nesta plataforma. Nomes vêm do catálogo público;
            a inscrição em si só é listada quando o status é concluído.
          </p>
          <ul className="mt-3 space-y-2">
            {completed.data.map((course) => (
              <li key={course.id} className="rounded-2xl border border-border bg-white p-3">
                <p className="mb-0 font-medium">{course.title}</p>
                {course.provider ? (
                  <p className="mb-0 text-sm text-neutral-600">{course.provider}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : isSelf ? (
        <section className="surface-card p-6">
          <h2>Capacitação</h2>
          <p className="mb-0">
            Cursos concluídos aparecem aqui e no seu perfil público. Comece em{" "}
            <Link href="/cursos" className="text-primary underline underline-offset-4">
              Cursos
            </Link>
            .
          </p>
        </section>
      ) : null}

      {skills.length > 0 ? (
        <section className="surface-card p-6">
          <h2>Habilidades</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <li key={skill} className="rounded-full border border-border bg-white px-3 py-1 text-sm">
                {skill}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {profile.accessibility_needs && profile.accessibility_needs.length > 0 ? (
        <section className="surface-card p-6">
          <h2>Recursos de acessibilidade</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {profile.accessibility_needs.map((need) => (
              <li
                key={need}
                className="rounded-full bg-success-surface px-3 py-1 text-sm font-medium text-success-text"
              >
                {ACCESSIBILITY_NEEDS.find((item) => item.value === need)?.label ??
                  labelFor(ACCESSIBILITY_RESOURCES, need)}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {profile.disability_types && profile.disability_types.length > 0 ? (
        <section className="surface-card p-6">
          <h2>Tipo de deficiência</h2>
          <p className="text-neutral-600">
            Visível porque esta pessoa escolheu mostrar no perfil público.
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {profile.disability_types.map((type) => (
              <li key={type} className="rounded-full border border-border bg-white px-3 py-1 text-sm">
                {DISABILITY_TYPES.find((item) => item.value === type)?.label ?? type}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
