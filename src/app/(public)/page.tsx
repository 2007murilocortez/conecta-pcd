import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="bg-bg">
      <section className="border-b border-border bg-bg">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center lg:py-24">
          <div>
            <h1 className="max-w-xl text-primary">
              Vagas que dizem, de verdade, como o processo seletivo é acessível.
            </h1>
            <p className="mt-4 max-w-xl text-neutral-900">
              18,6 milhões de brasileiras e brasileiros declaram ter alguma
              deficiência. A taxa de ocupação desse grupo é de 29,9%, contra
              60,7% das pessoas sem deficiência. Plataformas genéricas não
              filtram por acessibilidade e não mostram se a empresa inclui de
              fato, ou só no papel.
            </p>
            <p className="max-w-xl text-neutral-900">
              O Conecta PCD é uma rede profissional gratuita para pessoas com
              deficiência: perfil, vagas filtráveis pelos recursos oferecidos,
              avaliações de quem já trabalhou na empresa, mentoria e comunidade.
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/cadastro">Criar perfil</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/vagas">Ver vagas</Link>
              </Button>
            </div>
          </div>

          <article
            aria-label="Exemplo de card de vaga"
            className="border border-border bg-neutral-100 p-5"
          >
            <p className="mb-1 text-caption text-neutral-600">
              Exemplo de vaga na plataforma
            </p>
            <h2 className="text-h3 text-neutral-900">
              Pessoa desenvolvedora front-end
            </h2>
            <p className="mb-3 text-neutral-600">
              Empresa exemplo · Recife, PE
            </p>
            <ul className="mb-4 flex flex-wrap gap-2" aria-label="Tipo e modalidade">
              <li className="border border-border bg-bg px-2 py-1 text-body-sm">
                CLT
              </li>
              <li className="border border-border bg-bg px-2 py-1 text-body-sm">
                Remoto
              </li>
            </ul>
            <p className="mb-2 text-caption text-neutral-900">
              Recursos de acessibilidade
            </p>
            <ul className="flex flex-wrap gap-2" aria-label="Recursos de acessibilidade">
              <li className="bg-[color-mix(in_srgb,var(--secondary)_10%,white)] px-2 py-1 text-body-sm font-medium text-secondary">
                Libras na entrevista
              </li>
              <li className="bg-[color-mix(in_srgb,var(--secondary)_10%,white)] px-2 py-1 text-body-sm font-medium text-secondary">
                Leitor de tela
              </li>
            </ul>
          </article>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <h2 className="max-w-2xl text-primary">As duas pontas do mercado</h2>
        <div className="mt-8 grid gap-12 lg:grid-cols-2">
          <div>
            <h3>Para a pessoa com deficiência</h3>
            <p className="text-neutral-900">
              Perfil profissional completo, busca de vagas pelo tipo de
              acessibilidade oferecida, rede com outros profissionais, mentoria,
              cursos e avaliações de quem já passou por cada empresa.
            </p>
          </div>
          <div className="border-l-4 border-primary pl-6">
            <h3>Para a empresa</h3>
            <p className="text-neutral-900">
              Canal direto com profissionais qualificados, publicação de vaga
              com acessibilidade no desenho do processo, e um selo de empresa
              inclusiva que precisa ser conquistado — não autodeclarado.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-neutral-100">
        <div className="mx-auto w-full max-w-6xl px-4 py-16">
          <h2 className="text-primary">O que a Lei de Cotas não resolve sozinha</h2>
          <p className="mt-4 max-w-3xl text-neutral-900">
            Empresas com 100 ou mais funcionários precisam reservar vagas para
            pessoas com deficiência (Lei 8.213/91). Ainda assim, falta encontro:
            de um lado, poucas candidaturas; do outro, pouca confiança de que o
            processo será adaptado. O Conecta PCD existe para tornar essa
            informação visível e útil nas duas pontas, em linha com a Lei
            Brasileira de Inclusão (Lei 13.146/2015).
          </p>
          <Button asChild className="mt-2">
            <Link href="/cadastro">Começar agora</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
