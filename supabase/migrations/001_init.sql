-- ============================================================
-- Guestio — Supabase Migration
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── PROFILES (extends auth.users) ──────────────────────────
create table public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── ORGANIZATIONS ──────────────────────────────────────────
create table public.organizations (
  id          uuid default uuid_generate_v4() primary key,
  name        text not null,
  owner_id    uuid references auth.users not null,
  created_at  timestamptz default now()
);
alter table public.organizations enable row level security;
create policy "Org members can view org" on public.organizations
  for select using (
    auth.uid() = owner_id or
    exists (select 1 from public.org_members where org_id = id and user_id = auth.uid())
  );
create policy "Owner can update org" on public.organizations
  for update using (auth.uid() = owner_id);

-- ── ORG MEMBERS ────────────────────────────────────────────
create table public.org_members (
  id          uuid default uuid_generate_v4() primary key,
  org_id      uuid references public.organizations on delete cascade not null,
  user_id     uuid references auth.users on delete cascade not null,
  role        text not null default 'checkin' check (role in ('owner','manager','checkin')),
  created_at  timestamptz default now(),
  unique(org_id, user_id)
);
alter table public.org_members enable row level security;
create policy "Org members can view members" on public.org_members
  for select using (
    exists (
      select 1 from public.org_members m
      where m.org_id = org_id and m.user_id = auth.uid()
    )
  );
create policy "Managers can manage members" on public.org_members
  for all using (
    exists (
      select 1 from public.org_members m
      where m.org_id = org_id and m.user_id = auth.uid() and m.role in ('owner','manager')
    )
  );

-- ── EVENTS ─────────────────────────────────────────────────
create table public.events (
  id            uuid default uuid_generate_v4() primary key,
  org_id        uuid references public.organizations on delete cascade not null,
  name          text not null,
  date          date,
  venue         text,
  emoji         text default '⚡',
  description   text,
  bugece_url    text,
  is_active     boolean default false,

  created_by    uuid references auth.users not null,
  created_at    timestamptz default now()
);
alter table public.events enable row level security;
create policy "Org members can view events" on public.events
  for select using (
    exists (
      select 1 from public.org_members m
      where m.org_id = org_id and m.user_id = auth.uid()
    )
  );
create policy "Managers can manage events" on public.events
  for all using (
    exists (
      select 1 from public.org_members m
      where m.org_id = org_id and m.user_id = auth.uid() and m.role in ('owner','manager')
    )
  );

-- ── GUESTS ─────────────────────────────────────────────────
create table public.guests (
  id            uuid default uuid_generate_v4() primary key,
  event_id      uuid references public.events on delete cascade not null,
  first_name    text not null,
  last_name     text not null,
  email         text,
  phone         text,
  status        text not null default 'pending' check (status in ('pending','vip','plus1','plus2')),
  table_name    text,
  note          text,
  checked_in    boolean default false,
  checked_in_at timestamptz,
  checked_in_by uuid references auth.users,
  created_at    timestamptz default now()
);
alter table public.guests enable row level security;
create policy "Org members can view guests" on public.guests
  for select using (
    exists (
      select 1 from public.events e
      join public.org_members m on m.org_id = e.org_id
      where e.id = event_id and m.user_id = auth.uid()
    )
  );
create policy "Org members can insert guests" on public.guests
  for insert with check (
    exists (
      select 1 from public.events e
      join public.org_members m on m.org_id = e.org_id
      where e.id = event_id and m.user_id = auth.uid()
    )
  );
create policy "Org members can update guests" on public.guests
  for update using (
    exists (
      select 1 from public.events e
      join public.org_members m on m.org_id = e.org_id
      where e.id = event_id and m.user_id = auth.uid()
    )
  );
create policy "Managers can delete guests" on public.guests
  for delete using (
    exists (
      select 1 from public.events e
      join public.org_members m on m.org_id = e.org_id
      where e.id = event_id and m.user_id = auth.uid() and m.role in ('owner','manager')
    )
  );

-- ── REALTIME ───────────────────────────────────────────────
-- Enable realtime for guests table (for multi-device sync)
alter publication supabase_realtime add table public.guests;

-- ── INDEXES ────────────────────────────────────────────────
create index idx_guests_event on public.guests(event_id);
create index idx_guests_checked_in on public.guests(event_id, checked_in);
create index idx_guests_name on public.guests(event_id, lower(first_name), lower(last_name));
create index idx_events_org on public.events(org_id);
create index idx_members_org on public.org_members(org_id);
create index idx_members_user on public.org_members(user_id);
