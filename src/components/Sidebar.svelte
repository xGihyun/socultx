<script lang="ts">
	import { isMusicLoading, musicQueue, areSongsSelected } from '$lib/music';
	// import { Avatar } from '@skeletonlabs/skeleton';
	import { afterUpdate } from 'svelte';
	import { AudioPlayer, trackIndex } from 'svelte-mp3';
	import { browser } from '$app/environment';
	import { fade, fly } from 'svelte/transition';
	import Spinner from './Spinner.svelte';
	import Queue from './Queue.svelte';
	import { activateTextTruncateScroll } from 'text-truncate-scroll';

	$: currentTab = 'Friends';
	$: showLyrics = false;
	$: nowPlayingKey = false;

	// Whenever the user clicks on any of the tabs, return a different classname
	$: sidebarTabLogic = (clickedButtonName: string) => {
		if (currentTab === clickedButtonName) {
			return '!bg-primary-500 rounded-md p-2';
		}
		return 'p-2';
	};

	// const users = getContext<Writable<UserData[]>>('users');

	// const usersCollection = collection(db, 'users');
	// const unsubUsers = onSnapshot(usersCollection, (snapshot) => {
	// 	$users = snapshot.docs.map((doc) => doc.data() as UserData);
	// });

	afterUpdate(() => {
		nowPlayingKey = !nowPlayingKey;
		if (browser) {
			activateTextTruncateScroll();
		}
	});

	// onDestroy(() => unsubUsers());
</script>

<ul
	class="list flex w-72 flex-col gap-2 overflow-y-auto border-l-[1px] border-neutral-800 px-5 py-8"
>
	<li>
		<button class={sidebarTabLogic('Friends')} on:click={() => (currentTab = 'Friends')}
			>Friends</button
		>
		<button
			class={sidebarTabLogic('Activity')}
			on:click={() => {
				currentTab = 'Activity';
				nowPlayingKey = !nowPlayingKey;
			}}>Activity</button
		>
	</li>

	<!-- Now playing div block -->
	<div
		class={$musicQueue.length >= 1 && currentTab === 'Activity' ? 'visible' : 'invisible absolute'}
	>
		<div class="card overflow-hidden">
			<div class="m-2.5 flex">
				<div class="group relative flex-none">
					<img
						src={$musicQueue[$trackIndex]?.cover_art_url}
						alt="cover"
						class="rounded group-hover:opacity-40"
						referrerpolicy="no-referrer"
					/>

					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						fill="currentColor"
						class="bi bi-music-note-list absolute inset-x-3 inset-y-3 cursor-pointer fill-primary-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						viewBox="0 0 16 16"
						on:click={() => (showLyrics = !showLyrics)}
					>
						<path d="M12 13c0 1.105-1.12 2-2.5 2S7 14.105 7 13s1.12-2 2.5-2 2.5.895 2.5 2z" />
						<path fill-rule="evenodd" d="M12 3v10h-1V3h1z" />
						<path d="M11 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 16 2.22V4l-5 1V2.82z" />
						<path
							fill-rule="evenodd"
							d="M0 11.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 .5 7H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 .5 3H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5z"
						/>
					</svg>
				</div>
				{#key nowPlayingKey}
					<div class="mx-2 my-auto flex flex-col items-start">
						<p class="text-truncate-scroll font-gt-walsheim-pro-medium">
							{$musicQueue[$trackIndex]?.song}
						</p>
						<p class="text-truncate-scroll font-gt-walsheim-pro-thin">
							{$musicQueue[$trackIndex]?.artist}
						</p>
					</div>
				{/key}
			</div>

			{#if browser}
				<!-- Check out the library I used - https://github.com/Khandakar227/svelte-mp3 -->

				<AudioPlayer
					style="margin: 0.5em;"
					loop="repeat-all"
					showTrackNum={true}
					showShuffle={false}
					color="white"
					urls={$musicQueue.map((song) => song.url)}
				/>
			{/if}
		</div>
	</div>

	{#if currentTab === 'Friends'}
		<!-- FRIENDS LIST -->
		<!-- {#each $users as user, idx (idx)}
			<a
				href={`/chat/${user.uid}`}
				class="rounded-md p-2 transition-colors duration-200 hover:bg-secondary-900 hover:bg-opacity-40"
				in:fly={{ duration: 300, x: -20 }}
			>
				<li>
					<div class="relative h-10 w-10">
						<Avatar src={user.photo_url || ''} width="w-10" referrerpolicy="no-referrer" />
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
		{/each} -->
	{:else if currentTab === 'Activity'}
		{#if showLyrics}
			<div class="flex-column mb-4 mt-4 overflow-auto pl-2 pr-2" in:fly={{ y: -20, duration: 400 }}>
				<p class="whitespace-pre-wrap font-gt-walsheim-pro-thin text-sm">
					{$musicQueue[$trackIndex].lyrics}
				</p>
			</div>
		{:else}
			{#if $musicQueue.length >= 2}
				<div class="flex items-center justify-between pt-2">
					<p class="ml-2">Next from queue</p>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						height="24"
						width="24"
						class={$areSongsSelected.state
							? 'visible mr-2 cursor-pointer fill-surface-600 transition-colors duration-300 hover:scale-105 hover:fill-error-400'
							: 'invisible'}
						on:click={() => {
							// Get selected items from queue then remove one by one

							// $areSongsSelected.selectedIndexes.forEach((index) => {
							// 	musicQueue.update((currentQueue) => {
							// 		currentQueue.splice(index, 1);
							// 		if ($trackIndex > index) $trackIndex--;
							// 		return currentQueue;
							// 	});
							// });

							// Use reverse for loop
							for (let index = $areSongsSelected.selectedIndexes.length - 1; index >= 0; index--) {
								musicQueue.update((currentQueue) => {
									currentQueue.splice($areSongsSelected.selectedIndexes[index], 1);
									if ($trackIndex > $areSongsSelected.selectedIndexes[index]) $trackIndex--;
									return currentQueue;
								});
							}

							// musicQueue.update((currentQueue) => {
							// 	console.log('Current queue (old) is: ', currentQueue);

							// 	let newQueue = currentQueue.filter(
							// 		(_, index) => !$areSongsSelected.selectedIndexes.includes(index)
							// 	);

							// 	console.log('Current queue (new) is: ', newQueue);
							// 	return newQueue;
							// });

							// Hide icon
							// $areSongsSelected.state = false;
							// $areSongsSelected.
							areSongsSelected.set({ state: false, selectedIndexes: [] });
						}}
					>
						<g>
							<path fill="none" d="M0 0h24v24H0z" />
							<path
								d="M7 4V2h10v2h5v2h-2v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6H2V4h5zM6 6v14h12V6H6zm3 3h2v8H9V9zm4 0h2v8h-2V9z"
							/>
						</g>
					</svg>
				</div>
			{:else if $musicQueue.length == 0}
				<div in:fade={{ duration: 500 }} class="mb-4 mt-4">Try adding some music...</div>
			{/if}

			{#if $isMusicLoading}
				<div class="flex justify-center p-16 opacity-50">
					<Spinner />
				</div>
			{:else}
				<Queue />
			{/if}
		{/if}
	{/if}
</ul>
