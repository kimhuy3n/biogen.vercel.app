create table if not exists public.bio_pages (
  handle text primary key check (handle = lower(handle)),
  profile jsonb not null default '{}'::jsonb,
  links jsonb not null default '[]'::jsonb,
  theme text not null default 'aurora',
  published boolean not null default false,
  stats jsonb not null default '{"views": 0, "clicks": 0, "byLink": {}}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.bio_pages enable row level security;

create policy "Anyone can read published bio pages"
  on public.bio_pages for select
  using (published = true);

create policy "Anyone can create or update bio pages for the MVP"
  on public.bio_pages for insert
  with check (true);

create policy "Anyone can update bio pages for the MVP"
  on public.bio_pages for update
  using (true)
  with check (true);

