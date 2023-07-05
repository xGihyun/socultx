<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import { auth } from '$lib/client/firebase';
	import { signOut } from 'firebase/auth';

	export let picture: string | undefined;
</script>

<nav
	class="flex h-20 w-full shrink-0 items-center justify-between gap-5 border-b-[1px] border-neutral-800 px-20 py-5"
>
	<a href="/" class="font-gt-walsheim-pro-medium text-4xl uppercase">socult</a>
	<div class="flex gap-5">
		<a class="variant-filled-secondary rounded-md p-2" type="button" href="/listen">Listen</a>
		<a class="variant-filled-secondary rounded-md p-2" type="button" href="/chat">Chat</a>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<form method="post" action="?/logout" on:submit={async () => await signOut(auth)}>
			<button class="variant-filled-primary rounded-md p-2">Log Out</button>
		</form>
		<!-- <button class="variant-filled-primary rounded-md p-2" on:click={signOutAccount}>Log Out</button> -->
		<a href="/profile">
			<Avatar src={picture} width="w-10" />
		</a>
	</div>
</nav>
