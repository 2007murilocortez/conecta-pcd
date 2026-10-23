# Notas para o professor — o que o site faz e por quê

Fonte da pesquisa: `14-10_Projeto_Conecta_PCD.docx` (Anexo 1 + Anexo 2).
Site em produção: https://conecta-pcd.vercel.app
Repositório: https://github.com/2007murilocortez/conecta-pcd

Estas notas existem para a parte escrita / apresentação. Não substituem o relatório
oficial (Anexos 1–4 do regulamento). Usar como material de “mais detalhes sobre o site”.

## 1. Como o cronograma do documento virou o produto

| Período no doc | O que o grupo prometeu | O que o site entrega hoje |
|---|---|---|
| Agosto | Tema + questionário | Pesquisa com 14 pessoas e 17 empresários (Anexo 2) |
| Setembro | Aplicar pesquisa e começar o site | Auth, perfil, toolbar, VLibras |
| Outubro | Finalizar o site + parte escrita | Vagas, empresas, networking, cursos, recomendações, notificações |
| Novembro | Banner e apresentação | Ainda falta Sprint 6 (polimento/QA) e o pôster |
| Dezembro | Entrega | Relatório final + vídeo de backup |

## 2. Achados da pesquisa → tela do site

### Lado candidato (n = 14)

| Achado | Número | Onde isso aparece no site |
|---|---|---|
| Dificuldade de achar vaga adequada / poucas vagas PCD | 28,6% / 21,4% | `/vagas` com filtro de acessibilidade em destaque; “Vagas para você” no `/feed` (skills + remoto/mesmo estado) |
| Preconceito ou discriminação | 28,6% | Avaliações anônimas em `/empresas/[id]`; selo `is_verified_inclusive` só o admin concede (não é autodeclaração) |
| Falta de informação sobre acessibilidade | 14,3% | Cada vaga declara recursos (Libras, leitor de tela, intérprete, horário flexível); perfil da empresa lista acessibilidade |
| Libras | 78,6% | Widget VLibras no layout raiz; rodapé explica que é ferramenta oficial do gov.br |
| Leitor de tela | 42,9% | HTML semântico, skip-link, `aria-label` nos ícones, `alt` em imagem de post, `aria-live` nos formulários |
| Aumento de fonte | 42,9% | Toolbar fixa (100–150%) |
| Alto contraste | 14,3% | Toggle na mesma toolbar |
| Comandos por voz | 42,9% | Não implementamos motor próprio; o site é usável com o reconhecimento de voz do SO/leitor (navegação por teclado). Documentar como limitação do MVP |
| Interesse em cursos no app | 92,9% sim/talvez | `/cursos` com 20 cursos oficiais (EVG, MEC, SEBRAE, SENAI, SENAC, FGV, Ifes, Google) |
| Plataformas atuais parciais ou inadequadas | 42,9% + 21,4% | Proposta do produto inteiro: rede + vaga + acessibilidade no mesmo lugar |

### Lado empresa (n = 17)

| Achado | Número | Onde isso aparece no site |
|---|---|---|
| Falta de informação sobre inclusão | 41,2% | Página da empresa + recursos da vaga + `/sobre-acessibilidade` (LBI e Lei de Cotas) |
| Adaptação do espaço físico | 35,3% | Campo de recursos de acessibilidade na vaga e no perfil da empresa |
| Qualificação e adequação ao perfil | 47,1% / 35,3% | Perfil com formação, experiência, skills e cursos concluídos; recomendação cruza skill com requisito da vaga |

Leis citadas no relatório (e no site): Lei 8.213/1991 (Cotas) e Lei 13.146/2015 (LBI). IBGE 2022/2023: ocupação 26,6% vs 60,7%; 55% na informalidade.

## 3. Mapa das telas (para o professor “ver o site”)

Público (sem login): `/`, `/login`, `/cadastro`, `/sobre-acessibilidade`.
Logado (dashboard):

- `/feed` — posts das conexões + vagas/cursos recomendados
- `/vagas` e `/vagas/[id]` — busca, filtro de acessibilidade, candidatura
- `/candidaturas` — status do candidato; empresa muda status
- `/empresas`, `/empresas/nova`, `/empresas/[id]`, `/empresas/[id]/equipe`
- `/perfil/editar` e `/perfil/[id]` — perfil via `profiles_public` (deficiência só se a pessoa autorizar)
- `/conexoes`, `/mentoria`, `/cursos`, `/notificacoes`
- `/admin/empresas` — selo de empresa inclusiva (só admin)

Stack: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + Supabase (Postgres, Auth, Storage, RLS) + Resend (e-mail só de alto valor) + Vercel.

## 4. O que ainda falta para “site pronto de demo” (Sprint 6)

- Checklist WCAG 2.1 AA em toda tela + prints Lighthouse/axe ≥ 90
- Seed grande (empresas, vagas, avaliações) para a demo não parecer vazia
- Revisão mobile (a pesquisa aponta uso de celular)
- Aplicar as duas migrations de policy que ainda podem faltar no banco (conexão/imagem do feed; cursos concluídos públicos; notificação de mentoria)
- `NEXT_PUBLIC_SITE_URL` e callback do Supabase em produção
- Parte escrita extra que o professor pediu: usar este arquivo + prints das telas
- Novembro: banner/pôster (Anexo 3) e apresentação
- Dezembro: Anexos 2–4 oficiais + vídeo de backup

## 5. O que não vamos inventar no relatório

Não incluir respostas de questionário geradas por IA. Os n=14 e n=17 do Anexo 2 são a amostra real.
