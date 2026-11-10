create table if not exists public.gorilla_profiles (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique,
  created_at timestamptz not null default now(),
  full_name text not null,
  phone text not null,
  profile jsonb not null,
  notification_status text not null default 'pending'
    check (notification_status in ('pending', 'sent', 'failed'))
);

create index if not exists gorilla_profiles_created_at_idx
  on public.gorilla_profiles (created_at desc);
create index if not exists gorilla_profiles_phone_idx
  on public.gorilla_profiles (phone);

alter table public.gorilla_profiles enable row level security;
revoke all on table public.gorilla_profiles from anon, authenticated;
grant all on table public.gorilla_profiles to service_role;

create table if not exists public.gorilla_submission_limits (
  ip_hash text primary key,
  window_started_at timestamptz not null,
  submission_count integer not null default 0
);

alter table public.gorilla_submission_limits enable row level security;
revoke all on table public.gorilla_submission_limits from anon, authenticated;
grant all on table public.gorilla_submission_limits to service_role;

create or replace function public.gorilla_take_submission_slot(p_ip_hash text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_count integer;
begin
  insert into public.gorilla_submission_limits as limits
    (ip_hash, window_started_at, submission_count)
  values (p_ip_hash, now(), 1)
  on conflict (ip_hash) do update
    set window_started_at = case
          when limits.window_started_at < now() - interval '1 hour' then now()
          else limits.window_started_at
        end,
        submission_count = case
          when limits.window_started_at < now() - interval '1 hour' then 1
          else limits.submission_count + 1
        end
  returning submission_count into current_count;

  delete from public.gorilla_submission_limits
    where window_started_at < now() - interval '2 days';

  return current_count <= 8;
end;
$$;

revoke all on function public.gorilla_take_submission_slot(text) from public, anon, authenticated;
grant execute on function public.gorilla_take_submission_slot(text) to service_role;
