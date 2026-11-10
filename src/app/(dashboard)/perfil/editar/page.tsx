import { redirect } from "next/navigation";
import { PageHeading, PageShell } from "@/components/shared";
import { ProfileEditor } from "@/components/perfil/ProfileEditor";
import { getProfileEditorData } from "@/lib/actions/profile";
import { isOnboardingComplete } from "@/lib/validations/profile";

export const dynamic = "force-dynamic";

export default async function EditarPerfilPage() {
  const result = await getProfileEditorData();

  if (result.error || !result.data) {
    redirect("/login");
  }

  const { profile, educations, experiences, skills, skillCatalog } = result.data;
  const isOnboarding = !isOnboardingComplete(profile);

  return (
    <PageShell width="narrow">
      <PageHeading
        eyebrow="Perfil"
        title={isOnboarding ? "Complete seu perfil" : "Editar perfil"}
        description={
          isOnboarding
            ? "Toda conta começa igual. Preencha seus dados profissionais para liberar o restante da plataforma."
            : "Atualize seu currículo vivo. O tipo de deficiência só aparece publicamente se você escolher mostrar."
        }
      />
      <ProfileEditor
        isOnboarding={isOnboarding}
        profile={profile}
        educations={educations}
        experiences={experiences}
        skills={skills}
        skillCatalog={skillCatalog}
      />
    </PageShell>
  );
}
