-- Contas e dados da apresentação. Reexecutar é seguro (ids fixos).
-- Senha de todas as contas: Conecta2026

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- Auth: cria ou confirma o usuário (o trigger handle_new_user monta o profile)
-- ---------------------------------------------------------------------------
create or replace function public.seed_demo_auth_user(
  p_id uuid,
  p_email text,
  p_password text,
  p_full_name text
) returns void
language plpgsql
security definer
set search_path = auth, extensions, public
as $$
begin
  if exists (select 1 from auth.users where id = p_id) then
    update auth.users
    set
      email = p_email,
      encrypted_password = extensions.crypt(p_password, extensions.gen_salt('bf')),
      email_confirmed_at = coalesce(email_confirmed_at, now()),
      raw_app_meta_data = '{"provider":"email","providers":["email"]}'::jsonb,
      raw_user_meta_data = jsonb_build_object('full_name', p_full_name),
      updated_at = now()
    where id = p_id;
  elsif exists (select 1 from auth.users where email = p_email) then
    raise exception 'E-mail % já existe com outro id', p_email;
  else
    insert into auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) values (
      '00000000-0000-0000-0000-000000000000',
      p_id,
      'authenticated',
      'authenticated',
      p_email,
      extensions.crypt(p_password, extensions.gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('full_name', p_full_name),
      now(),
      now(),
      '',
      '',
      '',
      ''
    );

  end if;

  if not exists (
    select 1 from auth.identities where user_id = p_id and provider = 'email'
  ) then
    insert into auth.identities (
      id,
      provider_id,
      user_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) values (
      gen_random_uuid(),
      p_id::text,
      p_id,
      jsonb_build_object(
        'sub', p_id::text,
        'email', p_email,
        'email_verified', true
      ),
      'email',
      now(),
      now(),
      now()
    );
  end if;
end;
$$;

revoke all on function public.seed_demo_auth_user(uuid, text, text, text) from public;
revoke all on function public.seed_demo_auth_user(uuid, text, text, text) from anon;
revoke all on function public.seed_demo_auth_user(uuid, text, text, text) from authenticated;

select public.seed_demo_auth_user(
  'a1111111-1111-4111-8111-111111111111',
  'ana.souza@conectapcd.dev',
  'Conecta2026',
  'Ana Souza'
);
select public.seed_demo_auth_user(
  'a2222222-2222-4222-8222-222222222222',
  'carla.mendes@conectapcd.dev',
  'Conecta2026',
  'Carla Mendes'
);
select public.seed_demo_auth_user(
  'a3333333-3333-4333-8333-333333333333',
  'paulo.ribeiro@conectapcd.dev',
  'Conecta2026',
  'Paulo Ribeiro'
);
select public.seed_demo_auth_user(
  'a4444444-4444-4444-8444-444444444444',
  'bruno.costa@conectapcd.dev',
  'Conecta2026',
  'Bruno Costa'
);

-- Perfis, empresas e vagas da demo: cargos comuns no mercado PcD
-- (administrativo, atendimento, caixa, recepção, estoque, digitação).
-- ---------------------------------------------------------------------------
-- Perfis (headline precisa existir senão o middleware manda de volta ao onboarding)
-- ---------------------------------------------------------------------------
update public.profiles
set
  full_name = 'Ana Souza',
  headline = 'Auxiliar administrativa',
  bio = 'Busco vaga administrativa com leitor de tela e horário flexível. Tenho prática com planilha, atendimento ao público e organização de documentos.',
  location_city = 'São Paulo',
  location_state = 'SP',
  discloses_disability = true,
  disability_types = array['visual'],
  accessibility_needs = array['leitor_de_tela', 'horario_flexivel'],
  open_to_work = true,
  open_to_mentor = false,
  role = 'admin'
where id = 'a1111111-1111-4111-8111-111111111111';

update public.profiles
set
  full_name = 'Carla Mendes',
  headline = 'Recrutadora de inclusão',
  bio = 'Publico vagas de administrativo, atendimento e operação com os recursos de acessibilidade escritos na descrição — não é texto genérico.',
  location_city = 'Campinas',
  location_state = 'SP',
  discloses_disability = false,
  disability_types = '{}',
  accessibility_needs = '{}',
  open_to_work = false,
  open_to_mentor = false,
  role = 'usuario'
where id = 'a2222222-2222-4222-8222-222222222222';

update public.profiles
set
  full_name = 'Paulo Ribeiro',
  headline = 'Coordenador administrativo e mentor',
  bio = 'Disponível para mentoria sobre primeiro emprego, rotina de escritório e adaptação do ambiente de trabalho.',
  location_city = 'Belo Horizonte',
  location_state = 'MG',
  discloses_disability = true,
  disability_types = array['auditiva'],
  accessibility_needs = array['libras', 'interprete_entrevista'],
  open_to_work = false,
  open_to_mentor = true,
  role = 'usuario'
where id = 'a3333333-3333-4333-8333-333333333333';

update public.profiles
set
  full_name = 'Bruno Costa',
  headline = 'Auxiliar de estoque',
  bio = 'Quero conectar com outras pessoas da área e acompanhar vagas de estoque ou caixa com horário flexível.',
  location_city = 'Recife',
  location_state = 'PE',
  discloses_disability = true,
  disability_types = array['fisica'],
  accessibility_needs = array['horario_flexivel'],
  open_to_work = true,
  open_to_mentor = false,
  role = 'usuario'
where id = 'a4444444-4444-4444-8444-444444444444';

insert into public.educations (
  id, profile_id, institution, course, level, start_date, end_date, is_current
) values
  (
    'e1111111-1111-4111-8111-111111111111',
    'a1111111-1111-4111-8111-111111111111',
    'ETEC São Paulo',
    'Técnico em Administração',
    'Técnico',
    '2020-02-01',
    '2022-12-15',
    false
  ),
  (
    'e3333333-3333-4333-8333-333333333333',
    'a3333333-3333-4333-8333-333333333333',
    'UFMG',
    'Administração',
    'Graduação',
    '2014-02-01',
    '2018-12-15',
    false
  )
on conflict (id) do update
set institution = excluded.institution, course = excluded.course, level = excluded.level;

insert into public.experiences (
  id, profile_id, company_name, role_title, description, start_date, end_date, is_current
) values
  (
    'd1111111-1111-4111-8111-111111111111',
    'a1111111-1111-4111-8111-111111111111',
    'Escritório São Lucas',
    'Auxiliar administrativa',
    'Atendimento ao público, organização de documentos e planilha. Trabalho com leitor de tela.',
    '2024-01-10',
    null,
    true
  ),
  (
    'd2222222-2222-4222-8222-222222222222',
    'a2222222-2222-4222-8222-222222222222',
    'Rede Viva Mais',
    'Pessoa recrutadora',
    'Processo seletivo com intérprete e vaga descrita com acessibilidade.',
    '2022-03-01',
    null,
    true
  ),
  (
    'd3333333-3333-4333-8333-333333333333',
    'a3333333-3333-4333-8333-333333333333',
    'Prefeitura de Belo Horizonte',
    'Coordenador administrativo',
    'Rotina de escritório, equipe administrativa e adaptação do posto de trabalho.',
    '2019-03-01',
    null,
    true
  )
on conflict (id) do update
set company_name = excluded.company_name, role_title = excluded.role_title, description = excluded.description;

insert into public.skills (id, name) values
  ('b0000000-0000-4000-8000-000000000001', 'Excel'),
  ('b0000000-0000-4000-8000-000000000002', 'Atendimento'),
  ('b0000000-0000-4000-8000-000000000003', 'Organização'),
  ('b0000000-0000-4000-8000-000000000004', 'Comunicação escrita'),
  ('b0000000-0000-4000-8000-000000000005', 'Recrutamento'),
  ('b0000000-0000-4000-8000-000000000006', 'Mentoria'),
  ('b0000000-0000-4000-8000-000000000007', 'Operação de caixa'),
  ('b0000000-0000-4000-8000-000000000008', 'Estoque'),
  ('b0000000-0000-4000-8000-000000000009', 'Digitação')
on conflict (id) do update set name = excluded.name;

delete from public.profile_skills
where profile_id in (
  'a1111111-1111-4111-8111-111111111111',
  'a2222222-2222-4222-8222-222222222222',
  'a3333333-3333-4333-8333-333333333333',
  'a4444444-4444-4444-8444-444444444444'
);

insert into public.profile_skills (profile_id, skill_id) values
  ('a1111111-1111-4111-8111-111111111111', 'b0000000-0000-4000-8000-000000000001'),
  ('a1111111-1111-4111-8111-111111111111', 'b0000000-0000-4000-8000-000000000002'),
  ('a1111111-1111-4111-8111-111111111111', 'b0000000-0000-4000-8000-000000000003'),
  ('a1111111-1111-4111-8111-111111111111', 'b0000000-0000-4000-8000-000000000004'),
  ('a2222222-2222-4222-8222-222222222222', 'b0000000-0000-4000-8000-000000000002'),
  ('a2222222-2222-4222-8222-222222222222', 'b0000000-0000-4000-8000-000000000005'),
  ('a3333333-3333-4333-8333-333333333333', 'b0000000-0000-4000-8000-000000000002'),
  ('a3333333-3333-4333-8333-333333333333', 'b0000000-0000-4000-8000-000000000006'),
  ('a4444444-4444-4444-8444-444444444444', 'b0000000-0000-4000-8000-000000000003'),
  ('a4444444-4444-4444-8444-444444444444', 'b0000000-0000-4000-8000-000000000008')
on conflict do nothing;

insert into public.companies (
  id, name, description, sector, size, created_by, is_verified_inclusive, accessibility_features
) values
  (
    'c1111111-1111-4111-8111-111111111111',
    'Rede Viva Mais',
    'Rede de supermercados. Descreve o recurso de acessibilidade em cada vaga (leitor de tela, horário flexível, intérprete na entrevista).',
    'Varejo',
    '201-1000',
    'a2222222-2222-4222-8222-222222222222',
    true,
    array['leitor_de_tela', 'libras', 'horario_flexivel', 'interprete_entrevista']
  ),
  (
    'c2222222-2222-4222-8222-222222222222',
    'Central de Atendimento Norte',
    'Operação de teleatendimento. Ainda sem selo de empresa inclusiva — serve para contrastar com a Rede Viva Mais.',
    'Serviços',
    '201-1000',
    'a2222222-2222-4222-8222-222222222222',
    false,
    array['horario_flexivel']
  ),
  (
    'c3333333-3333-4333-8333-333333333333',
    'Clínica Horizonte',
    'Clínica de especialidades. Recepção e apoio administrativo com intérprete de Libras na entrevista.',
    'Saúde',
    '51-200',
    'a2222222-2222-4222-8222-222222222222',
    false,
    array['libras', 'interprete_entrevista', 'horario_flexivel']
  )
on conflict (id) do update
set
  name = excluded.name,
  description = excluded.description,
  sector = excluded.sector,
  size = excluded.size,
  is_verified_inclusive = excluded.is_verified_inclusive,
  accessibility_features = excluded.accessibility_features;

insert into public.company_members (id, company_id, profile_id, member_role, show_pcd_badge) values
  (
    'aa222222-2222-4222-8222-222222222222',
    'c1111111-1111-4111-8111-111111111111',
    'a2222222-2222-4222-8222-222222222222',
    'dono',
    false
  ),
  (
    'aa222aaa-2222-4222-8222-222222222222',
    'c2222222-2222-4222-8222-222222222222',
    'a2222222-2222-4222-8222-222222222222',
    'dono',
    false
  ),
  (
    'aa333aaa-3333-4333-8333-333333333333',
    'c3333333-3333-4333-8333-333333333333',
    'a2222222-2222-4222-8222-222222222222',
    'dono',
    false
  )
on conflict (id) do nothing;

insert into public.jobs (
  id, company_id, posted_by, title, description, requirements, type, work_mode,
  location_city, location_state, salary_min, salary_max, salary_visible, status,
  accessibility_resources
) values
  (
    '11111111-1111-4111-8111-111111111111',
    'c1111111-1111-4111-8111-111111111111',
    'a2222222-2222-4222-8222-222222222222',
    'Auxiliar administrativo',
    'Rotina de escritório na sede: organização de documentos, planilha, atendimento interno e apoio à equipe. O processo seletivo descreve leitor de tela de verdade e horário flexível. Modalidade híbrida em São Paulo.',
    'Excel, organização e comunicação escrita. Experiência com atendimento é um plus.',
    'CLT',
    'hibrido',
    'São Paulo',
    'SP',
    1800,
    2400,
    true,
    'aberta',
    array['leitor_de_tela', 'horario_flexivel']
  ),
  (
    '12222222-2222-4222-8222-222222222222',
    'c2222222-2222-4222-8222-222222222222',
    'a2222222-2222-4222-8222-222222222222',
    'Pessoa atendente de teleatendimento',
    'Atendimento a clientes por telefone e chat, com horário flexível e intérprete de Libras na entrevista.',
    'Atendimento, comunicação escrita e boa dicção. Experiência com SAC é um plus.',
    'CLT',
    'hibrido',
    'Campinas',
    'SP',
    1800,
    2300,
    true,
    'aberta',
    array['interprete_entrevista', 'horario_flexivel', 'libras']
  ),
  (
    '13333333-3333-4333-8333-333333333333',
    'c1111111-1111-4111-8111-111111111111',
    'a2222222-2222-4222-8222-222222222222',
    'Operador de caixa',
    'Frente de loja em supermercado. Posto com espaço para cadeira de rodas, pausas combinadas e horário flexível. Treinamento no sistema de caixa no primeiro mês.',
    'Operação de caixa, atendimento ao público e organização. Experiência em varejo é um plus.',
    'CLT',
    'presencial',
    'São Paulo',
    'SP',
    1600,
    2000,
    true,
    'aberta',
    array['horario_flexivel']
  ),
  (
    '14444444-4444-4444-8444-444444444444',
    'c3333333-3333-4333-8333-333333333333',
    'a2222222-2222-4222-8222-222222222222',
    'Recepcionista',
    'Recepção da clínica: acolher pacientes, agendar consultas e orientar o fluxo da recepção. Entrevista com intérprete de Libras, se precisar.',
    'Atendimento, organização e comunicação escrita. Noções de agenda são um plus.',
    'CLT',
    'presencial',
    'São Paulo',
    'SP',
    1700,
    2200,
    true,
    'aberta',
    array['libras', 'interprete_entrevista']
  ),
  (
    '15555555-5555-4555-8555-555555555555',
    'c1111111-1111-4111-8111-111111111111',
    'a2222222-2222-4222-8222-222222222222',
    'Auxiliar de estoque',
    'Conferência de mercadoria, organização de prateleira e apoio à reposição. Corredor largo, posto sentado quando necessário e horário flexível.',
    'Estoque, organização e atenção a conferência. Experiência em supermercado ou depósito é um plus.',
    'CLT',
    'presencial',
    'São Paulo',
    'SP',
    1600,
    2100,
    true,
    'aberta',
    array['horario_flexivel']
  ),
  (
    '16666666-6666-4666-8666-666666666666',
    'c2222222-2222-4222-8222-222222222222',
    'a2222222-2222-4222-8222-222222222222',
    'Digitador',
    'Digitação de cadastros e lançamento em planilha, em home office. Sistema compatível com leitor de tela e alto contraste.',
    'Digitação, Excel e comunicação escrita. Boa pontuação em digitação é um plus.',
    'CLT',
    'remoto',
    null,
    null,
    1700,
    2200,
    true,
    'aberta',
    array['leitor_de_tela', 'alto_contraste']
  )
on conflict (id) do update
set
  company_id = excluded.company_id,
  posted_by = excluded.posted_by,
  title = excluded.title,
  description = excluded.description,
  requirements = excluded.requirements,
  type = excluded.type,
  work_mode = excluded.work_mode,
  location_city = excluded.location_city,
  location_state = excluded.location_state,
  salary_min = excluded.salary_min,
  salary_max = excluded.salary_max,
  salary_visible = excluded.salary_visible,
  status = 'aberta',
  accessibility_resources = excluded.accessibility_resources;

insert into public.applications (id, job_id, profile_id, cover_letter, status) values
  (
    'aa111111-1111-4111-8111-111111111111',
    '11111111-1111-4111-8111-111111111111',
    'a1111111-1111-4111-8111-111111111111',
    'Tenho prática com Excel, atendimento e organização de documentos. Trabalho com leitor de tela e gostaria de seguir no processo.',
    'em_analise'
  )
on conflict (id) do update
set
  job_id = excluded.job_id,
  cover_letter = excluded.cover_letter,
  status = excluded.status;

insert into public.company_reviews (
  id, company_id, profile_id, rating, accessibility_rating, comment, is_anonymous
) values
  (
    'ab111111-1111-4111-8111-111111111111',
    'c1111111-1111-4111-8111-111111111111',
    'a1111111-1111-4111-8111-111111111111',
    5,
    5,
    'A vaga de auxiliar administrativo descrevia leitor de tela de verdade, não só um selo genérico.',
    false
  )
on conflict (id) do update set comment = excluded.comment;

insert into public.connections (id, requester_id, addressee_id, status) values
  (
    'ac111111-1111-4111-8111-111111111111',
    'a1111111-1111-4111-8111-111111111111',
    'a3333333-3333-4333-8333-333333333333',
    'aceita'
  ),
  (
    'ac222222-2222-4222-8222-222222222222',
    'a1111111-1111-4111-8111-111111111111',
    'a2222222-2222-4222-8222-222222222222',
    'aceita'
  ),
  (
    'ac444444-4444-4444-8444-444444444444',
    'a4444444-4444-4444-8444-444444444444',
    'a1111111-1111-4111-8111-111111111111',
    'pendente'
  )
on conflict (id) do update set status = excluded.status;

insert into public.mentorships (id, mentor_id, mentee_id, message, status) values
  (
    'ad111111-1111-4111-8111-111111111111',
    'a3333333-3333-4333-8333-333333333333',
    'a1111111-1111-4111-8111-111111111111',
    'Quero conversar sobre carreira remota e adaptação do ambiente.',
    'ativa'
  )
on conflict (id) do update set status = excluded.status;

insert into public.posts (id, profile_id, content, created_at) values
  (
    'f3333333-3333-4333-8333-333333333333',
    'a3333333-3333-4333-8333-333333333333',
    'Abri agenda de mentoria para quem está buscando o primeiro emprego — administrativo, atendimento, caixa — com acessibilidade de verdade.',
    now() - interval '2 days'
  ),
  (
    'f1111111-1111-4111-8111-111111111111',
    'a1111111-1111-4111-8111-111111111111',
    'Concluí o curso de Acessibilidade na Comunicação da EVG. Recomendo para quem for entrevistar ou publicar vaga.',
    now() - interval '1 day'
  ),
  (
    'f2222222-2222-4222-8222-222222222222',
    'a2222222-2222-4222-8222-222222222222',
    'Abrimos vaga de auxiliar administrativo: processo com leitor de tela e horário flexível. Também tem caixa, estoque e recepção. A acessibilidade vai na descrição, não só no discurso.',
    now() - interval '3 hours'
  ),
  (
    'f4444444-4444-4444-8444-444444444444',
    'a4444444-4444-4444-8444-444444444444',
    'Procuro vaga de estoque ou caixa com horário flexível. Quem da rede já passou por processo seletivo que descrevia acessibilidade de verdade?',
    now() - interval '5 hours'
  ),
  (
    'f5555555-5555-4555-8555-555555555555',
    'a1111111-1111-4111-8111-111111111111',
    'Alguém indica empresa que coloca Libras ou leitor de tela na vaga, em vez de um selo genérico?',
    now() - interval '1 hour'
  ),
  (
    'f6666666-6666-4666-8666-666666666666',
    'a3333333-3333-4333-8333-333333333333',
    'Dica rápida: se a entrevista precisa de intérprete, isso tem que estar escrito no anúncio. Candidata e candidato não deveriam ter que descobrir na hora.',
    now() - interval '8 hours'
  )
on conflict (id) do update set content = excluded.content;

insert into public.course_enrollments (profile_id, course_id, status, completed_at) values
  (
    'a1111111-1111-4111-8111-111111111111',
    'c0000000-0000-4000-8000-000000000005',
    'concluido',
    now()
  ),
  (
    'a1111111-1111-4111-8111-111111111111',
    'c0000000-0000-4000-8000-000000000001',
    'em_andamento',
    null
  )
on conflict (profile_id, course_id) do update
set status = excluded.status, completed_at = excluded.completed_at;

insert into public.notifications (id, profile_id, type, title, body, link, is_read) values
  (
    'ae111111-1111-4111-8111-111111111111',
    'a1111111-1111-4111-8111-111111111111',
    'application_status',
    'Candidatura em análise',
    'A Rede Viva Mais moveu sua candidatura para Auxiliar administrativo.',
    '/candidaturas',
    false
  ),
  (
    'ae222222-2222-4222-8222-222222222222',
    'a1111111-1111-4111-8111-111111111111',
    'connection_request',
    'Novo pedido de conexão',
    'Bruno Costa quer conectar com você.',
    '/conexoes',
    false
  )
on conflict (id) do update set is_read = false;
