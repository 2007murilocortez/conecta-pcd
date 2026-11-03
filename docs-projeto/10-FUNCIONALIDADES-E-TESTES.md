# Funcionalidades e modo de testar — Conecta PCD

Site: https://conecta-pcd.vercel.app  
Slides rápidos: https://conecta-pcd.vercel.app/apresentacao  
Este arquivo é o guia da banca / do esboço escrito. Não substitui o relatório oficial.

Na apresentação **não criar conta**. Tudo já está preenchido.

---

## 1. Contas da demo

Senha de todas: `Conecta2026`

| Pessoa | E-mail | Papel | Para que serve no teste |
|---|---|---|---|
| **Ana Souza** (começar por ela) | `ana.souza@conectapcd.dev` | Candidata | Feed, vaga, candidatura, cursos, conexões, mentoria, sino |
| **Carla Mendes** | `carla.mendes@conectapcd.dev` | Recrutadora / dona da Rede Viva Mais | Página da empresa, vagas publicadas, mudar status da Ana |
| **Paulo Ribeiro** | `paulo.ribeiro@conectapcd.dev` | Mentor | Só se sobrar tempo |

Bruno Costa existe só para deixar um **pedido de conexão pendente** na Ana. Não precisa entrar com ele.

Como entrar: https://conecta-pcd.vercel.app/login → botão da Ana (ou colar e-mail e senha) → **Entrar**.

Não usar Google. Não usar `teste@gmail.com`.

---

## 2. O que o site faz (para o esboço escrito)

O Conecta PCD é uma rede profissional gratuita para pessoas com deficiência e para empresas que publicam vaga acessível.

1. **Perfil profissional** — formação, experiência, habilidades; a pessoa escolhe se o tipo de deficiência aparece no perfil público.
2. **Feed** — publicar texto (com modelos prontos) e ver posts das conexões.
3. **Vagas** — filtro em destaque por acessibilidade (Libras, leitor de tela, intérprete, horário flexível), não um detalhe escondido.
4. **Candidatura** — um clique + carta opcional; status: enviada → em análise → entrevista → aprovado/rejeitado.
5. **Empresa** — página com acessibilidade, vagas abertas e avaliações (podem ser anônimas).
6. **Selo inclusivo** — só o admin concede; não é autodeclaração da empresa.
7. **Recrutamento** — quem é da equipe publica vaga e muda o status de quem se candidatou, sem “tipo de conta” no cadastro.
8. **Conexões** — pedir, aceitar ou recusar; o feed mostra a rede aceita.
9. **Mentoria** — perfil aberto a mentorar; pedido com mensagem; aceite libera o contato pelo perfil (não tem chat).
10. **Cursos** — catálogo de links oficiais (EVG, MEC, SEBRAE, SENAI, etc.); marcar em andamento ou concluído.
11. **Recomendação simples** — vaga que cruza com as skills e é remota ou do mesmo estado; cursos nas categorias que ainda faltam.
12. **Acessibilidade da interface** — VLibras, ouvir o texto em voz alta, toolbar (fonte 100–150%, contraste, menos animação), skip-link, teclado.
13. **Base legal citada no site** — Lei 8.213/1991 (Cotas) e Lei 13.146/2015 (LBI). Dado IBGE: ocupação 26,6% vs 60,7%.
14. **Sair** — botão no topo (e no menu da conta) encerra a sessão e volta ao login, para trocar de pessoa na demo.

Pesquisa que fundamenta o produto: 14 pessoas e 17 empresários (Anexo 2). Não inventar resposta de questionário.

---

## 3. Como testar cada função

Fazer nesta ordem. Tempo cheio: ±12 min. Se apertar, seguir só a coluna **mínimo**.

### 3.1 Página inicial (sem login)

| | |
|---|---|
| **Abrir** | `/` |
| **O que mostrar** | Proposta do produto, número do IBGE, card de vaga com Libras e leitor de tela, bloco “o que o site consegue fazer”. |
| **Como testar** | Rolar a home. Canto inferior: VLibras e toolbar de fonte/contraste. |
| **Esperado** | Textos com espaço (não colado). Botão “Entrar na demonstração” vai para `/login`. |
| **Mínimo** | 20 segundos na home e ir ao login. |

### 3.2 Login

