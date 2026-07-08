<script lang="ts">
	import { toasts } from '$lib/stores/toast';
</script>

<div class="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none" aria-live="polite">
	{#each $toasts as toast (toast.id)}
		<div
			class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-[Inter,sans-serif] shadow-lg border
			{toast.type === 'success'
				? 'bg-[#16140F] border-[#B08D4F]/40 text-[#F4EFE3]'
				: 'bg-[#16140F] border-red-500/30 text-red-300'
			}"
			style="animation: fade-up 0.3s ease forwards"
		>
			{#if toast.type === 'success'}
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A24C" stroke-width="2">
					<polyline points="20 6 9 17 4 12"/>
				</svg>
			{:else}
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
				</svg>
			{/if}
			{toast.message}
		</div>
	{/each}
</div>
