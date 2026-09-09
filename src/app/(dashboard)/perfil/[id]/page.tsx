import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConnectButton } from "@/components/conexoes/ConnectButton";
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
  const result = await getPublicProfile(id);

  if (result.error || !result.data) {
    notFound();
  }

  const { profile, skills, isSelf, connection } = result.data;
  const location = [profile.location_city, profile.location_state].filter(Boolean).join(", ");

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-12">
      <header className="flex flex-wrap items-start gap-4">
        <Avatar className="size-16" size="lg">
          {profile.avatar_url ? <AvatarImage src={profile.avatar_url} alt="" /> : null}
          <AvatarFallback>{profile.full_name.slice(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="text-primary">{profile.full_name}</h1>
          {profile.headline ? <p>{profile.headline}</p> : null}
          {location ? <p className="text-neutral-600">{location}</p> : null}
          {profile.open_to_mentor ? (
            <p className="text-sm text-secondary">Disponível para mentoria</p>
          ) : null}
          {isSelf ? (
            <p>
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
      </header>

      {profile.bio ? (
        <section>
          <h2>Sobre</h2>
          <p className="whitespace-pre-wrap">{profile.bio}</p>
        </section>
      ) : null}

      {skills.length > 0 ? (
        <section>
          <h2>Habilidades</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <li key={skill} className="rounded-full border border-border px-3 py-1 text-sm">
                {skill}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {profile.accessibility_needs && profile.accessibility_needs.length > 0 ? (
        <section>
          <h2>Recursos de acessibilidade</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {profile.accessibility_needs.map((need) => (
              <li
                key={need}
                className="rounded-full bg-secondary/10 px-3 py-1 text-sm text-secondary"
              >
                {ACCESSIBILITY_NEEDS.find((item) => item.value === need)?.label ??
                  labelFor(ACCESSIBILITY_RESOURCES, need)}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {profile.disability_types && profile.disability_types.length > 0 ? (
        <section>
          <h2>Tipo de deficiência</h2>
          <p className="text-neutral-600">
            Visível porque esta pessoa escolheu mostrar no perfil público.
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {profile.disability_types.map((type) => (
              <li key={type} className="rounded-full border border-border px-3 py-1 text-sm">
                {DISABILITY_TYPES.find((item) => item.value === type)?.label ?? type}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
