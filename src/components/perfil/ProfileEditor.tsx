"use client";

import { useMemo, useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  addEducation,
  addExperience,
  addSkillToProfile,
  removeEducation,
  removeExperience,
  removeSkillFromProfile,
  updateProfile,
  uploadAvatar,
  uploadResume,
} from "@/lib/actions/profile";
import { cropImageToSquare } from "@/lib/avatar-crop";
import {
  ACCESSIBILITY_NEEDS,
  BRAZILIAN_STATES,
  DISABILITY_TYPES,
  EDUCATION_LEVELS,
} from "@/lib/constants/profile";
import {
  educationSchema,
  experienceSchema,
  skillNameSchema,
  updateProfileSchema,
  type EducationInput,
  type ExperienceInput,
  type SkillNameInput,
  type UpdateProfileInput,
} from "@/lib/validations/profile";
import type { Tables } from "@/types/database.types";

type ProfileEditorProps = {
  isOnboarding: boolean;
  profile: Tables<"profiles">;
  educations: Tables<"educations">[];
  experiences: Tables<"experiences">[];
  skills: { id: string; name: string }[];
  skillCatalog: { id: string; name: string }[];
};

function profileFormDefaults(profile: Tables<"profiles">): UpdateProfileInput {
  return {
    full_name: profile.full_name,
    headline: profile.headline ?? "",
    bio: profile.bio ?? "",
    phone: profile.phone ?? "",
    location_city: profile.location_city ?? "",
    location_state: profile.location_state ?? "",
    discloses_disability: profile.discloses_disability,
    disability_types: profile.disability_types ?? [],
    accessibility_needs: profile.accessibility_needs ?? [],
    accessibility_needs_other: profile.accessibility_needs_other ?? "",
    disability_types_other: profile.disability_types_other ?? "",
    open_to_mentor: profile.open_to_mentor,
  };
}

export function ProfileEditor({
  isOnboarding,
  profile,
  educations,
  experiences,
  skills,
  skillCatalog,
}: ProfileEditorProps) {
  return (
    <div className="space-y-12">
      {isOnboarding ? (
        <p role="status" className="rounded-md border border-border bg-neutral-100 p-4">
          Complete os dados básicos abaixo — pelo menos nome e título
          profissional — para começar a usar o restante da plataforma.
        </p>
      ) : null}

      <BasicsSection profile={profile} />
      <EducationSection items={educations} />
      <ExperienceSection items={experiences} />
      <SkillsSection items={skills} catalog={skillCatalog} />
      <AccessibilitySection profile={profile} />
      <ResumeSection hasResume={Boolean(profile.resume_url)} />
    </div>
  );
}

