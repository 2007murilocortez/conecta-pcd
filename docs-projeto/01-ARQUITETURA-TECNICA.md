# Arquitetura Técnica — Conecta PCD

## 1. Stack

| Camada | Escolha | Por quê |
|---|---|---|
| Framework | **Next.js 14+ (App Router, TypeScript)** | Padrão de mercado pra Vercel, SSR bom pra SEO das vagas, Server Actions eliminam necessidade de API separada |
| Estilo | **Tailwind CSS + shadcn/ui** | Componentes acessíveis por padrão (Radix UI por baixo), rápido de customizar, fácil pro Cursor gerar código consistente |
| Banco de dados | **Supabase (Postgres)** | Decisão já validada com você |
| Auth | **Supabase Auth** | Email/senha + OAuth (Google) prontos, integra direto com RLS do Postgres |
| Storage | **Supabase Storage** | Avatares, logos de empresa, currículos (PDF), certificados |
| Validação | **Zod** | Schemas compartilhados entre formulário (client) e Server Action (server) |
| Formulários | **React Hook Form + Zod resolver** | Padrão, acessível, pouco boilerplate |
| E-mail transacional | **Resend** | Notificação de nova vaga compatível, status de candidatura, confirmação de cadastro |
| Acessibilidade | **VLibras (widget oficial gov.br)** + Radix UI (base do shadcn, já acessível por padrão) | Tradução em Libras é referência técnica pública e gratuita |
| Hospedagem | **Vercel** | Já decidido |
| Editor | **Cursor** | Já decidido — os `.md` desta pasta viram contexto pra IA do Cursor |
| ORM | **Supabase JS Client direto (sem Prisma)** | Menos uma camada de abstração; RLS do Postgres já garante segurança. Se o projeto crescer muito, dá pra migrar para Prisma depois. |

> Nota: optamos por **não usar Prisma** para não duplicar a modelagem (o schema SQL já vive no Supabase). Se no futuro quiser tipagem gerada automaticamente, usar `supabase gen types typescript` — já dá tipos TS a partir do schema real, sem duplicar nada.

## 2. Estrutura de pastas (Next.js App Router)

```
conecta-pcd/
├── docs/                          ← estes .md (contexto pro Cursor)
├── public/
│   └── icons/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── cadastro/page.tsx      ← cadastro único, sem bifurcação por tipo de conta
│   │   ├── (dashboard)/           ← área logada
│   │   │   ├── feed/page.tsx
│   │   │   ├── perfil/[id]/page.tsx
│   │   │   ├── perfil/editar/page.tsx
│   │   │   ├── vagas/page.tsx
│   │   │   ├── vagas/[id]/page.tsx
│   │   │   ├── vagas/nova/page.tsx        ← só quem for company_member da empresa
│   │   │   ├── empresas/page.tsx
│   │   │   ├── empresas/nova/page.tsx     ← chama a RPC create_company (Sprint 3)
│   │   │   ├── empresas/[id]/page.tsx
│   │   │   ├── empresas/[id]/equipe/page.tsx  ← gestão de company_members, só dono (Sprint 3)
│   │   │   ├── conexoes/page.tsx
│   │   │   ├── mentoria/page.tsx
│   │   │   ├── cursos/page.tsx
│   │   │   ├── candidaturas/page.tsx      ← minhas candidaturas / vaga (empresa)
│   │   │   └── notificacoes/page.tsx
│   │   ├── (public)/
│   │   │   ├── page.tsx                   ← landing page
│   │   │   └── sobre-acessibilidade/page.tsx
│   │   ├── api/                            ← rotas de webhook (Resend, Supabase) se precisar
│   │   ├── layout.tsx                      ← <html lang="pt-BR">, VLibras script, skip-link
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                    ← shadcn (gerado via CLI)
│   │   ├── layout/                ← Header, Sidebar, Footer, AccessibilityToolbar
│   │   ├── perfil/
│   │   ├── vagas/
│   │   ├── empresas/
│   │   └── shared/
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts          ← client-side supabase client
│   │   │   ├── server.ts          ← server-side (cookies) supabase client
│   │   │   └── middleware.ts
│   │   ├── validations/           ← schemas Zod
│   │   ├── actions/                ← Server Actions por domínio (jobs.ts, profile.ts, connections.ts...)
│   │   └── utils.ts
│   ├── hooks/
│   │   └── use-accessibility-settings.ts
│   ├── types/
│   │   └── database.types.ts      ← gerado via `supabase gen types typescript`
│   └── middleware.ts              ← protege rotas (dashboard) + refresh de sessão
├── supabase/
│   ├── migrations/                 ← SQL versionado (ver 02-MODELO-DE-DADOS.md)
│   └── seed.sql                    ← dados fake pra desenvolvimento
├── .env.local                      ← nunca commitado
├── .env.example
├── tailwind.config.ts
├── next.config.js
└── package.json
```

