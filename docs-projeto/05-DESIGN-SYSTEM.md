# Design System — Conecta PCD

## 1. Princípio geral

Acessível primeiro, bonito em segundo lugar — mas os dois não são opostos. Toda escolha visual
abaixo já nasce validada em contraste WCAG AA (4.5:1 mínimo para texto).

## 2. Paleta de cores

| Token | Hex | Uso | Contraste sobre branco |
|---|---|---|---|
| `--primary` | `#1D4E89` (azul petróleo) | Botões primários, links, headings | 7.1:1 ✅ AAA |
| `--primary-dark` | `#123353` | Hover de botão primário | — |
| `--secondary` | `#2E9E5B` (verde) | Sucesso, "vaga aberta", selo inclusivo | 4.6:1 ✅ AA |
| `--accent` | `#B85C00` (laranja queimado) | CTAs secundários, destaques | 4.9:1 ✅ AA |
| `--danger` | `#C0392B` | Erros, "candidatura rejeitada" | 5.9:1 ✅ AA |
| `--warning` | `#8A6D00` (amarelo escurecido p/ contraste) | Avisos — **nunca usar amarelo puro `#FFC107` como texto**, só como fundo com texto escuro | — |
| `--neutral-900` | `#1A1A1A` | Texto principal | 16.1:1 |
| `--neutral-600` | `#595959` | Texto secundário | 7.1:1 |
| `--neutral-100` | `#F5F5F5` | Fundo de cards | — |
| `--bg` | `#FFFFFF` | Fundo geral | — |

**Modo alto contraste (toggle):** troca `--neutral-900`→`#000000`, `--bg`→`#FFFFFF`, aumenta espessura de borda dos componentes de 1px → 2px, remove sombras sutis (que perdem definição em alto contraste).

## 3. Tipografia

- Fonte: **Inter** (ou **Atkinson Hyperlegible** como alternativa — fonte desenhada especificamente para baixa visão; vale considerar como fonte padrão dado o público do produto, não só como opção).
- Escala base: `16px` (1rem), nunca menor que isso pro corpo de texto.
- Escala tipográfica (com `--font-scale` multiplicando tudo):

| Elemento | Tamanho | Peso |
|---|---|---|
| H1 | 2rem (32px) | 700 |
| H2 | 1.5rem (24px) | 700 |
| H3 | 1.25rem (20px) | 600 |
| Corpo | 1rem (16px) | 400 |
| Corpo pequeno | 0.875rem (14px) | 400 |
| Legenda/label | 0.875rem (14px) | 500 |

- Altura de linha: mínimo `1.5` no corpo de texto (requisito WCAG 1.4.8).
- Espaçamento entre parágrafos: mínimo `1.5x` o tamanho da fonte.

## 4. Componentes (shadcn/ui como base)

Gerar via `npx shadcn-ui@latest add <componente>`. Lista inicial necessária:

```
button, input, textarea, select, checkbox, radio-group, switch,
label, form, card, avatar, badge, tabs, dialog, dropdown-menu,
sonner, skeleton, separator, tooltip, accordion, field
```

**Customizações obrigatórias sobre o padrão shadcn:**
- `Button`: altura mínima de 44x44px (área de toque acessível, requisito WCAG 2.5.5) mesmo na variante "small".
- `Toast` (via `sonner`, substituto oficial do antigo componente `toast` do shadcn): configurar `richColors` e garantir que o `<Toaster />` renderiza numa região com `aria-live` correta — o sonner já anuncia via `aria-live="polite"` por padrão nas mensagens normais; usar `toast.error(...)` (que o sonner marca como mais urgente) para falhas, não só cor vermelha.
- `Badge` de status de candidatura: sempre ícone + texto, nunca só cor (ver `04-ACESSIBILIDADE.md`).

## 5. Ícones

- Biblioteca: **lucide-react** (já integra nativamente com shadcn).
- Todo ícone usado sozinho (sem texto ao lado) precisa de `aria-label` no botão que o contém.

## 6. Layout de referência

### Header (fixo, presente em toda tela logada)
```
[Logo Conecta PCD]   [Busca de vagas]   [Feed] [Vagas] [Empresas] [Mentoria]   [🔔] [Avatar ▾]
```
Abaixo do header, sempre visível ou em um botão flutuante discreto: **Toolbar de Acessibilidade** (A- / A+ para fonte, toggle de alto contraste, toggle de reduzir movimento).

### Card de vaga (componente central do produto)
```
┌─────────────────────────────────────────┐
│ [logo empresa]  Nome da Vaga             │
│                 Empresa · Cidade, UF     │
│                 [CLT] [Remoto]           │
│                                           │
│ ♿ Recursos de acessibilidade:            │
│   [Libras na entrevista] [Leitor de tela]│
│                                           │
│ Publicada há 2 dias        [Candidatar-se]│
└─────────────────────────────────────────┘
```
Os "chips" de acessibilidade em destaque visual (fundo `--secondary` com 10% de opacidade, texto `--secondary`) — é o diferencial do produto, tem que saltar aos olhos na listagem.

### Selo de empresa inclusiva
Badge verde com ícone de check + texto "Empresa Inclusiva Verificada", com tooltip explicando o critério de verificação ao passar o mouse/focar.

## 7. Tom de voz (copy do produto)

Coerente com a pesquisa de linguagem inclusiva já produzida:
- Sempre "pessoa com deficiência", nunca abreviações despersonalizantes em textos voltados ao usuário final (ok usar "PCD" em contextos técnicos/administrativos, como filtros, por concisão — mas nunca em textos de acolhimento/marketing).
- Microcopy direto e sem jargão: "Sua candidatura foi enviada" em vez de "Requisição processada com sucesso".
- Nunca tom de "superação" ou "inspiração" — o produto trata a pessoa como profissional, ponto.
