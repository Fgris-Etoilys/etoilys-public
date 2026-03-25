create extension if not exists pgcrypto;

create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  form_type text not null check (form_type in ('contact', 'classement')),
  nom text not null,
  prenom text,
  email text not null,
  telephone text,
  adresse text,
  message text,
  consent_accepted boolean not null default false,
  consent_version text not null,
  turnstile_verified boolean not null default false,
  source_ip_hash text,
  user_agent text,
  status text not null default 'received' check (status in ('received', 'notified', 'notification_failed')),
  notification_error text,
  notified_at timestamptz,
  payload_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_form_submissions_created_at on public.form_submissions (created_at desc);
create index if not exists idx_form_submissions_form_type_created_at
  on public.form_submissions (form_type, created_at desc);
create index if not exists idx_form_submissions_email_created_at
  on public.form_submissions (email, created_at desc);
create index if not exists idx_form_submissions_source_ip_hash_created_at
  on public.form_submissions (source_ip_hash, created_at desc);

alter table public.form_submissions enable row level security;
alter table public.form_submissions force row level security;

revoke all on table public.form_submissions from anon, authenticated;

create or replace function public.purge_form_submissions_older_than(
  retention interval default interval '12 months'
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count bigint;
begin
  delete from public.form_submissions
  where created_at < now() - retention;

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

revoke all on function public.purge_form_submissions_older_than(interval) from anon, authenticated;
