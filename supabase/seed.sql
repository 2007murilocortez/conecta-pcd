-- Cursos curados (Sprint 5). URLs conferidas em 2026-09-10.
-- Se a página específica do curso não existia ou não respondia, usei
-- a home do catálogo oficial da instituição — nunca uma URL inventada.
-- Reexecutar é seguro: ids fixos + on conflict.

insert into public.courses (
  id, title, provider, url, category, description, is_free, accessibility_features
) values
  (
    'c0000000-0000-4000-8000-000000000001',
    'Introdução à Libras',
    'Escola Virtual do Governo (Enap)',
    'https://www.escolavirtual.gov.br/curso/11',
    'Acessibilidade e Comunicação',
    'Carga horária: 60h. Cultura surda, legislação da Libras e prática do alfabeto manual, pronomes, expressões faciais e vocabulário do cotidiano. Curso aberto, gratuito e com certificado.',
    true,
    array['libras', 'certificado']
  ),
  (
    'c0000000-0000-4000-8000-000000000002',
    'Catálogo da Escola Virtual do Governo',
    'Escola Virtual do Governo (Enap)',
    'https://www.escolavirtual.gov.br',
    'Gestão e Tecnologia',
    'Portal oficial da EV.G com cursos gratuitos de gestão pública, dados, transformação digital e inclusão. Use o catálogo para escolher a trilha.',
    true,
    array['certificado']
  ),
  (
    'c0000000-0000-4000-8000-000000000003',
    'Catálogo Aprenda Mais (MEC)',
    'Aprenda Mais / MEC',
    'https://aprendamais.mec.gov.br',
    'Educação Profissional',
    'Cursos on-line, abertos e gratuitos do Ministério da Educação, com certificação. Autoinstrucionais, sem tutoria, abertos a qualquer pessoa.',
    true,
    array['certificado']
  ),
  (
    'c0000000-0000-4000-8000-000000000004',
    'Cursos Grow with Google (Ateliê Digital)',
    'Google',
    'https://grow.google/intl/pt/courses-and-tools/',
    'Tecnologia',
    'Catálogo oficial do Grow with Google — sucessor do Ateliê Digital / Digital Garage. Marketing digital, dados, cloud, IA e certificados profissionais.',
    true,
    array['certificado']
  ),
  (
    'c0000000-0000-4000-8000-000000000005',
    'Acessibilidade na Comunicação',
    'Escola Virtual do Governo (Enap)',
    'https://www.escolavirtual.gov.br/curso/615',
    'Acessibilidade e Comunicação',
    'Carga horária: 30h. Conceito biopsicossocial, legislação e técnicas de comunicação acessível (Libras, audiodescrição, Braille). Aberto ao público.',
    true,
    array['libras', 'audiodescricao', 'certificado']
  ),
  (
    'c0000000-0000-4000-8000-000000000006',
    'Introdução à Audiodescrição',
    'Escola Virtual do Governo (Enap)',
    'https://www.escolavirtual.gov.br/curso/320',
    'Acessibilidade e Comunicação',
    'Carga horária: 40h. Fundamentos da audiodescrição em sites, cultura, livros e comunicação acessível. Aberto, gratuito e com certificado.',
    true,
    array['audiodescricao', 'certificado']
  ),
  (
    'c0000000-0000-4000-8000-000000000007',
    'O conceito contemporâneo da deficiência e o modelo biopsicossocial',
    'Escola Virtual do Governo (Enap)',
    'https://www.escolavirtual.gov.br/curso/1191',
    'Inclusão no Trabalho',
    'Carga horária: 30h. História e modelos de deficiência, direitos humanos e avaliação biopsicossocial. Aberto ao público.',
    true,
    array['certificado']
  ),
  (
    'c0000000-0000-4000-8000-000000000008',
    'Desenvolvimento de gestores em políticas para pessoas com deficiência',
    'Escola Virtual do Governo (Enap)',
    'https://www.escolavirtual.gov.br/curso/1369',
    'Inclusão no Trabalho',
    'Carga horária: 30h. Direitos, legislação, eliminação de barreiras e gestão de políticas de inclusão. Conteudista: SNDPD / MDHC.',
    true,
    array['certificado']
  ),
  (
    'c0000000-0000-4000-8000-000000000009',
    'Seleção, Contratação e Inclusão de Pessoas com Deficiência no Mundo do Trabalho',
    'Escola Virtual do Governo (Enap)',
    'https://www.escolavirtual.gov.br/curso/1188',
    'Inclusão no Trabalho',
    'Carga horária: 30h. Empregabilidade, normas legais, acessibilidade do processo seletivo ao ambiente de trabalho e apoio governamental.',
    true,
    array['certificado']
  ),
  (
    'c0000000-0000-4000-8000-00000000000a',
    'Diversidade e inclusão no ambiente de trabalho',
    'Escola Virtual do Governo (Enap)',
    'https://www.escolavirtual.gov.br/curso/1336',
    'Inclusão no Trabalho',
    'Carga horária: 20h. DEI nas organizações, políticas públicas de gestão de pessoas e RH inclusivo. Aberto, gratuito e com certificado.',
    true,
    array['certificado']
  ),
  (
    'c0000000-0000-4000-8000-00000000000b',
    'Diversidade e Inclusão: Uma Introdução',
    'Escola Virtual do Governo (Enap)',
    'https://www.escolavirtual.gov.br/curso/1289',
    'Inclusão no Trabalho',
    'Carga horária: 2h. Introdução a diversidade, equidade e inclusão. Conteudista: IBEGESP.',
    true,
    array['certificado']
  ),
  (
    'c0000000-0000-4000-8000-00000000000c',
    'eMAG Conteudista — conteúdos web acessíveis',
    'Escola Virtual do Governo (Enap)',
    'https://www.escolavirtual.gov.br/curso/41',
    'Acessibilidade e Comunicação',
    'Diretrizes do eMAG para conteúdos web acessíveis: tipos de deficiência, tecnologias assistivas e avaliação de acessibilidade.',
    true,
    array['leitor_de_tela', 'certificado']
  ),
  (
    'c0000000-0000-4000-8000-00000000000d',
    'SEI! Usar para Deficientes Visuais',
    'Escola Virtual do Governo (Enap)',
    'https://www.escolavirtual.gov.br/curso/545',
    'Acessibilidade e Comunicação',
    'Carga horária: 20h. Operar o SEI com foco em acessibilidade para pessoas com deficiência visual. Aberto e com certificado.',
    true,
    array['leitor_de_tela', 'certificado']
  ),
  (
    'c0000000-0000-4000-8000-00000000000e',
    'Cursos EAD do SEBRAE',
    'SEBRAE',
    'https://sebrae.com.br/sites/PortalSebrae/cursosonline',
    'Empreendedorismo',
    'Catálogo oficial de capacitações online do SEBRAE (finanças, marketing, vendas e atendimento inclusivo). Maioria gratuita, com certificado.',
    true,
    array['certificado']
  ),
  (
    'c0000000-0000-4000-8000-00000000000f',
    'Catálogo SENAC EAD',
    'SENAC',
    'https://www.ead.senac.br/',
    'Educação Profissional',
    'Portal oficial do SENAC EAD: cursos livres, técnicos, graduação, pós e extensão a distância.',
    false,
    '{}'::text[]
  ),
  (
    'c0000000-0000-4000-8000-000000000010',
    'Cursos do SENAI',
    'SENAI',
    'https://www.senai.portaldaindustria.com.br/para-voce/estude-aqui-no-senai',
    'Educação Profissional',
    'Catálogo oficial do SENAI no Portal da Indústria: cursos profissionais, EAD e certificações para a indústria.',
    false,
    '{}'::text[]
  ),
  (
    'c0000000-0000-4000-8000-000000000011',
    'Cursos gratuitos da FGV Educação Executiva',
    'FGV Online',
    'https://educacao-executiva.fgv.br/Cursos/Gratuitos/1000',
    'Gestão e Tecnologia',
    'Catálogo oficial de cursos online gratuitos da FGV (administração, dados, direito, educação e negócios), com declaração de conclusão.',
    true,
    array['certificado']
  ),
  (
    'c0000000-0000-4000-8000-000000000012',
    'Catálogo de cursos do Ifes',
    'Instituto Federal do Espírito Santo (Ifes)',
    'https://www.ifes.edu.br/cursos',
    'Educação Profissional',
    'Oferta oficial do Ifes: qualificação, técnico, graduação, pós e MOOCs abertos do Cefor, inclusive a distância.',
    true,
    '{}'::text[]
  ),
  (
    'c0000000-0000-4000-8000-000000000013',
    'Google Skills (Cloud Skills Boost)',
    'Google',
    'https://www.cloudskillsboost.google/',
    'Tecnologia',
    'Plataforma oficial de aprendizagem do Google Cloud / Google Skills: laboratórios, skill badges e certificações em nuvem e IA.',
    true,
    array['certificado']
  ),
  (
    'c0000000-0000-4000-8000-000000000014',
    'Inclusão social e laboral das pessoas com deficiência intelectual ou TEA',
    'Escola Virtual do Governo (Enap)',
    'https://www.escolavirtual.gov.br/curso/1351',
    'Inclusão no Trabalho',
    'Emprego apoiado e inclusão profissional de pessoas com deficiência intelectual ou transtorno do espectro autista. Aberto e com certificado.',
    true,
    array['certificado']
  )
on conflict (id) do update set
  title = excluded.title,
  provider = excluded.provider,
  url = excluded.url,
  category = excluded.category,
  description = excluded.description,
  is_free = excluded.is_free,
  accessibility_features = excluded.accessibility_features;
