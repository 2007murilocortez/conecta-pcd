import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/shared";

export default function NotFound() {
  return (
    <PageShell width="narrow">
      <div className="surface-card px-6 py-12 text-center">
        <p className="mb-2 text-sm font-medium text-primary">404</p>
        <h1>Página não encontrada</h1>
        <p className="mx-auto max-w-md text-neutral-600">
          O endereço pode ter mudado ou a página não existe. Volte para o início ou entre na plataforma.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/">Ir para o início</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">Entrar</Link>
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
