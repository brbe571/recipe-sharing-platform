-- Add optional bio field for user profiles.

alter table public.profiles
add column if not exists bio text;
