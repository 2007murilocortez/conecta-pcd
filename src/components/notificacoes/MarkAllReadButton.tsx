"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { markAllNotificationsRead } from "@/lib/actions/notifications";

export function MarkAllReadButton() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function markAll() {
    setPending(true);
    const result = await markAllNotificationsRead();
    setPending(false);
    setMessage(result.error ?? "Todas as notificações foram marcadas como lidas.");
    if (!result.error) router.refresh();
  }

  return (
    <div className="space-y-2">
      <Button type="button" variant="outline" onClick={markAll} disabled={pending}>
        {pending ? "Marcando…" : "Marcar todas como lidas"}
      </Button>
      <div aria-live="polite" className="sr-only">
        {message}
      </div>
      {message ? <p role="status">{message}</p> : null}
    </div>
  );
}
