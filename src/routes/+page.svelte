<script>
	import { googleAuthPopup } from '$lib/firebase/auth';
	import { currentUser } from '$lib/store';
	import { getContext } from 'svelte';
	import { google } from '../assets/images';

	$: userContext = getContext('user');

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
	<div class="flex flex-col items-center justify-center h-full">
		<p class="mb-10 text-5xl">Hello, {$userContext.username}</p>
		<a class="p-2 variant-filled-secondary" type="button" href="/profile">Go to profile</a>
	</div>
{:else}
	<div class="flex h-full flex-col items-center justify-center">
		<h1 class="font-gt-walsheim-pro-medium text-center text-9xl uppercase select-none mb-10">socult</h1>
		<button class="rounded-lg border-[1px] border-white p-2 flex items-center gap-5 select-none" on:click={login}>
			<img src={google} alt="google" class="w-8 aspect-square" />
			<span class="text-xl">Sign in with Google</span>
		</button>
	</div>
{/if}
