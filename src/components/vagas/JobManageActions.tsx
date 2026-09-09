"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { closeJob } from "@/lib/actions/jobs";

export function JobManageActions({
  jobId,
  isOpen,
}: {
  jobId: string;
  isOpen: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onClose() {
    setPending(true);
    const result = await closeJob({ id: jobId });
    setPending(false);
    setStatus(result.error ?? "Vaga encerrada.");
    if (!result.error) router.refresh();
  }

  return (
    <div className="space-y-3 rounded-md border border-border p-4">
      <p className="font-medium">Gestão da vaga</p>
      <div aria-live="polite" className="sr-only">
        {status}
      </div>
      {status ? <p role="status">{status}</p> : null}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" asChild>
          <Link href={`/vagas/${jobId}/editar`}>Editar vaga</Link>
        </Button>
        {isOpen ? (
          <Button variant="destructive" type="button" onClick={onClose} disabled={pending}>
            {pending ? "Encerrando…" : "Encerrar vaga"}
          </Button>
        ) : (
          <p>Esta vaga já está encerrada.</p>
        )}
      </div>
    </div>
  );
}
