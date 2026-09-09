# Conecta PCD — Visão Geral

> Rede social profissional gratuita para pessoas com deficiência (PCDs), inspirada no LinkedIn.
> Projeto de extensão acadêmica com ambição de virar produto real.

## 1. Problema

- 18,6 milhões de brasileiros declaram ter alguma deficiência (Censo 2022, IBGE), mas a taxa de ocupação desse grupo é de **29,9%** contra **60,7%** das pessoas sem deficiência.
- 55% das PCDs ocupadas estão na informalidade.
- Empresas com 100+ funcionários são obrigadas por lei (Lei 8.213/91) a reservar vagas para PCDs, mas enfrentam dificuldade em **encontrar candidatos qualificados** — e candidatos enfrentam dificuldade em **encontrar vagas realmente acessíveis** e confiar que a empresa é inclusiva de fato, não só no papel.
- Plataformas genéricas (LinkedIn, Catho, Indeed) não filtram por recursos de acessibilidade, não mostram o compromisso real da empresa com inclusão, e não têm comunidade de apoio entre PCDs.

## 2. Solução

Uma plataforma que resolve as duas pontas do mercado:

- **Para o candidato PCD:** perfil profissional completo, vagas filtráveis por tipo de acessibilidade oferecida, rede de contatos com outros profissionais PCDs, mentoria, cursos, e visibilidade real sobre como é trabalhar em cada empresa (via avaliações de outros PCDs).
- **Para a empresa:** um canal direto com talentos PCDs qualificados, um selo de "empresa inclusiva" que precisa ser conquistado (não autodeclarado), e ferramentas de publicação de vaga acessíveis desde o desenho.

## 3. Personas

| Persona | Objetivo principal | Dor atual |
|---|---|---|
| **Candidato PCD** (ex: pessoa surda, 24 anos, buscando 1º emprego em TI) | Encontrar vaga compatível com formação e necessidades de acessibilidade | Não sabe se a empresa vai realmente adaptar o processo seletivo |
| **Empresa inclusiva** (ex: RH de uma fintech com cota a cumprir) | Achar candidatos qualificados e cumprir a Lei de Cotas sem "cota de fachada" | Poucos candidatos se candidatam; dificuldade em achar talento PCD |
| **Mentor PCD** (profissional PCD sênior) | Ajudar outros PCDs a entrar no mercado | Não tem canal formal pra isso hoje |
| **Admin da plataforma** (vocês) | Validar selo de empresa inclusiva, moderar conteúdo | — |

## 4. Módulos do produto (visão completa)

1. **Autenticação e Perfil Profissional** — cadastro, edição de perfil, formação, experiências, habilidades, preferências de acessibilidade.
2. **Vagas (Oportunidades)** — publicação, busca, filtro por acessibilidade, candidatura, acompanhamento de status.
3. **Empresas Inclusivas** — perfil de empresa, selo de inclusão, avaliações por PCDs.
4. **Networking** — conexões entre profissionais, feed, mentoria.
5. **Capacitação** — cursos e trilhas dentro do app.
6. **Recomendações Personalizadas** — vagas e cursos sugeridos por perfil (regra de negócio simples no MVP, espaço para IA depois).
7. **Acessibilidade da própria plataforma** — alto contraste, fonte ajustável, leitor de tela otimizado, Libras (VLibras), navegação 100% por teclado.

## 5. Objetivos para a entrega de dezembro

- [ ] Produto funcional em produção (Vercel), com cadastro real via Supabase Auth.
- [ ] Os 7 módulos acima implementados, mesmo que com profundidade variável (ver roadmap em `06-ROADMAP-SPRINTS.md`).
- [ ] Nota de acessibilidade real (auditoria Lighthouse/axe ≥ 90) — é o maior diferencial de nota, porque conecta diretamente com a pesquisa teórica já entregue (Lei de Cotas, LBI, comunicação, capacitismo).
- [ ] Dados de verdade: pelo menos o questionário respondido por uma amostra real deve embasar decisões de produto documentadas.

## 6. Fora de escopo (por ora)

- Pagamentos / monetização.
- App mobile nativo (o site será responsivo e instalável como PWA).
- Chat em tempo real avançado (fica como mensageria simples via notificação, não WebSocket full duplex, no MVP).
- Verificação de identidade com documento (fica no roadmap pós-dezembro).

## 7. Referências que embasam decisões de produto

Este documento de visão se apoia na pesquisa já produzida no projeto (`Pesquisa_Inclusao_PCD_Mercado_Trabalho.docx`): Lei 8.213/91, Lei 13.146/2015 (LBI), diretrizes de comunicação inclusiva do Senado/Câmara, e o guia "Incluir" da OIT/MPT. Toda feature relacionada a linguagem, avaliação de empresa e capacitismo deve ser coerente com esse material.
