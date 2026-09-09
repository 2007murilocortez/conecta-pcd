# Especificação de Funcionalidades — Conecta PCD

Cada módulo abaixo tem: objetivo, telas, user stories e critérios de aceite.
Use este arquivo como prompt de contexto no Cursor ao gerar cada tela — cole a seção relevante junto do pedido.

---

## Módulo 1 — Autenticação e Onboarding

**Objetivo:** cadastro simples e acessível. Toda conta nasce igual (pessoa física) — gerenciar uma
empresa é uma ação posterior, não uma escolha no cadastro (ver `02-MODELO-DE-DADOS.md`, seção 1).

**Telas:** `/login`, `/cadastro`, `/onboarding`

**User stories**
- Como visitante, quero me cadastrar com email/senha ou Google, para criar minha conta rapidamente.
- Como novo usuário, quero preencher meu perfil pessoal logo após o cadastro (não escolher "tipo de conta"), para começar a usar a plataforma como candidato desde já.
- Como candidato, quero, no onboarding, poder informar (opcionalmente) se tenho alguma deficiência e quais recursos de acessibilidade preciso, para já sair da configuração inicial com meu perfil ajustado.
- Como usuário já cadastrado, quero poder criar uma página de empresa a qualquer momento (não só no cadastro), para começar a recrutar sem precisar de uma conta separada.

**Critérios de aceite**
- [ ] Formulário 100% navegável por teclado (Tab / Shift+Tab / Enter).
- [ ] Erros de validação anunciados via `aria-live` (não só cor vermelha).
- [ ] Campo de deficiência é opcional, com texto explicando por que perguntamos e como o dado é usado (link para política de privacidade).
- [ ] Após signup, trigger do banco cria `profiles` (role `usuario`) e `accessibility_settings` automaticamente — sem intervenção da aplicação.
- [ ] Onboarding é único (não bifurca por tipo de conta): dados básicos → formação/experiência → necessidades de acessibilidade → concluir.
- [ ] "Criar página de empresa" é um CTA separado (menu do usuário ou `/empresas/nova`), disponível a qualquer momento, que chama a RPC `create_company` — nunca um formulário de insert direto na tabela `companies`.

---

## Módulo 2 — Perfil Profissional

**Objetivo:** o "currículo vivo" do candidato — usado tanto pra ele se apresentar quanto pra alimentar recomendações.

**Telas:** `/perfil/[id]` (visualização, pública para autenticados), `/perfil/editar` (edição, só o dono)

**User stories**
- Como candidato, quero editar formação, experiências e habilidades, para que meu perfil reflita minha trajetória.
- Como candidato, quero fazer upload do meu currículo em PDF, para facilitar candidaturas.
- Como candidato, quero controlar se minha deficiência aparece no meu perfil público ou não, para decidir quando e para quem revelar essa informação (achado do questionário: nem todo mundo se sente confortável).
- Como visitante do perfil, quero ver claramente as necessidades de acessibilidade que a pessoa tem informado (se ela optou por exibir), para adaptar uma eventual entrevista.

**Critérios de aceite**
- [ ] Seções: dados básicos, headline, bio, formação (lista editável), experiências (lista editável), habilidades (tags/autocomplete), currículo (upload PDF via Supabase Storage).
- [ ] Toggle explícito "Mostrar tipo de deficiência no meu perfil público" — desligado por padrão.
- [ ] Campo de "necessidades de acessibilidade" é multi-select com opções da pesquisa (leitor de tela, Libras, alto contraste, intérprete em entrevista, horário flexível, etc.) + opção "outro".
- [ ] Visualização usa a view `profiles_public` (nunca expõe `disability_types` cru se `discloses_disability = false`).
- [ ] Foto de perfil com upload + crop simples.

---

## Módulo 3 — Vagas (Oportunidades)

**Objetivo:** núcleo funcional do produto — é o motivo #1 pelo qual alguém abre o app (validado no questionário: dificuldade em achar vaga foi a dor mais citada).

**Telas:** `/vagas` (listagem + filtros), `/vagas/[id]` (detalhe + candidatar), `/vagas/nova` (recrutador cria vaga em nome de uma empresa), `/candidaturas` (minhas candidaturas) e `/empresas/[id]/candidaturas` (candidaturas recebidas pelas vagas daquela empresa, visível a quem está em `company_members`)

