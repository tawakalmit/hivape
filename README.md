# HiVape Store

Website katalog vape premium dengan checkout via WhatsApp.

## Stack

- **Framework:** SvelteKit 2 (Svelte 5, runes mode)
- **Styling:** Tailwind CSS v4
- **Database & Auth:** Supabase (PostgreSQL + Storage + Auth)
- **Hosting:** Cloudflare Workers (adapter-cloudflare)

## Setup

### 1. Clone & install

```bash
npm install
```

### 2. Buat file `.env` dari template

```bash
cp .env.example .env
```

Isi dengan credentials Supabase kamu:

```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
VITE_WA_PHONE=6281234567890
VITE_WA_DISPLAY=+62 812-3456-7890
```

### 3. Setup database Supabase

Jalankan SQL di file `supabase/migrations/001_initial.sql` via Supabase SQL Editor.

Ini akan membuat:
- Tabel `categories`, `products`, `variants`, `product_images`
- Row Level Security (RLS) — publik hanya bisa baca produk aktif
- Seed data kategori default

### 4. Buat admin user

Di Supabase Dashboard → Authentication → Users → Add user. Pakai email/password.

### 5. Run dev

```bash
npm run dev
```

## Halaman

| Route | Deskripsi |
|-------|-----------|
| `/` | Homepage — hero, trust badges, kategori, produk terbaru |
| `/produk` | Katalog semua produk dengan filter kategori |
| `/produk/[slug]` | Detail produk — varian, CTA WhatsApp, produk terkait |
| `/kategori/[slug]` | Produk per kategori |
| `/keranjang` | Keranjang ringan → checkout WhatsApp multi-item |
| `/admin/login` | Login admin |
| `/admin/produk` | CRUD produk |
| `/admin/produk/baru` | Tambah produk baru |
| `/admin/produk/[id]` | Edit produk |
| `/admin/kategori` | CRUD kategori |

## Upload Foto Produk

Foto produk disimpan di Supabase Storage. Setelah upload via Supabase Dashboard atau API,
masukkan URL-nya ke tabel `product_images` dengan kolom:
- `product_id`: ID produk
- `url`: URL publik dari Supabase Storage
- `is_primary`: `true` untuk foto utama
- `sort_order`: urutan tampil

## Deploy ke Cloudflare Workers

```bash
npm run build
npx wrangler deploy
```

Pastikan environment variables sudah di-set di Cloudflare dashboard.
