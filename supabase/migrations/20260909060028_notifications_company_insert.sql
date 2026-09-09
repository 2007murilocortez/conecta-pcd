do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'notifications'
      and policyname = 'equipe notifica candidato da propria vaga'
  ) then
    create policy "equipe notifica candidato da propria vaga"
    on public.notifications
    for insert
    with check (
      exists (
        select 1
        from public.applications a
        join public.jobs j on j.id = a.job_id
        where a.profile_id = notifications.profile_id
          and public.is_company_member(j.company_id)
      )
    );
  end if;
end
$$;
