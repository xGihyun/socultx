<script>
	import { Avatar } from '@skeletonlabs/skeleton';

	/**
	 * @type {string}
	 */
	export let username;

	/**
	 * @type {string}
	 */
	export let message;

	/**
	 * @type {string}
	 */
	export let uid;

	/**
	 * @type {string}
	 */
	export let senderId;

	/**
	 * @type {string}
	 */
	export let photoURL;

	$: isCurrentUser = uid === senderId;
</script>

<!-- Other user -->
<div class={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
	<div class={`grid gap-2 ${isCurrentUser ? 'grid-cols-[1fr_auto]' : 'grid-cols-[auto_1fr]'}`}>
		{#if !isCurrentUser}
			<Avatar src={photoURL} width="w-12" />
		{/if}
		<!-- <span class="text-white">Icon</span> -->
		<div
			class={`card space-y-2 p-4 ${
				isCurrentUser ? 'rounded-tr-none variant-soft-primary' : 'rounded-tl-none variant-soft-secondary'
			}`}
		>
			<header class="flex items-center justify-between">
				<p class={`font-bold`}>{username}</p>
				<!-- <small class="opacity-50">timestamp</small> -->
			</header>
			<p class={``}>{message}</p>
		</div>
	</div>
</div>

