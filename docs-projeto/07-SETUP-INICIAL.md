# Setup Inicial — Conecta PCD

Passo a passo pra sair do zero e ter algo rodando em produção (Vercel) ainda hoje.

## 1. Criar o projeto

```bash
npx create-next-app@latest conecta-pcd --typescript --tailwind --app --src-dir --import-alias "@/*"
cd conecta-pcd
```

Responda: ESLint = sim. Turbopack = sim (mais rápido).

## 2. Instalar dependências principais

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install zod react-hook-form @hookform/resolvers
npm install resend
npm install lucide-react
npm install class-variance-authority clsx tailwind-merge
```

## 3. Configurar shadcn/ui

```bash
npx shadcn-ui@latest init
```
- Style: Default
- Base color: Slate (vamos sobrescrever com os tokens de `05-DESIGN-SYSTEM.md` depois)
- CSS variables: **sim**

Depois adicione os componentes iniciais:
```bash
npx shadcn-ui@latest add button input textarea label form card avatar badge tabs dialog dropdown-menu toast skeleton separator tooltip
```

## 4. Criar o projeto Supabase

1. Acesse [supabase.com](https://supabase.com), crie um novo projeto (região: São Paulo/`sa-east-1` se disponível, pra latência).
2. Copie `Project URL` e `anon public key` do painel (Settings → API).
3. Crie `.env.local` na raiz:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxxxx
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. No SQL Editor do painel Supabase, rode, **nesta ordem**, os blocos SQL de `02-MODELO-DE-DADOS.md` (enums → tabelas → trigger → RLS → índices).

## 5. Instalar Supabase CLI (opcional mas recomendado)

```bash
npm install -g supabase
supabase login
supabase link --project-ref <seu-project-ref>
supabase gen types typescript --linked > src/types/database.types.ts
```
Rode esse último comando de novo toda vez que alterar o schema — mantém a tipagem TS sincronizada com o banco de verdade, sem precisar de Prisma.

## 6. Clientes Supabase (client/server)

Peça pro Cursor gerar exatamente isto (cole no chat do Cursor):

> "Crie `src/lib/supabase/client.ts` (browser client com `createBrowserClient` de `@supabase/ssr`) e `src/lib/supabase/server.ts` (server client com `createServerClient`, lendo cookies via `next/headers`), tipados com `Database` de `src/types/database.types.ts`."

## 7. Primeiro deploy

```bash
git init
git add .
git commit -m "setup inicial"
gh repo create conecta-pcd --public --source=. --push
```

Depois:
1. Vá em [vercel.com/new](https://vercel.com/new), importe o repositório.
2. Cole as mesmas variáveis de ambiente do `.env.local` (troque `NEXT_PUBLIC_SITE_URL` pela URL real da Vercel depois do primeiro deploy).
3. Deploy.

A partir daqui, todo `git push` na branch `main` gera deploy automático, e todo PR gera preview automático — útil se vocês forem mais de uma pessoa codando.

## 8. Como usar os `.md` desta pasta no Cursor

- Deixe a pasta `docs/` versionada no repositório (não é gambiarra, é documentação real do projeto — inclusive conta ponto na entrega acadêmica).
- No Cursor, ao pedir uma feature nova, referencie o arquivo relevante com `@docs/03-FUNCIONALIDADES.md` (ou arraste o arquivo pro contexto) — isso ancora a IA nas specs reais em vez de inventar campos/tabelas que não existem no schema.
- Ordem sugerida de ataque, seguindo `06-ROADMAP-SPRINTS.md`:
  1. Layout raiz + toolbar de acessibilidade + VLibras (`@docs/04-ACESSIBILIDADE.md` + `@docs/05-DESIGN-SYSTEM.md`)
  2. Autenticação e onboarding (`@docs/03-FUNCIONALIDADES.md`, Módulo 1)
  3. Perfil (Módulo 2)
  4. Vagas (Módulo 3) — o mais importante
  5. Segue a ordem dos sprints

## 9. Comando de bootstrap sugerido pro primeiro prompt no Cursor

> "Estou seguindo as specs em `/docs`. Leia `01-ARQUITETURA-TECNICA.md` e `02-MODELO-DE-DADOS.md` primeiro. Crie a estrutura de pastas descrita em `01-ARQUITETURA-TECNICA.md` seção 2, com arquivos vazios/placeholder onde fizer sentido, e o layout raiz (`src/app/layout.tsx`) com `<html lang="pt-BR">`, o widget do VLibras, e um header básico."

Isso já deixa o esqueleto do projeto pronto pra você começar a preencher módulo por módulo.
