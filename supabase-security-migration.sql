alter table public.bio_pages add column if not exists user_id uuid;
alter table public.bio_pages add column if not exists font_family text not null default 'sans';
alter table public.bio_pages enable row level security;

drop policy if exists "Anyone can read published bio pages" on public.bio_pages;
drop policy if exists "Anyone can create or update bio pages for the MVP" on public.bio_pages;
drop policy if exists "Anyone can update bio pages for the MVP" on public.bio_pages;
drop policy if exists "Public pages are readable, owners can read drafts" on public.bio_pages;
drop policy if exists "Signed in users can create their own bio page" on public.bio_pages;
drop policy if exists "Signed in users can update their own bio page" on public.bio_pages;

create policy "Public pages are readable, owners can read drafts"
on public.bio_pages
for select
using (published = true or auth.uid() = user_id or user_id is null);

create policy "Signed in users can create their own bio page"
on public.bio_pages
for insert
with check (auth.uid() is not null and auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('bio-media', 'bio-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view bio media" on storage.objects;
drop policy if exists "Users can upload their bio media" on storage.objects;
drop policy if exists "Users can update their bio media" on storage.objects;

create policy "Public can view bio media"
on storage.objects for select
using (bucket_id = 'bio-media');

create policy "Users can upload their bio media"
on storage.objects for insert
with check (bucket_id = 'bio-media' and auth.uid() is not null and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can update their bio media"
on storage.objects for update
using (bucket_id = 'bio-media' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Signed in users can update their own bio page"
on public.bio_pages
for update
using (auth.uid() is not null and (auth.uid() = user_id or user_id is null))
with check (auth.uid() is not null and auth.uid() = user_id);
