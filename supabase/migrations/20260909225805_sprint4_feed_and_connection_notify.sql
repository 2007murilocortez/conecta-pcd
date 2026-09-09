alter table public.posts
  add column if not exists image_alt text;

comment on column public.posts.image_alt is
  'Texto alternativo da imagem do post, para leitores de tela.';

insert into storage.buckets (id, name, public)
values ('posts', 'posts', true)
on conflict (id) do nothing;

drop policy if exists posts_public_read on storage.objects;
create policy posts_public_read
on storage.objects
for select
using (bucket_id = 'posts');

drop policy if exists posts_owner_insert on storage.objects;
create policy posts_owner_insert
on storage.objects
for insert
with check (
  bucket_id = 'posts'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists posts_owner_update on storage.objects;
create policy posts_owner_update
on storage.objects
for update
using (
  bucket_id = 'posts'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'posts'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists posts_owner_delete on storage.objects;
create policy posts_owner_delete
on storage.objects
for delete
using (
  bucket_id = 'posts'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'notifications'
      and policyname = 'remetente notifica destinatario de conexao'
  ) then
    create policy "remetente notifica destinatario de conexao"
    on public.notifications
    for insert
    with check (
      exists (
        select 1
        from public.connections c
        where c.addressee_id = notifications.profile_id
          and c.requester_id = (select auth.uid())
      )
    );
  end if;
end
$$;