function BasicsSection({ profile }: { profile: Tables<"profiles"> }) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: profileFormDefaults(profile),
  });

  async function onSubmit(values: UpdateProfileInput) {
    setPending(true);
    const result = await updateProfile(values);
    setPending(false);
    setStatus(result.error ?? "Dados básicos salvos.");
    if (!result.error) {
      router.refresh();
    }
  }

  async function onAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const cropped = await cropImageToSquare(file);
    const formData = new FormData();
    formData.append("file", cropped);
    const result = await uploadAvatar(formData);
    setStatus(result.error ?? "Avatar atualizado.");
    if (result.data?.url) {
      setAvatarUrl(result.data.url);
    }
  }

  return (
    <section aria-labelledby="dados-basicos">
      <h2 id="dados-basicos">Dados básicos</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div aria-live="polite" className="sr-only">
            {status}
          </div>
          {status ? (
            <p role="status" className="text-sm">
              {status}
            </p>
          ) : null}

          <div className="flex items-center gap-4">
            <Avatar className="size-16" size="lg">
              {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
              <AvatarFallback>
                {profile.full_name.slice(0, 1).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <Field>
              <FieldLabel htmlFor="avatar">Foto de perfil</FieldLabel>
              <Input
                id="avatar"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="min-h-11"
                onChange={onAvatarChange}
              />
              <FieldDescription>
                A imagem é recortada no centro, em quadrado.
              </FieldDescription>
            </Field>
          </div>

          <FormField
            control={form.control}
            name="full_name"
            render={({ field, fieldState }) => (
              <FormItem>
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor="full_name">Nome completo</FieldLabel>
                  <FormControl>
                    <Input id="full_name" className="min-h-11" autoComplete="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </Field>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="headline"
            render={({ field, fieldState }) => (
              <FormItem>
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor="headline">Título profissional</FieldLabel>
                  <FormControl>
                    <Input
                      id="headline"
                      className="min-h-11"
                      placeholder="Pessoa desenvolvedora front-end"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </Field>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <Field>
                  <FieldLabel htmlFor="bio">Sobre você</FieldLabel>
                  <FormControl>
                    <Textarea id="bio" className="min-h-24" {...field} value={field.value ?? ""} />
                  </FormControl>
                </Field>
              </FormItem>
            )}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="location_city"
              render={({ field }) => (
                <FormItem>
                  <Field>
                    <FieldLabel htmlFor="location_city">Cidade</FieldLabel>
                    <FormControl>
                      <Input id="location_city" className="min-h-11" {...field} value={field.value ?? ""} />
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
                    <FieldLabel htmlFor="location_state">Estado</FieldLabel>
                    <FormControl>
                      <select
                        id="location_state"
                        className="min-h-11 w-full rounded-lg border border-input bg-transparent px-2.5"
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

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <Field>
                  <FieldLabel htmlFor="phone">Telefone</FieldLabel>
                  <FormControl>
                    <Input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      className="min-h-11"
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
            name="open_to_mentor"
            render={({ field }) => (
              <FormItem>
                <Field orientation="horizontal">
                  <FormControl>
                    <Switch
                      id="open_to_mentor"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-describedby="mentor-help"
                    />
                  </FormControl>
                  <div>
                    <FieldLabel htmlFor="open_to_mentor">
                      Disponível para mentoria
                    </FieldLabel>
                    <FieldDescription id="mentor-help">
                      Outras pessoas poderão te encontrar em Mentoria e enviar um pedido.
                    </FieldDescription>
                  </div>
                </Field>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={pending}>
            {pending ? "Salvando…" : "Salvar dados básicos"}
          </Button>
        </form>
      </Form>
    </section>
  );
}

function EducationSection({ items }: { items: Tables<"educations">[] }) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const form = useForm<EducationInput>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: "",
      course: "",
      level: "",
      start_date: "",
      end_date: "",
      is_current: false,
    },
  });
  const isCurrent = form.watch("is_current");

  async function onSubmit(values: EducationInput) {
    const result = await addEducation(values);
    setStatus(result.error ?? "Formação adicionada.");
    if (!result.error) {
      form.reset();
      router.refresh();
    }
  }

  return (
    <section aria-labelledby="formacao">
      <h2 id="formacao">Formação</h2>
      <ul className="mb-6 space-y-3">
        {items.length === 0 ? (
          <li className="text-neutral-600">Nenhuma formação adicionada ainda.</li>
        ) : (
          items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3 border border-border p-3">
              <div>
                <p className="mb-0 font-medium">{item.course}</p>
                <p className="mb-0 text-sm text-neutral-600">
                  {item.institution}
                  {item.level ? ` · ${item.level}` : ""}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  const result = await removeEducation({ id: item.id });
                  setStatus(result.error ?? "Formação removida.");
                  if (!result.error) router.refresh();
                }}
              >
                Remover
              </Button>
            </li>
          ))
        )}
      </ul>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div aria-live="polite" className="sr-only">
            {status}
          </div>
          {status ? <p role="status">{status}</p> : null}
          <FormField
            control={form.control}
            name="institution"
            render={({ field }) => (
              <FormItem>
                <Field>
                  <FieldLabel htmlFor="institution">Instituição</FieldLabel>
                  <FormControl>
                    <Input id="institution" className="min-h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </Field>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="course"
            render={({ field }) => (
              <FormItem>
                <Field>
                  <FieldLabel htmlFor="course">Curso</FieldLabel>
                  <FormControl>
                    <Input id="course" className="min-h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </Field>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <Field>
                  <FieldLabel htmlFor="level">Nível</FieldLabel>
                  <FormControl>
                    <select
                      id="level"
                      className="min-h-11 w-full rounded-lg border border-input bg-transparent px-2.5"
                      {...field}
                      value={field.value ?? ""}
                    >
                      <option value="">Selecione</option>
                      {EDUCATION_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                </Field>
              </FormItem>
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <Field>
                    <FieldLabel htmlFor="edu-start">Início</FieldLabel>
                    <FormControl>
                      <Input id="edu-start" type="date" className="min-h-11" {...field} value={field.value ?? ""} />
                    </FormControl>
                  </Field>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <Field>
                    <FieldLabel htmlFor="edu-end">Término</FieldLabel>
                    <FormControl>
                      <Input
                        id="edu-end"
                        type="date"
                        className="min-h-11"
                        disabled={isCurrent}
                        {...field}
                        value={field.value ?? ""}
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
            name="is_current"
            render={({ field }) => (
              <FormItem>
                <Field orientation="horizontal">
                  <FormControl>
                    <Checkbox
                      id="edu-current"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                    />
                  </FormControl>
                  <FieldLabel htmlFor="edu-current">Cursando atualmente</FieldLabel>
                </Field>
              </FormItem>
            )}
          />
          <Button type="submit">Adicionar formação</Button>
        </form>
      </Form>
    </section>
  );
}

function ExperienceSection({ items }: { items: Tables<"experiences">[] }) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const form = useForm<ExperienceInput>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company_name: "",
      role_title: "",
      description: "",
      start_date: "",
      end_date: "",
      is_current: false,
    },
  });
  const isCurrent = form.watch("is_current");

  async function onSubmit(values: ExperienceInput) {
    const result = await addExperience(values);
    setStatus(result.error ?? "Experiência adicionada.");
    if (!result.error) {
      form.reset();
      router.refresh();
    }
  }

  return (
    <section aria-labelledby="experiencias">
      <h2 id="experiencias">Experiências</h2>
      <ul className="mb-6 space-y-3">
        {items.length === 0 ? (
          <li className="text-neutral-600">Nenhuma experiência adicionada ainda.</li>
        ) : (
          items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3 border border-border p-3">
              <div>
                <p className="mb-0 font-medium">{item.role_title}</p>
                <p className="mb-0 text-sm text-neutral-600">{item.company_name}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  const result = await removeExperience({ id: item.id });
                  setStatus(result.error ?? "Experiência removida.");
                  if (!result.error) router.refresh();
                }}
              >
                Remover
              </Button>
            </li>
          ))
        )}
      </ul>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div aria-live="polite" className="sr-only">
            {status}
          </div>
          {status ? <p role="status">{status}</p> : null}
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <Field>
                  <FieldLabel htmlFor="company_name">Empresa</FieldLabel>
                  <FormControl>
                    <Input id="company_name" className="min-h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </Field>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role_title"
            render={({ field }) => (
              <FormItem>
                <Field>
                  <FieldLabel htmlFor="role_title">Cargo</FieldLabel>
                  <FormControl>
                    <Input id="role_title" className="min-h-11" {...field} />
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
                  <FieldLabel htmlFor="exp-description">Descrição</FieldLabel>
                  <FormControl>
                    <Textarea id="exp-description" {...field} value={field.value ?? ""} />
                  </FormControl>
                </Field>
              </FormItem>
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <Field>
                    <FieldLabel htmlFor="exp-start">Início</FieldLabel>
                    <FormControl>
                      <Input id="exp-start" type="date" className="min-h-11" {...field} value={field.value ?? ""} />
                    </FormControl>
                  </Field>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <Field>
                    <FieldLabel htmlFor="exp-end">Término</FieldLabel>
                    <FormControl>
                      <Input
                        id="exp-end"
                        type="date"
                        className="min-h-11"
                        disabled={isCurrent}
                        {...field}
                        value={field.value ?? ""}
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
            name="is_current"
            render={({ field }) => (
              <FormItem>
                <Field orientation="horizontal">
                  <FormControl>
                    <Checkbox
                      id="exp-current"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                    />
                  </FormControl>
                  <FieldLabel htmlFor="exp-current">Trabalho atual</FieldLabel>
                </Field>
              </FormItem>
            )}
          />
          <Button type="submit">Adicionar experiência</Button>
        </form>
      </Form>
    </section>
  );
}

