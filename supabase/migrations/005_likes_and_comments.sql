-- Likes and flat comments for recipes.

create table public.recipe_likes (
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (recipe_id, user_id)
);

create index recipe_likes_recipe_id_idx on public.recipe_likes (recipe_id);

create table public.recipe_comments (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 1000),
  created_at timestamptz not null default now()
);

create index recipe_comments_recipe_created_idx
  on public.recipe_comments (recipe_id, created_at);

alter table public.recipe_likes enable row level security;
alter table public.recipe_comments enable row level security;

create policy "Likes are viewable by everyone"
on public.recipe_likes
for select
to anon, authenticated
using (true);

create policy "Users can like recipes"
on public.recipe_likes
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can remove their own likes"
on public.recipe_likes
for delete
to authenticated
using (auth.uid() = user_id);

create policy "Comments are viewable by everyone"
on public.recipe_comments
for select
to anon, authenticated
using (true);

create policy "Users can create their own comments"
on public.recipe_comments
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can delete their own comments"
on public.recipe_comments
for delete
to authenticated
using (auth.uid() = user_id);