**User stories**
- Como candidato, quero filtrar vagas por tipo (CLT/estágio/jovem aprendiz), modalidade (remoto/híbrido/presencial) e **recursos de acessibilidade oferecidos**, para não perder tempo com vagas incompatíveis.
- Como candidato, quero me candidatar com um clique (usando meu perfil já preenchido) + uma carta de apresentação opcional.
- Como candidato, quero acompanhar o status da minha candidatura (enviada → em análise → entrevista → aprovado/rejeitado), para saber onde estou no processo.
- Como recrutador (membro de `company_members`), quero publicar uma vaga em nome da empresa informando quais recursos de acessibilidade oferecemos no processo seletivo e no ambiente de trabalho, para atrair candidatos certos.
- Como recrutador, quero ver a lista de candidatos de uma vaga da minha empresa e mudar o status de cada candidatura.

**Critérios de aceite**
- [ ] Filtro por `accessibility_resources` é **destaque visual** na listagem (não escondido em "filtros avançados") — é o diferencial do produto frente a LinkedIn/Catho.
- [ ] Candidatura duplicada na mesma vaga é bloqueada (constraint `unique(job_id, profile_id)` já cobre no banco; a UI precisa desabilitar o botão e avisar).
- [ ] Ao mudar status da candidatura, o candidato recebe notificação (tabela `notifications` + e-mail via Resend).
- [ ] Formulário de nova vaga só acessível a quem `is_company_member(company_id)` for verdadeiro pra aquela empresa (RLS já impede no banco; a UI esconde o link também). Ao publicar, `posted_by` é preenchido com o `profile_id` de quem está logado.
- [ ] Vaga tem campo de salário opcional/oculto (`salary_visible`) — pesquisa mostrou que "salário e benefícios" é informação valorizada, mas nem toda empresa quer expor.

---

## Módulo 4 — Empresas Inclusivas

**Objetivo:** dar confiança ao candidato de que a empresa é inclusiva **de verdade**, não só no discurso — ponto direto da pesquisa teórica (inclusão ≠ contratação) e do questionário (usuários já deixaram de aplicar por desconfiança).

**Telas:** `/empresas` (listagem), `/empresas/[id]` (perfil da empresa: sobre, vagas abertas, avaliações)

**User stories**
- Como candidato, quero ver o perfil de uma empresa antes de me candidatar: descrição, recursos de acessibilidade que oferece, e avaliações de outros PCDs.
- Como candidato, quero avaliar uma empresa onde trabalhei/participei de processo seletivo, com nota geral + nota específica de acessibilidade, podendo ser anônimo.
- Como visitante, quero identificar visualmente quais empresas têm o **selo de empresa inclusiva verificada**, para confiar mais nelas.
- Como usuário, quero criar a página de uma empresa a qualquer momento (não só no cadastro) e virar automaticamente o `dono` dela.
- Como dono de uma empresa, quero adicionar outras pessoas como recrutadoras da minha equipe (`company_members`), para dividir o trabalho de publicar vaga e triar candidatos.
- Como recrutador que também é PCD, quero poder optar por mostrar uma estrela/badge no meu card na página pública da empresa (`show_pcd_badge`), sinalizando que a empresa já tem PCDs em cargos de recrutamento — sem ser obrigado a isso, e independente de eu ter revelado minha deficiência no meu perfil pessoal (`profiles.discloses_disability`).

**Critérios de aceite**
- [ ] Selo (`is_verified_inclusive`) só pode ser marcado por um admin (nunca autodeclarado pela empresa) — isso é o que dá credibilidade ao selo. Documentar processo de verificação num doc futuro de "critérios do selo".
- [ ] Avaliação (`company_reviews`) tem opção de anonimato (`is_anonymous`) — mostrada como "Profissional PCD (anônimo)" quando marcada.
- [ ] Nota média exibida no card da empresa na listagem (`rating` e `accessibility_rating` separados).
- [ ] Uma avaliação por empresa por usuário (constraint já no banco).
- [ ] Página da empresa mostra a seção "Equipe" listando `company_members` (nome, `member_role`, e a estrela de quem tiver `show_pcd_badge = true`) — é sinal de confiança concreto, diferente de qualquer selo autodeclarado.
- [ ] Tela de gestão da equipe (`/empresas/[id]/equipe`, só visível a quem `is_company_owner`) permite adicionar/remover recrutador. Cada recrutador controla o próprio `show_pcd_badge` — o dono não pode ligar essa flag por outra pessoa.

---

## Módulo 5 — Networking

