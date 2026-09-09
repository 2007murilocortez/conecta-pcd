"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { updateOwnPcdBadge } from "@/lib/actions/company";

export function OwnPcdBadgeToggle({
  companyId,
  checked,
}: {
  companyId: string;
  checked: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(checked);
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onChange(next: boolean) {
    setValue(next);
    setPending(true);
    const result = await updateOwnPcdBadge({
      company_id: companyId,
      show_pcd_badge: next,
    });
    setPending(false);
    setStatus(result.error ?? "Preferência salva.");
    if (result.error) {
      setValue(!next);
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-2">
      <Field orientation="horizontal">
        <Switch
          id="own_pcd_badge"
          checked={value}
          onCheckedChange={onChange}
          disabled={pending}
          aria-describedby="own-pcd-help"
        />
        <div>
          <FieldLabel htmlFor="own_pcd_badge">
            Mostrar minha estrela de pessoa com deficiência nesta empresa
          </FieldLabel>
          <FieldDescription id="own-pcd-help">
            Só você controla isso. Não altera o que aparece no seu perfil pessoal.
          </FieldDescription>
        </div>
      </Field>
      <div aria-live="polite" className="sr-only">
        {status}
      </div>
      {status ? <p role="status">{status}</p> : null}
    </div>
  );
}
