import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <>
      <h1 className="text-primary">Entrar</h1>
      <p>Acesse com o e-mail e a senha da sua conta.</p>
      <Suspense fallback={<p>Carregando formulário…</p>}>
        <LoginForm />
      </Suspense>
    </>
  );
}
