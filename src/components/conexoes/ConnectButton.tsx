"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { requestConnection, respondConnection } from "@/lib/actions/connections";

export function ConnectButton({
  profileId,
  connectionId,
  status,
  incoming,
}: {
  profileId: string;
  connectionId?: string;
  status?: "pendente" | "aceita" | "recusada" | null;
  incoming?: boolean;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function connect() {
    setPending(true);
    const result = await requestConnection({ addressee_id: profileId });
    setPending(false);
    setMessage(result.error ?? "Pedido enviado.");
    if (!result.error) router.refresh();
  }

  async function respond(next: "aceita" | "recusada") {
    if (!connectionId) return;
    setPending(true);
    const result = await respondConnection({
      connection_id: connectionId,
      status: next,
    });
    setPending(false);
    setMessage(result.error ?? (next === "aceita" ? "Conexão aceita." : "Pedido recusado."));
    if (!result.error) router.refresh();
  }

  if (status === "aceita") {
    return <p>Vocês já estão conectados.</p>;
  }

  if (status === "pendente" && incoming && connectionId) {
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
        <StatusText message={message} />
      </div>
    );
  }

  if (status === "pendente") {
    return <p>Pedido de conexão enviado.</p>;
  }

  return (
    <div className="space-y-2">
      <Button type="button" onClick={connect} disabled={pending}>
        {pending ? "Enviando…" : "Conectar"}
      </Button>
      <StatusText message={message} />
    </div>
  );
}

function StatusText({ message }: { message: string | null }) {
  return (
    <>
      <div aria-live="polite" className="sr-only">
        {message}
      </div>
      {message ? <p role="status">{message}</p> : null}
    </>
  );
}
