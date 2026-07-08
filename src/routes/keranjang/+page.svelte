<script lang="ts">
	import { cart } from '$lib/stores/cart';
	import { formatPrice } from '$lib/utils/format';
	import { page } from '$app/stores';

	const WA_PHONE = import.meta.env.VITE_WA_PHONE ?? '6281234567890';

	const total = $derived($cart.reduce((sum, i) => sum + i.price * i.quantity, 0));

	function checkout() {
		const url = cart.generateWhatsAppMessage(WA_PHONE, $page.url.origin);
		window.open(url, '_blank', 'noopener,noreferrer');
	}
</script>

<svelte:head>
	<title>Keranjang — HiVape Store</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-4 sm:px-6 py-10">
	<div class="mb-8">
		<p class="text-xs font-[Space_Grotesk,sans-serif] tracking-[0.3em] uppercase text-[#B08D4F] mb-2">Pesanan</p>
		<h1 class="font-['Playfair_Display',Georgia,serif] text-4xl font-bold text-[#F4EFE3]">Keranjang</h1>
	</div>

	{#if $cart.length === 0}
		<div class="py-20 text-center flex flex-col items-center gap-4">
			<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#B08D4F" stroke-width="1">
				<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
				<line x1="3" y1="6" x2="21" y2="6"/>
				<path d="M16 10a4 4 0 0 1-8 0"/>
			</svg>
			<p class="text-[#8C8578] font-[Space_Grotesk,sans-serif] tracking-widest uppercase text-sm">Keranjang kosong</p>
			<a href="/produk" class="text-xs font-[Space_Grotesk,sans-serif] tracking-widest uppercase text-[#B08D4F] hover:text-[#F1D48A] transition-colors">
				Lihat Produk →
			</a>
		</div>
	{:else}
		<div class="flex flex-col gap-3 mb-6">
			{#each $cart as item (item.productId + item.variantId)}
				{@const variant = [item.flavor, item.nicotineMg ? `${item.nicotineMg}mg` : null].filter(Boolean).join(' / ')}
				<div class="flex gap-4 p-4 rounded-xl bg-[#16140F] border border-[#2a2620]">
					{#if item.imageUrl}
						<img src={item.imageUrl} alt={item.productName} class="w-16 h-16 object-cover rounded-lg" />
					{:else}
						<div class="w-16 h-16 rounded-lg bg-[#0D0B08] flex items-center justify-center">
							<span class="text-[#8C8578]/30 text-xs">—</span>
						</div>
					{/if}
					<div class="flex-1 min-w-0">
						<a href="/produk/{item.productSlug}" class="text-sm font-medium text-[#F4EFE3] hover:text-[#F1D48A] transition-colors line-clamp-1">
							{item.productName}
						</a>
						{#if variant}
							<p class="text-xs text-[#8C8578] mt-0.5">{variant}</p>
						{/if}
						<div class="flex items-center gap-3 mt-2">
							<div class="flex items-center gap-2">
								<button
									type="button"
									onclick={() => cart.updateQuantity(item.productId, item.variantId, item.quantity - 1)}
									class="w-7 h-7 rounded border border-[#2a2620] text-[#F4EFE3] hover:border-[#B08D4F]/50 transition-colors text-sm"
									aria-label="Kurangi"
								>–</button>
								<span class="text-sm text-[#F4EFE3] w-6 text-center">{item.quantity}</span>
								<button
									type="button"
									onclick={() => cart.updateQuantity(item.productId, item.variantId, item.quantity + 1)}
									class="w-7 h-7 rounded border border-[#2a2620] text-[#F4EFE3] hover:border-[#B08D4F]/50 transition-colors text-sm"
									aria-label="Tambah"
								>+</button>
							</div>
							<button
								type="button"
								onclick={() => cart.removeItem(item.productId, item.variantId)}
								class="ml-auto text-xs text-[#8C8578] hover:text-red-400 transition-colors font-[Space_Grotesk,sans-serif] tracking-widest uppercase"
							>
								Hapus
							</button>
						</div>
					</div>
					<div class="shrink-0 text-right">
						<p class="text-sm font-semibold" style="background: linear-gradient(135deg, #C9A24C, #F1D48A); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
							{formatPrice(item.price * item.quantity)}
						</p>
						<p class="text-xs text-[#8C8578] mt-0.5">{formatPrice(item.price)} × {item.quantity}</p>
					</div>
				</div>
			{/each}
		</div>

		<!-- Summary -->
		<div class="p-5 rounded-xl bg-[#16140F] border border-[#2a2620] flex flex-col gap-4">
			<div class="flex justify-between items-center">
				<span class="text-[#8C8578] font-[Inter,sans-serif]">Total</span>
				<span class="text-xl font-bold" style="background: linear-gradient(135deg, #C9A24C, #F1D48A); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
					{formatPrice(total)}
				</span>
			</div>
			<p class="text-xs text-[#8C8578]">* Ongkos kirim didiskusikan via WhatsApp</p>
			<button
				type="button"
				onclick={checkout}
				class="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-[Space_Grotesk,sans-serif] text-sm font-semibold tracking-widest uppercase text-[#0A0908] transition-opacity hover:opacity-90"
				style="background: linear-gradient(135deg, #C9A24C, #F1D48A);"
			>
				<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
					<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
				</svg>
				Checkout via WhatsApp
			</button>
			<button
				type="button"
				onclick={() => cart.clear()}
				class="text-xs text-[#8C8578] hover:text-red-400 transition-colors font-[Space_Grotesk,sans-serif] tracking-widest uppercase text-center"
			>
				Kosongkan keranjang
			</button>
		</div>
	{/if}
</div>
