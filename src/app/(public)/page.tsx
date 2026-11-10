import Link from "next/link";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Eye,
  GraduationCap,
  Handshake,
  ShieldCheck,
  Users,
} from "lucide-react";
import { OrbitalBackdrop } from "@/components/brand/OrbitalBackdrop";
import { Button } from "@/components/ui/button";

function FeatureIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-brand-light text-primary" aria-hidden>
      {children}
    </span>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-bg">
      <section className="relative overflow-hidden border-b border-border bg-white">
        <OrbitalBackdrop />
        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:py-24">
          <div>
            <p className="mb-3 text-sm font-medium text-primary">Conexões que abrem caminhos</p>
            <h1 className="max-w-xl text-[clamp(2.4rem,4.5vw,4rem)] leading-[1.12] text-primary-dark">
              Seu talento merece oportunidades sem barreiras.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-neutral-900">
              Conheça vagas que mostram os recursos de acessibilidade, construa sua
              rede profissional e descubra empresas comprometidas com relações de
              trabalho mais inclusivas.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/cadastro">Criar meu perfil</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/login">Entrar na plataforma</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/apresentacao">Conheça todas as funcionalidades</Link>
              </Button>
            </div>
          </div>

          <article
            aria-label="Exemplo ilustrativo de card de vaga"
            className="surface-card relative p-6"
          >
            <p className="mb-3 text-sm font-medium text-primary">Exemplo ilustrativo</p>
            <p className="mb-1 text-sm text-neutral-600">Rede Viva Mais · Híbrido · São Paulo, SP</p>
            <h2 className="text-2xl">Auxiliar administrativo</h2>
            <ul className="mt-3 mb-4 flex flex-wrap gap-2" aria-label="Tipo e modalidade">
              <li className="rounded-full border border-border bg-white px-3 py-1 text-sm">CLT</li>
              <li className="rounded-full border border-border bg-white px-3 py-1 text-sm">Híbrido</li>
            </ul>
            <p className="mb-2 text-sm font-medium text-success-text">Recursos de acessibilidade</p>
            <ul className="flex flex-wrap gap-2" aria-label="Recursos de acessibilidade">
              <li className="rounded-full bg-success-surface px-3 py-1 text-sm font-medium text-success-text">
                Leitor de tela
              </li>
              <li className="rounded-full bg-success-surface px-3 py-1 text-sm font-medium text-success-text">
                Horário flexível
              </li>
            </ul>
            <p className="mt-5 mb-0 text-sm text-neutral-600">
              Na plataforma, cada vaga descreve o recurso no anúncio — não só no discurso.
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <ul className="grid gap-4 md:grid-cols-3">
          <li className="surface-card p-6">
            <FeatureIcon><Eye className="size-5" /></FeatureIcon>
            <h2 className="mt-4 text-xl">Acessibilidade antes da candidatura</h2>
            <p className="mb-0 text-neutral-600">
              Saiba quais recursos a vaga informa — Libras, leitor de tela, intérprete ou horário flexível — antes de se candidatar.
            </p>
          </li>
          <li className="surface-card p-6">
            <FeatureIcon><ShieldCheck className="size-5" /></FeatureIcon>
            <h2 className="mt-4 text-xl">Empresas com transparência</h2>
            <p className="mb-0 text-neutral-600">
              Conheça perfis, avaliações e, quando houver, o selo inclusivo validado na plataforma.
            </p>
          </li>
          <li className="surface-card p-6">
            <FeatureIcon><Users className="size-5" /></FeatureIcon>
            <h2 className="mt-4 text-xl">Conexões e aprendizado</h2>
            <p className="mb-0 text-neutral-600">
              Amplie sua rede, peça mentoria e acompanhe cursos de instituições parceiras.
            </p>
          </li>
        </ul>
      </section>

      <section id="como-funciona" className="scroll-mt-24 bg-neutral-100">
        <div className="mx-auto w-full max-w-6xl px-4 py-16">
          <h2>Como a plataforma funciona</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            <li className="surface-card p-6">
              <p className="mb-2 text-3xl font-extrabold text-primary">01</p>
              <h3>Apresente sua trajetória</h3>
              <p className="mb-0 text-neutral-600">
                Crie um perfil com experiências, formação e habilidades. Você decide quais informações pessoais quer tornar visíveis.
              </p>
            </li>
            <li className="surface-card p-6">
              <p className="mb-2 text-3xl font-extrabold text-primary">02</p>
              <h3>Explore possibilidades</h3>
              <p className="mb-0 text-neutral-600">
                Encontre vagas por modalidade, tipo de trabalho e recursos de acessibilidade anunciados.
              </p>
            </li>
            <li className="surface-card p-6">
              <p className="mb-2 text-3xl font-extrabold text-primary">03</p>
              <h3>Siga em frente</h3>
              <p className="mb-0 text-neutral-600">
                Candidate-se às oportunidades de seu interesse e acompanhe as atualizações disponíveis.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="bg-brand-light/60">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center">
          <div className="surface-card p-6">
            <p className="mb-3 text-sm font-medium text-success-text">Prévia dos filtros</p>
            <h3 className="text-lg">Recursos de acessibilidade</h3>
            <p className="text-sm text-neutral-600">
              Este é o filtro em destaque da listagem de vagas — não um detalhe escondido.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {["Leitor de tela", "Libras", "Intérprete em entrevista", "Horário flexível"].map((item) => (
                <li key={item} className="rounded-xl border border-border bg-white px-3 py-3 text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Acessibilidade vem antes do botão de candidatura.</h2>
            <p className="mt-4 text-neutral-900">
              Cada vaga pode informar recursos disponíveis, como suporte a leitor de tela, Libras e flexibilidade. Assim, você tem mais informações para avaliar uma oportunidade.
            </p>
            <Button asChild className="mt-2">
              <Link href="/login">Entrar para explorar vagas</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="para-empresas" className="scroll-mt-24 mx-auto w-full max-w-6xl px-4 py-16">
        <h2>As duas pontas do mercado</h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="surface-card p-8">
            <FeatureIcon><BriefcaseBusiness className="size-5" /></FeatureIcon>
            <h3 className="mt-4">Para profissionais</h3>
            <p className="text-neutral-600">
              Encontre oportunidades, apresente suas habilidades e construa conexões para avançar na carreira.
            </p>
            <Button asChild>
              <Link href="/cadastro">Criar meu perfil</Link>
            </Button>
          </div>
          <div className="rounded-[1.15rem] bg-primary-dark p-8 text-white">
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/10" aria-hidden>
              <Handshake className="size-5" />
            </span>
            <h3 className="mt-4 text-white">Para empresas</h3>
            <p className="text-white/90">
              Divulgue vagas com informações de acessibilidade e encontre profissionais por meio de uma experiência de recrutamento mais transparente.
            </p>
            <Button asChild variant="secondary" className="bg-white text-primary-dark hover:bg-brand-light">
              <Link href="/login">Entrar e criar página de empresa</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <h2>Conheça as empresas além da descrição da vaga.</h2>
            <p className="mt-4 text-neutral-900">
              Explore informações sobre acessibilidade, avaliações e, quando disponível, o selo inclusivo concedido após validação na plataforma. O selo não é autodeclaração nem certificação governamental.
            </p>
          </div>
          <div className="surface-card p-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-success-surface px-3 py-1 text-sm font-medium text-success-text">
              <BadgeCheck className="size-4" aria-hidden />
              Selo validado na plataforma
            </div>
            <h3>Rede Viva Mais</h3>
            <p className="text-neutral-600">
              Exemplo ilustrativo: a página da empresa mostra recursos declarados, vagas abertas e avaliações de quem já passou por lá.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <h2>Uma carreira também se constrói com conexões.</h2>
        <p className="mt-3 max-w-3xl text-neutral-600">
          Compartilhe aprendizados no feed, amplie sua rede e descubra mentoria e cursos de parceiros. A mentoria acontece por solicitação e aceite — não há chat interno. Os cursos abrem no site da instituição.
        </p>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          <li className="surface-card p-6">
            <FeatureIcon><Users className="size-5" /></FeatureIcon>
            <h3 className="mt-4">Rede</h3>
            <p className="mb-0 text-neutral-600">Pedidos de conexão, feed das pessoas aceitas e perfil profissional.</p>
          </li>
          <li className="surface-card p-6">
            <FeatureIcon><Handshake className="size-5" /></FeatureIcon>
            <h3 className="mt-4">Mentoria</h3>
            <p className="mb-0 text-neutral-600">Encontre quem está aberto a orientar e combine o contato pelo perfil após o aceite.</p>
          </li>
          <li className="surface-card p-6">
            <FeatureIcon><GraduationCap className="size-5" /></FeatureIcon>
            <h3 className="mt-4">Cursos</h3>
            <p className="mb-0 text-neutral-600">Catálogo com links oficiais (EVG, MEC, SEBRAE, SENAI e outros).</p>
          </li>
        </ul>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-16">
          <h2>Uma ideia construída a partir de necessidades reais.</h2>
          <p className="mt-4 max-w-3xl">
            Levantamento do projeto com 14 pessoas e 17 empresários: achar vaga adequada e o preconceito empataram como maiores barreiras (28,6% cada). Libras foi o recurso mais pedido (78,6%). 92,9% teriam interesse em cursos no aplicativo. Empresas citaram, em primeiro lugar, falta de informação sobre inclusão (41,2%). Essa amostra orienta o produto; não é um levantamento nacional.
          </p>
          <p className="max-w-3xl text-neutral-600">
            Dado nacional de contexto: 18,6 milhões de brasileiras e brasileiros declaram ter alguma deficiência. A taxa de ocupação desse grupo é de 26,6%, contra 60,7% das pessoas sem deficiência (IBGE/PNAD 2022).
          </p>
          <Link href="/sobre-acessibilidade" className="inline-flex min-h-11 items-center text-primary underline underline-offset-4">
            Sobre o site, a LBI e a Lei de Cotas
          </Link>
        </div>
      </section>

      <section className="bg-primary-dark">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h2 className="text-white">Novas oportunidades começam com uma conexão.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/90">
            Crie seu perfil gratuito e faça parte de uma rede profissional que valoriza acessibilidade e informação.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild className="bg-white text-primary-dark hover:bg-brand-light">
              <Link href="/cadastro">Criar perfil gratuito</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10">
              <Link href="/login">Entrar</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
