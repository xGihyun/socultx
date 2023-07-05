<script lang="ts">
	import Auth from '../components/Auth.svelte';
	import type { ActionData } from './$types.js';

	export let data;

	// export let form: ActionData;

	// console.log(form);
</script>

{#if data.user}
	<div class="flex h-full flex-col items-center justify-center">
		<!-- <p class="mb-10 text-5xl">Hello, {$userContext.username}</p> -->
		<p class="mb-10 text-5xl">Hello, {data.user.name}</p>
		<a class="variant-filled-secondary p-2" type="button" href="/profile">Go to profile</a>
	</div>
{:else}
	<div class="flex h-full flex-row items-center justify-around">
		<div>
			<h1
				class="animate-text select-none bg-gradient-to-br from-teal-500 via-purple-500 to-orange-500 box-decoration-clone bg-clip-text text-center font-gt-walsheim-pro-medium text-8xl uppercase text-transparent"
			>
				Socult
			</h1>
			<span>Social Media + Ultimate</span>
		</div>
		<Auth />
	</div>
{/if}
