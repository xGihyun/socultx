<script lang="ts">
	import { googleAuthPopup } from '$lib/firebase/auth';
	import { currentUser } from '$lib/store';
	import { getContext } from 'svelte';
	import { google } from '../assets/images';
	import type { UserData } from '$lib/types';
	import type { Writable } from 'svelte/store';

	let userContext: any;
	$: userContext = getContext<Writable<UserData>>('user');

	async function login() {
		const user = await googleAuthPopup();

		if (!user) return;

		console.log('Setting stores...');

		// Update the current store
		currentUser.update(
			(val) =>
				(val = {
					email: user.username || '',
					is_logged_in: user.is_logged_in || false,
					photo_url: user.photo_url || '',
					uid: user.uid || '',
					username: user.username || ''
				})
		);

		console.log('Stores set!');
	}
</script>

{#if $userContext.is_logged_in}
	<div class="flex h-full flex-col items-center justify-center">
		<p class="mb-10 text-5xl">Hello, {$userContext.username}</p>
		<a class="variant-filled-secondary p-2" type="button" href="/profile">Go to profile</a>
	</div>
{:else}
	<div class="flex h-full flex-col items-center justify-center">
		<h1 class="mb-10 select-none text-center font-gt-walsheim-pro-medium text-9xl uppercase">
			socult
		</h1>
		<button
			class="flex select-none items-center gap-5 rounded-lg border-[1px] border-white p-2"
			on:click={login}
		>
			<img src={google} alt="google" class="aspect-square w-8" />
			<span class="text-xl">Sign in with Google</span>
		</button>
	</div>
{/if}
