<script lang="ts">
	import { enhance } from '$app/forms';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import type { ProductWithRelations, Category } from '$lib/types';

	let {
		product = null,
		categories,
		action
	}: {
		product?: ProductWithRelations | null;
		categories: Category[];
		action: string;
	} = $props();

	// Form state
	let name = $state(product?.name ?? '');
	let slug = $state(product?.slug ?? '');
	let categoryId = $state(product?.category_id ?? (categories[0]?.id ?? ''));
	let descriptionShort = $state(product?.description_short ?? '');
	let descriptionLong = $state(product?.description_long ?? '');
	let status = $state<'active' | 'draft' | 'out_of_stock'>(product?.status ?? 'draft');

	interface FormVariant {
		_key: number;
		id: string;
		product_id?: string;
		flavor: string | null;
		nicotine_mg: number | string | null;
		price: number | string;
		stock: number | string;
		created_at?: string;
	}

	// Variants
	let variants = $state<FormVariant[]>(
		product?.variants?.length
			? product.variants.map((v) => ({ ...v, _key: Math.random() } as FormVariant))
			: [{ _key: Math.random(), id: '', flavor: '', nicotine_mg: '', price: '', stock: '0' }]
	);

	// Images (existing)
	let existingImages = $state(product?.product_images ?? []);

	// Auto-generate slug from name
	function generateSlug(val: string) {
		return val
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^\w-]+/g, '')
			.replace(/--+/g, '-')
			.trim();
	}

	$effect(() => {
		if (!product) slug = generateSlug(name);
	});

	function addVariant() {
		variants = [...variants, { _key: Math.random(), id: '', flavor: '', nicotine_mg: '', price: '', stock: '0' }];
	}

	function removeVariant(key: number) {
		variants = variants.filter((v) => v._key !== key);
	}

	// Preview card data
	const previewProduct = $derived({
		id: product?.id ?? 'preview',
		name: name || 'Nama Produk',
		slug: slug,
		category: categories.find((c) => c.id === categoryId)?.name ?? '',
		price_min: variants.reduce((min, v) => {
			const p = Number(v.price);
			return p < min && p > 0 ? p : min;
		}, Infinity) || 0,
		price_max: variants.reduce((max, v) => {
			const p = Number(v.price);
			return p > max ? p : max;
		}, 0),
		image_url: existingImages?.[0]?.url ?? null,
		status,
		variants_count: variants.length
	});
</script>

