# Acessibilidade — Conecta PCD

Este é o documento mais importante do projeto em termos de nota e de coerência com a pesquisa
já entregue (`Pesquisa_Inclusao_PCD_Mercado_Trabalho.docx`). Uma plataforma pra PCDs que não é
acessível de verdade é uma contradição que qualquer avaliador vai notar na hora.

## 1. Padrão mínimo

- **WCAG 2.1, nível AA** como baseline obrigatório em toda tela.
- Meta de auditoria: **Lighthouse Accessibility ≥ 90** e **0 erros críticos no axe DevTools** em cada página antes de considerar "pronta".

## 2. Checklist técnico (aplicar em toda tela nova)

### Estrutura e semântica
- [ ] `<html lang="pt-BR">` no layout raiz.
- [ ] Hierarquia de headings correta (`h1` único por página, sem pular níveis).
- [ ] Landmarks semânticos: `<header>`, `<nav>`, `<main>`, `<footer>`.
- [ ] "Skip to content" link no topo de toda página logada, visível ao focar via Tab.

### Navegação por teclado
- [ ] Toda ação clicável é alcançável via Tab e ativável via Enter/Espaço.
- [ ] Ordem de tabulação segue a ordem visual lógica (nunca usar `tabindex` positivo).
- [ ] Foco visível (`focus-visible`) em todo elemento interativo — **nunca remover o outline sem substituir por um estilo de foco equivalente**.
- [ ] Modais e dropdowns fazem "focus trap" (Radix UI, base do shadcn, já resolve isso — não reinventar).

### Leitor de tela
- [ ] Toda `<img>` com `alt` descritivo (ou `alt=""` se decorativa).
- [ ] Ícones sem texto (botão de "favoritar", "notificação") têm `aria-label`.
- [ ] Erros de formulário anunciados via `aria-live="polite"` ou `role="alert"`.
- [ ] Estados dinâmicos (ex: "candidatura enviada com sucesso") anunciados via região `aria-live`, não só toast visual.
- [ ] Testar com pelo menos um leitor de tela real antes da entrega (NVDA no Windows é gratuito; VoiceOver no Mac já vem instalado).

### Contraste e cor
- [ ] Contraste mínimo 4.5:1 para texto normal, 3:1 para texto grande — ver paleta já calculada em `05-DESIGN-SYSTEM.md`.
- [ ] Informação nunca é passada só por cor (ex: status de candidatura usa cor **+ ícone + texto**, não só uma bolinha colorida).
- [ ] Modo alto contraste disponível via toggle (persistido em `accessibility_settings.high_contrast`).

### Tipografia e zoom
- [ ] Layout não quebra com zoom de até 200% do navegador.
- [ ] Ajuste de fonte próprio da plataforma (`accessibility_settings.font_scale`, de 100% a 150%) — usar `rem` em toda a tipografia, nunca `px` fixo, para essa escala funcionar via CSS variable.

### Libras
- [ ] Widget **VLibras** (oficial, gov.br) embutido no layout raiz — script público, não precisa construir nada do zero.
- [ ] Documentar no rodapé que a tradução é feita por essa ferramenta pública.

### Movimento
- [ ] Toggle "reduzir animações" (`accessibility_settings.reduce_motion`) respeita `prefers-reduced-motion` como fallback automático mesmo sem o usuário mexer no toggle.

### Formulários
- [ ] Todo `<input>` tem `<label>` associado (nunca só `placeholder` como label).
- [ ] Mensagens de erro específicas e em texto (não só borda vermelha): "E-mail inválido", não "Campo inválido".

## 3. Linguagem e conteúdo (ligado à pesquisa jurídica já feita)

- [ ] Toda a interface usa **"pessoa com deficiência"**, nunca "portador de deficiência" ou variações capacitistas (base: Manual de Comunicação do Senado, cartilha da Câmara).
- [ ] Nenhum texto usa "superação" ou tom de "inspiração" ao se referir a PCDs no marketing/copy do site.
- [ ] Textos institucionais (política de privacidade, seção "sobre") citam explicitamente a Lei 13.146/2015 e a Lei 8.213/91 como base legal do produto — reforça a seriedade do projeto pra banca.

## 4. Onde isso vira código, na prática

- **`font_scale`** e **`high_contrast`**: variáveis CSS no `:root`, setadas via `useEffect` no client a partir do valor salvo em `accessibility_settings` (buscado uma vez no load do dashboard).
  ```css
  :root {
    --font-scale: 1;
  }
  html {
    font-size: calc(16px * var(--font-scale));
  }
  ```
- **Toolbar de acessibilidade**: componente fixo (`components/layout/AccessibilityToolbar.tsx`), sempre visível, com os 3 toggles (fonte, contraste, movimento) — não esconder atrás de menu profundo.
- **VLibras**: script oficial adicionado no `layout.tsx`:
  ```html
  <div vw class="enabled">
    <div vw-access-button class="active"></div>
    <div vw-plugin-wrapper>
      <div class="vw-plugin-top-wrapper"></div>
    </div>
  </div>
  <script src="https://vlibras.gov.br/app/vlibras-plugin.js"></script>
  <script>new window.VLibras.Widget('https://vlibras.gov.br/app');</script>
  ```

## 5. Testes de aceitação antes da entrega final (dezembro)

1. Navegar o fluxo completo de cadastro → busca de vaga → candidatura **usando só o teclado**.
2. Rodar Lighthouse em: landing page, listagem de vagas, perfil, feed.
3. Rodar axe DevTools em todas as telas do dashboard.
4. Testar com NVDA (ou VoiceOver) o fluxo de candidatura a uma vaga.
5. Testar zoom do navegador em 200% em pelo menos 3 telas-chave.

Esse checklist, cumprido e documentado com print/vídeo, é material forte pra apresentação final — mostra que a acessibilidade não foi só discurso.
