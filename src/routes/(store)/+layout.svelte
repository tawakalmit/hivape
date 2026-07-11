<script lang="ts">
	import '../layout.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Toast from '$lib/components/Toast.svelte';

	let { children, data } = $props();
</script>

<svelte:head>
	<title>HiVape Store — Premium Vape & Liquid</title>
</svelte:head>

<div class="min-h-screen flex flex-col bg-[#0A0908] text-[#F4EFE3]">
	<Navbar />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>

<Toast />
