-- Setup Supabase Storage untuk foto produk
-- Jalankan di Supabase SQL Editor

-- Buat bucket product-images (public)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Policy: siapa saja bisa baca (public bucket)
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Policy: hanya authenticated (admin) yang bisa upload
create policy "Admin upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
  );

-- Policy: hanya authenticated yang bisa update
create policy "Admin update product images"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
  );

-- Policy: hanya authenticated yang bisa hapus
create policy "Admin delete product images"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
  );
