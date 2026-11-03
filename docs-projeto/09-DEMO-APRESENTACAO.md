# Demo da apresentação — contas prontas

Site: https://conecta-pcd.vercel.app
Login: https://conecta-pcd.vercel.app/login

Na banca **não criar conta**. As pessoas já existem, com perfil, vaga, empresa, conexão, curso e mentoria. Se o cadastro público falhar (e-mail de teste bloqueado ou banco pausado), a demonstração continua.

Senha de todas: `Conecta2026`

| Quem entra | E-mail | O que mostrar |
|---|---|---|
| Ana Souza (começar por ela) | `ana.souza@conectapcd.dev` | Candidata com perfil completo |
| Carla Mendes | `carla.mendes@conectapcd.dev` | Recrutadora / dona da Inclusiva Tech |
| Paulo Ribeiro | `paulo.ribeiro@conectapcd.dev` | Mentor (só se sobrar tempo) |

Bruno Costa existe só para deixar um **pedido de conexão pendente** na conta da Ana. Não precisa entrar com ele.

## Roteiro de 8–10 minutos (logado como Ana)

1. **Landing** (`/`) — o que é o produto + 26,6% IBGE. Toolbar (fonte / contraste) e VLibras no canto.
2. **Entrar** — e-mail da Ana + senha. Não passar por cadastro.
3. **Feed** — caixa de publicar no topo (modelos: conquista, busco vaga, dica). Posts da Ana, do Paulo e da Carla já estão na rede.
4. **Vagas** — filtro de acessibilidade (Libras, leitor de tela). Abrir *Pessoa desenvolvedora front-end*.
5. **Candidaturas** — a da Ana já está *em análise*.
6. **Empresas** — Inclusiva Tech tem selo (admin concedeu; não é autodeclaração). Avaliação da Ana na página.
7. **Conexões** — Paulo e Carla aceitos; Bruno pendente (dá para aceitar ao vivo).
8. **Mentoria** — relação Ana ↔ Paulo já ativa.
9. **Cursos** — EVG / MEC / SEBRAE reais; Ana tem um concluído e um em andamento.
10. **Sino** — notificação da candidatura e do pedido do Bruno.
11. **Sair e entrar como Carla** (se der tempo) — menu da empresa, vaga publicada, mudar status da Ana.

Acessibilidade: skip-link, teclado, VLibras, `/sobre-acessibilidade` (LBI e Cotas).

## O que não fazer na hora

- Não usar `teste@gmail.com` — o Auth bloqueia e-mail de teste.
- Não depender do Google (provedor desligado).
- Não inventar URL de curso; os 20 do seed são oficiais.
- Não preencher questionário de pesquisa na hora; n=14 e n=17 já estão no relatório.

## Se o site “não entra”

O banco gratuito do Supabase pausa. Religar o projeto `conecta-pcd` e, se a base voltar vazia, rodar `supabase/seed-demo.sql` de novo (é idempotente).
