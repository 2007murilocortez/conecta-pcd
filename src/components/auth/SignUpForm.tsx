"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { signUpSchema, type SignUpInput } from "@/lib/validations/auth";

export function SignUpForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignUpInput) {
    setFormError(null);
    setInfo(null);
    setPending(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: values.fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setPending(false);

    if (error) {
      setFormError(error.message);
      return;
    }

    if (!data.session) {
      setInfo(
        "Conta criada. Verifique seu e-mail para confirmar o cadastro e depois entre na plataforma.",
      );
      return;
    }

    router.push("/perfil/editar");
    router.refresh();
  }

  async function continueWithGoogle() {
    setFormError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setFormError(error.message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div aria-live="polite" className="sr-only">
          {formError ?? info}
        </div>
        {formError ? (
          <p role="alert" className="text-sm font-medium text-destructive">
            {formError}
          </p>
        ) : null}
        {info ? (
          <p role="status" className="text-sm text-secondary">
            {info}
          </p>
        ) : null}

        <FormField
          control={form.control}
          name="fullName"
          render={({ field, fieldState }) => (
            <FormItem>
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="fullName">Nome completo</FieldLabel>
                <FormControl>
                  <Input
                    id="fullName"
                    autoComplete="name"
                    className="min-h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <FieldError errors={[fieldState.error]} />
              </Field>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <FormControl>
                  <Input
                    id="email"
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

        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    className="min-h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </Field>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Criando conta…" : "Criar perfil"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={continueWithGoogle}
        >
          Continuar com Google
        </Button>

        <p className="mb-0 text-sm text-neutral-600">
          Já tem conta?{" "}
          <Link href="/login" className="text-primary underline underline-offset-4">
            Entrar
          </Link>
        </p>
      </form>
    </Form>
  );
}
