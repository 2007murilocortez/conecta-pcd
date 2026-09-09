-- Sprint 5: cursos concluídos visíveis no perfil público + notificação de mentoria.
-- Não apliquei no remoto — rode este arquivo no SQL Editor se as policies ainda não existirem.

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'course_enrollments'
      and policyname = 'inscricoes concluidas sao publicas'
  ) then
    create policy "inscricoes concluidas sao publicas"
    on public.course_enrollments
    for select
    using (status = 'concluido');
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'notifications'
      and policyname = 'mentee notifica mentor do pedido'
  ) then
    create policy "mentee notifica mentor do pedido"
    on public.notifications
    for insert
    with check (
      exists (
        select 1
        from public.mentorships m
        where m.mentor_id = notifications.profile_id
          and m.mentee_id = (select auth.uid())
      )
    );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'notifications'
      and policyname = 'mentor notifica mentee do aceite'
  ) then
    create policy "mentor notifica mentee do aceite"
    on public.notifications
    for insert
    with check (
      exists (
        select 1
        from public.mentorships m
        where m.mentee_id = notifications.profile_id
          and m.mentor_id = (select auth.uid())
          and m.status = 'ativa'
      )
    );
  end if;
end
$$;
