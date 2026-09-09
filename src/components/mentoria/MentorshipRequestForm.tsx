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
import { requestMentorship } from "@/lib/actions/mentorship";
import {
  requestMentorshipSchema,
  type RequestMentorshipInput,
} from "@/lib/validations/network";

export function MentorshipRequestForm({ mentorId }: { mentorId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const form = useForm<RequestMentorshipInput>({
    resolver: zodResolver(requestMentorshipSchema),
    defaultValues: {
      mentor_id: mentorId,
      message: "",
    },
  });

  async function onSubmit(values: RequestMentorshipInput) {
    setPending(true);
    const result = await requestMentorship(values);
    setPending(false);
    setStatus(result.error ?? "Pedido de mentoria enviado.");
    if (!result.error) {
      form.reset({ mentor_id: mentorId, message: "" });
      router.refresh();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3" noValidate>
        <div aria-live="polite" className="sr-only">
          {status}
        </div>
        {status ? <p role="status">{status}</p> : null}

        <FormField
          control={form.control}
          name="message"
          render={({ field, fieldState }) => (
            <FormItem>
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor={`mentor-msg-${mentorId}`}>Mensagem inicial</FieldLabel>
                <FormControl>
                  <Textarea id={`mentor-msg-${mentorId}`} className="min-h-20" {...field} />
                </FormControl>
                <FormMessage />
              </Field>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={pending}>
          {pending ? "Enviando…" : "Solicitar mentoria"}
        </Button>
      </form>
    </Form>
  );
}