| | |
|---|---|
| **Abrir** | `/login` |
| **Como testar** | Clicar em **Ana Souza** (preenche sozinho) → Entrar. |
| **Esperado** | Cai no `/feed` (ou `/perfil/editar` só se o headline estiver vazio — na Ana já está preenchido). No topo aparece **Sair**. |
| **Não testar** | Continuar com Google. |
| **Sair** | Botão **Sair** no header (também no menu da conta e no menu do celular). Volta para `/login`. Use isso para trocar da Ana para a Carla. |

### 3.3 Feed e posts

| | |
|---|---|
| **Abrir** | `/feed` |
| **O que já tem** | Posts da Ana, do Paulo e da Carla. Caixa de publicar no topo. |
| **Como testar** | Clicar num modelo (**Conquista**, **Busco vaga** ou **Dica**) → **Publicar**. O post aparece na lista. Embaixo: “Vagas para você” e cursos sugeridos. |
| **Esperado** | Publicar texto funciona. Foto é opcional (“Anexar imagem”). |
| **Mínimo** | Mostrar os posts prontos; publicar um modelo se der tempo. |

### 3.4 Vagas (núcleo do produto)

| | |
|---|---|
| **Abrir** | `/vagas` |
| **O que já tem** | Seis vagas abertas, cargos comuns no mercado PcD: *Auxiliar administrativo*, *Atendente de teleatendimento*, *Operador de caixa*, *Recepcionista*, *Auxiliar de estoque*, *Digitador*. A principal: *Auxiliar administrativo* (Rede Viva Mais, híbrido, leitor de tela + horário flexível). |
| **Como testar** | Usar o filtro de acessibilidade (Libras / leitor de tela). Abrir a vaga de auxiliar administrativo. |
| **Esperado** | O filtro é visível. Cada card mostra um trecho da descrição, o salário e os chips de acessibilidade. Sem login o visitante é mandado para `/login`. |
| **Mínimo** | Abrir *Auxiliar administrativo* e apontar os chips de acessibilidade. |

### 3.5 Candidatura

| | |
|---|---|
| **Abrir** | `/candidaturas` (menu) ou a própria vaga |
| **O que já tem** | Ana já está **em análise** na vaga de auxiliar administrativo. |
| **Como testar** | Mostrar a lista. Não precisa se candidatar de novo nessa vaga (o banco bloqueia duplicata). Para mostrar o clique, abrir *Pessoa atendente de teleatendimento* e candidatar se quiser. |
| **Esperado** | Status visível. Sino da Ana tem aviso dessa candidatura. |
| **Mínimo** | Só mostrar “em análise”. |

### 3.6 Empresas e selo

| | |
|---|---|
| **Abrir** | `/empresas` → Rede Viva Mais |
| **O que já tem** | Rede Viva Mais **com selo**. Central de Atendimento Norte e Clínica Horizonte **sem selo** (contraste). Avaliação da Ana na Rede Viva Mais. |
| **Como testar** | Entrar na Rede Viva Mais: descrição, recursos, vagas, avaliação. Comparar com a Central Norte. |
| **Esperado** | Dá para falar: “selo não é autodeclaração”. |
| **Mínimo** | Abrir a Rede Viva Mais e apontar o selo. |

### 3.7 Perfil

| | |
|---|---|
| **Abrir** | ícone da conta → editar, ou `/perfil/editar` |
| **O que já tem** | Ana: headline *Auxiliar administrativa*, ETEC, Excel/atendimento/organização, deficiência visual **visível** (ela autorizou), leitor de tela. |
| **Como testar** | Mostrar o toggle de exibir deficiência. Não precisa salvar mudança na banca. |
| **Mínimo** | Abrir o perfil público da Ana a partir de um post do feed. |

### 3.8 Conexões

| | |
|---|---|
| **Abrir** | `/conexoes` |
| **O que já tem** | Paulo e Carla **aceitos**. Bruno **pendente**. |
| **Como testar** | Aceitar o Bruno ao vivo. Depois o post dele pode aparecer no feed. |
| **Esperado** | Pedido some da pendente e vai para aceitas. |
| **Mínimo** | Só mostrar a lista (aceitas + pendente). |

### 3.9 Mentoria

| | |
|---|---|
| **Abrir** | `/mentoria` |
| **O que já tem** | Ana (mentorada) ↔ Paulo (mentor), status **ativa**. |
| **Como testar** | Mostrar a relação. Se sobrar tempo, sair e entrar como Paulo. |
| **Esperado** | Não há chat; o aceite vale como “pode falar pelo perfil”. |
| **Mínimo** | Uma tela da mentoria ativa. |

