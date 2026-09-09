# Roadmap — Conecta PCD (Setembro → Dezembro)

Hoje é **8 de setembro**. Considerando entrega final em dezembro, temos ~14-15 semanas.
Sprints de 2 semanas, com buffer nas últimas duas semanas para relatório/apresentação
(não deixe pra codar até a véspera — a banca avalia entregável **e** discurso).

## Sprint 0 (8–14 set) — Fundação
- [ ] Criar projeto Next.js + repositório GitHub + conectar na Vercel (deploy do "hello world" já em produção no dia 1 — dá confiança pro resto do projeto).
- [ ] Criar projeto Supabase, aplicar todas as migrations de `02-MODELO-DE-DADOS.md`.
- [ ] Configurar Tailwind + shadcn/ui + tokens de `05-DESIGN-SYSTEM.md`.
- [ ] Layout raiz: header, footer, toolbar de acessibilidade (mesmo que os toggles ainda não façam nada), VLibras embutido.
- **Entregável do sprint:** landing page estática no ar, com identidade visual definida.

## Sprint 1 (15–28 set) — Autenticação e Perfil
- [ ] Cadastro/login (Supabase Auth) + onboarding único (perfil pessoal — sem escolha de "tipo de conta").
- [ ] CRUD de perfil: dados básicos, formação, experiências, habilidades.
- [ ] Upload de avatar e currículo (Supabase Storage).
- [ ] Toggle de exposição de deficiência + necessidades de acessibilidade.
- **Entregável:** usuário real consegue se cadastrar e montar o perfil completo.

## Sprint 2 (29 set–12 out) — Empresas (básico) e Vagas (núcleo do produto)
- [ ] Fluxo "Criar página de empresa" (chama a RPC `create_company`) + página mínima
      `/empresas/nova` — **pré-requisito técnico da vaga**, já que `jobs.company_id`
      é `not null`. A página pública completa de empresa (perfil, avaliações, selo,
      gestão de equipe) fica pro Sprint 3; aqui só o suficiente pra existir uma
      empresa e a pessoa poder publicar vaga nela.
- [ ] CRUD de vaga (lado empresa: criar/editar/encerrar).
- [ ] Listagem + filtros (tipo, modalidade, **acessibilidade** em destaque).
- [ ] Página de detalhe da vaga + candidatura.
- [ ] Painel "minhas candidaturas" (candidato) e "candidaturas recebidas" (empresa) com mudança de status.
- **Entregável:** fluxo completo de ponta a ponta — empresa é criada, publica vaga, candidato se candidata, empresa muda status.

## Sprint 3 (13–26 out) — Empresas Inclusivas (completo)
- [ ] Tela de gestão da equipe (`company_members`: adicionar/remover recrutador, badge `show_pcd_badge`) — a criação básica já saiu no Sprint 2, aqui entra a parte de time.
- [ ] Perfil público de empresa (sobre, vagas abertas, recursos de acessibilidade).
- [ ] Sistema de avaliação (`company_reviews`), com opção de anonimato.
- [ ] Painel admin simples para conceder o selo `is_verified_inclusive` (mesmo que rudimentar — uma tela protegida por role admin).
- **Entregável:** módulo de confiança do produto funcionando, com pelo menos 3 empresas fake com avaliações no seed pra demo.

## Sprint 4 (27 out–9 nov) — Networking e Mentoria
- [ ] Conexões (enviar/aceitar/recusar pedido).
- [ ] Feed simples (posts das conexões).
- [ ] Mentoria (marcar-se como mentor, solicitar, aceitar).
- **Entregável:** comunidade funcionando — dá pra demonstrar a diferença do produto frente a um job board comum.

## Sprint 5 (10–23 nov) — Cursos, Recomendações e Notificações
- [ ] Listagem de cursos + inscrição (seed manual de 15-20 cursos reais, ex: gov.br, Senai, Coursera gratuitos).
- [ ] Recomendação por interseção de skills (vagas e cursos).
- [ ] Notificações in-app + e-mail (Resend) para os eventos definidos em `03-FUNCIONALIDADES.md`.
- **Entregável:** todos os 10 módulos do produto implementados, mesmo que alguns de forma simples.

## Sprint 6 (24 nov–7 dez) — Acessibilidade, polimento e QA
- [ ] Rodar o checklist completo de `04-ACESSIBILIDADE.md` em toda tela.
- [ ] Corrigir achados de Lighthouse/axe/teste com leitor de tela.
- [ ] Popular banco com dados realistas (seed grande) pra demo não parecer vazia.
- [ ] Responsividade mobile revisada (maioria dos respondentes do questionário usa celular).
- **Entregável:** produto estável, testado, pronto pra demo ao vivo.

## Sprint 7 (8–15 dez) — Relatório, vídeo e apresentação
- [ ] Gravar vídeo de demonstração (backup caso internet falhe na apresentação ao vivo).
- [ ] Documentar no relatório final: decisões técnicas (linkar estes `.md`), resultados do questionário, prints de auditoria de acessibilidade.
- [ ] Ensaiar apresentação.

## Regra de corte (se o tempo apertar)

Se algum sprint atrasar, cortar **nesta ordem** (do menos crítico pro mais crítico, mantendo sempre o núcleo perfil→vaga→candidatura→acessibilidade intacto):

1. Feed/posts do networking (manter só conexões, cortar timeline).
2. Cursos (manter como página estática simples se precisar).
3. Recomendações automáticas (manter listagem simples sem seção "pra você").
4. Mentoria (pode virar "feature futura" documentada no relatório, sem prejuízo — mostra visão de produto mesmo sem implementar).

**Nunca cortar:** autenticação, perfil, vagas, candidatura, e o módulo de acessibilidade — são o coração da nota e da coerência com a pesquisa já entregue.
