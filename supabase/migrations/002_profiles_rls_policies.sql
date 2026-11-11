-- Update profiles RLS to match product rules.

drop policy if exists "Authenticated users can read profiles" on public.profiles;

create policy "Profiles are viewable by everyone"
on public.profiles
for select
to anon, authenticated
using (true);

drop policy if exists "Users can update their own profile" on public.profiles;

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