function SkillsSection({
  items,
  catalog,
}: {
  items: { id: string; name: string }[];
  catalog: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const form = useForm<SkillNameInput>({
    resolver: zodResolver(skillNameSchema),
    defaultValues: { name: "" },
  });

  const suggestions = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return catalog.slice(0, 8);
    return catalog
      .filter((skill) => skill.name.toLowerCase().includes(term))
      .slice(0, 8);
  }, [catalog, query]);

  async function onSubmit(values: SkillNameInput) {
    const result = await addSkillToProfile(values);
    setStatus(result.error ?? "Habilidade adicionada.");
    if (!result.error) {
      form.reset();
      setQuery("");
      router.refresh();
    }
  }

  return (
    <section aria-labelledby="habilidades">
      <h2 id="habilidades">Habilidades</h2>
      <ul className="mb-4 flex flex-wrap gap-2">
        {items.length === 0 ? (
          <li className="text-neutral-600">Nenhuma habilidade ainda.</li>
        ) : (
          items.map((skill) => (
            <li key={skill.id}>
              <Button
                type="button"
                variant="secondary"
                onClick={async () => {
                  const result = await removeSkillFromProfile({ id: skill.id });
                  setStatus(result.error ?? `${skill.name} removida.`);
                  if (!result.error) router.refresh();
                }}
              >
                {skill.name} (remover)
              </Button>
            </li>
          ))
        )}
      </ul>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3" noValidate>
          <div aria-live="polite" className="sr-only">
            {status}
          </div>
          {status ? <p role="status">{status}</p> : null}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Field>
                  <FieldLabel htmlFor="skill-name">Adicionar habilidade</FieldLabel>
                  <FormControl>
                    <Input
                      id="skill-name"
                      className="min-h-11"
                      list="skill-catalog"
                      {...field}
                      onChange={(event) => {
                        field.onChange(event);
                        setQuery(event.target.value);
                      }}
                    />
                  </FormControl>
                  <datalist id="skill-catalog">
                    {suggestions.map((skill) => (
                      <option key={skill.id} value={skill.name} />
                    ))}
                  </datalist>
                  <FormMessage />
                </Field>
              </FormItem>
            )}
          />
          <Button type="submit">Adicionar</Button>
        </form>
      </Form>
    </section>
  );
}

