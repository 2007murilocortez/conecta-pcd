import Link from "next/link";
import { redirect } from "next/navigation";
import { AddMemberForm } from "@/components/empresas/AddMemberForm";
import { OwnPcdBadgeToggle } from "@/components/empresas/OwnPcdBadgeToggle";
import { RemoveMemberButton } from "@/components/empresas/RemoveMemberButton";
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
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-12">
      <div>
        <p>
          <Link href={`/empresas/${id}`} className="text-primary underline underline-offset-4">
            Voltar para {company.name}
          </Link>
        </p>
        <h1 className="text-primary">Equipe de {company.name}</h1>
        <p>
          Adicione recrutadores pelo e-mail da conta deles. Cada pessoa controla a
          própria estrela de pessoa com deficiência.
        </p>
      </div>

      <section>
        <h2>Membros atuais</h2>
        <ul className="mt-4 space-y-3">
          {members.map((member) => {
            const isLastOwner = member.member_role === "dono" && ownerCount <= 1;
            const isSelf = member.profile_id === userId;

            return (
              <li key={member.id} className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border p-4">
                <div>
                  <p className="font-medium">{member.full_name}</p>
                  <p className="text-sm text-neutral-600">{ROLE_LABEL[member.member_role]}</p>
                  {isLastOwner ? (
                    <p className="mt-1 text-sm text-neutral-600">
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

      <section>
        <h2>Adicionar recrutador</h2>
        <AddMemberForm companyId={id} />
      </section>
    </div>
  );
}