<form method="POST" {action} use:enhance class="flex flex-col gap-6">
	<div class="grid lg:grid-cols-3 gap-6">
		<!-- Main form -->
		<div class="lg:col-span-2 flex flex-col gap-6">
			<!-- Basic info -->
			<div class="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4 shadow-sm">
				<h2 class="font-semibold text-gray-800">Informasi Produk</h2>

				<div class="flex flex-col gap-1.5">
					<label for="name" class="text-sm font-medium text-gray-700">Nama Produk *</label>
					<input
						id="name"
						name="name"
						type="text"
						bind:value={name}
						required
						class="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
					/>
				</div>

				<div class="flex flex-col gap-1.5">
					<label for="slug" class="text-sm font-medium text-gray-700">Slug (URL)</label>
					<input
						id="slug"
						name="slug"
						type="text"
						bind:value={slug}
						class="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-yellow-500 font-mono"
					/>
					<p class="text-xs text-gray-400">URL: /produk/{slug || '...'}</p>
				</div>

				<div class="flex flex-col gap-1.5">
					<label for="category" class="text-sm font-medium text-gray-700">Kategori *</label>
					<select
						id="category"
						name="category_id"
						bind:value={categoryId}
						required
						class="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-yellow-500 bg-white"
					>
						{#each categories as cat}
							<option value={cat.id}>{cat.name}</option>
						{/each}
					</select>
				</div>

				<div class="flex flex-col gap-1.5">
					<label for="desc-short" class="text-sm font-medium text-gray-700">Deskripsi Singkat</label>
					<textarea
						id="desc-short"
						name="description_short"
						bind:value={descriptionShort}
						rows="2"
						class="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-yellow-500 resize-none"
					></textarea>
				</div>

				<div class="flex flex-col gap-1.5">
					<label for="desc-long" class="text-sm font-medium text-gray-700">Deskripsi Lengkap / Spesifikasi</label>
					<textarea
						id="desc-long"
						name="description_long"
						bind:value={descriptionLong}
						rows="5"
						class="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-yellow-500 resize-y"
					></textarea>
				</div>

				<div class="flex flex-col gap-1.5">
					<label for="status" class="text-sm font-medium text-gray-700">Status</label>
					<select
						id="status"
						name="status"
						bind:value={status}
						class="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-yellow-500 bg-white"
					>
						<option value="active">Aktif</option>
						<option value="draft">Draft</option>
						<option value="out_of_stock">Habis Stok</option>
					</select>
				</div>
			</div>

			<!-- Variants -->
			<div class="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4 shadow-sm">
				<div class="flex items-center justify-between">
					<h2 class="font-semibold text-gray-800">Varian</h2>
					<button
						type="button"
						onclick={addVariant}
						class="text-xs font-medium text-yellow-700 hover:text-yellow-800 flex items-center gap-1"
					>
						<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
						Tambah Varian
					</button>
				</div>

				<div class="flex flex-col gap-3">
					{#each variants as variant, i (variant._key)}
						<div class="grid grid-cols-4 gap-2 items-end p-3 rounded-lg bg-gray-50 border border-gray-200">
							{#if variant.id}
								<input type="hidden" name="variant_id_{i}" value={variant.id} />
							{/if}
							<div class="flex flex-col gap-1 col-span-2">
								<label class="text-xs text-gray-500" for="flavor_{i}">Rasa / Nama Varian</label>
								<input
									id="flavor_{i}"
									name="variant_flavor_{i}"
									type="text"
									value={variant.flavor ?? ''}
									class="px-2 py-1.5 rounded border border-gray-300 text-xs focus:outline-none focus:border-yellow-500"
									placeholder="Mango, Strawberry..."
								/>
							</div>
							<div class="flex flex-col gap-1">
								<label class="text-xs text-gray-500" for="nic_{i}">Nikotin (mg)</label>
								<input
									id="nic_{i}"
									name="variant_nicotine_{i}"
									type="number"
									value={variant.nicotine_mg ?? ''}
									min="0"
									class="px-2 py-1.5 rounded border border-gray-300 text-xs focus:outline-none focus:border-yellow-500"
									placeholder="3, 6, 30..."
								/>
							</div>
							<div class="flex flex-col gap-1">
								<label class="text-xs text-gray-500" for="price_{i}">Harga *</label>
								<input
									id="price_{i}"
									name="variant_price_{i}"
									type="number"
									value={variant.price ?? ''}
									min="0"
									required
									class="px-2 py-1.5 rounded border border-gray-300 text-xs focus:outline-none focus:border-yellow-500"
									placeholder="85000"
								/>
							</div>
							<div class="flex flex-col gap-1">
								<label class="text-xs text-gray-500" for="stock_{i}">Stok</label>
								<input
									id="stock_{i}"
									name="variant_stock_{i}"
									type="number"
									value={variant.stock ?? 0}
									min="0"
									class="px-2 py-1.5 rounded border border-gray-300 text-xs focus:outline-none focus:border-yellow-500"
								/>
							</div>
							<input type="hidden" name="variant_count" value={variants.length} />
							{#if variants.length > 1}
								<div class="col-span-4 flex justify-end">
									<button
										type="button"
										onclick={() => removeVariant(variant._key)}
										class="text-xs text-red-400 hover:text-red-600 transition-colors"
									>
										Hapus varian
									</button>
								</div>
							{/if}
						</div>
					{/each}
				</div>
				<input type="hidden" name="variant_count" value={variants.length} />
			</div>
		</div>

		<!-- Sidebar: preview + submit -->
		<div class="flex flex-col gap-4">
			<!-- Preview card -->
			<div class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
				<h3 class="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Preview Kartu</h3>
				<div class="max-w-[200px] mx-auto">
					<ProductCard product={previewProduct} />
				</div>
			</div>

			<!-- Submit -->
			<div class="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-2 shadow-sm">
				<button
					type="submit"
					class="w-full py-2.5 rounded-lg bg-yellow-600 text-sm font-semibold text-white hover:bg-yellow-700 transition-colors"
				>
					{product ? 'Simpan Perubahan' : 'Tambah Produk'}
				</button>
				<a
					href="/admin/produk"
					class="w-full py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors text-center"
				>
					Batal
				</a>
			</div>

			<!-- Existing images preview -->
			{#if existingImages.length > 0}
				<div class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
					<h3 class="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Foto Produk</h3>
					<div class="grid grid-cols-3 gap-2">
						{#each existingImages as img}
							<img src={img.url} alt="Foto produk" class="w-full aspect-square object-cover rounded-lg" />
						{/each}
					</div>
					<p class="text-xs text-gray-400 mt-2">Upload foto via Supabase Storage</p>
				</div>
			{/if}
		</div>
	</div>
</form>
