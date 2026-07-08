<script lang="ts">
	import { formatPriceRange } from '$lib/utils/format';
	import type { ProductCard } from '$lib/types';

	let { product }: { product: ProductCard } = $props();

	const priceStr = $derived(formatPriceRange(product.price_min, product.price_max));
</script>

<a
	href="/produk/{product.slug}"
	class="group relative flex flex-col overflow-hidden rounded-xl bg-[#16140F] border border-[#2a2620] transition-all duration-300 hover:-translate-y-1 hover:border-[#B08D4F]/50 hover:shadow-[0_8px_32px_rgba(201,162,76,0.15)] focus-visible:outline-2 focus-visible:outline-[#C9A24C]"
>
	<!-- Product image with podium glow -->
	<div class="relative aspect-[4/5] overflow-hidden bg-[#0D0B08] flex items-center justify-center">
		<!-- Gold ring glow behind product -->
		<div
			class="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-60 group-hover:opacity-100"
			style="background: radial-gradient(ellipse 70% 40% at 50% 85%, rgba(201,162,76,0.2) 0%, transparent 70%)"
			aria-hidden="true"
		></div>

		{#if product.image_url}
			<img
				src={product.image_url}
				alt={product.name}
				class="relative z-10 w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
				loading="lazy"
			/>
		{:else}
			<!-- Placeholder podium -->
			<div class="relative z-10 flex flex-col items-center justify-center gap-2 opacity-30">
				<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-[#B08D4F]">
					<rect x="3" y="11" width="18" height="11" rx="2"/>
					<path d="M7 11V7a5 5 0 0 1 10 0v4"/>
				</svg>
				<span class="text-xs font-[Space_Grotesk] tracking-widest uppercase text-[#8C8578]">No Image</span>
			</div>
		{/if}

		<!-- Category badge -->
		<span class="absolute top-3 left-3 z-20 text-[10px] font-[Space_Grotesk] tracking-widest uppercase text-[#8C8578] bg-[#0A0908]/80 px-2 py-1 rounded-full border border-[#2a2620]">
			{product.category}
		</span>

		{#if product.status === 'out_of_stock'}
			<div class="absolute inset-0 z-30 bg-[#0A0908]/70 flex items-center justify-center">
				<span class="text-xs font-[Space_Grotesk] tracking-widest uppercase text-[#8C8578] border border-[#8C8578]/40 px-3 py-1 rounded-full">
					Habis
				</span>
			</div>
		{/if}
	</div>

	<!-- Card content -->
	<div class="p-4 flex flex-col gap-1 flex-1">
		<h3 class="font-[Inter,sans-serif] text-sm font-medium text-[#F4EFE3] leading-snug line-clamp-2">
			{product.name}
		</h3>
		{#if product.variants_count > 1}
			<p class="text-xs text-[#8C8578] font-[Inter,sans-serif]">{product.variants_count} varian</p>
		{/if}
		<p class="mt-auto pt-2 text-sm font-semibold font-[Inter,sans-serif]" style="background: linear-gradient(135deg, #C9A24C, #F1D48A); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
			{priceStr}
		</p>
	</div>
</a>
