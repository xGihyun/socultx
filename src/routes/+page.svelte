<script>
	import { googleAuthPopup } from '$lib/firebase/auth';
	import { currentUser } from '$lib/store';
	import { getContext } from 'svelte';

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
	<div class="flex flex-col items-center justify-center">
		<p class="mb-10 text-5xl text-white">Hello {$userContext.username} {$userContext.is_logged_in}</p>
		<a class="bg-neutral-700 p-2 text-white" type="button" href="/profile">Go to profile</a>
	</div>
{:else}
	<!-- Testing out tailwind lol :D -->
	<div>
		<span class="rounded-full bg-indigo-500 px-8 py-3 text-4xl font-semibold text-white"
			>SOCULT</span
		>
		<button class="bg-neutral-700 p-2 text-white" on:click={login}>Log In</button>
	</div>
{/if}
