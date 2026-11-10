import Link from "next/link";
import { redirect } from "next/navigation";
import { AddMemberForm } from "@/components/empresas/AddMemberForm";
import { OwnPcdBadgeToggle } from "@/components/empresas/OwnPcdBadgeToggle";
import { RemoveMemberButton } from "@/components/empresas/RemoveMemberButton";
import { PageHeading, PageShell, StatusBadge } from "@/components/shared";
import { getCompanyTeamPage } from "@/lib/actions/company";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const ROLE_LABEL = {
  dono: "Dono",
  recrutador: "Recrutador",
} as const;

export default async function EmpresaEquipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: company } = await supabase
    .from("companies")
    .select("id, name")
    .eq("id", id)
    .maybeSingle();

  if (!company) {
    redirect("/empresas");
  }

  const result = await getCompanyTeamPage(id);

  if (result.error === "forbidden" || result.error === "Você precisa entrar para gerenciar a equipe.") {
    redirect(`/empresas/${id}?aviso=equipe`);
  }

  if (result.error || !result.data) {
    redirect(`/empresas/${id}?aviso=equipe`);
  }

  const { members, ownerCount, userId } = result.data;

  return (
    <PageShell width="narrow" className="space-y-8">
      <p>
        <Link href={`/empresas/${id}`} className="text-primary underline underline-offset-4">
          Voltar para {company.name}
        </Link>
      </p>
      <PageHeading
        eyebrow="Gestão"
        title={`Equipe de ${company.name}`}
        description="Adicione recrutadores pelo e-mail da conta deles. Cada pessoa controla a própria estrela de pessoa com deficiência."
      />

      <section className="surface-card p-6">
        <h2>Membros atuais</h2>
        <ul className="mt-4 space-y-3">
          {members.map((member) => {
            const isLastOwner = member.member_role === "dono" && ownerCount <= 1;
            const isSelf = member.profile_id === userId;

            return (
              <li key={member.id} className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-border bg-white p-4">
                <div>
                  <p className="mb-1 font-medium">{member.full_name}</p>
                  <StatusBadge tone={member.member_role === "dono" ? "info" : "neutral"}>
                    {ROLE_LABEL[member.member_role]}
                  </StatusBadge>
                  {isLastOwner ? (
                    <p className="mt-2 mb-0 text-sm text-neutral-600">
                      Único dono — não pode ser removido enquanto não houver outro.
                    </p>
                  ) : null}
                </div>
                {isLastOwner ? null : (
                  <RemoveMemberButton
                    companyId={id}
                    memberId={member.id}
                    memberName={member.full_name}
                  />
                )}
                {isSelf ? (
                  <div className="w-full">
                    <OwnPcdBadgeToggle
                      companyId={id}
                      checked={member.show_pcd_badge}
                    />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="surface-card p-6">
        <h2>Adicionar recrutador</h2>
        <AddMemberForm companyId={id} />
      </section>
    </PageShell>
  );
}
