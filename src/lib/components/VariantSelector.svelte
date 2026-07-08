<script lang="ts">
	import { formatPrice } from '$lib/utils/format';
	import type { Variant } from '$lib/types';

	let {
		variants,
		selected = $bindable(null)
	}: {
		variants: Variant[];
		selected: Variant | null;
	} = $props();

	// Auto-select first available variant
	$effect(() => {
		if (!selected && variants.length > 0) {
			selected = variants.find((v) => v.stock > 0) ?? variants[0];
		}
	});
</script>

<div class="flex flex-col gap-2">
	<label class="text-xs font-[Space_Grotesk] uppercase tracking-widest text-[#8C8578]">
		Varian
	</label>
	<div class="flex flex-wrap gap-2">
		{#each variants as variant (variant.id)}
			{@const isSelected = selected?.id === variant.id}
			{@const isOos = variant.stock <= 0}
			<button
				type="button"
				onclick={() => { if (!isOos) selected = variant; }}
				disabled={isOos}
				aria-pressed={isSelected}
				class="relative px-3 py-2 rounded-lg text-xs font-[Inter,sans-serif] transition-all duration-200 border
				{isSelected
					? 'border-transparent text-[#0A0908] font-semibold'
					: isOos
						? 'border-[#2a2620] text-[#8C8578]/50 cursor-not-allowed line-through'
						: 'border-[#B08D4F]/40 text-[#F4EFE3] hover:border-[#B08D4F]'
				}"
				style={isSelected ? 'background: linear-gradient(135deg, #C9A24C, #F1D48A);' : ''}
			>
				<span class="flex flex-col items-start gap-0.5">
					{#if variant.flavor}
						<span>{variant.flavor}</span>
					{/if}
					{#if variant.nicotine_mg}
						<span class={isSelected ? 'text-[#0A0908]/70' : 'text-[#8C8578]'}>{variant.nicotine_mg}mg</span>
					{/if}
					<span class={isSelected ? 'text-[#0A0908]/90 font-bold' : 'text-[#F1D48A]'}>{formatPrice(variant.price)}</span>
				</span>
				{#if isOos}
					<span class="absolute -top-1.5 -right-1.5 text-[9px] bg-[#8C8578]/20 text-[#8C8578] px-1 rounded">habis</span>
				{/if}
			</button>
		{/each}
	</div>
</div>
