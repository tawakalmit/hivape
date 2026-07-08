-- HiVape Store — Initial Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Categories
create table if not exists categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  cover_image_url text,
  created_at  timestamptz default now()
);

-- Products
create table if not exists products (
  id               uuid primary key default uuid_generate_v4(),
  name             text not null,
  slug             text not null unique,
  category_id      uuid references categories(id) on delete set null,
  description_short text,
  description_long  text,
  status           text not null default 'draft' check (status in ('active', 'draft', 'out_of_stock')),
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- Variants (flavor/nicotine/price per product)
create table if not exists variants (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid references products(id) on delete cascade,
  flavor      text,
  nicotine_mg integer,
  price       numeric(12,0) not null,
  stock       integer not null default 0,
  created_at  timestamptz default now()
);

-- Product images
create table if not exists product_images (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid references products(id) on delete cascade,
  url         text not null,
  is_primary  boolean default false,
  sort_order  integer default 0,
  created_at  timestamptz default now()
);

-- Indexes
create index if not exists idx_products_slug on products(slug);
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_status on products(status);
create index if not exists idx_variants_product on variants(product_id);
create index if not exists idx_images_product on product_images(product_id);

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

-- Row Level Security
alter table categories enable row level security;
alter table products enable row level security;
alter table variants enable row level security;
alter table product_images enable row level security;

-- Public can read active products and all categories
create policy "Public read categories" on categories for select using (true);
create policy "Public read active products" on products for select using (status = 'active');
create policy "Public read variants" on variants for select using (true);
create policy "Public read images" on product_images for select using (true);

-- Authenticated users (admin) can do everything
create policy "Admin full access categories" on categories for all using (auth.role() = 'authenticated');
create policy "Admin full access products" on products for all using (auth.role() = 'authenticated');
create policy "Admin full access variants" on variants for all using (auth.role() = 'authenticated');
create policy "Admin full access images" on product_images for all using (auth.role() = 'authenticated');

-- Seed: default categories
insert into categories (name, slug) values
  ('Liquid Saltnic', 'liquid-saltnic'),
  ('Liquid Freebase', 'liquid-freebase'),
  ('Pod System', 'pod-system'),
  ('Device / Mod', 'device-mod'),
  ('Coil & Accessories', 'coil-accessories')
on conflict (slug) do nothing;
