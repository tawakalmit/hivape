<script lang="ts">
	import { enhance } from '$app/forms';
	import { formatPrice } from '$lib/utils/format';
	import { toasts } from '$lib/stores/toast';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let deleteId = $state<string | null>(null);
	let searchQuery = $state('');

	const filtered = $derived(
		searchQuery
			? data.products.filter((p: any) =>
					p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					p.categories?.name?.toLowerCase().includes(searchQuery.toLowerCase())
				)
			: data.products
	);

	$effect(() => {
		if (form?.success) toasts.show('Aksi berhasil', 'success');
		if (form?.error) toasts.show(form.error, 'error');
	});
</script>

<div class="p-8">
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Produk</h1>
			<p class="text-sm text-gray-500 mt-0.5">{data.products.length} produk terdaftar</p>
		</div>
		<a
			href="/admin/produk/baru"
			class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-600 text-white text-sm font-semibold hover:bg-yellow-700 transition-colors"
		>
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
				<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
			</svg>
			Tambah Produk
		</a>
	</div>

	<!-- Search -->
	<div class="mb-4">
		<input
			type="search"
			bind:value={searchQuery}
			placeholder="Cari produk atau kategori..."
			class="w-full max-w-sm px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-gray-900"
		/>
	</div>

	<!-- Table -->
	<div class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-gray-200 bg-gray-50">
						<th class="text-left px-4 py-3 font-semibold text-gray-600">Produk</th>
						<th class="text-left px-4 py-3 font-semibold text-gray-600">Kategori</th>
						<th class="text-left px-4 py-3 font-semibold text-gray-600">Harga</th>
						<th class="text-left px-4 py-3 font-semibold text-gray-600">Stok</th>
						<th class="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
						<th class="text-right px-4 py-3 font-semibold text-gray-600">Aksi</th>
					</tr>
				</thead>
				<tbody>
					{#each filtered as product (product.id)}
						{@const prices = product.variants?.map((v: any) => v.price) ?? []}
						{@const totalStock = product.variants?.reduce((s: number, v: any) => s + v.stock, 0) ?? 0}
						{@const primaryImg = product.product_images?.find((i: any) => i.is_primary) ?? product.product_images?.[0]}
						<tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
							<td class="px-4 py-3">
								<div class="flex items-center gap-3">
									{#if primaryImg}
										<img src={primaryImg.url} alt="" class="w-10 h-10 object-cover rounded-lg" />
									{:else}
										<div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300">
											<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
										</div>
									{/if}
									<span class="font-medium text-gray-900">{product.name}</span>
								</div>
							</td>
							<td class="px-4 py-3 text-gray-500">{product.categories?.name ?? '—'}</td>
							<td class="px-4 py-3 text-gray-700">
								{#if prices.length}
									{formatPrice(Math.min(...prices))}{prices.length > 1 && Math.min(...prices) !== Math.max(...prices) ? ` – ${formatPrice(Math.max(...prices))}` : ''}
								{:else}—{/if}
							</td>
							<td class="px-4 py-3">
								<span class="text-gray-700">{totalStock}</span>
							</td>
							<td class="px-4 py-3">
								<form method="POST" action="?/toggleStatus" use:enhance>
									<input type="hidden" name="id" value={product.id} />
									<input type="hidden" name="status" value={product.status} />
									<button
										type="submit"
										class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium transition-colors
										{product.status === 'active'
											? 'bg-green-50 text-green-700 hover:bg-green-100'
											: product.status === 'draft'
												? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
												: 'bg-red-50 text-red-600'
										}"
									>
										{product.status === 'active' ? 'Aktif' : product.status === 'draft' ? 'Draft' : 'Habis'}
									</button>
								</form>
							</td>
							<td class="px-4 py-3">
								<div class="flex items-center justify-end gap-2">
									<a
										href="/admin/produk/{product.id}"
										class="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 border border-gray-200 hover:border-gray-400 hover:text-gray-900 transition-colors"
									>
										Edit
									</a>
									<button
										type="button"
										onclick={() => (deleteId = product.id)}
										class="px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 border border-red-100 hover:border-red-300 hover:bg-red-50 transition-colors"
									>
										Hapus
									</button>
								</div>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="6" class="px-4 py-10 text-center text-gray-400 text-sm">
								Tidak ada produk ditemukan
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Delete confirmation modal -->
{#if deleteId}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="delete-title">
		<div class="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
			<h2 id="delete-title" class="text-lg font-bold text-gray-900 mb-2">Hapus Produk?</h2>
			<p class="text-sm text-gray-500 mb-6">Produk akan dihapus permanen dan tidak bisa dikembalikan.</p>
			<div class="flex gap-3">
				<button
					type="button"
					onclick={() => (deleteId = null)}
					class="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
				>
					Batal
				</button>
				<form method="POST" action="?/delete" use:enhance class="flex-1">
					<input type="hidden" name="id" value={deleteId} />
					<button
						type="submit"
						onclick={() => (deleteId = null)}
						class="w-full py-2 rounded-lg bg-red-600 text-sm font-medium text-white hover:bg-red-700 transition-colors"
					>
						Hapus
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}
