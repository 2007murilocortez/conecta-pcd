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
import { Input } from "@/components/ui/input";
import { addCompanyMember } from "@/lib/actions/company";
import {
  addCompanyMemberSchema,
  type AddCompanyMemberInput,
} from "@/lib/validations/company";

export function AddMemberForm({ companyId }: { companyId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const form = useForm<AddCompanyMemberInput>({
    resolver: zodResolver(addCompanyMemberSchema),
    defaultValues: {
      company_id: companyId,
      email: "",
    },
  });

  async function onSubmit(values: AddCompanyMemberInput) {
    setPending(true);
    const result = await addCompanyMember(values);
    setPending(false);
    setStatus(result.error ?? "Pessoa adicionada à equipe.");
    if (!result.error) {
      form.reset({ company_id: companyId, email: "" });
      router.refresh();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div aria-live="polite" className="sr-only">
          {status}
        </div>
        {status ? (
          <p role={status.includes("Não") || status.includes("já") ? "alert" : "status"}>
            {status}
          </p>
        ) : null}

        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="member_email">E-mail de quem já tem conta</FieldLabel>
                <FormControl>
                  <Input
                    id="member_email"
                    type="email"
                    autoComplete="email"
                    className="min-h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </Field>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={pending}>
          {pending ? "Adicionando…" : "Adicionar recrutador"}
        </Button>
      </form>
    </Form>
  );
}
