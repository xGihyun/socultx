<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { Timestamp } from 'firebase/firestore';

	export let username: string;

	export let message: string;

	export let uid: string;

	export let senderId: string;

	export let photoURL: string;

	export let timestamp: Timestamp;

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
				isCurrentUser
					? 'variant-soft-primary rounded-tr-none'
					: 'variant-soft-secondary rounded-tl-none'
			}`}
		>
			<header class="flex items-center justify-between">
				<p class={`font-bold`}>{username}</p>
				<!-- <small class="opacity-50">timestamp</small> -->
			</header>
			<p title={timestamp.seconds.toString()}>{message}</p>
		</div>
	</div>
</div>
