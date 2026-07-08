<script lang="ts">
	import { page } from '$app/stores';
	import { cart } from '$lib/stores/cart';
	import { derived } from 'svelte/store';

	const WA_PHONE = import.meta.env.VITE_WA_PHONE ?? '6281234567890';

	const cartCount = derived(cart, ($cart) => $cart.reduce((sum, i) => sum + i.quantity, 0));

	const categories = [
		{ label: 'Saltnic', href: '/kategori/liquid-saltnic' },
		{ label: 'Freebase', href: '/kategori/liquid-freebase' },
		{ label: 'Pod System', href: '/kategori/pod-system' },
		{ label: 'Device', href: '/kategori/device-mod' },
		{ label: 'Coil & Acc', href: '/kategori/coil-accessories' }
	];

	let menuOpen = $state(false);

	function closeMenu() {
		menuOpen = false;
	}
</script>

<header class="sticky top-0 z-50 border-b border-[#2a2620]/60 bg-[#0A0908]/90 backdrop-blur-md">
	<nav class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4" aria-label="Navigasi utama">
		<!-- Logo -->
		<a
			href="/"
			class="font-[Space_Grotesk,sans-serif] text-lg font-semibold tracking-[0.2em] uppercase text-[#F4EFE3] hover:text-[#F1D48A] transition-colors shrink-0"
		>
			H!VAPE
		</a>

		<!-- Desktop nav links -->
		<ul class="hidden md:flex items-center gap-1" role="list">
			{#each categories as cat}
				{@const isActive = $page.url.pathname.startsWith(cat.href)}
				<li>
					<a
						href={cat.href}
						class="px-3 py-1.5 text-xs font-[Space_Grotesk,sans-serif] tracking-widest uppercase transition-colors rounded
						{isActive
							? 'text-[#F1D48A]'
							: 'text-[#8C8578] hover:text-[#F4EFE3]'
						}"
					>
						{cat.label}
					</a>
				</li>
			{/each}
		</ul>

		<!-- Right actions -->
		<div class="flex items-center gap-2">
			<!-- Katalog link (desktop) -->
			<a href="/produk" class="hidden md:inline-flex items-center gap-1.5 text-xs font-[Space_Grotesk,sans-serif] tracking-widest uppercase text-[#8C8578] hover:text-[#F4EFE3] transition-colors px-3 py-1.5">
				Semua Produk
			</a>

			<!-- Cart -->
			<a
				href="/keranjang"
				class="relative p-2 text-[#8C8578] hover:text-[#F4EFE3] transition-colors rounded"
				aria-label="Keranjang"
			>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
					<line x1="3" y1="6" x2="21" y2="6"/>
					<path d="M16 10a4 4 0 0 1-8 0"/>
				</svg>
				{#if $cartCount > 0}
					<span class="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center text-[9px] font-bold rounded-full text-[#0A0908] px-1"
						style="background: linear-gradient(135deg, #C9A24C, #F1D48A)">
						{$cartCount}
					</span>
				{/if}
			</a>

			<!-- WhatsApp icon (always visible) -->
			<a
				href="https://wa.me/{WA_PHONE}"
				target="_blank"
				rel="noopener noreferrer"
				class="p-2 text-[#8C8578] hover:text-[#25D366] transition-colors rounded"
				aria-label="WhatsApp HiVape"
			>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
				</svg>
			</a>

			<!-- Mobile hamburger -->
			<button
				type="button"
				class="md:hidden p-2 text-[#8C8578] hover:text-[#F4EFE3] transition-colors rounded"
				aria-label="Buka menu"
				aria-expanded={menuOpen}
				onclick={() => (menuOpen = !menuOpen)}
			>
				{#if menuOpen}
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
					</svg>
				{:else}
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
					</svg>
				{/if}
			</button>
		</div>
	</nav>

	<!-- Mobile menu -->
	{#if menuOpen}
		<div class="md:hidden border-t border-[#2a2620]/60 bg-[#0A0908]">
			<ul class="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1" role="list">
				<li>
					<a href="/produk" class="block px-3 py-2 text-xs font-[Space_Grotesk,sans-serif] tracking-widest uppercase text-[#F4EFE3] hover:text-[#F1D48A] transition-colors" onclick={closeMenu}>
						Semua Produk
					</a>
				</li>
				{#each categories as cat}
					<li>
						<a
							href={cat.href}
							class="block px-3 py-2 text-xs font-[Space_Grotesk,sans-serif] tracking-widest uppercase text-[#8C8578] hover:text-[#F4EFE3] transition-colors"
							onclick={closeMenu}
						>
							{cat.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</header>
