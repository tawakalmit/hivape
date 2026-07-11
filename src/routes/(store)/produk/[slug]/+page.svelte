<script lang="ts">
	import VariantSelector from '$lib/components/VariantSelector.svelte';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import SectionDivider from '$lib/components/SectionDivider.svelte';
	import { formatPrice } from '$lib/utils/format';
	import { cart } from '$lib/stores/cart';
	import { toasts } from '$lib/stores/toast';
	import type { Variant } from '$lib/types';
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	const WA_PHONE = import.meta.env.VITE_WA_PHONE ?? '6281234567890';

	let { data }: { data: PageData } = $props();

	let selectedVariant = $state<Variant | null>(null);
	let quantity = $state(1);
	let activeImage = $state(0);

	const product = $derived(data.product);
	const images = $derived(
		[...product.product_images].sort((a, b) => {
			if (a.is_primary && !b.is_primary) return -1;
			if (!a.is_primary && b.is_primary) return 1;
			return a.sort_order - b.sort_order;
		})
	);

	function buildWaLink() {
		if (!selectedVariant) return '#';
		const variantStr = [
			selectedVariant.flavor,
			selectedVariant.nicotine_mg ? `${selectedVariant.nicotine_mg}mg` : null
		]
			.filter(Boolean)
			.join(' / ');
		const productUrl = `${$page.url.origin}/produk/${product.slug}`;
		const message =
			`Halo HiVape Store, saya mau pesan:\n` +
			`- Produk: ${product.name}\n` +
			`- Varian: ${variantStr || 'Default'}\n` +
			`- Jumlah: ${quantity}\n` +
			`Link produk: ${productUrl}`;
		return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(message)}`;
	}

	function addToCart() {
		if (!selectedVariant) return;
		const variantStr = [
			selectedVariant.flavor,
			selectedVariant.nicotine_mg ? `${selectedVariant.nicotine_mg}mg` : null
		]
			.filter(Boolean)
			.join(' / ');
		cart.addItem({
			productId: product.id,
			productName: product.name,
			productSlug: product.slug,
			variantId: selectedVariant.id,
			flavor: selectedVariant.flavor,
			nicotineMg: selectedVariant.nicotine_mg,
			price: selectedVariant.price,
			quantity,
			imageUrl: images[0]?.url ?? null
		});
		toasts.show(`${product.name} ditambahkan ke keranjang`, 'success');
	}
</script>

<svelte:head>
	<title>{product.name} — HiVape Store</title>
	<meta name="description" content={product.description_short ?? `${product.name} — produk premium HiVape Store.`} />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
	<!-- Breadcrumb -->
	<nav class="flex items-center gap-2 text-xs font-[Space_Grotesk,sans-serif] text-[#8C8578] mb-8" aria-label="Breadcrumb">
		<a href="/" class="hover:text-[#F4EFE3] transition-colors">Home</a>
		<span>/</span>
		<a href="/produk" class="hover:text-[#F4EFE3] transition-colors">Produk</a>
		<span>/</span>
		<a href="/kategori/{product.categories.slug}" class="hover:text-[#F4EFE3] transition-colors">{product.categories.name}</a>
		<span>/</span>
		<span class="text-[#F4EFE3] truncate max-w-32">{product.name}</span>
	</nav>

	<div class="grid md:grid-cols-2 gap-10 lg:gap-16">
		<!-- Gallery -->
		<div class="flex flex-col gap-3">
			<!-- Main image with podium glow -->
			<div class="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#0D0B08] flex items-center justify-center border border-[#2a2620]">
				<div
					class="absolute inset-0 pointer-events-none"
					style="background: radial-gradient(ellipse 70% 40% at 50% 85%, rgba(201,162,76,0.2) 0%, transparent 70%)"
					aria-hidden="true"
				></div>
				{#if images.length > 0}
					<img
						src={images[activeImage]?.url}
						alt={product.name}
						class="relative z-10 w-full h-full object-contain p-6"
					/>
				{:else}
					<div class="flex flex-col items-center gap-3 opacity-30">
						<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#B08D4F" stroke-width="1">
							<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
							<polyline points="21 15 16 10 5 21"/>
						</svg>
						<span class="text-xs font-[Space_Grotesk,sans-serif] tracking-widest uppercase text-[#8C8578]">No Image</span>
					</div>
				{/if}
				<!-- Gold ring -->
				<div
					class="absolute bottom-6 left-1/2 -translate-x-1/2 w-32 h-5 rounded-full"
					style="box-shadow: 0 0 0 1px rgba(201,162,76,0.4), 0 0 16px rgba(201,162,76,0.15);"
					aria-hidden="true"
				></div>
			</div>

			<!-- Thumbnail strip -->
			{#if images.length > 1}
				<div class="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Foto produk">
					{#each images as img, i}
						<button
							type="button"
							role="tab"
							aria-selected={activeImage === i}
							onclick={() => (activeImage = i)}
							class="shrink-0 w-16 h-16 rounded-lg overflow-hidden border transition-colors
							{activeImage === i ? 'border-[#C9A24C]' : 'border-[#2a2620] hover:border-[#B08D4F]/50'}"
						>
							<img src={img.url} alt="Foto {i + 1}" class="w-full h-full object-cover" />
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Product info -->
		<div class="flex flex-col gap-6">
			<div>
				<a
					href="/kategori/{product.categories.slug}"
					class="text-xs font-[Space_Grotesk,sans-serif] tracking-widest uppercase text-[#B08D4F] hover:text-[#F1D48A] transition-colors"
				>
					{product.categories.name}
				</a>
				<h1 class="mt-2 font-['Playfair_Display',Georgia,serif] text-3xl md:text-4xl font-bold text-[#F4EFE3] leading-tight">
					{product.name}
				</h1>
			</div>

			<!-- Price -->
			{#if selectedVariant}
				<p class="text-3xl font-semibold font-[Inter,sans-serif]" style="background: linear-gradient(135deg, #C9A24C, #F1D48A); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
					{formatPrice(selectedVariant.price)}
				</p>
			{:else if product.variants.length > 0}
				{@const prices = product.variants.map((v) => v.price)}
				<p class="text-2xl font-semibold font-[Inter,sans-serif]" style="background: linear-gradient(135deg, #C9A24C, #F1D48A); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
					{formatPrice(Math.min(...prices))}{Math.min(...prices) !== Math.max(...prices) ? ` – ${formatPrice(Math.max(...prices))}` : ''}
				</p>
			{/if}

			<!-- Short description -->
			{#if product.description_short}
				<p class="text-[#8C8578] leading-relaxed">{product.description_short}</p>
			{/if}

			<!-- Variant selector -->
			{#if product.variants.length > 0}
				<VariantSelector variants={product.variants} bind:selected={selectedVariant} />
			{/if}

			<!-- Quantity -->
			<div class="flex flex-col gap-2">
				<label class="text-xs font-[Space_Grotesk,sans-serif] uppercase tracking-widest text-[#8C8578]" for="qty">
					Jumlah
				</label>
				<div class="flex items-center gap-3">
					<button
						type="button"
						onclick={() => (quantity = Math.max(1, quantity - 1))}
						class="w-9 h-9 rounded-lg border border-[#2a2620] text-[#F4EFE3] hover:border-[#B08D4F]/50 transition-colors flex items-center justify-center"
						aria-label="Kurangi"
					>–</button>
					<input
						id="qty"
						type="number"
						bind:value={quantity}
						min="1"
						max="99"
						class="w-16 text-center bg-[#16140F] border border-[#2a2620] rounded-lg py-2 text-[#F4EFE3] text-sm [appearance:textfield] focus:outline-none focus:border-[#B08D4F]"
					/>
					<button
						type="button"
						onclick={() => (quantity = Math.min(99, quantity + 1))}
						class="w-9 h-9 rounded-lg border border-[#2a2620] text-[#F4EFE3] hover:border-[#B08D4F]/50 transition-colors flex items-center justify-center"
						aria-label="Tambah"
					>+</button>
				</div>
			</div>

			<!-- Action buttons -->
			<div class="flex flex-col gap-3">
				<!-- WhatsApp CTA -->
				<a
					href={buildWaLink()}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl font-[Space_Grotesk,sans-serif] text-sm font-semibold tracking-widest uppercase text-[#0A0908] transition-opacity hover:opacity-90
					{!selectedVariant ? 'pointer-events-none opacity-50' : ''}"
					style="background: linear-gradient(135deg, #C9A24C, #F1D48A);"
					aria-disabled={!selectedVariant}
				>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
						<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
					</svg>
					Pesan via WhatsApp
				</a>

				<!-- Add to cart -->
				<button
					type="button"
					onclick={addToCart}
					disabled={!selectedVariant}
					class="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl font-[Space_Grotesk,sans-serif] text-sm font-semibold tracking-widest uppercase text-[#F4EFE3] border border-[#B08D4F]/40 transition-colors hover:border-[#B08D4F] disabled:opacity-40 disabled:cursor-not-allowed"
				>
					+ Keranjang
				</button>
			</div>

			<!-- Spec table / long description -->
			{#if product.description_long}
				<div class="border-t border-[#2a2620] pt-5 mt-2">
					<h2 class="text-xs font-[Space_Grotesk,sans-serif] tracking-widest uppercase text-[#B08D4F] mb-3">Deskripsi</h2>
					<div class="text-[#8C8578] text-sm leading-relaxed whitespace-pre-line">
						{product.description_long}
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Related products -->
	{#if data.related.length > 0}
		<div class="mt-20">
			<SectionDivider />
			<div class="mt-10 flex flex-col gap-6">
				<h2 class="font-['Playfair_Display',Georgia,serif] text-2xl font-bold text-[#F4EFE3]">Produk Terkait</h2>
				<div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
					{#each data.related as product}
						<ProductCard {product} />
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>

<!-- Sticky WA button (mobile) -->
{#if selectedVariant}
	<div class="fixed bottom-0 left-0 right-0 z-40 md:hidden p-4 bg-gradient-to-t from-[#0A0908] to-transparent pointer-events-none">
		<a
			href={buildWaLink()}
			target="_blank"
			rel="noopener noreferrer"
			class="pointer-events-auto flex items-center justify-center gap-2 w-full py-4 rounded-xl font-[Space_Grotesk,sans-serif] text-sm font-semibold tracking-widest uppercase text-[#0A0908] shadow-lg"
			style="background: linear-gradient(135deg, #C9A24C, #F1D48A);"
		>
			<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
				<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
			</svg>
			Pesan via WhatsApp
		</a>
	</div>
{/if}
