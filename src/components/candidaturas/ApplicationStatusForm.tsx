"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updateApplicationStatus } from "@/lib/actions/jobs";
import { APPLICATION_STATUSES } from "@/lib/constants/jobs";
import type { Database } from "@/types/database.types";

type ApplicationStatus = Database["public"]["Enums"]["application_status"];

export function ApplicationStatusForm({
  applicationId,
  currentStatus,
}: {
  applicationId: string;
  currentStatus: ApplicationStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const result = await updateApplicationStatus({
      application_id: applicationId,
      status,
    });
    setPending(false);
    setMessage(result.error ?? "Status atualizado.");
    if (!result.error) router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-2">
      <div>
        <label htmlFor={`status-${applicationId}`} className="mb-1 block text-sm font-medium">
          Status
        </label>
        <select
          id={`status-${applicationId}`}
          className="min-h-11 rounded-lg border border-input bg-transparent px-2.5"
          value={status}
          onChange={(event) => setStatus(event.target.value as ApplicationStatus)}
        >
          {APPLICATION_STATUSES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Salvando…" : "Atualizar"}
      </Button>
      <div aria-live="polite" className="sr-only">
        {message}
      </div>
      {message ? <p role="status" className="w-full text-sm">{message}</p> : null}
    </form>
  );
}
