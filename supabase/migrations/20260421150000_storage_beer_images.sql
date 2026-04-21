-- Storage: beer-images bucket + RLS so admin UI can upload/replace/delete beer photos.
-- Bucket itself created out-of-band via Storage API (public = true so images render
-- without signed URLs). These policies open it to anon key, matching the rest of
-- RLS in this project. When service-role upload is wired from the server,
-- tighten the anon policies or drop them.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'beer-images',
  'beer-images',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Object-level RLS: anon may upload, overwrite, read and delete within this bucket.
drop policy if exists "beer-images anon read"   on storage.objects;
drop policy if exists "beer-images anon insert" on storage.objects;
drop policy if exists "beer-images anon update" on storage.objects;
drop policy if exists "beer-images anon delete" on storage.objects;

create policy "beer-images anon read"
  on storage.objects for select
  using (bucket_id = 'beer-images');

create policy "beer-images anon insert"
  on storage.objects for insert
  with check (bucket_id = 'beer-images');

create policy "beer-images anon update"
  on storage.objects for update
  using (bucket_id = 'beer-images')
  with check (bucket_id = 'beer-images');

create policy "beer-images anon delete"
  on storage.objects for delete
  using (bucket_id = 'beer-images');
