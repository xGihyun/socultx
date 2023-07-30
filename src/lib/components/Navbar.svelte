<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidate } from '$app/navigation';
	import { Inbox, Music } from '$lib/assets/icons';
	import { resetAllMusicStores } from '$lib/music';
	import { resetAllUserStores } from '$lib/store';
	import { Avatar, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import type { Session, SupabaseClient } from '@supabase/supabase-js';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	let globalContext: Writable<{ session: Session; supabase: SupabaseClient }> =
		getContext('globalContext');

	const userProfilePopup: PopupSettings = {
		event: 'click',
		target: 'avatar',
		placement: 'bottom'
	};

	const handleSignOut = async () => {
		await $globalContext.supabase.auth.signOut();
		console.log('Invalidating auth cause of signout');
		await goto('/', { invalidateAll: true });
		await invalidate('supabase:auth');

		// Reset all stores
		resetAllUserStores();
		resetAllMusicStores();
	};
</script>

<nav
	class="flex h-20 w-full shrink-0 items-center justify-between border-b-[1px] border-neutral-800 px-10 py-5"
>
	<div class="flex">
		<a href="/" class="mr-8 font-gt-walsheim-pro-medium text-4xl uppercase">socult</a>

		<form action="?/search" method="post" use:enhance>
			<div class="input-group-divider input-group w-96 grid-cols-[auto_1fr_auto]">
				<div class="input-group-shim">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="fill-secondary-600"
						height="1em"
						viewBox="0 0 512 512"
						><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
						<path
							d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
						/></svg
					>
				</div>
				<input type="search" name="query" placeholder="Search..." />
			</div>
		</form>
	</div>

	<div class="flex gap-5">
		<a
			class="hover:variant-ghost-primary variant-soft-surface flex gap-4 self-center rounded-md p-2"
			type="button"
			href="/listen"
		>
			<Music styles="fill-secondary-600 self-center" />
			<span class="self-center">Music</span>
		</a>
		<a
			class="hover:variant-ghost-primary variant-soft-surface flex gap-4 self-center rounded-md p-2"
			type="button"
			href="/inbox"
		>
			<Inbox styles="fill-secondary-600 self-center" />
			<span class="self-center"> Inbox </span>
		</a>
		<!-- <button class="variant-filled-primary rounded-md p-2" on:click={handleSignOut}>Log Out</button> -->
		<!-- <a href="/profile"> -->
		<button use:popup={userProfilePopup}>
			<Avatar src={$globalContext.session.user.user_metadata.photo_url} width="w-12" />
		</button>

		<!-- Popup actions for song -->
		<div class="card shadow-xl" data-popup="avatar">
			<div class="btn-group-vertical">
				<button on:click={() => goto('/profile')}>Profile</button>
				<button on:click={() => goto('/settings')}>Settings</button>
				<button on:click={handleSignOut}>Log Out</button>
				<div class="arrow bg-surface-100-800-token" />
			</div>
		</div>

		<!-- </a> -->
	</div>
</nav>
