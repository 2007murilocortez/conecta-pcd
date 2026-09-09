# Modelo de Dados — Conecta PCD (Supabase/Postgres)

> **Este documento reflete o schema REAL, já aplicado em produção** no projeto Supabase
> `conecta-pcd` (id `xfobwkcyctrfkqeflrvg`). Não é um plano — é o estado atual do banco,
> verificado via `list_tables` e `get_advisors`. Se o código da aplicação divergir disso,
> o banco é a fonte da verdade; rode `supabase gen types typescript` pra conferir.

## 1. Princípio central do modelo de acesso

**Toda conta é uma pessoa.** Não existe "conta de empresa". Uma empresa é uma entidade separada
(`companies`), e uma pessoa ganha permissão de gerenciá-la ao ser adicionada em `company_members`
— podendo, inclusive, ser candidato E recrutador ao mesmo tempo (ex: um recrutador PCD que também
está de olho em outras vagas). Isso é o que permite três coisas que a versão inicial do schema não
suportava: equipe de recrutadores por empresa, uma pessoa participar de mais de uma empresa, e o
badge opcional de "recrutador PCD" sem misturar isso com o papel de conta.

`profiles.role` só distingue **`usuario`** (todo mundo) de **`admin`** (moderação/GOD MODE da
plataforma). "Visitante" nunca aparece no banco — é simplesmente ausência de sessão; ele navega
vagas e empresas por elas serem públicas via RLS, sem precisar de linha nenhuma em `profiles`.

## 2. Diagrama de relacionamento (resumo textual)

```
auth.users (Supabase) ──1:1── profiles ──1:N── educations
                                    │
                                    ├──1:N── experiences
                                    ├──N:N── skills (via profile_skills)
                                    ├──1:N── posts
                                    ├──1:N── applications ──N:1── jobs ──N:1── companies
                                    ├──N:N── connections (self-relation)
                                    ├──1:N── company_reviews ──N:1── companies
                                    ├──1:N── course_enrollments ──N:1── courses
                                    ├──N:N── mentorships (mentor_id / mentee_id, self-relation)
                                    ├──N:N── company_members ──N:1── companies (equipe/recrutadores)
                                    ├──1:1── accessibility_settings
                                    ├──1:N── notifications
                                    └──1:N── reports (como denunciante)

companies ──1:N── jobs (jobs.posted_by aponta pro profile que publicou)
companies ──1:N── company_reviews
```

## 3. Enums

```sql
create type user_role as enum ('usuario', 'admin');
create type job_type as enum ('CLT', 'PJ', 'Estagio', 'Jovem Aprendiz', 'Temporario');
create type work_mode as enum ('presencial', 'remoto', 'hibrido');
create type job_status as enum ('rascunho', 'aberta', 'encerrada');
create type application_status as enum ('enviada', 'em_analise', 'entrevista', 'aprovado', 'rejeitado');
create type connection_status as enum ('pendente', 'aceita', 'recusada');
create type mentorship_status as enum ('pendente', 'ativa', 'concluida');
create type company_member_role as enum ('dono', 'recrutador');
create type report_target_type as enum ('post', 'company_review', 'profile', 'job', 'company');
create type report_status as enum ('pendente', 'em_analise', 'resolvido');
```

## 4. Tabelas

### 4.1 `profiles`
Estende `auth.users`. Criada automaticamente via trigger no signup (seção 6).

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'usuario',
  full_name text not null,
  headline text,
  bio text,
  avatar_url text,
  resume_url text,
  phone text,
  location_city text,
  location_state text,
  discloses_disability boolean not null default false,
  disability_types text[],                -- só preenchido/exibido se discloses_disability = true
  accessibility_needs text[],
  open_to_work boolean not null default true,
  open_to_mentor boolean not null default false,
  deleted_at timestamptz,                 -- soft-delete: null = conta ativa
  scheduled_deletion_at timestamptz,      -- null = sem exclusão agendada (ver seção 8)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

> **Privacidade:** `disability_types` é dado sensível de saúde. Nunca exibir publicamente sem
> `discloses_disability = true`. Consumir sempre via a view `profiles_public` (seção 7) fora do
> contexto "o próprio usuário vendo o próprio perfil".

### 4.2 `educations` / `experiences` / `skills` / `profile_skills`
```sql
create table educations (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  institution text not null,
  course text not null,
  level text,
  start_date date,
  end_date date,
  is_current boolean default false
);

create table experiences (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  company_name text not null,
  role_title text not null,
  description text,
  start_date date,
  end_date date,
  is_current boolean default false
);

create table skills (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

create table profile_skills (
  profile_id uuid references profiles(id) on delete cascade,
  skill_id uuid references skills(id) on delete cascade,
  primary key (profile_id, skill_id)
);
```

