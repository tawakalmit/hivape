-- Fix RLS policies — pisahkan per operasi agar INSERT/UPDATE/DELETE berfungsi untuk admin
-- Jalankan ini di Supabase SQL Editor

-- Drop policy "for all" yang bermasalah
drop policy if exists "Admin full access categories" on categories;
drop policy if exists "Admin full access products" on products;
drop policy if exists "Admin full access variants" on variants;
drop policy if exists "Admin full access images" on product_images;

-- CATEGORIES: admin bisa semua, publik bisa select
create policy "Admin insert categories"  on categories for insert  with check (auth.role() = 'authenticated');
create policy "Admin update categories"  on categories for update  using (auth.role() = 'authenticated');
create policy "Admin delete categories"  on categories for delete  using (auth.role() = 'authenticated');

-- PRODUCTS: admin bisa semua operasi, publik sudah ada policy select (status = active)
-- Drop dulu policy publik yang ada, buat ulang termasuk admin select
drop policy if exists "Public read active products" on products;
create policy "Select products" on products for select using (
  status = 'active' OR auth.role() = 'authenticated'
);
create policy "Admin insert products"  on products for insert  with check (auth.role() = 'authenticated');
create policy "Admin update products"  on products for update  using (auth.role() = 'authenticated');
create policy "Admin delete products"  on products for delete  using (auth.role() = 'authenticated');

-- VARIANTS
create policy "Admin insert variants"  on variants for insert  with check (auth.role() = 'authenticated');
create policy "Admin update variants"  on variants for update  using (auth.role() = 'authenticated');
create policy "Admin delete variants"  on variants for delete  using (auth.role() = 'authenticated');

-- PRODUCT IMAGES
create policy "Admin insert images"  on product_images for insert  with check (auth.role() = 'authenticated');
create policy "Admin update images"  on product_images for update  using (auth.role() = 'authenticated');
create policy "Admin delete images"  on product_images for delete  using (auth.role() = 'authenticated');
