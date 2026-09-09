alter table public.profiles
  add column if not exists accessibility_needs_other text,
  add column if not exists disability_types_other text;

comment on column public.profiles.accessibility_needs_other is
  'Texto livre quando accessibility_needs inclui outro.';

comment on column public.profiles.disability_types_other is
  'Texto livre quando disability_types inclui outra.';
