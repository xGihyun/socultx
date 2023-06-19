<script lang="ts">
	import { db } from '$lib/firebase/firebase';
	import { musicQueue } from '$lib/store';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { collection, onSnapshot } from 'firebase/firestore';
	import { getContext, onDestroy } from 'svelte';
	import { AudioPlayer, isPlaying } from 'svelte-mp3';
	import { browser } from '$app/environment';
	import type { Song } from '$lib/types';
	import { onMount, afterUpdate } from 'svelte';
	import { activateTextTruncateScroll } from 'text-truncate-scroll';

	$: currentTab = 'Friends';
	$: playerKeyCondition = false;

	let player: AudioPlayer;
	let actualQueue: Song[] = [];

	musicQueue.subscribe((value) => {
		// titleOfTheSongClass = 'font-gt-walsheim-pro-medium';
		// artistsOfTheSongClass = 'font-gt-walsheim-pro-thin';
		actualQueue = value;
		playerKeyCondition = !playerKeyCondition;
		// Reset the css values for the class first
		// nowPlayingSong = value[0]?.song;
		// nowPlayingArtist = value[0]?.artist;
		// nowPlayingCover = value[0]?.cover_art_url;
		// console.log(nowPlayingSong);

		// console.log(player);

		if (browser) {
			// Now add the necessary truncate scroll effect
			activateTextTruncateScroll();
		}
	});

	// Whenever the user clicks on any of the tabs, grab the latest context
	$: sidebarTabLogic = (clickedButtonName: string) => {
		if (currentTab === clickedButtonName) {
			return '!bg-primary-500 rounded-md p-2';
		}
		return 'p-2';
	};

	onMount(() => {
		// activateTextTruncateScroll({ timeoutBeforeInit: 500 });
		player.$on('ended', () => {
			console.log('Song has ended, removing the song (0th index) from queue');
			musicQueue.update((arr) => arr.slice(1));
			if (actualQueue.length >= 1) {
				// If there are songs remaining from queue
				isPlaying.set(true); // Play the next song
			}
		});

		// player.$on('canplay', () => {
		// 	if (browser) {
		// 		// Now add the necessary truncate scroll effect
		// 		titleOfTheSongClass = 'text-truncate-scroll font-gt-walsheim-pro-medium';
		// 		artistsOfTheSongClass = 'text-truncate-scroll font-gt-walsheim-pro-thin';
		// 		activateTextTruncateScroll();
		// 	}
		// });
	});

	const users = getContext<any>('users');
	const usersCollection = collection(db, 'users');
	const unsubUsers = onSnapshot(usersCollection, (snapshot) => {
		$users = snapshot.docs.map((doc) => doc.data());
	});
	onDestroy(() => unsubUsers());
</script>

<ul class="list flex w-72 flex-col gap-2 overflow-y-auto px-5 py-10">
	<li>
		<button class={sidebarTabLogic('Friends')} on:click={() => (currentTab = 'Friends')}
			>Friends</button
		>
		<button class={sidebarTabLogic('Queue')} on:click={() => (currentTab = 'Queue')}>Queue</button>
	</li>

	<!-- Now playing div block -->
	<div class={actualQueue.length >= 1 && currentTab === 'Queue' ? 'visible' : 'invisible absolute'}>
		<div class="mb-4 mt-2">Now Playing</div>
		<div class="card overflow-hidden">
			{#key playerKeyCondition}
				<div class="flex">
					<img src={actualQueue[0]?.cover_art_url} alt="cover" />
					<div class="mx-2 my-auto flex flex-col items-start">
						<p class="text-truncate-scroll font-gt-walsheim-pro-medium">{actualQueue[0]?.song}</p>
						<p class="text-truncate-scroll font-gt-walsheim-pro-thin">
							{actualQueue[0]?.artist}
						</p>
					</div>
				</div>
			{/key}

			{#if browser}
				<!-- Check out the library I used - https://github.com/Khandakar227/svelte-mp3 -->
				<AudioPlayer
					bind:this={player}
					style=""
					showShuffle={false}
					color="white"
					urls={actualQueue.map((song) => song.url)}
				/>
			{/if}
		</div>
	</div>

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
		{#if actualQueue.length >= 2}
			<div class="mb-4 mt-4">Next from queue</div>
		{:else}
			<div class="mb-4 mt-4">Try adding some music...</div>
		{/if}
		<div class="flex-column overflow-auto pr-2">
			{#each actualQueue.slice(1) as item}
				<div class="card my-2 overflow-hidden">
					<div class="flex h-14">
						<img src={item.cover_art_url} alt="cover" />
						<div class="mx-2 my-auto flex flex-col items-start">
							<p class="text-truncate-scroll font-gt-walsheim-pro-regular mb-1 text-sm">
								{item.song}
							</p>
							<p class="text-truncate-scroll font-gt-walsheim-pro-thin text-sm">
								{item.artist}
							</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</ul>
