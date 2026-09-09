"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { setCompanyInclusiveSeal } from "@/lib/actions/company";

export function GrantSealButton({
  companyId,
  isVerified,
}: {
  companyId: string;
  isVerified: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onToggle() {
    setPending(true);
    const result = await setCompanyInclusiveSeal({
      company_id: companyId,
      is_verified_inclusive: !isVerified,
    });
    setPending(false);
    setStatus(result.error ?? (isVerified ? "Selo removido." : "Selo concedido."));
    if (!result.error) router.refresh();
  }

  return (
    <div>
      <Button type="button" onClick={onToggle} disabled={pending} variant={isVerified ? "outline" : "default"}>
        {pending ? "Salvando…" : isVerified ? "Remover selo" : "Conceder selo"}
      </Button>
      <div aria-live="polite" className="sr-only">
        {status}
      </div>
      {status ? <p role="status">{status}</p> : null}
    </div>
  );
}
