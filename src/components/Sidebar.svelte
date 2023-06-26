<script lang="ts">
	import { db } from '$lib/firebase/firebase';
	import { musicQueue } from '$lib/store';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { collection, onSnapshot } from 'firebase/firestore';
	import { afterUpdate, getContext, onDestroy } from 'svelte';
	import { AudioPlayer, isPlaying, trackIndex } from 'svelte-mp3';
	import { browser } from '$app/environment';
	import type { Song } from '$lib/types';
	import { activateTextTruncateScroll } from 'text-truncate-scroll';
	import { draggableSong, draggableContainer } from '$lib/dnd';

	$: currentTab = 'Friends';
	$: playerKeyCondition = false;

	let actualQueue: Song[] = [];

	musicQueue.subscribe((updatedQueue) => {
		actualQueue = updatedQueue;
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

	afterUpdate(() => {
		playerKeyCondition = !playerKeyCondition;
		if (browser) {
			// Now add the necessary truncate scroll effect
			activateTextTruncateScroll();
		}
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
		<button
			class={sidebarTabLogic('Activity')}
			on:click={() => {
				currentTab = 'Activity';
				playerKeyCondition = !playerKeyCondition;
			}}>Activity</button
		>
	</li>

	<!-- Now playing div block -->
	<div
		class={actualQueue.length >= 1 && currentTab === 'Activity' ? 'visible' : 'invisible absolute'}
	>
		<!-- <div class="mb-4 mt-2">Now Playing</div> -->
		<div class="card overflow-hidden">
			{#key playerKeyCondition}
				<div class="m-2.5 flex">
					<img
						src={actualQueue[$trackIndex]?.cover_art_url}
						alt="cover"
						class="rounded"
						referrerpolicy="no-referrer"
					/>
					<div class="mx-2 my-auto flex flex-col items-start">
						<p class="text-truncate-scroll font-gt-walsheim-pro-medium">
							{actualQueue[$trackIndex]?.song}
						</p>
						<p class="text-truncate-scroll font-gt-walsheim-pro-thin">
							{actualQueue[$trackIndex]?.artist}
						</p>
					</div>
				</div>
			{/key}

			{#if browser}
				<!-- Check out the library I used - https://github.com/Khandakar227/svelte-mp3 -->

				<AudioPlayer
					style="margin: 0.5em;"
					loop="repeat-all"
					showTrackNum={true}
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
						<Avatar src={user.photo_url} width="w-10" referrerpolicy="no-referrer" />
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
	{:else if currentTab === 'Activity'}
		{#if actualQueue.length >= 2}
			<div class="mb-4 mt-4">Next from queue</div>
		{:else if actualQueue.length == 0}
			<div class="mb-4 mt-4">Try adding some music...</div>
		{/if}

		<div use:draggableContainer class="flex-column overflow-auto p-2">
			{#key playerKeyCondition}
				{#each actualQueue as item, index}
					<div
						use:draggableSong
						class="draggable my-2 flex bg-surface-800"
						data-id={item.id}
						data-song={item.song}
						data-artist={item.artist}
						data-album={item.album?.name || ''}
						data-cover_art_url={item.cover_art_url}
						data-duration={item.duration}
						data-url={item.url}
						data-now_playing={index === $trackIndex ? true : false}
					>
						<div class="relative flex-none">
							<img
								src={item.cover_art_url}
								alt="cover"
								referrerpolicy="no-referrer"
								class={index === $trackIndex ? 'opacity-40' : 'opacity-100'}
							/>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								class="absolute inset-x-3 inset-y-3 fill-warning-800 opacity-0 hover:opacity-100"
							>
								<g>
									<path fill="none" d="M0 0h24v24H0z" />
									<path
										d="M7 4V2h10v2h5v2h-2v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6H2V4h5zM6 6v14h12V6H6zm3 3h2v8H9V9zm4 0h2v8h-2V9z"
									/>
								</g>
							</svg>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								fill="currentColor"
								class={$isPlaying && index === $trackIndex
									? 'visible absolute inset-x-3 inset-y-3 fill-primary-300 motion-safe:animate-pulse'
									: 'invisible absolute inset-x-3 inset-y-3'}
								viewBox="0 0 16 16"
							>
								<path
									d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2zm9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z"
								/> <path fill-rule="evenodd" d="M14 11V2h1v9h-1zM6 3v10H5V3h1z" />
								<path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z" />
							</svg>
						</div>

						<div class="mx-2 my-auto flex flex-col items-start">
							<p
								class={$isPlaying && index === $trackIndex
									? 'text-truncate-scroll font-gt-walsheim-pro-regular mb-1 text-sm text-primary-300'
									: 'text-truncate-scroll font-gt-walsheim-pro-regular mb-1 text-sm'}
							>
								{item.song}
							</p>

							<p class="text-truncate-scroll font-gt-walsheim-pro-thin text-sm">
								{item.artist}
							</p>
						</div>
					</div>
				{/each}
			{/key}
		</div>
	{/if}
</ul>
