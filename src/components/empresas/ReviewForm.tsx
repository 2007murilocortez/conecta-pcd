"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { saveCompanyReview } from "@/lib/actions/company";
import {
  companyReviewSchema,
  type CompanyReviewInput,
} from "@/lib/validations/company";

const SCORES = [1, 2, 3, 4, 5] as const;

export function ReviewForm({
  companyId,
  existing,
}: {
  companyId: string;
  existing?: {
    id: string;
    rating: number;
    accessibility_rating: number;
    comment: string | null;
    is_anonymous: boolean;
  } | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const form = useForm<CompanyReviewInput>({
    resolver: zodResolver(companyReviewSchema),
    defaultValues: {
      id: existing?.id,
      company_id: companyId,
      rating: existing?.rating ?? 5,
      accessibility_rating: existing?.accessibility_rating ?? 5,
      comment: existing?.comment ?? "",
      is_anonymous: existing?.is_anonymous ?? true,
    },
  });

  async function onSubmit(values: CompanyReviewInput) {
    setPending(true);
    const result = await saveCompanyReview(values);
    setPending(false);
    setStatus(result.error ?? (existing ? "Avaliação atualizada." : "Avaliação publicada."));
    if (!result.error) router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div aria-live="polite" className="sr-only">
          {status}
        </div>
        {status ? (
          <p role={status.includes("já avaliou") ? "alert" : "status"}>{status}</p>
        ) : null}

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <fieldset>
                <legend className="mb-2 font-medium">Nota geral</legend>
                <div className="flex flex-wrap gap-3">
                  {SCORES.map((score) => (
                    <label key={score} className="flex min-h-11 items-center gap-2">
                      <input
                        type="radio"
                        name={field.name}
                        value={score}
                        checked={field.value === score}
                        onChange={() => field.onChange(score)}
                      />
                      {score}
                    </label>
                  ))}
                </div>
                <FormMessage />
              </fieldset>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accessibility_rating"
          render={({ field }) => (
            <FormItem>
              <fieldset>
                <legend className="mb-2 font-medium">Nota de acessibilidade</legend>
                <div className="flex flex-wrap gap-3">
                  {SCORES.map((score) => (
                    <label key={score} className="flex min-h-11 items-center gap-2">
                      <input
                        type="radio"
                        name={field.name}
                        value={score}
                        checked={field.value === score}
                        onChange={() => field.onChange(score)}
                      />
                      {score}
                    </label>
                  ))}
                </div>
                <FormMessage />
              </fieldset>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <Field>
                <FieldLabel htmlFor="review_comment">Comentário (opcional)</FieldLabel>
                <FormControl>
                  <Textarea
                    id="review_comment"
                    className="min-h-24"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
              </Field>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_anonymous"
          render={({ field }) => (
            <FormItem>
              <Field orientation="horizontal">
                <FormControl>
                  <Switch
                    id="is_anonymous"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-describedby="anonymous-help"
                  />
                </FormControl>
                <div>
                  <FieldLabel htmlFor="is_anonymous">Publicar como anônima</FieldLabel>
                  <FieldDescription id="anonymous-help">
                    Ligado, aparece só como “Profissional PCD (anônimo)”.
                  </FieldDescription>
                </div>
              </Field>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={pending}>
          {pending ? "Salvando…" : existing ? "Atualizar avaliação" : "Publicar avaliação"}
        </Button>
      </form>
    </Form>
  );
}
