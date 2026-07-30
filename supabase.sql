create table if not exists public.bio_pages (
  handle text primary key check (handle = lower(handle)),
  profile jsonb not null default '{}'::jsonb,
  links jsonb not null default '[]'::jsonb,
  theme text not null default 'aurora',
  published boolean not null default false,
  stats jsonb not null default '{"views": 0, "clicks": 0, "byLink": {}}'::jsonb,
  user_id uuid,
  updated_at timestamptz not null default now()
);

alter table public.bio_pages add column if not exists user_id uuid;
alter table public.bio_pages enable row level security;

alter table public.bio_pages add column if not exists font_family text not null default 'sans';

drop policy if exists "Anyone can read published bio pages" on public.bio_pages;
drop policy if exists "Anyone can create or update bio pages for the MVP" on public.bio_pages;
drop policy if exists "Anyone can update bio pages for the MVP" on public.bio_pages;

create policy "Public pages are readable, owners can read drafts"
  on public.bio_pages for select
  using (published = true or (auth.uid() is not null and (auth.uid() = user_id or user_id is null)));

create policy "Signed in users can create their own bio page"
  on public.bio_pages for insert
  with check (auth.uid() is not null and auth.uid() = user_id);

create policy "Signed in users can update their own bio page"
  on public.bio_pages for update
  using (auth.uid() is not null and (auth.uid() = user_id or user_id is null))
  with check (auth.uid() is not null and auth.uid() = user_id);
