<script lang="ts">
	import { getContext } from 'svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { UserData } from '$lib/types';
	import type { Writable } from 'svelte/store';

	// const user = getContext('user');
	const user: any = getContext<Writable<UserData>>('user');
</script>

{#if $user.is_logged_in}
	<nav
		class="flex h-20 w-full shrink-0 items-center justify-between gap-5 border-b-[1px] border-neutral-800 px-20 py-5"
	>
		<a href="/" class="font-gt-walsheim-pro-medium text-4xl uppercase">socult</a>
		<div class="flex gap-5">
			<a class="variant-filled-secondary rounded-md p-2" type="button" href="/listen">Listen</a>
			<a class="variant-filled-secondary rounded-md p-2" type="button" href="/chat">Chat</a>
			<form method="post" action="/logout">
				<button class="variant-filled-primary rounded-md p-2">Log Out</button>
			</form>
			<a href="/profile">
				<Avatar src={$user.photo_url} width="w-10" />
			</a>
		</div>
	</nav>
{/if}
