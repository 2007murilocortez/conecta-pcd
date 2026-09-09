create or replace function public.profile_id_by_email(
  p_email text,
  p_company_id uuid
)
returns uuid
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_company_owner(p_company_id) then
    raise exception 'not authorized';
  end if;

  return (
    select u.id
    from auth.users u
    join public.profiles p on p.id = u.id
    where lower(u.email) = lower(trim(p_email))
      and p.deleted_at is null
    limit 1
  );
end;
$$;

revoke all on function public.profile_id_by_email(text, uuid) from public;
grant execute on function public.profile_id_by_email(text, uuid) to authenticated;
