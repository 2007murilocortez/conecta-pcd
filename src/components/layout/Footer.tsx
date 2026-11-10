import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-white">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <BrandLogo variant="slogan" />
          <p className="mt-4 mb-0 max-w-md text-neutral-600">
            Rede profissional para pessoas com deficiência e empresas que
            publicam vagas com acessibilidade visível.
          </p>
        </div>

        <nav aria-label="Rodapé">
          <p className="mb-3 text-sm font-medium text-primary-dark">Navegação</p>
          <ul className="flex flex-col gap-1">
            <li>
              <Link href="/apresentacao" className="inline-flex min-h-11 items-center text-primary underline-offset-4 hover:underline">
                O que dá para fazer no site
              </Link>
            </li>
            <li>
              <Link href="/sobre-acessibilidade" className="inline-flex min-h-11 items-center text-primary underline-offset-4 hover:underline">
                Sobre acessibilidade
              </Link>
            </li>
            <li>
              <Link href="/login" className="inline-flex min-h-11 items-center text-primary underline-offset-4 hover:underline">
                Entrar
              </Link>
            </li>
            <li>
              <Link href="/cadastro" className="inline-flex min-h-11 items-center text-primary underline-offset-4 hover:underline">
                Criar perfil
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-border bg-[#F7FAFE]">
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
          , ferramenta oficial do governo brasileiro. O produto se apoia na{" "}
          <a
            href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm"
            className="text-primary underline underline-offset-4"
            rel="noopener noreferrer"
            target="_blank"
          >
            Lei 13.146/2015
          </a>{" "}
          (LBI) e na{" "}
          <a
            href="https://www.planalto.gov.br/ccivil_03/leis/l8213cons.htm"
            className="text-primary underline underline-offset-4"
            rel="noopener noreferrer"
            target="_blank"
          >
            Lei 8.213/1991
          </a>{" "}
          (Cotas).
        </p>
      </div>
    </footer>
  );
}
