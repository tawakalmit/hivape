<script lang="ts">
	import ProductCard from '$lib/components/ProductCard.svelte';
	import FilterChip from '$lib/components/FilterChip.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.category.name} — HiVape Store</title>
	<meta name="description" content="Produk {data.category.name} original dan premium di HiVape Store." />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
	<!-- Header -->
	<div class="mb-8">
		<nav class="flex items-center gap-2 text-xs font-[Space_Grotesk,sans-serif] text-[#8C8578] mb-4" aria-label="Breadcrumb">
			<a href="/" class="hover:text-[#F4EFE3] transition-colors">Home</a>
			<span>/</span>
			<span class="text-[#F4EFE3]">{data.category.name}</span>
		</nav>
		<h1 class="font-['Playfair_Display',Georgia,serif] text-4xl font-bold text-[#F4EFE3]">
			{data.category.name}
		</h1>
		<p class="mt-2 text-[#8C8578] text-sm">{data.products.length} produk tersedia</p>
	</div>

	<!-- Category chips -->
	<div class="flex gap-2 overflow-x-auto pb-3 mb-8">
		{#each data.categories as cat}
			<FilterChip
				label={cat.name}
				active={cat.slug === data.category.slug}
				onclick={() => { if (cat.slug !== data.category.slug) window.location.href = `/kategori/${cat.slug}`; }}
			/>
		{/each}
	</div>

	{#if data.products.length > 0}
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
			{#each data.products as product}
				<ProductCard {product} />
			{/each}
		</div>
	{:else}
		<div class="py-20 text-center">
			<p class="text-[#8C8578] font-[Space_Grotesk,sans-serif] tracking-widest uppercase text-sm">
				Belum ada produk di kategori ini
			</p>
		</div>
	{/if}
</div>
