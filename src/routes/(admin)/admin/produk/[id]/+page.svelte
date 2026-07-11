<script lang="ts">
	import ProductForm from '$lib/components/ProductForm.svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<div class="p-8">
	<div class="mb-6">
		<a href="/admin/produk" class="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1 mb-3">
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
			Kembali
		</a>
		<h1 class="text-2xl font-bold text-gray-900">Edit: {data.product.name}</h1>
	</div>

	{#if form?.error}
		<div class="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
			<strong>Error:</strong> {form.error}
		</div>
	{/if}

	<ProductForm product={data.product} categories={data.categories} action="?/simpan" />
</div>