## 3. Variáveis de ambiente

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # só em Server Actions/rotas server-side, nunca no client
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=             # https://conecta-pcd.vercel.app em prod
```

## 4. Fluxo de autenticação

1. Cadastro com email/senha (ou Google) via `supabase.auth.signUp`.
2. Trigger no Postgres (`on auth.users insert`) cria automaticamente uma linha em `profiles` (role
   sempre `usuario`) e uma em `accessibility_settings` — ver `02-MODELO-DE-DADOS.md`.
3. No primeiro login, o usuário é redirecionado pra `/onboarding` — **não existe mais escolha de
   "candidato vs empresa"**: toda conta nasce igual. O onboarding só preenche o perfil pessoal
   (formação, experiências, skills, necessidades de acessibilidade). Gerenciar uma empresa é uma
   ação separada, disponível a qualquer momento em "Criar página de empresa" (chama a RPC
   `create_company`, que já registra quem criou como `dono` em `company_members`).
4. Uma pessoa pode acumular papéis: continuar se candidatando a vagas normalmente enquanto também
   gerencia uma ou mais empresas via `company_members`. A UI deve mostrar um seletor de contexto
   ("Ver como: [Meu perfil] [Empresa X]") quando o usuário tiver 1+ vínculo em `company_members`.
5. `middleware.ts` protege todas as rotas de `(dashboard)`, redirecionando não-autenticados pra
   `/login`. Rotas de gestão de empresa (`/empresas/[id]/gerenciar`, `/vagas/nova`, etc.) checam
   `is_company_member`/`is_company_owner` no server antes de renderizar — o RLS já barra no banco,
   mas checar antes evita mostrar UI que vai falhar.

## 5. Renderização

- Landing page, listagem de vagas e perfis de empresa: **Server Components** com fetch direto no Supabase (SEO importa aqui — Google precisa indexar vagas).
- Formulários (perfil, nova vaga, candidatura): **Client Components** com Server Actions no submit.
- Feed e notificações: Server Component inicial + revalidação via `router.refresh()` após ações (sem necessidade de WebSocket no MVP; Supabase Realtime fica como melhoria futura documentada no roadmap).

## 6. Deploy

- Repositório no GitHub → conectado direto na Vercel (deploy automático a cada push em `main`, preview automático em PRs).
- Ambientes: `local` (Supabase local via CLI ou projeto de dev separado) e `production` (projeto Supabase real).
- Rodar `supabase db push` para aplicar migrations no ambiente certo.

## 7. Decisões que ficam registradas aqui (pra não perder depois)

- **Sem Prisma** — motivo explicado acima.
- **Sem app mobile nativo** — PWA via `manifest.json` cobre a necessidade (respondida no questionário: maioria acessa por celular).
- **VLibras via widget oficial**, não tradução própria — não é realista construir um tradutor de Libras num projeto de semestre; usar a ferramenta pública do governo é uma decisão defensável e correta tecnicamente.
