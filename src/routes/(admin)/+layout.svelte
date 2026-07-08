<script lang="ts">
	import Toast from '$lib/components/Toast.svelte';
	let { children, data } = $props();
</script>

<svelte:head>
	<title>Admin — HiVape Store</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex">
	{#if data.session}
		<!-- Sidebar -->
		<aside class="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0">
			<div class="p-5 border-b border-gray-200">
				<a href="/" class="text-sm font-semibold tracking-widest uppercase text-gray-800">
					H!VAPE <span class="text-yellow-600">Admin</span>
				</a>
			</div>
			<nav class="flex-1 p-4 flex flex-col gap-1" aria-label="Admin navigation">
				<a href="/admin/produk" class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
					Produk
				</a>
				<a href="/admin/kategori" class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
					Kategori
				</a>
			</nav>
			<div class="p-4 border-t border-gray-200">
				<form method="POST" action="/admin/login?/logout">
					<button type="submit" class="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 hover:text-red-600 transition-colors">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
						Logout
					</button>
				</form>
			</div>
		</aside>
	{/if}

	<!-- Main content -->
	<main class="flex-1 overflow-auto">
		{@render children()}
	</main>
</div>

<Toast />
