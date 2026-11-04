-- Anonymous visitor journeys, and a guard that stops scripts spending flight API searches.
-- No names, contact details or IP addresses are stored. Server-side only, like the other
-- admin tables: the site reads and writes these with the service role.

create table if not exists public.site_events (
  id uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null default now(),
  visitor_id text not null,
  visit_id text not null,
  event_type text not null check (event_type in (
    'page_view', 'search_run', 'search_result', 'fare_selected', 'call_clicked',
    'booking_started', 'booking_completed', 'quote_requested'
  )),
  path text,
  route text,
  detail jsonb,
  country text
);
create index if not exists site_events_occurred_idx on public.site_events (occurred_at desc);
create index if not exists site_events_visitor_idx on public.site_events (visitor_id, occurred_at);

create table if not exists public.search_guard_blocks (
  id uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null default now(),
  reason text not null,
  path text not null,
  country text
);
create index if not exists search_guard_blocks_occurred_idx
  on public.search_guard_blocks (occurred_at desc);

-- The key is a salted hash of the address, never the address itself.
create table if not exists public.rate_limit_counters (
  key text primary key,
  window_started timestamptz not null default now(),
  hits integer not null default 0
);

alter table public.site_events enable row level security;
alter table public.search_guard_blocks enable row level security;
alter table public.rate_limit_counters enable row level security;

drop policy if exists "Server-side access only" on public.site_events;
create policy "Server-side access only" on public.site_events as restrictive for all
  to anon, authenticated using (false) with check (false);
drop policy if exists "Server-side access only" on public.search_guard_blocks;
create policy "Server-side access only" on public.search_guard_blocks as restrictive for all
  to anon, authenticated using (false) with check (false);
drop policy if exists "Server-side access only" on public.rate_limit_counters;
create policy "Server-side access only" on public.rate_limit_counters as restrictive for all
  to anon, authenticated using (false) with check (false);

revoke all on public.site_events, public.search_guard_blocks, public.rate_limit_counters
  from anon, authenticated;
grant all on public.site_events, public.search_guard_blocks, public.rate_limit_counters
  to service_role;

-- Counts one hit and says whether the key is still inside its limit for the window.
create or replace function public.rate_limit_hit(p_key text, p_window_seconds integer, p_limit integer)
returns boolean
language plpgsql
set search_path = public
as $$
declare
  current_hits integer;
begin
  insert into rate_limit_counters as c (key, window_started, hits)
  values (p_key, now(), 1)
  on conflict (key) do update set
    hits = case
      when c.window_started < now() - make_interval(secs => p_window_seconds) then 1
      else c.hits + 1
    end,
    window_started = case
      when c.window_started < now() - make_interval(secs => p_window_seconds) then now()
      else c.window_started
    end
  returning hits into current_hits;

  -- Old counters are useless, so roughly one call in a hundred clears them.
  if random() < 0.01 then
    delete from rate_limit_counters where window_started < now() - interval '1 day';
  end if;

  return current_hits <= p_limit;
end;
$$;

-- The figures at the top of the Visitors section.
create or replace function public.visitor_summary(p_since timestamptz, p_until timestamptz)
returns jsonb
language sql
stable
set search_path = public
as $$
  with e as (
    select * from site_events where occurred_at >= p_since and occurred_at < p_until
  ),
  per as (
    select
      visitor_id,
      count(distinct visit_id) as visits,
      bool_or(event_type = 'search_run') as searched,
      bool_or(event_type = 'booking_completed') as booked
    from e
    group by visitor_id
  )
  select jsonb_build_object(
    'visitors', (select count(*) from per),
    'returning', (
      select count(*) from per p
      where p.visits > 1 or exists (
        select 1 from site_events o where o.visitor_id = p.visitor_id and o.occurred_at < p_since
      )
    ),
    'searched', (select count(*) from per where searched),
    'booked', (select count(*) from per where booked),
    'actions', (select count(*) from e)
  );
$$;

-- One row per visitor, most recently seen first. p_search matches the start of a visitor ID.
create or replace function public.visitor_recent(
  p_since timestamptz,
  p_until timestamptz,
  p_search text,
  p_limit integer
)
returns table (
  visitor_id text,
  visits bigint,
  first_seen timestamptz,
  last_seen timestamptz,
  actions bigint,
  searched boolean,
  booked boolean,
  landing text,
  country text
)
language sql
stable
set search_path = public
as $$
  select
    e.visitor_id,
    count(distinct e.visit_id),
    min(e.occurred_at),
    max(e.occurred_at),
    count(*),
    bool_or(e.event_type = 'search_run'),
    bool_or(e.event_type = 'booking_completed'),
    (array_agg(e.path order by e.occurred_at) filter (where e.event_type = 'page_view'))[1],
    (array_agg(e.country order by e.occurred_at desc) filter (where e.country is not null))[1]
  from site_events e
  where e.occurred_at >= p_since
    and e.occurred_at < p_until
    and (p_search is null or e.visitor_id like p_search || '%')
  group by e.visitor_id
  order by max(e.occurred_at) desc
  limit p_limit;
$$;

-- What the guard refused in a period.
create or replace function public.search_guard_summary(p_since timestamptz, p_until timestamptz)
returns jsonb
language sql
stable
set search_path = public
as $$
  with b as (
    select * from search_guard_blocks where occurred_at >= p_since and occurred_at < p_until
  ),
  top as (
    select 'reason' as kind, reason as value, count(*) as n from b group by reason
    union all
    select 'country', coalesce(country, 'Unknown'), count(*) from b group by coalesce(country, 'Unknown')
  )
  select jsonb_build_object(
    'total', (select count(*) from b),
    'last_at', (select max(occurred_at) from b),
    'by_reason', coalesce((
      select jsonb_agg(jsonb_build_object('value', value, 'count', n) order by n desc)
      from top where kind = 'reason'
    ), '[]'::jsonb),
    'by_country', coalesce((
      select jsonb_agg(jsonb_build_object('value', value, 'count', n) order by n desc)
      from (select * from top where kind = 'country' order by n desc limit 8) t
    ), '[]'::jsonb)
  );
$$;

revoke all on function public.rate_limit_hit(text, integer, integer) from public, anon, authenticated;
revoke all on function public.visitor_summary(timestamptz, timestamptz) from public, anon, authenticated;
revoke all on function public.visitor_recent(timestamptz, timestamptz, text, integer) from public, anon, authenticated;
revoke all on function public.search_guard_summary(timestamptz, timestamptz) from public, anon, authenticated;
grant execute on function public.rate_limit_hit(text, integer, integer) to service_role;
grant execute on function public.visitor_summary(timestamptz, timestamptz) to service_role;
grant execute on function public.visitor_recent(timestamptz, timestamptz, text, integer) to service_role;
grant execute on function public.search_guard_summary(timestamptz, timestamptz) to service_role;
