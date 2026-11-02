"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
import { authErrorMessage } from "@/lib/auth-errors";
import { getGoogleAuthUrl, signInAction } from "@/lib/actions/auth";
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "@/lib/demo-accounts";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(
    searchParams.get("error"),
  );
  const [pending, setPending] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginInput) {
    setFormError(null);
    setPending(true);

    const result = await signInAction(values);

    setPending(false);

    if (result.error) {
      setFormError(result.error);
      return;
    }

    router.push(searchParams.get("next") || "/feed");
    router.refresh();
  }

  async function continueWithGoogle() {
    setFormError(null);
    const result = await getGoogleAuthUrl();

    if (result.url) {
      window.location.href = result.url;
      return;
    }

    setFormError(result.error ?? authErrorMessage("Load failed"));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div aria-live="polite" className="sr-only">
          {formError}
        </div>
        {formError ? (
          <p role="alert" className="text-sm font-medium text-destructive">
            {formError}
          </p>
        ) : null}

        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="login-email">E-mail</FieldLabel>
                <FormControl>
                  <Input
                    id="login-email"
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
                <FieldLabel htmlFor="login-password">Senha</FieldLabel>
                <FormControl>
                  <Input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
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
          {pending ? "Entrando…" : "Entrar"}
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
          Ainda não tem conta?{" "}
          <Link href="/cadastro" className="text-primary underline underline-offset-4">
            Criar perfil
          </Link>
        </p>

        <div className="rounded-md border border-border p-3">
          <p className="mb-2 text-sm font-medium">Contas da apresentação (senha {DEMO_PASSWORD})</p>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {DEMO_ACCOUNTS.map((account) => (
              <li key={account.id}>
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto w-full justify-start whitespace-normal py-2 text-left"
                  onClick={() => {
                    form.setValue("email", account.email);
                    form.setValue("password", DEMO_PASSWORD);
                    setFormError(null);
                  }}
                >
                  <span>
                    <strong>{account.name}</strong>
                    <span className="block text-xs font-normal text-neutral-600">
                      {account.email} — {account.role}
                    </span>
                  </span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </form>
    </Form>
  );
}
