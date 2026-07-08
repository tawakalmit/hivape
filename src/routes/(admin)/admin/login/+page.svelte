<script lang="ts">
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Login Admin — HiVape Store</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
	<div class="w-full max-w-sm">
		<div class="text-center mb-8">
			<h1 class="text-2xl font-bold text-gray-900">H!VAPE Admin</h1>
			<p class="text-sm text-gray-500 mt-1">Masuk ke panel admin</p>
		</div>

		<form method="POST" action="?/login" class="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4 shadow-sm">
			{#if form?.error}
				<div class="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
					{form.error}
				</div>
			{/if}

			<div class="flex flex-col gap-1.5">
				<label for="email" class="text-sm font-medium text-gray-700">Email</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					autocomplete="email"
					class="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
					placeholder="admin@hivape.id"
				/>
			</div>

			<div class="flex flex-col gap-1.5">
				<label for="password" class="text-sm font-medium text-gray-700">Password</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					autocomplete="current-password"
					class="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
				/>
			</div>

			<button
				type="submit"
				class="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-yellow-600 hover:bg-yellow-700 transition-colors"
			>
				Masuk
			</button>
		</form>
	</div>
</div>
