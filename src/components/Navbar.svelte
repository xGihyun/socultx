<script>
	import { getContext } from 'svelte';
	import { Avatar } from '@skeletonlabs/skeleton';

	const currentUser = getContext('user');
</script>

{#if $currentUser.is_logged_in}
	<nav
		class="fixed flex h-20 w-full items-center justify-between gap-5 border-b-[1px] border-neutral-800 bg-black px-20 py-5"
	>
		<a href="/" class="font-gt-walsheim-pro-medium text-4xl uppercase text-white">socult</a>
		<div class="flex gap-5">
			<a class="bg-neutral-700 p-2 text-white rounded-md" type="button" href="/">Listen</a>
			<a class="bg-neutral-700 p-2 text-white rounded-md" type="button" href="/chat">Chat</a>
			<form method="post" action="/logout">
				<button class="bg-white p-2 rounded-md">Log Out</button>
			</form>
      <a href="/profile">
        <Avatar src={$currentUser.photo_url} width="w-10" />
      </a>
		</div>
	</nav>
{/if}