function AccessibilitySection({ profile }: { profile: Tables<"profiles"> }) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: profileFormDefaults(profile),
  });
  const discloses = form.watch("discloses_disability");
  const disabilityTypes = form.watch("disability_types");
  const accessibilityNeeds = form.watch("accessibility_needs");

  async function onSubmit(values: UpdateProfileInput) {
    const result = await updateProfile(values);
    setStatus(result.error ?? "Preferências de acessibilidade salvas.");
    if (!result.error) router.refresh();
  }

  return (
    <section aria-labelledby="acessibilidade">
      <h2 id="acessibilidade">Acessibilidade</h2>
      <p>
        Essas informações são opcionais. Usamos só para filtrar vagas e
        adaptar o contato com empresas. O tipo de deficiência só aparece no
        perfil público se você ligar o interruptor abaixo. Veja também a{" "}
        <a href="/sobre-acessibilidade" className="text-primary underline underline-offset-4">
          página sobre acessibilidade
        </a>
        .
      </p>

      {!profile.headline?.trim() ? (
        <p role="status" className="text-neutral-600">
          Salve os dados básicos (nome e título profissional) antes desta seção.
        </p>
      ) : null}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div aria-live="polite" className="sr-only">
            {status}
          </div>
          {status ? <p role="status">{status}</p> : null}

          <FormField
            control={form.control}
            name="discloses_disability"
            render={({ field }) => (
              <FormItem>
                <Field orientation="horizontal">
                  <FormControl>
                    <Switch
                      id="discloses_disability"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-describedby="discloses-help"
                    />
                  </FormControl>
                  <div>
                    <FieldLabel htmlFor="discloses_disability">
                      Mostrar tipo de deficiência no meu perfil público
                    </FieldLabel>
                    <FieldDescription id="discloses-help">
                      Desligado por padrão. Você decide se e quando revelar.
                    </FieldDescription>
                  </div>
                </Field>
              </FormItem>
            )}
          />

          {discloses ? (
            <>
              <FormField
                control={form.control}
                name="disability_types"
                render={({ field }) => (
                  <FormItem>
                    <fieldset>
                      <legend className="mb-2 font-medium">Tipo de deficiência</legend>
                      <div className="grid gap-2">
                        {DISABILITY_TYPES.map((option) => (
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
              {disabilityTypes.includes("outra") ? (
                <FormField
                  control={form.control}
                  name="disability_types_other"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <Field data-invalid={fieldState.invalid || undefined}>
                        <FieldLabel htmlFor="disability_types_other">
                          Descreva brevemente
                        </FieldLabel>
                        <FormControl>
                          <Textarea
                            id="disability_types_other"
                            className="min-h-20"
                            required
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </Field>
                    </FormItem>
                  )}
                />
              ) : null}
            </>
          ) : null}

          <FormField
            control={form.control}
            name="accessibility_needs"
            render={({ field }) => (
              <FormItem>
                <fieldset>
                  <legend className="mb-2 font-medium">Recursos de acessibilidade que você precisa</legend>
                  <div className="grid gap-2">
                    {ACCESSIBILITY_NEEDS.map((option) => (
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

          {accessibilityNeeds.includes("outro") ? (
            <FormField
              control={form.control}
              name="accessibility_needs_other"
              render={({ field, fieldState }) => (
                <FormItem>
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="accessibility_needs_other">
                      Descreva brevemente
                    </FieldLabel>
                    <FormControl>
                      <Textarea
                        id="accessibility_needs_other"
                        className="min-h-20"
                        required
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </Field>
                </FormItem>
              )}
            />
          ) : null}

          <Button type="submit">Salvar acessibilidade</Button>
        </form>
      </Form>
    </section>
  );
}

function ResumeSection({ hasResume }: { hasResume: boolean }) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);

  async function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadResume(formData);
    setStatus(result.error ?? "Currículo enviado.");
    if (!result.error) router.refresh();
  }

  return (
    <section aria-labelledby="curriculo">
      <h2 id="curriculo">Currículo</h2>
      <div aria-live="polite" className="sr-only">
        {status}
      </div>
      {status ? <p role="status">{status}</p> : null}
      <p>
        {hasResume
          ? "Há um PDF salvo. Enviar outro arquivo substitui o anterior."
          : "Nenhum PDF enviado ainda."}
      </p>
      <Field>
        <FieldLabel htmlFor="resume">Enviar currículo em PDF</FieldLabel>
        <Input
          id="resume"
          type="file"
          accept="application/pdf"
          className="min-h-11"
          onChange={onChange}
        />
      </Field>
    </section>
  );
}