**Objetivo:** comunidade entre profissionais PCDs — item que a pesquisa e o questionário indicaram como diferencial frente a job boards comuns.

**Telas:** `/feed`, `/conexoes`, `/perfil/[id]` (botão de conectar)

**User stories**
- Como candidato, quero enviar e aceitar pedidos de conexão com outros profissionais PCDs.
- Como candidato, quero publicar um post curto no feed (texto + imagem opcional), para compartilhar conquistas ou pedir ajuda.
- Como candidato, quero ver um feed com posts das minhas conexões.

**Critérios de aceite**
- [ ] Pedido de conexão gera notificação para quem recebe.
- [ ] Feed no MVP pode ser simples: lista cronológica dos posts das conexões aceitas (sem algoritmo de ranqueamento — isso é melhoria futura).
- [ ] Post com imagem passa por upload no Supabase Storage.

---

## Módulo 6 — Mentoria

**Objetivo:** conectar profissionais PCDs experientes com quem está começando — resposta direta a uma pergunta do questionário complementado.

**Telas:** `/mentoria` (listagem de mentores disponíveis + minhas mentorias)

**User stories**
- Como profissional PCD sênior, quero me marcar como "disponível para mentoria" no meu perfil.
- Como candidato, quero solicitar mentoria a alguém, com uma mensagem inicial.
- Como mentor, quero aceitar ou recusar pedidos de mentoria.

**Critérios de aceite**
- [ ] Flag `open_to_mentor` (adicionar em `profiles` se quiser separar de `open_to_work` — ver nota abaixo).
- [ ] Status da mentoria (`pendente/ativa/concluida`) visível pros dois lados.
- [ ] MVP não precisa de chat dentro da mentoria — pode ser só o contato liberado (email/perfil) após aceite.

---

## Módulo 7 — Cursos e Capacitação

**Objetivo:** resposta direta à pergunta 7 do questionário original ("interesse em cursos dentro do app").

**Telas:** `/cursos` (listagem + filtro por categoria), inscrição

**User stories**
- Como candidato, quero ver uma lista de cursos gratuitos/pagos relevantes, com indicação de recursos de acessibilidade do próprio curso.
- Como candidato, quero marcar um curso como "em andamento" ou "concluído" no meu perfil.

**Critérios de aceite**
- [ ] MVP: cursos são curados manualmente (seed no banco, sem parceria formal ainda) — link externo para a plataforma real do curso.
- [ ] Cursos concluídos aparecem no perfil público como parte da "capacitação" — reforça o perfil pra recrutador.

---

## Módulo 8 — Recomendações Personalizadas

**Objetivo:** vagas e cursos sugeridos de acordo com perfil — item explícito do documento original do projeto.

**Regra no MVP (sem IA):**
- Vaga recomendada = interseção entre `skills` do candidato e `requirements`/tags da vaga, + mesma `location_state` OU `work_mode = 'remoto'`.
- Curso recomendado = categoria de curso alinhada às `skills` que o candidato **não tem ainda** mas que aparecem com frequência nos `requirements` das vagas que ele visualizou/candidatou.

**Evolução futura (documentar, não implementar agora):** usar embeddings (ex: OpenAI) para matching semântico entre bio/skills do candidato e descrição da vaga. Colocar isso no roadmap pós-dezembro.

**Critérios de aceite (MVP)**
- [ ] Seção "Vagas para você" na home do candidato, com no mínimo a regra de interseção de skills.
- [ ] Seção "Cursos recomendados" no mesmo padrão.

---

## Módulo 9 — Acessibilidade da Plataforma

Ver documento dedicado: `04-ACESSIBILIDADE.md`. Este módulo é transversal a todos os outros — toda tela nova precisa ser checada contra esse documento antes de ser considerada "pronta".

---

## Módulo 10 — Notificações

**Objetivo:** manter o usuário informado sem precisar ficar checando o app manualmente.

**Telas:** `/notificacoes`, sino no header com contador de não lidas

**Eventos que geram notificação:**
- Nova vaga compatível publicada (baseado na regra de recomendação).
- Mudança de status de candidatura.
- Pedido de conexão recebido / aceito.
- Pedido de mentoria recebido / aceito.
- Nova avaliação recebida na empresa (para o dono da empresa).

**Critérios de aceite**
- [ ] Notificação in-app sempre criada; e-mail via Resend só para eventos de alto valor (status de candidatura, mentoria) — não gerar spam de e-mail para curtidas/likes se essa feature existir.
