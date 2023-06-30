<script lang="ts">
	import { db } from '$lib/firebase/firebase';
	import { fetchSongAudioUrl, isMusicLoading, musicQueue } from '$lib/music';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { collection, onSnapshot } from 'firebase/firestore';
	import { afterUpdate, getContext, onDestroy } from 'svelte';
	import { AudioPlayer, isPlaying, trackIndex } from 'svelte-mp3';
	import { browser } from '$app/environment';
	import Spinner from './Spinner.svelte';
	import type { Song, UserData } from '$lib/types';
	import { activateTextTruncateScroll } from 'text-truncate-scroll';
	import { draggableSong, draggableContainer } from '$lib/dnd';
	import type { Writable } from 'svelte/store';

	$: currentTab = 'Friends';
	$: playerKeyCondition = false;
	$: showLyrics = false;

	let actualQueue: Song[] = [];

	musicQueue.subscribe(async (updatedQueue) => {
		actualQueue = updatedQueue;
		if (browser) {
			// Now add the necessary truncate scroll effect
			activateTextTruncateScroll();
		}
	});

	trackIndex.subscribe(async (latestIndex) => {
		// If the actual song url is blank, just fetch it
		if ($musicQueue[latestIndex]?.url === '') {
			let song = await fetchSongAudioUrl(actualQueue[latestIndex].id);
			$musicQueue[latestIndex].url = song.url;
			$musicQueue[latestIndex].lyrics = song.lyrics;
		}
	});

	isPlaying.subscribe(async (state) => {
		// Only do this if the user adds a song to the queue for the first time
		if ($trackIndex == 0 && $musicQueue[0]?.url === '' && state == true) {
			let song = await fetchSongAudioUrl($musicQueue[0].id);
			$musicQueue[0].url = song.url;
			$musicQueue[0].lyrics = song.lyrics;
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

	const users = getContext<Writable<UserData[]>>('users');

	const usersCollection = collection(db, 'users');
	const unsubUsers = onSnapshot(usersCollection, (snapshot) => {
		$users = snapshot.docs.map((doc) => doc.data() as UserData);
	});

	function removeItemFromQueue(itemIndex: number) {
		musicQueue.update((currentQueue) => {
			currentQueue.splice(itemIndex, 1);
			if ($trackIndex > itemIndex) $trackIndex--;
			return currentQueue;
		});
	}

	onDestroy(() => unsubUsers());
</script>

<ul class="list flex w-72 flex-col gap-2 overflow-y-auto px-5 py-8">
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
		<div class="card overflow-hidden">
			{#key playerKeyCondition}
				<div class="m-2.5 flex">
					<div class="group relative flex-none">
						<img
							src={actualQueue[$trackIndex]?.cover_art_url}
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
		{/each}
	{:else if currentTab === 'Activity'}
		{#if showLyrics}
			<div class="flex-column overflow-auto whitespace-pre-wrap pl-2 pr-2">
				{actualQueue[$trackIndex].lyrics}
			</div>
		{:else}
			{#if actualQueue.length >= 2}
				<div class="mb-4 mt-4">Next from queue</div>
			{:else if actualQueue.length == 0}
				<div class="mb-4 mt-4">Try adding some music...</div>
			{/if}

			{#if $isMusicLoading}
				<div class="flex justify-center p-16 opacity-50">
					<Spinner />
				</div>
			{:else}
				<div use:draggableContainer class="flex-column overflow-auto pl-2 pr-2">
					{#key playerKeyCondition}
						{#each actualQueue as item, index}
							{#if index === $trackIndex}
								<div
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
									<div class="group relative flex-none">
										<img
											src={item.cover_art_url}
											alt="cover"
											referrerpolicy="no-referrer"
											class="opacity-40"
										/>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="32"
											height="32"
											fill="currentColor"
											class={$isPlaying
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
											class={`text-truncate-scroll font-gt-walsheim-pro-regular mb-1 text-sm ${
												$isPlaying && index === $trackIndex ? 'text-primary-300' : 'text-white'
											}`}
										>
											{item.song}
										</p>

										<p class="text-truncate-scroll font-gt-walsheim-pro-thin text-sm">
											{item.artist}
										</p>
									</div>
								</div>
							{:else}
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
									<div class="group relative flex-none">
										<img
											src={item.cover_art_url}
											alt="cover"
											referrerpolicy="no-referrer"
											class="group-hover:opacity-40"
										/>
										<!-- svelte-ignore a11y-click-events-have-key-events -->
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											height="32"
											width="32"
											class="absolute inset-x-3 inset-y-3 cursor-pointer fill-error-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
											on:click={() => removeItemFromQueue(index)}
										>
											<g>
												<path fill="none" d="M0 0h24v24H0z" />
												<path
													d="M7 4V2h10v2h5v2h-2v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6H2V4h5zM6 6v14h12V6H6zm3 3h2v8H9V9zm4 0h2v8h-2V9z"
												/>
											</g>
										</svg>
									</div>

									<div class="mx-2 my-auto flex flex-col items-start">
										<p
											class={`text-truncate-scroll font-gt-walsheim-pro-regular mb-1 text-sm ${
												$isPlaying && index === $trackIndex ? 'text-primary-300' : 'text-white'
											}`}
										>
											{item.song}
										</p>

										<p class="text-truncate-scroll font-gt-walsheim-pro-thin text-sm">
											{item.artist}
										</p>
									</div>
								</div>
							{/if}
						{/each}
					{/key}
				</div>
			{/if}
		{/if}
	{/if}
</ul>
