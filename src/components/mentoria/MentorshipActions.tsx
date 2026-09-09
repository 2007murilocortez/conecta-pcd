"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { respondMentorship } from "@/lib/actions/mentorship";

export function MentorshipActions({ mentorshipId }: { mentorshipId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function respond(accept: boolean) {
    setPending(true);
    const result = await respondMentorship({
      mentorship_id: mentorshipId,
      accept,
    });
    setPending(false);
    setMessage(result.error ?? (accept ? "Mentoria aceita." : "Pedido recusado."));
    if (!result.error) router.refresh();
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={() => respond(true)} disabled={pending}>
          Aceitar
        </Button>
        <Button type="button" variant="outline" onClick={() => respond(false)} disabled={pending}>
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
