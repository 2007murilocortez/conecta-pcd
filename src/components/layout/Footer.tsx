import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-neutral-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="mb-2 font-bold text-primary">Conecta PCD</p>
          <p className="mb-0 max-w-md text-neutral-600">
            Rede profissional para pessoas com deficiência e empresas que
            publicam vagas acessíveis.
          </p>
        </div>

        <nav aria-label="Rodapé">
          <ul className="flex flex-col gap-2">
            <li>
              <Link
                href="/sobre-acessibilidade"
                className="inline-flex min-h-11 items-center text-primary underline-offset-4 hover:underline"
              >
                Sobre acessibilidade
              </Link>
            </li>
            <li>
              <Link
                href="/vagas"
                className="inline-flex min-h-11 items-center text-primary underline-offset-4 hover:underline"
              >
                Vagas
              </Link>
            </li>
            <li>
              <Link
                href="/empresas"
                className="inline-flex min-h-11 items-center text-primary underline-offset-4 hover:underline"
              >
                Empresas
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-border">
        <p className="mx-auto mb-0 max-w-6xl px-4 py-4 text-body-sm text-neutral-600">
          A tradução em Libras desta página é feita pelo widget público{" "}
          <a
            href="https://www.gov.br/governodigital/pt-br/acessibilidade-e-usuario/vlibras"
            className="text-primary underline underline-offset-4"
            rel="noopener noreferrer"
            target="_blank"
          >
            VLibras
          </a>
          , ferramenta oficial do governo brasileiro.
        </p>
      </div>
    </footer>
  );
}