### 4.3 `companies`
```sql
create table companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  description text,
  website text,
  sector text,
  size text,                              -- '1-50', '51-200', '201-1000', '1000+'
  accessibility_features text[],
  is_verified_inclusive boolean not null default false,   -- selo — só admin concede
  created_at timestamptz not null default now(),
  created_by uuid references profiles(id) on delete set null   -- só auditoria, NÃO dá permissão
);
```
> Sem CNPJ (decisão do time) e sem `owner_id` — quem gerencia a empresa é definido só por
> `company_members`, nunca por uma coluna nesta tabela.

### 4.4 `company_members`
```sql
create table company_members (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  member_role company_member_role not null default 'recrutador',
  show_pcd_badge boolean not null default false,   -- recrutador opta por mostrar a estrela de PCD na página da empresa
  created_at timestamptz not null default now(),
  unique (company_id, profile_id)
);
```

### 4.5 `jobs`
```sql
create table jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  title text not null,
  description text not null,
  requirements text,
  type job_type not null,
  work_mode work_mode not null,
  location_city text,
  location_state text,
  salary_min numeric,
  salary_max numeric,
  salary_visible boolean default false,
  accessibility_resources text[],
  status job_status not null default 'aberta',
  created_at timestamptz not null default now(),
  closes_at timestamptz,
  posted_by uuid references profiles(id) on delete set null   -- qual recrutador publicou
);
```

### 4.6 `applications`
```sql
create table applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  status application_status not null default 'enviada',
  cover_letter text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, profile_id)
);
```

### 4.7 `connections`
```sql
create table connections (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references profiles(id) on delete cascade,
  addressee_id uuid not null references profiles(id) on delete cascade,
  status connection_status not null default 'pendente',
  created_at timestamptz not null default now(),
  unique (requester_id, addressee_id)
);
```

### 4.8 `mentorships`
```sql
create table mentorships (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references profiles(id) on delete cascade,
  mentee_id uuid not null references profiles(id) on delete cascade,
  status mentorship_status not null default 'pendente',
  message text,
  created_at timestamptz not null default now(),
  unique (mentor_id, mentee_id)
);
```

### 4.9 `company_reviews`
```sql
create table company_reviews (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  accessibility_rating smallint not null check (accessibility_rating between 1 and 5),
  comment text,
  is_anonymous boolean not null default true,
  created_at timestamptz not null default now(),
  unique (company_id, profile_id)
);
```

### 4.10 `courses` / `course_enrollments`
```sql
create table courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  provider text,
  url text,
  category text,
  description text,
  is_free boolean default true,
  accessibility_features text[]
);

create table course_enrollments (
  profile_id uuid references profiles(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  status text default 'em_andamento',
  completed_at timestamptz,
  primary key (profile_id, course_id)
);
```

### 4.11 `posts`
```sql
create table posts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  content text not null,
  image_url text,
  created_at timestamptz not null default now()
);
```

### 4.12 `accessibility_settings`
```sql
create table accessibility_settings (
  profile_id uuid primary key references profiles(id) on delete cascade,
  font_scale numeric not null default 1.0,
  high_contrast boolean not null default false,
  reduce_motion boolean not null default false,
  screen_reader_optimized boolean not null default false,
  updated_at timestamptz not null default now()
);
```

### 4.13 `notifications`
```sql
create table notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  link text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
```

### 4.14 `reports`
```sql
create table reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references profiles(id) on delete cascade,
  target_type report_target_type not null,
  target_id uuid not null,        -- id do post/review/perfil/vaga/empresa denunciado
  reason text not null,
  status report_status not null default 'pendente',
  reviewed_by uuid references profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
```

## 5. Funções helper (usadas dentro das políticas de RLS)

```sql
-- Booleans de checagem, chamadas de dentro das policies. Todas com search_path fixo.
public.is_admin() returns boolean
public.is_company_member(target_company_id uuid) returns boolean
public.is_company_owner(target_company_id uuid) returns boolean
```

## 6. RPC: criação de empresa

`company_members` não pode ser preenchida via insert comum na hora de criar a empresa (ainda não
existe ninguém com `member_role = 'dono'` pra autorizar). Por isso, criar empresa é sempre via RPC,
que faz os dois inserts (`companies` + `company_members`) numa transação só, como o próprio dono:

```sql
public.create_company(
  p_name text,
  p_description text default null,
  p_website text default null,
  p_sector text default null,
  p_size text default null,
  p_show_pcd_badge boolean default false
) returns uuid
```

Chamar do client: `supabase.rpc('create_company', { p_name: '...', ... })`. Só `authenticated` pode
executar (visitante não consegue nem tentar).

## 7. Trigger: criar profile automaticamente no signup

```sql
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), 'usuario');

  insert into public.accessibility_settings (profile_id)
  values (new.id);

  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```
Não é chamável via RPC por ninguém (`revoke execute ... from public, anon, authenticated`) — só
dispara pelo trigger.

## 8. View pública de perfil

