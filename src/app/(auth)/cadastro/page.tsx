import { SignUpForm } from "@/components/auth/SignUpForm";

export default function CadastroPage() {
  return (
    <>
      <h1>Crie seu perfil profissional</h1>
      <p className="text-neutral-600">
        Uma conta só. Depois você pode criar a página de uma empresa, se
        quiser recrutar — isso não muda o tipo da sua conta. Use um e-mail
        real seu; endereços como teste@gmail.com são bloqueados.
      </p>
      <SignUpForm />
    </>
  );
}
