<script lang="ts">
	import { db } from '$lib/firebase/firebase';
	import { musicQueue } from '$lib/store';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { collection, onSnapshot } from 'firebase/firestore';
	import { getContext, onDestroy } from 'svelte';
	import type { Song } from '$lib/types';

	$: currentTab = 'Friends';

	let nowPlaying: Song[] = [];
	musicQueue.subscribe((value) => {
		nowPlaying = value;
	});

	// Whenever the user clicks on any of the tabs, grab the latest context
	$: sidebarTabLogic = (clickedButtonName: string) => {
		if (currentTab === clickedButtonName) {
			return '!bg-primary-500 rounded-md p-2';
		}
		return 'p-2';
	};

	const users = getContext<any>('users');
	const usersCollection = collection(db, 'users');
	const unsubUsers = onSnapshot(usersCollection, (snapshot) => {
		$users = snapshot.docs.map((doc) => doc.data());
	});

	onDestroy(() => unsubUsers());
</script>

<ul class="list flex flex-col gap-2 overflow-y-auto px-5 py-10">
	<li>
		<button class={sidebarTabLogic('Friends')} on:click={() => (currentTab = 'Friends')}
			>Friends</button
		>
		<button class={sidebarTabLogic('Queue')} on:click={() => (currentTab = 'Queue')}>Queue</button>
	</li>
	{#if currentTab === 'Friends'}
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
	{:else if currentTab === 'Queue'}
		{#each nowPlaying as item}
			<div class="card w-64 overflow-hidden">
				<div class="flex">
					<img src={item.cover_art_url} alt="cover" />
					<div class="mx-2 my-auto flex flex-col items-start truncate">
						<p class="truncate font-gt-walsheim-pro-medium">{item.song}</p>
						<p class="truncate font-gt-walsheim-pro-thin">
							{item.artist}
						</p>
					</div>
				</div>
			</div>
		{/each}

		<!-- TODO: Place this tag somewhere in the root +layout.svelte -->
		<!-- {#if isSongPlaying}
		{/if} -->
		{#if nowPlaying.length >= 1}
			TODO: Add svelte-mp3
		{/if}
	{/if}
</ul>
