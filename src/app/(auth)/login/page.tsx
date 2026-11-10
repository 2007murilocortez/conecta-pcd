import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <>
      <h1>Entrar</h1>
      <p className="text-neutral-600">Acesse com o e-mail e a senha da sua conta.</p>
      <Suspense fallback={<p>Carregando formulário…</p>}>
        <LoginForm />
      </Suspense>
    </>
  );
}
