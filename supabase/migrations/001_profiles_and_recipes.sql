-- Profiles and recipes schema for Recipe Share
-- Run in the Supabase SQL Editor, or via the Supabase CLI.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  ingredients text not null,
  instructions text not null,
  cooking_time integer not null check (cooking_time > 0),
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  category text not null
);

create index recipes_user_id_idx on public.recipes (user_id);
create index recipes_category_idx on public.recipes (category);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  candidate text;
begin
  base_username := lower(split_part(new.email, '@', 1));
  base_username := regexp_replace(base_username, '[^a-z0-9_]', '_', 'g');
  base_username := trim(both '_' from base_username);

  if base_username = '' then
    base_username := 'user';
  end if;

  candidate := base_username;

  if exists (select 1 from public.profiles where username = candidate) then
    candidate := base_username || '_' || substr(replace(new.id::text, '-', ''), 1, 8);
  end if;

  insert into public.profiles (id, username)
  values (new.id, candidate);

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.recipes enable row level security;

create policy "Profiles are viewable by everyone"
on public.profiles
for select
to anon, authenticated
using (true);

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can create their own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "Recipes are viewable by everyone"
on public.recipes
for select
to anon, authenticated
using (true);

create policy "Users can insert their own recipes"
on public.recipes
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own recipes"
on public.recipes
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own recipes"
on public.recipes
for delete
to authenticated
using (auth.uid() = user_id);

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.set_updated_at() to postgres, service_role;
grant execute on function public.handle_new_user() to postgres, service_role;
