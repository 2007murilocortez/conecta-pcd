"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createCompany } from "@/lib/actions/company";
import { ACCESSIBILITY_RESOURCES, COMPANY_SIZES } from "@/lib/constants/jobs";
import {
  createCompanySchema,
  type CreateCompanyInput,
} from "@/lib/validations/company";

export function CompanyForm() {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const form = useForm<CreateCompanyInput>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
      sector: "",
      size: "",
      accessibility_features: [],
      show_pcd_badge: false,
    },
  });

  async function onSubmit(values: CreateCompanyInput) {
    setPending(true);
    const result = await createCompany(values);
    setPending(false);

    if (result.error && !result.data) {
      setStatus(result.error);
      return;
    }

    if (result.data) {
      router.push(`/vagas/nova?empresa=${result.data.id}`);
      router.refresh();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div aria-live="polite" className="sr-only">
          {status}
        </div>
        {status ? (
          <p role="alert" className="text-sm font-medium text-destructive">
            {status}
          </p>
        ) : null}

        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="company_name">Nome da empresa</FieldLabel>
                <FormControl>
                  <Input id="company_name" className="min-h-11" autoComplete="organization" {...field} />
                </FormControl>
                <FormMessage />
              </Field>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <Field>
                <FieldLabel htmlFor="company_description">Descrição</FieldLabel>
                <FormControl>
                  <Textarea
                    id="company_description"
                    className="min-h-24"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
              </Field>
            </FormItem>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <Field>
                  <FieldLabel htmlFor="company_website">Site</FieldLabel>
                  <FormControl>
                    <Input
                      id="company_website"
                      className="min-h-11"
                      inputMode="url"
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
            name="sector"
            render={({ field }) => (
              <FormItem>
                <Field>
                  <FieldLabel htmlFor="company_sector">Setor</FieldLabel>
                  <FormControl>
                    <Input
                      id="company_sector"
                      className="min-h-11"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                </Field>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <Field>
                <FieldLabel htmlFor="company_size">Tamanho</FieldLabel>
                <FormControl>
                  <select
                    id="company_size"
                    className="min-h-11 w-full rounded-lg border border-input bg-transparent px-2.5"
                    {...field}
                    value={field.value ?? ""}
                  >
                    <option value="">Selecione</option>
                    {COMPANY_SIZES.map((size) => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
              </Field>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accessibility_features"
          render={({ field }) => (
            <FormItem>
              <fieldset>
                <legend className="mb-2 font-medium">
                  Recursos de acessibilidade que a empresa oferece
                </legend>
                <div className="grid gap-2">
                  {ACCESSIBILITY_RESOURCES.map((option) => (
                    <label key={option.value} className="flex min-h-11 items-center gap-2">
                      <Checkbox
                        checked={field.value.includes(option.value)}
                        onCheckedChange={(checked) => {
                          const next = checked
                            ? [...field.value, option.value]
                            : field.value.filter((value) => value !== option.value);
                          field.onChange(next);
                        }}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </fieldset>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="show_pcd_badge"
          render={({ field }) => (
            <FormItem>
              <Field orientation="horizontal">
                <FormControl>
                  <Switch
                    id="show_pcd_badge"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-describedby="pcd-badge-help"
                  />
                </FormControl>
                <div>
                  <FieldLabel htmlFor="show_pcd_badge">
                    Mostrar que eu sou recrutador com deficiência
                  </FieldLabel>
                  <FieldDescription id="pcd-badge-help">
                    Aparece só na página da empresa, e só se você quiser. Não
                    altera o que está visível no seu perfil pessoal.
                  </FieldDescription>
                </div>
              </Field>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={pending}>
          {pending ? "Criando…" : "Criar empresa e publicar vaga"}
        </Button>
      </form>
    </Form>
  );
}
