import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <>
      <h1 className="text-primary">Entrar</h1>
      <p>Acesse com e-mail e senha ou com o Google.</p>
      <Suspense fallback={<p>Carregando formulário…</p>}>
        <LoginForm />
      </Suspense>
    </>
  );
}
