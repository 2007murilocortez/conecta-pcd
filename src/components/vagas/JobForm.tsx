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
import { createJob, updateJob } from "@/lib/actions/jobs";
import {
  ACCESSIBILITY_RESOURCES,
  JOB_TYPES,
  WORK_MODES,
} from "@/lib/constants/jobs";
import { BRAZILIAN_STATES } from "@/lib/constants/profile";
import { jobSchema, type JobInput } from "@/lib/validations/jobs";

type JobFormProps = {
  companies: { id: string; name: string }[];
  defaultCompanyId?: string;
  jobId?: string;
  defaultValues?: Partial<JobInput>;
};

export function JobForm({
  companies,
  defaultCompanyId,
  jobId,
  defaultValues,
}: JobFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const form = useForm<JobInput>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      company_id: defaultValues?.company_id ?? defaultCompanyId ?? companies[0]?.id ?? "",
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      requirements: defaultValues?.requirements ?? "",
      type: defaultValues?.type ?? "CLT",
      work_mode: defaultValues?.work_mode ?? "presencial",
      location_city: defaultValues?.location_city ?? "",
      location_state: defaultValues?.location_state ?? "",
      salary_min: defaultValues?.salary_min,
      salary_max: defaultValues?.salary_max,
      salary_visible: defaultValues?.salary_visible ?? false,
      accessibility_resources: defaultValues?.accessibility_resources ?? [],
    },
  });

  async function onSubmit(values: JobInput) {
    setPending(true);
    const result = jobId ? await updateJob(jobId, values) : await createJob(values);
    setPending(false);

    if (result.error) {
      setStatus(result.error);
      return;
    }

    const nextId = jobId ?? result.data?.id;
    if (nextId) {
      router.push(`/vagas/${nextId}`);
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

        {companies.length > 1 ? (
          <FormField
            control={form.control}
            name="company_id"
            render={({ field, fieldState }) => (
              <FormItem>
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor="job_company">Empresa</FieldLabel>
                  <FormControl>
                    <select
                      id="job_company"
                      className="form-select"
                      {...field}
                    >
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </Field>
              </FormItem>
            )}
          />
        ) : (
          <input type="hidden" {...form.register("company_id")} />
        )}

        <h2 className="text-lg">Detalhes</h2>
        <FormField
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <FormItem>
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="job_title">Título da vaga</FieldLabel>
                <FormControl>
                  <Input
                    id="job_title"
                    className="min-h-11"
                    placeholder="Ex.: Auxiliar administrativo, operador de caixa, recepcionista"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </Field>
            </FormItem>
          )}
        />

        <h2 className="text-lg">Descrição e requisitos</h2>
        <FormField
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <FormItem>
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="job_description">Descrição</FieldLabel>
                <FormControl>
                  <Textarea
                    id="job_description"
                    className="min-h-32"
                    placeholder="Descreva o dia a dia e o recurso de acessibilidade (leitor de tela, Libras, horário flexível, rampa)."
                    {...field}
                  />
                </FormControl>
                <FieldDescription>
                  Escreva o recurso de acessibilidade no anúncio. Selo genérico não basta.
                </FieldDescription>
                <FormMessage />
              </Field>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <Field>
                <FieldLabel htmlFor="job_requirements">Requisitos</FieldLabel>
                <FormControl>
                  <Textarea
                    id="job_requirements"
                    className="min-h-24"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
              </Field>
            </FormItem>
          )}
        />

        <h2 className="text-lg">Regime e local</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field, fieldState }) => (
              <FormItem>
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor="job_type">Tipo</FieldLabel>
                  <FormControl>
                    <select
                      id="job_type"
                      className="form-select"
                      {...field}
                    >
                      {JOB_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </Field>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="work_mode"
            render={({ field, fieldState }) => (
              <FormItem>
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor="job_mode">Modalidade</FieldLabel>
                  <FormControl>
                    <select
                      id="job_mode"
                      className="form-select"
                      {...field}
                    >
                      {WORK_MODES.map((mode) => (
                        <option key={mode.value} value={mode.value}>
                          {mode.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </Field>
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="location_city"
            render={({ field }) => (
              <FormItem>
                <Field>
                  <FieldLabel htmlFor="job_city">Cidade</FieldLabel>
                  <FormControl>
                    <Input id="job_city" className="min-h-11" {...field} value={field.value ?? ""} />
                  </FormControl>
                </Field>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location_state"
            render={({ field }) => (
              <FormItem>
                <Field>
                  <FieldLabel htmlFor="job_state">Estado</FieldLabel>
                  <FormControl>
                    <select
                      id="job_state"
                      className="form-select"
                      {...field}
                      value={field.value ?? ""}
                    >
                      <option value="">Selecione</option>
                      {BRAZILIAN_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                </Field>
              </FormItem>
            )}
          />
        </div>

        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-primary-dark">Remuneração</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="salary_min"
              render={({ field }) => (
                <FormItem>
                  <Field>
                    <FieldLabel htmlFor="salary_min">Mínimo</FieldLabel>
                    <FormControl>
                      <Input
                        id="salary_min"
                        type="number"
                        min={0}
                        step="100"
                        className="min-h-11"
                        value={field.value ?? ""}
                        onChange={(event) =>
                          field.onChange(
                            event.target.value === "" ? undefined : Number(event.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </Field>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salary_max"
              render={({ field }) => (
                <FormItem>
                  <Field>
                    <FieldLabel htmlFor="salary_max">Máximo</FieldLabel>
                    <FormControl>
                      <Input
                        id="salary_max"
                        type="number"
                        min={0}
                        step="100"
                        className="min-h-11"
                        value={field.value ?? ""}
                        onChange={(event) =>
                          field.onChange(
                            event.target.value === "" ? undefined : Number(event.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </Field>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="salary_visible"
            render={({ field }) => (
              <FormItem>
                <Field orientation="horizontal">
                  <FormControl>
                    <Switch
                      id="salary_visible"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-describedby="salary-visible-help"
                    />
                  </FormControl>
                  <div>
                    <FieldLabel htmlFor="salary_visible">Mostrar salário na vaga</FieldLabel>
                    <FieldDescription id="salary-visible-help">
                      Desligado, o valor fica só com a equipe da empresa.
                    </FieldDescription>
                  </div>
                </Field>
              </FormItem>
            )}
          />
        </fieldset>

        <FormField
          control={form.control}
          name="accessibility_resources"
          render={({ field }) => (
            <FormItem>
              <fieldset className="rounded-2xl border border-success-text/25 bg-success-surface p-4">
                <legend className="px-1 font-medium text-success-text">
                  Recursos de acessibilidade oferecidos
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

        <Button type="submit" disabled={pending}>
          {pending ? "Salvando…" : jobId ? "Salvar vaga" : "Publicar vaga"}
        </Button>
      </form>
    </Form>
  );
}
