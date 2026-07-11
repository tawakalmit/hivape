<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import FilterChip from '$lib/components/FilterChip.svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let filterOpen = $state(false);
	let selectedCategory = $state(data.currentCategory ?? '');

	function setCategory(slug: string) {
		selectedCategory = slug;
		const params = new URLSearchParams($page.url.searchParams);
		if (slug) params.set('kategori', slug);
		else params.delete('kategori');
		params.delete('page');
		goto(`?${params}`, { keepFocus: true });
	}
</script>

<svelte:head>
	<title>Katalog Produk — HiVape Store</title>
	<meta name="description" content="Semua produk vape premium: saltnic, freebase, pod, device & accessories. Pilih varian favoritmu." />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
	<!-- Page header -->
	<div class="mb-8">
		<p class="text-xs font-[Space_Grotesk,sans-serif] tracking-[0.3em] uppercase text-[#B08D4F] mb-2">Katalog</p>
		<h1 class="font-['Playfair_Display',Georgia,serif] text-4xl font-bold text-[#F4EFE3]">Semua Produk</h1>
	</div>

	<!-- Mobile filter toggle -->
	<button
		type="button"
		class="md:hidden mb-4 flex items-center gap-2 text-xs font-[Space_Grotesk,sans-serif] tracking-widest uppercase text-[#8C8578] border border-[#2a2620] px-4 py-2 rounded-lg hover:border-[#B08D4F]/50 transition-colors"
		onclick={() => (filterOpen = !filterOpen)}
		aria-expanded={filterOpen}
	>
		<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<line x1="21" y1="4" x2="14" y2="4"/><line x1="10" y1="4" x2="3" y2="4"/>
			<line x1="21" y1="12" x2="12" y2="12"/><line x1="8" y1="12" x2="3" y2="12"/>
			<line x1="21" y1="20" x2="16" y2="20"/><line x1="12" y1="20" x2="3" y2="20"/>
		</svg>
		Filter Kategori
	</button>

	<!-- Mobile: filter as horizontal scroll chips -->
	{#if filterOpen || true}
		<div class="md:hidden mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
			<FilterChip label="Semua" active={!selectedCategory} onclick={() => setCategory('')} />
			{#each data.categories as cat}
				<FilterChip label={cat.name} active={selectedCategory === cat.slug} onclick={() => setCategory(cat.slug)} />
			{/each}
		</div>
	{/if}

	<div class="flex gap-8">
		<!-- Desktop sidebar filter -->
		<aside class="hidden md:flex flex-col gap-2 w-48 shrink-0" aria-label="Filter produk">
			<p class="text-xs font-[Space_Grotesk,sans-serif] tracking-widest uppercase text-[#B08D4F] mb-2">Kategori</p>
			<FilterChip label="Semua" active={!selectedCategory} onclick={() => setCategory('')} />
			{#each data.categories as cat}
				<FilterChip label={cat.name} active={selectedCategory === cat.slug} onclick={() => setCategory(cat.slug)} />
			{/each}
		</aside>

		<!-- Product grid -->
		<div class="flex-1 min-w-0">
			{#if data.products.length > 0}
				<div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
					{#each data.products as product}
						<ProductCard {product} />
					{/each}
				</div>

				<!-- Pagination -->
				{#if data.products.length === 24}
					<div class="flex justify-center gap-2 mt-10">
						{#if data.page > 1}
							<a
								href="?{new URLSearchParams({ ...(data.currentCategory ? { kategori: data.currentCategory } : {}), page: String(data.page - 1) })}"
								class="px-5 py-2 text-xs font-[Space_Grotesk,sans-serif] tracking-widest uppercase border border-[#B08D4F]/40 text-[#F4EFE3] rounded-lg hover:border-[#B08D4F] transition-colors"
							>
								← Prev
							</a>
						{/if}
						<a
							href="?{new URLSearchParams({ ...(data.currentCategory ? { kategori: data.currentCategory } : {}), page: String(data.page + 1) })}"
							class="px-5 py-2 text-xs font-[Space_Grotesk,sans-serif] tracking-widest uppercase border border-[#B08D4F]/40 text-[#F4EFE3] rounded-lg hover:border-[#B08D4F] transition-colors"
						>
							Next →
						</a>
					</div>
				{/if}
			{:else}
				<div class="py-20 text-center">
					<p class="text-[#8C8578] font-[Space_Grotesk,sans-serif] tracking-widest uppercase text-sm">
						Tidak ada produk ditemukan
					</p>
					<button
						type="button"
						class="mt-4 text-xs text-[#B08D4F] hover:text-[#F1D48A] transition-colors font-[Space_Grotesk,sans-serif] tracking-widest uppercase"
						onclick={() => setCategory('')}
					>
						Reset filter
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>
