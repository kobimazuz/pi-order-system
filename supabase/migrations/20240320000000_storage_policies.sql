-- Enable Storage
create extension if not exists "storage" schema "extensions";

-- Create products bucket
insert into storage.buckets (id, name, public)
values ('products', 'products', false);

-- Set up access policies
create policy "Authenticated users can upload product images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'products' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can view their own product images"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'products' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update their own product images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'products' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete their own product images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'products' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Set up size limits and file type restrictions
alter bucket "products"
  set file_size_limit = 5242880, -- 5MB
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']; 