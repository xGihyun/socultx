<script lang="ts">
	import { browser } from '$app/environment';
	import { draggableContainer, draggableSong } from '$lib/dnd';
	import { musicQueue } from '$lib/music';
	import { afterUpdate } from 'svelte';
	import { trackIndex, isPlaying } from 'svelte-mp3';
	import { fly } from 'svelte/transition';
	import { activateTextTruncateScroll } from 'text-truncate-scroll';

	$: playerKeyCondition = false;

	// trackIndex.subscribe(async (latestIndex) => {
	// 	// If the actual song url is blank, just fetch it
	// 	if ($musicQueue[latestIndex]?.url === '') {
	// 		let song = await fetchSongAudioUrl($musicQueue[latestIndex].id);
	// 		$musicQueue[latestIndex].url = song.url;
	// 		$musicQueue[latestIndex].lyrics = song.lyrics;
	// 	}
	// });

	// isPlaying.subscribe(async (state) => {
	// 	// Only do this if the user adds a song to the queue for the first time
	// 	if ($trackIndex == 0 && $musicQueue[0]?.url === '' && state == true) {
	// 		let song = await fetchSongAudioUrl($musicQueue[0].id);
	// 		$musicQueue[0].url = song.url;
	// 		$musicQueue[0].lyrics = song.lyrics;
	// 	}
	// });

	// function removeItemFromQueue(itemIndex: number) {
	// 	musicQueue.update((currentQueue) => {
	// 		currentQueue.splice(itemIndex, 1);
	// 		if ($trackIndex > itemIndex) $trackIndex--;
	// 		return currentQueue;
	// 	});
	// }

	afterUpdate(() => {
		playerKeyCondition = !playerKeyCondition;
		if (browser) {
			// Now add the necessary truncate scroll effect
			activateTextTruncateScroll();
		}
	});
</script>

<div
	use:draggableContainer
	class="flex-column overflow-auto pl-2 pr-2"
	in:fly={{ y: -20, duration: 400 }}
>
	{#each $musicQueue as item, index}
		{#key playerKeyCondition}
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
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					use:draggableSong={index}
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
						<button
							class="absolute inset-x-4 inset-y-3 outline-none"
							on:click|stopPropagation={() => trackIndex.set(index)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								fill="currentColor"
								class="bi bi-play cursor-pointer opacity-0 transition duration-300 ease-in-out hover:scale-150 group-hover:opacity-100"
								viewBox="0 0 16 16"
							>
								<path
									d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"
								/>
							</svg>
						</button>
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
		{/key}
	{/each}
</div>