```sql
create view profiles_public
with (security_invoker = true) as
select
  id, role, full_name, headline, bio, avatar_url, location_city, location_state,
  open_to_work, open_to_mentor,
  case when discloses_disability then disability_types else null end as disability_types,
  accessibility_needs
from profiles
where deleted_at is null;
```
Use esta view em qualquer contexto que não seja "o próprio usuário vendo o próprio perfil" — nunca
consulte `profiles` bruta pra exibição pública.

## 9. Row Level Security — modelo por tabela

RLS está habilitado em **todas** as tabelas (o projeto Supabase já vem com uma função interna que
liga isso automaticamente em tabela nova). Resumo de quem pode o quê:

| Tabela | Select público (visitante) | Select autenticado | Insert/Update |
|---|---|---|---|
| `profiles` | ❌ | ✅ (exceto `deleted_at is not null`, exceto se for o próprio dono) | dono edita o próprio |
| `companies` | ✅ | ✅ | `is_company_owner()` edita; `create_company()` cria |
| `company_members` | ✅ (transparência) | ✅ | `is_company_owner()` gerencia a equipe |
| `jobs` | ✅ se `status='aberta'` | ✅ + rascunhos da própria empresa | `is_company_member()` publica/edita |
| `applications` | ❌ | candidato vê as próprias; equipe da empresa vê as da vaga dela | candidato cria; empresa muda status |
| `connections` / `mentorships` | ❌ | só quem está envolvido | requester/mentee cria; addressee/mentor aceita |
| `company_reviews` | ✅ | ✅ | autor cria/edita a própria |
| `courses` | ✅ | ✅ | só admin |
| `course_enrollments` | ❌ | só o dono da inscrição | dono gerencia |
| `posts` | ❌ | ✅ | autor gerencia o próprio |
| `reports` | ❌ | reporter vê as próprias | reporter cria |
| Todas | — | — | **admin faz qualquer coisa em qualquer tabela** (política "GOD MODE" própria em cada uma) |

Todas as políticas usam `(select auth.uid())` / `(select auth.role())` (não a chamada direta) —
otimização confirmada pelo advisor de performance do Supabase.

## 10. Índices

```sql
create index idx_jobs_company on jobs(company_id);
create index idx_jobs_status on jobs(status);
create index idx_jobs_posted_by on jobs(posted_by);
create index idx_applications_job on applications(job_id);
create index idx_applications_profile on applications(profile_id);
create index idx_connections_requester on connections(requester_id);
create index idx_connections_addressee on connections(addressee_id);
create index idx_notifications_profile_unread on notifications(profile_id) where is_read = false;
create index idx_company_members_profile on company_members(profile_id);
create index idx_company_members_company on company_members(company_id);
create index idx_companies_created_by on companies(created_by);
create index idx_company_reviews_company on company_reviews(company_id);
create index idx_company_reviews_profile on company_reviews(profile_id);
create index idx_course_enrollments_course on course_enrollments(course_id);
create index idx_educations_profile on educations(profile_id);
create index idx_experiences_profile on experiences(profile_id);
create index idx_mentorships_mentee on mentorships(mentee_id);
create index idx_posts_profile on posts(profile_id);
create index idx_profile_skills_skill on profile_skills(skill_id);
create index idx_reports_reporter on reports(reporter_id);
create index idx_reports_reviewed_by on reports(reviewed_by);
create index idx_reports_status_pending on reports(status) where status = 'pendente';
create index idx_profiles_scheduled_deletion on profiles(scheduled_deletion_at) where scheduled_deletion_at is not null;
```

## 11. Fluxo de exclusão de conta (soft-delete, 30 dias) — pendente na aplicação

O banco já tem os campos (`profiles.deleted_at`, `profiles.scheduled_deletion_at`); falta a lógica
de aplicação, que entra no Sprint 1 junto de autenticação:

1. **Botão "Excluir conta"** → `update profiles set deleted_at = now(), scheduled_deletion_at = now() + interval '30 days' where id = auth.uid()`.
2. **No login/middleware**: se o usuário logado tem `deleted_at is not null`, redirecionar pra uma
   tela de aviso com o prazo restante e dois botões:
   - "Cancelar exclusão" → zera os dois campos.
   - "Excluir agora" → chama uma rota server-side com a *service role key* pra
     `supabase.auth.admin.deleteUser(id)`, que cascade-deleta tudo (o `on delete cascade` já cuida
     do resto).
3. **Cron diário** (Vercel Cron batendo numa rota `/api/cron/purge-deleted-accounts`, protegida por
   secret): busca `profiles` com `scheduled_deletion_at <= now()` e chama `auth.admin.deleteUser`
   pra cada uma.

## 12. Como isso foi versionado no Supabase

Aplicado via MCP em migrations sequenciais (`0001_enums` até `0015_performance_hardening`) —
histórico completo consultável com `Supabase:list_migrations`. Não existe mais um script
`.sql` local pra rodar do zero; se precisar recriar o banco em outro projeto, a sequência de
migrations do histórico é a fonte da verdade, não um arquivo estático.
