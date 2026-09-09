"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { applyToJob } from "@/lib/actions/jobs";
import { applyToJobSchema, type ApplyToJobInput } from "@/lib/validations/jobs";

export function ApplyForm({
  jobId,
  disabled,
  disabledReason,
}: {
  jobId: string;
  disabled?: boolean;
  disabledReason?: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(disabledReason ?? null);
  const [pending, setPending] = useState(false);

  const form = useForm<ApplyToJobInput>({
    resolver: zodResolver(applyToJobSchema),
    defaultValues: {
      job_id: jobId,
      cover_letter: "",
    },
  });

  async function onSubmit(values: ApplyToJobInput) {
    setPending(true);
    const result = await applyToJob(values);
    setPending(false);

    if (result.error) {
      setStatus(result.error);
      return;
    }

    setStatus("Candidatura enviada.");
    router.refresh();
  }

  if (disabled) {
    return (
      <p role="status" className="rounded-md border border-border bg-neutral-100 p-4">
        {disabledReason ?? "Esta vaga não aceita novas candidaturas."}
      </p>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div aria-live="polite" className="sr-only">
          {status}
        </div>
        {status ? <p role="status">{status}</p> : null}

        <FormField
          control={form.control}
          name="cover_letter"
          render={({ field }) => (
            <FormItem>
              <Field>
                <FieldLabel htmlFor="cover_letter">Carta de apresentação (opcional)</FieldLabel>
                <FormControl>
                  <Textarea
                    id="cover_letter"
                    className="min-h-28"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </Field>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={pending}>
          {pending ? "Enviando…" : "Candidatar-se"}
        </Button>
      </form>
    </Form>
  );
}
