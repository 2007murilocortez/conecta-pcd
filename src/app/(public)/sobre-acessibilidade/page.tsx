export default function SobreAcessibilidadePage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-primary">Sobre acessibilidade</h1>
      <p>
        O Conecta PCD trata acessibilidade como requisito de produto, não como
        extra. A interface segue WCAG 2.1 nível AA: contraste validado,
        navegação por teclado, skip-link, ajuste de fonte, alto contraste,
        redução de movimento e o widget oficial VLibras para tradução em Libras.
      </p>
      <p>
        A linguagem da plataforma usa &quot;pessoa com deficiência&quot;, em
        coerência com a Lei 13.146/2015 (LBI) e com os manuais de comunicação
        inclusiva do Senado e da Câmara.
      </p>
      <p className="mb-0">
        {/* TODO: completar com política detalhada e resultados de auditoria (Sprint 6) */}
        Esta página será expandida com o checklist completo de acessibilidade e
        os resultados de auditoria (Lighthouse e axe).
      </p>
    </article>
  );
}
