-- Refund tracking and an activity log for the admin console.
-- Both are server-side only: the admin console reads and writes them with the service role.

create table if not exists public.refunds (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  status text not null default 'requested'
    check (status in ('requested', 'filed', 'paid', 'rejected')),
  currency text not null default 'USD',
  fare_paid numeric not null check (fare_paid >= 0),
  airline_penalty numeric not null default 0 check (airline_penalty >= 0),
  non_refundable_taxes numeric not null default 0 check (non_refundable_taxes >= 0),
  service_fee numeric not null default 0 check (service_fee >= 0),
  refund_amount numeric not null check (refund_amount >= 0),
  airline_reference text,
  reason text,
  notes text,
  requested_by text not null,
  created_at timestamptz not null default now(),
  filed_at timestamptz,
  paid_at timestamptz,
  closed_by text,
  updated_at timestamptz not null default now()
);
create index if not exists refunds_booking_idx on public.refunds (booking_id);
-- At most one refund in progress or paid per booking; rejected ones don't count.
create unique index if not exists refunds_one_open_per_booking
  on public.refunds (booking_id) where status in ('requested', 'filed', 'paid');

drop trigger if exists set_refunds_updated_at on public.refunds;
create trigger set_refunds_updated_at
  before update on public.refunds
  for each row execute function public.set_updated_at();

create table if not exists public.admin_activity (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  staff_id uuid references public.staff_users (id) on delete set null,
  staff_email text not null,
  staff_role text not null,
  action text not null,
  entity text not null,
  entity_id uuid,
  summary text not null
);
create index if not exists admin_activity_created_idx on public.admin_activity (created_at desc);

alter table public.refunds enable row level security;
alter table public.admin_activity enable row level security;

drop policy if exists "Server-side access only" on public.refunds;
create policy "Server-side access only" on public.refunds as restrictive for all
  to anon, authenticated using (false) with check (false);
drop policy if exists "Server-side access only" on public.admin_activity;
create policy "Server-side access only" on public.admin_activity as restrictive for all
  to anon, authenticated using (false) with check (false);

revoke all on public.refunds, public.admin_activity from anon, authenticated;
grant all on public.refunds, public.admin_activity to service_role;
