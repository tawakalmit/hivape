<script lang="ts">
	let {
		label,
		active = false,
		onclick
	}: {
		label: string;
		active?: boolean;
		onclick?: () => void;
	} = $props();
</script>

<button
	type="button"
	{onclick}
	aria-pressed={active}
	class="px-4 py-1.5 rounded-full text-xs font-[Space_Grotesk,sans-serif] tracking-widest uppercase transition-all duration-200 border focus-visible:outline-2 focus-visible:outline-[#C9A24C]
	{active
		? 'border-transparent text-[#0A0908] font-semibold'
		: 'border-[#B08D4F]/50 text-[#F4EFE3] hover:border-[#B08D4F] bg-transparent'
	}"
	style={active ? 'background: linear-gradient(135deg, #C9A24C, #F1D48A);' : ''}
>
	{label}
</button>
