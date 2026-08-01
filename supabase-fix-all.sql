-- Run this once in Supabase SQL Editor for an existing BioGen project.
-- It is safe to run repeatedly.

alter table public.bio_pages add column if not exists user_id uuid;
alter table public.bio_pages add column if not exists font_family text not null default 'sans';
alter table public.bio_pages add column if not exists text_color text not null default '#ffffff';
alter table public.bio_pages add column if not exists layout text not null default 'classic';
alter table public.bio_pages add column if not exists background_image text not null default '';
alter table public.bio_pages add column if not exists custom_domain text;
create unique index if not exists bio_pages_custom_domain_idx on public.bio_pages(lower(custom_domain)) where custom_domain is not null;

create unique index if not exists bio_pages_one_page_per_user
  on public.bio_pages(user_id) where user_id is not null;

alter table public.bio_pages enable row level security;

drop policy if exists "Anyone can read published bio pages" on public.bio_pages;
drop policy if exists "Anyone can create or update bio pages for the MVP" on public.bio_pages;
drop policy if exists "Anyone can update bio pages for the MVP" on public.bio_pages;
drop policy if exists "Public pages are readable, owners can read drafts" on public.bio_pages;
drop policy if exists "Signed in users can create their own bio page" on public.bio_pages;
drop policy if exists "Signed in users can update their own bio page" on public.bio_pages;

create policy "Public pages are readable, owners can read drafts"
  on public.bio_pages for select
  using (published = true or (auth.uid() is not null and auth.uid() = user_id));

create policy "Signed in users can create their own bio page"
  on public.bio_pages for insert
  with check (auth.uid() is not null and auth.uid() = user_id);

create policy "Signed in users can update their own bio page"
  on public.bio_pages for update
  using (auth.uid() is not null and auth.uid() = user_id)
  with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "Signed in users can delete their own bio page" on public.bio_pages;
create policy "Signed in users can delete their own bio page"
  on public.bio_pages for delete
  using (auth.uid() is not null and auth.uid() = user_id);

create or replace function public.increment_bio_link_click(page_handle text, link_id text)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  update public.bio_pages
  set stats = jsonb_set(
    jsonb_set(coalesce(stats, '{}'::jsonb), '{clicks}',
      to_jsonb(coalesce((stats->>'clicks')::integer, 0) + 1), true),
    array['byLink', link_id],
    to_jsonb(coalesce((stats->'byLink'->>link_id)::integer, 0) + 1), true),
    updated_at = now()
  where handle = lower(page_handle)
    and published = true
    and exists (
      select 1 from jsonb_array_elements(coalesce(links, '[]'::jsonb)) as item
      where item->>'id' = link_id
    );
end;
$$;

grant execute on function public.increment_bio_link_click(text, text) to anon, authenticated;


drop policy if exists "Users can delete their bio media" on storage.objects;
create policy "Users can delete their bio media"
  on storage.objects for delete
  using (bucket_id = 'bio-media' and auth.uid()::text = (storage.foldername(name))[1]);
