import { redirect } from "next/navigation";
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
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-primary">
        {isOnboarding ? "Complete seu perfil" : "Editar perfil"}
      </h1>
      <p>
        {isOnboarding
          ? "Toda conta começa igual. Preencha seus dados profissionais para liberar o restante da plataforma."
          : "Atualize seu currículo vivo. O tipo de deficiência só aparece publicamente se você escolher mostrar."}
      </p>
      <ProfileEditor
        isOnboarding={isOnboarding}
        profile={profile}
        educations={educations}
        experiences={experiences}
        skills={skills}
        skillCatalog={skillCatalog}
      />
    </div>
  );
}
