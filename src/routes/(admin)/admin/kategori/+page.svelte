<script lang="ts">
	import { enhance } from '$app/forms';
	import { toasts } from '$lib/stores/toast';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let newName = $state('');
	let deleteId = $state<string | null>(null);

	$effect(() => {
		if (form?.success) {
			toasts.show('Berhasil', 'success');
			newName = '';
		}
		if (form?.error) toasts.show(form.error, 'error');
	});
</script>

<div class="p-8">
	<div class="mb-6">
		<h1 class="text-2xl font-bold text-gray-900">Kategori</h1>
	</div>

	<div class="grid md:grid-cols-2 gap-6 max-w-3xl">
		<!-- Add form -->
		<div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
			<h2 class="font-semibold text-gray-800 mb-4">Tambah Kategori</h2>
			<form method="POST" action="?/create" use:enhance class="flex flex-col gap-3">
				<div class="flex flex-col gap-1.5">
					<label for="cat-name" class="text-sm font-medium text-gray-700">Nama *</label>
					<input
						id="cat-name"
						name="name"
						type="text"
						bind:value={newName}
						required
						class="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-yellow-500"
						placeholder="Liquid Saltnic"
					/>
				</div>
				<button type="submit" class="py-2 rounded-lg bg-yellow-600 text-sm font-semibold text-white hover:bg-yellow-700 transition-colors">
					Tambah
				</button>
			</form>
		</div>

		<!-- List -->
		<div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
			<div class="px-5 py-3 border-b border-gray-200 bg-gray-50">
				<h2 class="font-semibold text-gray-800">Daftar Kategori ({data.categories.length})</h2>
			</div>
			<ul class="divide-y divide-gray-100" role="list">
				{#each data.categories as cat}
					<li class="flex items-center justify-between px-5 py-3">
						<div>
							<p class="text-sm font-medium text-gray-800">{cat.name}</p>
							<p class="text-xs text-gray-400 font-mono">{cat.slug}</p>
						</div>
						<button
							type="button"
							onclick={() => (deleteId = cat.id)}
							class="text-xs text-red-400 hover:text-red-600 transition-colors"
						>
							Hapus
						</button>
					</li>
				{:else}
					<li class="px-5 py-6 text-center text-sm text-gray-400">Belum ada kategori</li>
				{/each}
			</ul>
		</div>
	</div>
</div>

{#if deleteId}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="del-cat-title">
		<div class="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
			<h2 id="del-cat-title" class="text-lg font-bold text-gray-900 mb-2">Hapus Kategori?</h2>
			<p class="text-sm text-gray-500 mb-6">Semua produk di kategori ini tidak akan terhapus, tapi kategorinya akan hilang.</p>
			<div class="flex gap-3">
				<button type="button" onclick={() => (deleteId = null)} class="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Batal</button>
				<form method="POST" action="?/delete" use:enhance class="flex-1">
					<input type="hidden" name="id" value={deleteId} />
					<button type="submit" onclick={() => (deleteId = null)} class="w-full py-2 rounded-lg bg-red-600 text-sm font-medium text-white hover:bg-red-700 transition-colors">Hapus</button>
				</form>
			</div>
		</div>
	</div>
{/if}
