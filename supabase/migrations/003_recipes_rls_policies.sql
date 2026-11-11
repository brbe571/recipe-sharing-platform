-- Align recipes RLS policy names with product rules.

drop policy if exists "Anyone can read recipes" on public.recipes;
drop policy if exists "Authenticated users can create their own recipes" on public.recipes;
drop policy if exists "Authors can update their own recipes" on public.recipes;
drop policy if exists "Authors can delete their own recipes" on public.recipes;

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
