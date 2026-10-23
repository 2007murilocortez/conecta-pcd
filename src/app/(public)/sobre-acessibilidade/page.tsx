import Link from "next/link";

export default function SobreAcessibilidadePage() {
  return (
    <article className="mx-auto w-full max-w-3xl space-y-8 px-4 py-12">
      <div>
        <h1 className="text-primary">Sobre o site e a acessibilidade</h1>
        <p>
          O Conecta PCD é uma rede profissional gratuita para pessoas com
          deficiência e para empresas que publicam vagas acessíveis. A
          acessibilidade não é um extra: é requisito de produto, alinhado à
          pesquisa do projeto de extensão e à legislação brasileira.
        </p>
      </div>

      <section>
        <h2>Base legal</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <a
              href="https://www.planalto.gov.br/ccivil_03/leis/l8213cons.htm"
              className="text-primary underline underline-offset-4"
              rel="noopener noreferrer"
              target="_blank"
            >
              Lei 8.213/1991
            </a>{" "}
            (Lei de Cotas): empresas com 100 ou mais empregados reservam vagas
            para pessoas com deficiência.
          </li>
          <li>
            <a
              href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm"
              className="text-primary underline underline-offset-4"
              rel="noopener noreferrer"
              target="_blank"
            >
              Lei 13.146/2015
            </a>{" "}
            (Lei Brasileira de Inclusão): igualdade, acessibilidade e combate ao
            capacitismo. A interface usa “pessoa com deficiência”, nunca
            “portador”.
          </li>
        </ul>
      </section>

      <section>
        <h2>O que o site faz</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Perfil profissional (formação, experiência, habilidades) e controle
            de quem vê o tipo de deficiência.
          </li>
          <li>
            Vagas com filtro de acessibilidade em destaque — Libras na
            entrevista, leitor de tela, horário flexível e outros recursos
            declarados pela empresa.
          </li>
          <li>
            Página de empresa com avaliações (inclusive anônimas) e selo de
            empresa inclusiva concedido por administrador, não autodeclarado.
          </li>
          <li>Conexões, feed, mentoria e cursos oficiais gratuitos.</li>
          <li>
            Recomendação simples: vaga que cruza com as skills do perfil e é
            remota ou do mesmo estado; cursos nas categorias que ainda faltam.
          </li>
        </ul>
        <p>
          Conta gratuita:{" "}
          <Link href="/cadastro" className="text-primary underline underline-offset-4">
            criar perfil
          </Link>
          . Já tem conta?{" "}
          <Link href="/login" className="text-primary underline underline-offset-4">
            Entrar
          </Link>
          .
        </p>
      </section>

      <section>
        <h2>Como a pesquisa virou funcionalidade</h2>
        <p>
          O levantamento (14 pessoas e 17 empresários) apontou dificuldade de
          achar vaga adequada, preconceito, e plataformas atuais pouco
          acessíveis. Libras foi o recurso mais pedido (78,6%); leitor de tela,
          voz e aumento de fonte empataram em 42,9%. Quase todos (92,9%)
          teriam interesse em cursos no aplicativo.
        </p>
        <p>
          Por isso o layout tem VLibras, skip-link, foco visível, labels em
          todo campo, <code>aria-live</code> nos formulários, toolbar de fonte /
          contraste / movimento, e a listagem de cursos. Comandos por voz não
          têm motor próprio neste MVP: o site é usável com o reconhecimento de
          voz do sistema operacional e com teclado.
        </p>
      </section>

      <section>
        <h2>Checklist técnico (WCAG 2.1 AA)</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <code>lang=&quot;pt-BR&quot;</code>, landmarks, um <code>h1</code> por
            página, skip-link no topo.
          </li>
          <li>Alvo de toque mínimo de 44px e foco visível (nunca só cor).</li>
          <li>
            Imagens com texto alternativo; ícones de sino e menu com{" "}
            <code>aria-label</code>.
          </li>
          <li>
            Contraste da paleta documentado no design system; modo alto
            contraste na toolbar.
          </li>
          <li>
            Fonte da plataforma de 100% a 150% (pedido de 42,9% da pesquisa).
          </li>
        </ul>
        <p className="mb-0">
          A auditoria com Lighthouse e axe em cada tela (meta ≥ 90, zero erro
          crítico) é a próxima etapa de QA, antes da apresentação de dezembro.
        </p>
      </section>
    </article>
  );
}
