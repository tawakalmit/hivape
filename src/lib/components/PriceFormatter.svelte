<script lang="ts">
	import { formatPrice, formatPriceRange } from '$lib/utils/format';

	let {
		min,
		max,
		class: className = ''
	}: { min: number; max?: number; class?: string } = $props();

	const text = $derived(max && max !== min ? formatPriceRange(min, max) : formatPrice(min));
</script>

<span class={className}>{text}</span>
