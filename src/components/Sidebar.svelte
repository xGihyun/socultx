<script lang="ts">
	import { db } from '$lib/firebase/firebase';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { collection, onSnapshot } from 'firebase/firestore';
	import { getContext, onDestroy } from 'svelte';

	$: isUserOnFriendsTab = true;

	const users = getContext<any>('users');

	const usersCollection = collection(db, 'users');

	const unsubUsers = onSnapshot(usersCollection, (snapshot) => {
		$users = snapshot.docs.map((doc) => doc.data());
	});

	onDestroy(() => unsubUsers());
</script>

<ul class="list flex flex-col gap-2 overflow-y-auto px-5 py-10">
	<nav>
		<ul>
			<li>
				<button class="flex-auto">Friends</button>
				<button class="flex-auto">Queue</button>
			</li>
		</ul>
	</nav>

	{#if isUserOnFriendsTab}
		{#each $users as user, idx (idx)}
			<a
				href={`/chat/${user.uid}`}
				class="rounded-md p-2 transition-colors duration-200 hover:bg-secondary-900 hover:bg-opacity-40"
			>
				<li>
					<div class="relative h-10 w-10">
						<Avatar src={user.photo_url} width="w-10" />
						{#if user.is_logged_in}
							<span
								class="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"
							/>
						{/if}
					</div>
					<div class="flex flex-col">
						<span class="line-clamp-1 flex-auto">{user.username}</span>
						<span class="text-sm opacity-75" />
					</div>
				</li>
			</a>
		{/each}
	{/if}
</ul>
