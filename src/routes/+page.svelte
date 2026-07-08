<script lang="ts">
	import TrustBadges from '$lib/components/TrustBadges.svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import SectionDivider from '$lib/components/SectionDivider.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const categoryIcons: Record<string, string> = {
		'liquid-saltnic': '🧪',
		'liquid-freebase': '⚗️',
		'pod-system': '🟦',
		'device-mod': '⚡',
		'coil-accessories': '🔧',
		merchandise: '🛍️'
	};
</script>

<svelte:head>
	<title>HiVape Store — Premium Vape & Liquid</title>
	<meta name="description" content="Toko vape premium dengan produk original, kualitas terbaik, rasa terdepan. Saltnic, freebase, pod, device & accessories." />
</svelte:head>

<!-- HERO -->
<section class="relative overflow-hidden min-h-[80vh] flex items-center" aria-label="Hero">
	<!-- Background glow -->
	<div
		class="absolute inset-0 pointer-events-none"
		style="background: radial-gradient(ellipse 60% 70% at 50% 100%, rgba(201,162,76,0.08) 0%, transparent 70%)"
		aria-hidden="true"
	></div>

	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 grid md:grid-cols-2 gap-12 items-center w-full">
		<!-- Hero text -->
		<div class="flex flex-col gap-6 animate-fade-up">
			<p class="text-xs font-[Space_Grotesk,sans-serif] tracking-[0.3em] uppercase text-[#B08D4F]">
				Premium Vape Store
			</p>
			<h1 class="font-['Playfair_Display',Georgia,serif] text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-[#F4EFE3]">
				Rasa Terbaik,<br />
				<span style="background: linear-gradient(135deg, #C9A24C, #F1D48A); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
					Kualitas Premium.
				</span>
			</h1>
			<p class="text-[#8C8578] text-lg leading-relaxed max-w-md">
				Liquid saltnic, freebase, pod system, device, coil & accessories — semua original, semua pilihan terbaik.
			</p>
			<div class="flex flex-wrap gap-3">
				<a
					href="/produk"
					class="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-[Space_Grotesk,sans-serif] text-sm font-semibold tracking-widest uppercase text-[#0A0908] transition-opacity hover:opacity-90"
					style="background: linear-gradient(135deg, #C9A24C, #F1D48A);"
				>
					Lihat Katalog
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
					</svg>
				</a>
				<a
					href="/kategori/liquid-saltnic"
					class="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-[Space_Grotesk,sans-serif] text-sm font-semibold tracking-widest uppercase text-[#F4EFE3] border border-[#B08D4F]/40 hover:border-[#B08D4F] transition-colors"
				>
					Saltnic Terbaru
				</a>
			</div>
		</div>

		<!-- Hero product podium visual -->
		<div class="relative flex items-center justify-center" aria-hidden="true">
			<div class="relative w-72 h-80 flex items-end justify-center">
				<!-- Gold ring glow -->
				<div
					class="absolute inset-0"
					style="background: radial-gradient(ellipse 80% 50% at 50% 85%, rgba(201,162,76,0.3) 0%, transparent 65%)"
				></div>
				<!-- Podium placeholder or featured product hint -->
				<div class="absolute inset-0 flex items-center justify-center">
					<div class="flex flex-col items-center gap-4 opacity-40">
						<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#C9A24C" stroke-width="0.8">
							<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
						</svg>
						<span class="text-[#B08D4F] font-[Space_Grotesk,sans-serif] text-xs tracking-widest uppercase">H!VAPE STORE</span>
					</div>
				</div>
				<!-- Gold ring outline -->
				<div
					class="absolute bottom-8 w-48 h-8 rounded-full opacity-40"
					style="background: transparent; box-shadow: 0 0 0 1px rgba(201,162,76,0.6), 0 0 24px rgba(201,162,76,0.2);"
				></div>
			</div>
		</div>
	</div>
</section>

<!-- TRUST BADGES -->
<TrustBadges />

<!-- KATEGORI GRID -->
{#if data.categories.length > 0}
	<section class="py-16 max-w-7xl mx-auto px-4 sm:px-6" aria-labelledby="kategori-heading">
		<div class="flex flex-col gap-2 mb-8">
			<p class="text-xs font-[Space_Grotesk,sans-serif] tracking-[0.3em] uppercase text-[#B08D4F]">Browse</p>
			<h2 id="kategori-heading" class="font-['Playfair_Display',Georgia,serif] text-3xl font-bold text-[#F4EFE3]">
				Kategori Produk
			</h2>
		</div>
		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
			{#each data.categories as cat}
				<a
					href="/kategori/{cat.slug}"
					class="group relative overflow-hidden rounded-xl bg-[#16140F] border border-[#2a2620] p-5 flex flex-col items-center gap-3 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#B08D4F]/50 hover:shadow-[0_8px_24px_rgba(201,162,76,0.12)]"
				>
					{#if cat.cover_image_url}
						<img src={cat.cover_image_url} alt="" class="w-12 h-12 object-cover rounded-lg opacity-70 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
					{:else}
						<span class="text-2xl" aria-hidden="true">{categoryIcons[cat.slug] ?? '📦'}</span>
					{/if}
					<span class="text-xs font-[Space_Grotesk,sans-serif] tracking-widest uppercase text-[#8C8578] group-hover:text-[#F4EFE3] transition-colors leading-snug">
						{cat.name}
					</span>
				</a>
			{/each}
		</div>
	</section>

	<SectionDivider />
{/if}

<!-- PRODUK TERBARU -->
<section class="py-16 max-w-7xl mx-auto px-4 sm:px-6" aria-labelledby="produk-heading">
	<div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
		<div class="flex flex-col gap-2">
			<p class="text-xs font-[Space_Grotesk,sans-serif] tracking-[0.3em] uppercase text-[#B08D4F]">Terbaru</p>
			<h2 id="produk-heading" class="font-['Playfair_Display',Georgia,serif] text-3xl font-bold text-[#F4EFE3]">
				Produk Pilihan
			</h2>
		</div>
		<a
			href="/produk"
			class="text-xs font-[Space_Grotesk,sans-serif] tracking-widest uppercase text-[#B08D4F] hover:text-[#F1D48A] transition-colors flex items-center gap-1"
		>
			Lihat Semua
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
			</svg>
		</a>
	</div>

	{#if data.products.length > 0}
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
			{#each data.products as product}
				<ProductCard {product} />
			{/each}
		</div>
	{:else}
		<div class="py-16 text-center text-[#8C8578]">
			<p class="font-[Space_Grotesk,sans-serif] tracking-widest uppercase text-xs">Belum ada produk</p>
		</div>
	{/if}
</section>
