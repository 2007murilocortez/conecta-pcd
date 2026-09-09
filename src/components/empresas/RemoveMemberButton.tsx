"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { removeCompanyMember } from "@/lib/actions/company";

export function RemoveMemberButton({
  companyId,
  memberId,
  memberName,
}: {
  companyId: string;
  memberId: string;
  memberName: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onRemove() {
    setPending(true);
    const result = await removeCompanyMember({
      company_id: companyId,
      member_id: memberId,
    });
    setPending(false);
    setStatus(result.error ?? `${memberName} foi removida da equipe.`);
    if (!result.error) router.refresh();
  }

  return (
    <div>
      <Button type="button" variant="destructive" onClick={onRemove} disabled={pending}>
        {pending ? "Removendo…" : "Remover"}
      </Button>
      <div aria-live="polite" className="sr-only">
        {status}
      </div>
      {status ? <p role="status" className="mt-2 text-sm">{status}</p> : null}
    </div>
  );
}
