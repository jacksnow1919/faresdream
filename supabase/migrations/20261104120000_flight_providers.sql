-- Pause and resume for the flight APIs, a log of what each one answered, and which API
-- each booking's fare came from. The tables are server-side only: the site reads and
-- writes them with the service role.

create table if not exists public.provider_switches (
  provider text primary key check (provider in ('pkfare', 'duffel', 'mcontent')),
  paused boolean not null default false,
  paused_until timestamptz,
  paused_at timestamptz,
  paused_by text,
  reason text,
  updated_at timestamptz not null default now()
);

create table if not exists public.provider_searches (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  search_id text not null,
  provider text not null check (provider in ('pkfare', 'duffel', 'mcontent')),
  origin text not null,
  destination text not null,
  depart_date text not null,
  return_date text,
  cabin text,
  adults integer not null default 1,
  status text not null check (status in ('ok', 'paused', 'error')),
  fares integer not null default 0,
  ms integer not null default 0,
  message text
);
create index if not exists provider_searches_created_idx
  on public.provider_searches (created_at desc);

alter table public.provider_switches enable row level security;
alter table public.provider_searches enable row level security;

drop policy if exists "Server-side access only" on public.provider_switches;
create policy "Server-side access only" on public.provider_switches as restrictive for all
  to anon, authenticated using (false) with check (false);
drop policy if exists "Server-side access only" on public.provider_searches;
create policy "Server-side access only" on public.provider_searches as restrictive for all
  to anon, authenticated using (false) with check (false);

revoke all on public.provider_switches, public.provider_searches from anon, authenticated;
grant all on public.provider_switches, public.provider_searches to service_role;

-- Totals per API since a date. Paused searches never reached the API, so they don't count.
create or replace function public.provider_search_stats(since timestamptz)
returns table (
  provider text,
  lookups bigint,
  with_fares bigint,
  failed bigint,
  fares_returned bigint,
  avg_ms bigint,
  last_fares_at timestamptz,
  last_error_at timestamptz,
  last_error text
)
language sql
stable
set search_path = public
as $$
  select
    s.provider,
    count(*),
    count(*) filter (where s.fares > 0),
    count(*) filter (where s.status = 'error'),
    coalesce(sum(s.fares), 0)::bigint,
    coalesce(round(avg(s.ms)), 0)::bigint,
    max(s.created_at) filter (where s.fares > 0),
    max(s.created_at) filter (where s.status = 'error'),
    (array_agg(s.message order by s.created_at desc) filter (where s.status = 'error'))[1]
  from public.provider_searches s
  where s.created_at >= since and s.status <> 'paused'
  group by s.provider;
$$;

revoke all on function public.provider_search_stats(timestamptz) from public, anon, authenticated;
grant execute on function public.provider_search_stats(timestamptz) to service_role;

alter table public.bookings add column if not exists fare_provider text;