### 3.10 Cursos

| | |
|---|---|
| **Abrir** | `/cursos` |
| **O que já tem** | 20 cursos com URL oficial (EVG, MEC, SEBRAE, SENAI…). Ana: um **concluído** (Acessibilidade na Comunicação) e um **em andamento** (Introdução à Libras). |
| **Como testar** | Abrir um curso (o link sai do site, para a instituição). Voltar. Marcar outro como em andamento se quiser. |
| **Esperado** | Não inventamos URL. O concluído entra na capacitação do perfil. |
| **Mínimo** | Mostrar a lista e a inscrição da Ana. |

### 3.11 Notificações

| | |
|---|---|
| **Abrir** | sino no header → `/notificacoes` |
| **O que já tem** | Candidatura em análise + pedido de conexão do Bruno. |
| **Como testar** | Abrir o sino. Clicar num aviso. |
| **Esperado** | Badge de não lidas. E-mail **não** deve ser prometido na banca (Resend não está no ar). |
| **Mínimo** | Mostrar o sino com os dois avisos. |

### 3.12 Lado empresa (Carla)

Só se sobrar tempo. **Sair** da Ana (botão no topo) → `/login` → Carla.

| | |
|---|---|
| **O que mostrar** | Menu da conta com a Rede Viva Mais. `/vagas` ou a página da empresa. Candidatura da Ana. |
| **Como testar** | Mudar o status da Ana para **entrevista** (opcional). |
| **Esperado** | Recrutador não precisa de “outra conta”; a mesma pessoa cria a página da empresa. |
| **Mínimo** | Entrar como Carla e abrir a empresa. |

### 3.13 Acessibilidade da interface

| | |
|---|---|
| **Onde** | Qualquer página logada ou a home |
| **Como testar** | Toolbar: aumentar fonte, alto contraste, botão de **ouvir** (ícone de alto-falante). VLibras no canto. Tab pelo header. `/sobre-acessibilidade`. |
| **Esperado** | Fonte cresce. Contraste muda. O ouvir lê a página em voz alta; outro clique no texto lê só aquele trecho. Skip-link “Pular para o conteúdo principal” no Tab inicial. |
| **Mínimo** | Um clique no alto-falante da toolbar (a voz começa) + citar VLibras. |

---

## 4. O que não testar na banca

- Criar conta nova (e-mail de teste é bloqueado; Google desligado).
- Prometer e-mail chegando na caixa (Resend não configurado).
- Preencher o questionário da pesquisa na hora (n=14 e n=17 já são a amostra real).
- Inventar link de curso.
- Auditoria Lighthouse/axe (ainda é etapa de QA, não da demo ao vivo).
- Admin `/admin/empresas` — o selo da Rede Viva Mais **já está concedido**.

---

## 5. Se algo falhar

| Sintoma | O que fazer |
|---|---|
| “Load failed” / site sem dados | Banco gratuito pausou. Religar o projeto Supabase `conecta-pcd`. |
| Login recusa a Ana | Conferir e-mail `ana.souza@conectapcd.dev` e senha `Conecta2026` (C maiúsculo). |
| Texto colado no celular | Atualizar a página; o ajuste da fonte já está no ar. |
| Google não entra | Esperado. Usar e-mail e senha da demo. |
| Cadastro com teste@gmail.com | Esperado. Voltar ao login da Ana. |
| Demo vazia depois de religar o banco | Rodar de novo `supabase/seed-demo.sql` (é seguro repetir). |

Backup se a internet cair: este documento + prints + https://conecta-pcd.vercel.app/apresentacao (os slides explicam o produto mesmo sem logar).

---

## 6. Mapa rápido das telas

**Sem login:** `/` `/login` `/cadastro` `/sobre-acessibilidade` `/apresentacao`

**Com a Ana:** `/feed` `/vagas` `/vagas/[id]` `/candidaturas` `/empresas` `/empresas/[id]` `/perfil/editar` `/conexoes` `/mentoria` `/cursos` `/notificacoes`

**Com a Carla (extra):** mesma lista + gestão da empresa e status da candidatura.

Stack, para quem perguntar: Next.js + TypeScript + Tailwind + Supabase + Vercel.
