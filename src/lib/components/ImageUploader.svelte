<script lang="ts">
	interface ImageEntry {
		id: string;
		url: string;
		is_primary: boolean;
		sort_order: number;
	}

	let {
		images = [],
		productId,
		uploadAction,
		deleteAction,
		setPrimaryAction
	}: {
		images?: ImageEntry[];
		productId: string;
		uploadAction: string;
		deleteAction: string;
		setPrimaryAction: string;
	} = $props();

	let fileInput: HTMLInputElement;
	let selectedFiles = $state<File[]>([]);
	let previews = $state<string[]>([]);

	function handleFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const files = Array.from(input.files ?? []);
		// Revoke old previews
		previews.forEach(URL.revokeObjectURL);
		selectedFiles = files;
		previews = files.map(f => URL.createObjectURL(f));
	}

	function clearFiles() {
		previews.forEach(URL.revokeObjectURL);
		selectedFiles = [];
		previews = [];
		if (fileInput) fileInput.value = '';
	}
</script>

<div class="flex flex-col gap-4">

	<!-- Existing saved images -->
	{#if images.length > 0}
		<div>
			<p class="text-xs font-medium text-gray-600 mb-2">Foto tersimpan ({images.length})</p>
			<div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
				{#each images as img (img.id)}
					<div class="relative group rounded-lg overflow-hidden border-2 {img.is_primary ? 'border-yellow-500' : 'border-gray-200'}">
						<div class="aspect-square bg-gray-100">
							<img src={img.url} alt="Foto produk" class="w-full h-full object-cover" />
						</div>

						{#if img.is_primary}
							<div class="absolute top-1 left-1 bg-yellow-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
								UTAMA
							</div>
						{/if}

						<div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
							{#if !img.is_primary}
								<form method="POST" action={setPrimaryAction}>
									<input type="hidden" name="image_id" value={img.id} />
									<button type="submit" class="text-[10px] font-semibold bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 w-full whitespace-nowrap">
										Jadikan Utama
									</button>
								</form>
							{/if}
							<form method="POST" action={deleteAction}>
								<input type="hidden" name="image_id" value={img.id} />
								<button
									type="submit"
									class="text-[10px] font-semibold bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 w-full"
									onclick={(e) => { if (!confirm('Hapus foto ini?')) e.preventDefault(); }}
								>
									Hapus
								</button>
							</form>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Upload form — satu form, file input langsung di dalamnya -->
	<div class="border border-gray-200 rounded-xl p-4 bg-gray-50">
		<p class="text-xs font-medium text-gray-600 mb-3">Upload foto baru</p>

		<form method="POST" action={uploadAction} enctype="multipart/form-data" class="flex flex-col gap-3">
			<input type="hidden" name="product_id" value={productId} />

			<!-- File picker area -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors hover:border-gray-400 hover:bg-white"
				onclick={() => fileInput.click()}
				onkeydown={(e) => e.key === 'Enter' && fileInput.click()}
				role="button"
				tabindex="0"
				aria-label="Pilih foto"
			>
				<svg class="mx-auto mb-1 text-gray-400" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
					<polyline points="17 8 12 3 7 8"/>
					<line x1="12" y1="3" x2="12" y2="15"/>
				</svg>
				<p class="text-sm text-gray-600">
					{selectedFiles.length > 0 ? `${selectedFiles.length} foto dipilih` : 'Klik untuk pilih foto'}
				</p>
				<p class="text-xs text-gray-400 mt-0.5">JPG, PNG, WebP — maks 5MB per foto</p>
			</div>

			<!-- The actual file input — hidden, inside the form -->
			<input
				bind:this={fileInput}
				type="file"
				name="images"
				accept="image/jpeg,image/png,image/webp"
				multiple
				class="hidden"
				onchange={handleFileChange}
			/>

			<!-- Previews -->
			{#if previews.length > 0}
				<div class="grid grid-cols-4 gap-2">
					{#each previews as src, i}
						<div class="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
							<img {src} alt="Preview {i+1}" class="w-full h-full object-cover" />
						</div>
					{/each}
				</div>

				<div class="flex gap-2">
					<button
						type="submit"
						class="flex-1 py-2 rounded-lg bg-gray-900 text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
					>
						Upload {selectedFiles.length} Foto
					</button>
					<button
						type="button"
						onclick={clearFiles}
						class="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
					>
						Batal
					</button>
				</div>
			{:else}
				<button
					type="submit"
					class="w-full py-2 rounded-lg bg-gray-900 text-sm font-semibold text-white hover:bg-gray-700 transition-colors opacity-50 cursor-not-allowed"
					disabled
				>
					Upload Foto
				</button>
			{/if}
		</form>
	</div>
</div>
