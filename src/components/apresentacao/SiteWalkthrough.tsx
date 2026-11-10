"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/button";

const SLIDES = [
  {
    title: "Conecta PCD, em 2 minutos",
    body: "É uma rede profissional para pessoa com deficiência — e para empresa que quer publicar vaga acessível de verdade. Site grátis: conecta-pcd.vercel.app",
  },
  {
    title: "1. Entra com a conta da demo",
    body: "Na apresentação ninguém cria conta. Entra em /login com ana.souza@conectapcd.dev e senha Conecta2026. Uma conta só: depois, se for da empresa, cria a página por dentro.",
    href: "/login",
    hrefLabel: "Entrar com a Ana",
  },
  {
    title: "2. Monta o perfil",
    body: "Nome, headline, formação, experiência e habilidades. Você escolhe se o tipo de deficiência aparece no perfil público. Dá para mandar avatar e currículo.",
    href: "/perfil/editar",
    hrefLabel: "Editar perfil",
  },
  {
    title: "3. Busca vaga (o coração do site)",
    body: "Em Vagas o filtro que importa é acessibilidade: Libras, leitor de tela, intérprete, horário flexível. As vagas da demo são cargos reais do mercado PcD: administrativo, atendimento, caixa, recepção, estoque e digitação.",
    href: "/vagas",
    hrefLabel: "Ver vagas",
  },
  {
    title: "4. Acompanha a candidatura",
    body: "Em Candidaturas você vê se foi enviada, está em análise, entrevista, aprovada ou rejeitada. Quando o status muda, chega aviso no sino — e e-mail nos casos importantes.",
    href: "/candidaturas",
    hrefLabel: "Minhas candidaturas",
  },
  {
    title: "5. Olha a empresa de verdade",
    body: "Cada empresa tem página com acessibilidade, vagas abertas e avaliações de quem já passou por lá (pode ser anônimo). Selo inclusivo só o admin concede — não é autodeclaração.",
    href: "/empresas",
    hrefLabel: "Ver empresas",
  },
  {
    title: "6. Se você for da empresa",
    body: "Cria a página, chama recrutador por e-mail, publica vaga e muda o status de quem se candidatou. Sem seletor de “ver como empresa”: quem é da equipe já vê isso no menu da conta.",
    href: "/empresas/nova",
    hrefLabel: "Criar página de empresa",
  },
  {
    title: "7. Conecta e usa o feed",
    body: "No perfil de outra pessoa, manda Conectar. Em Conexões você aceita ou recusa. O Feed mostra posts de quem já aceitou — texto e foto, em ordem cronológica.",
    href: "/conexoes",
    hrefLabel: "Abrir conexões",
  },
  {
    title: "8. Pede mentoria",
    body: "No perfil, marque “disponível para mentoria”. Em Mentoria você vê quem está aberto, manda uma mensagem e espera o aceite. Não tem chat: o aceite libera o perfil da outra pessoa.",
    href: "/mentoria",
    hrefLabel: "Ver mentoria",
  },
  {
    title: "9. Faz um curso",
    body: "Cursos são links oficiais (governo, SEBRAE, SENAI, FGV…). Você se inscreve aqui só para marcar em andamento ou concluído. O concluído aparece na capacitação do perfil.",
    href: "/cursos",
    hrefLabel: "Ver cursos",
  },
  {
    title: "10. Acessibilidade não é extra",
    body: "Canto inferior esquerdo: aumenta a fonte, alto contraste, menos animação e o botão de ouvir o texto (uma voz lê o que está escrito). Em toda página tem VLibras (Libras). Dá para usar só com teclado — Tab, Enter, e nesta apresentação as setas.",
    href: "/sobre-acessibilidade",
    hrefLabel: "Como o site é acessível",
  },
  {
    title: "Agora é só entrar e clicar",
    body: "Login da Ana: ana.souza@conectapcd.dev / Conecta2026. Para trocar de conta, use Sair no topo e entre como Carla (carla.mendes@conectapcd.dev). Qualquer dúvida, chama o Murilo.",
    href: "/login",
    hrefLabel: "Abrir o login",
  },
] as const;

export function SiteWalkthrough() {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const last = index === SLIDES.length - 1;

  const go = useCallback((next: number) => {
    setIndex(Math.min(SLIDES.length - 1, Math.max(0, next)));
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        go(index + 1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(index - 1);
      }
      if (event.key === "Home") go(0);
      if (event.key === "End") go(SLIDES.length - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 lg:py-16">
      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <BrandLogo variant="slogan" />
        <p className="mb-0 rounded-full bg-brand-light px-3 py-1 text-sm font-medium text-primary-dark">
          Demonstração — o roteiro não cria dados
        </p>
      </div>
      <div className="surface-card p-6 sm:p-10">
        <p className="text-sm text-neutral-600" aria-live="polite">
          Passo {index + 1} de {SLIDES.length}
        </p>
        <h1>{slide.title}</h1>
        <p className="text-lg">{slide.body}</p>
        {"href" in slide && slide.href ? (
          <p>
            <Button asChild>
              <Link href={slide.href}>{slide.hrefLabel}</Link>
            </Button>
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => go(index - 1)}
            disabled={index === 0}
          >
            Anterior
          </Button>
          <Button type="button" onClick={() => go(index + 1)} disabled={last}>
            Próximo
          </Button>
          <p className="mb-0 text-sm text-neutral-600">Use as setas do teclado ou Espaço.</p>
        </div>
      </div>

      <ol className="mt-6 flex flex-wrap gap-2" aria-label="Sumário da apresentação">
        {SLIDES.map((item, i) => (
          <li key={item.title}>
            <button
              type="button"
              onClick={() => go(i)}
              aria-current={i === index ? "step" : undefined}
              className={
                i === index
                  ? "inline-flex min-h-11 items-center rounded-full bg-primary px-3 text-sm font-medium text-white"
                  : "inline-flex min-h-11 items-center rounded-full border border-border bg-white px-3 text-sm"
              }
            >
              {i + 1}
              <span className="sr-only">. {item.title}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
