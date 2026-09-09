"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { respondConnection } from "@/lib/actions/connections";

export function ConnectionActions({ connectionId }: { connectionId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function respond(status: "aceita" | "recusada") {
    setPending(true);
    const result = await respondConnection({
      connection_id: connectionId,
      status,
    });
    setPending(false);
    setMessage(result.error ?? (status === "aceita" ? "Conexão aceita." : "Pedido recusado."));
    if (!result.error) router.refresh();
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={() => respond("aceita")} disabled={pending}>
          Aceitar
        </Button>
        <Button type="button" variant="outline" onClick={() => respond("recusada")} disabled={pending}>
          Recusar
        </Button>
      </div>
      <div aria-live="polite" className="sr-only">
        {message}
      </div>
      {message ? <p role="status">{message}</p> : null}
    </div>
  );
}
