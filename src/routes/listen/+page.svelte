<script lang="ts">
	import { musicQueue } from '$lib/store';
	import { isPlaying, trackIndex } from 'svelte-mp3';
	import { afterUpdate } from 'svelte';
	import { activateTextTruncateScroll } from 'text-truncate-scroll';
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import type { Song } from '$lib/types';
	import { draggableSong } from '$lib/dnd.js';

	const threeDots: PopupSettings = {
		event: 'click',
		target: 'threeDotsActions',
		placement: 'bottom'
	};

	export let data;

	$: hasResults = data.didUserSearch;
	let infoToStore: Song;

	// Input (261) -> Output (4:20)
	function getMinAndSec(seconds: number) {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return minutes + ':' + remainingSeconds.toString().padStart(2, '0');
	}

	async function setSongInfoToStore(
		songId: string,
		songName: string,
		albumInfo: object,
		artistName: string,
		thumbnailUrl: string,
		duration: number
	) {
		infoToStore = {
			id: songId,
			song: songName,
			artist: artistName,
			album: albumInfo,
			url: '',
			cover_art_url: thumbnailUrl,
			duration: getMinAndSec(duration)
		};
	}

	async function fetchSongAudioUrl() {
		const response = await fetch(`/listen/play/${infoToStore.id}`);
		const songInfo = await response.json();
		const audioSrc = songInfo.url;
		infoToStore.url = audioSrc;
	}

	async function playSong() {
		await fetchSongAudioUrl();
		// Replace the current playing song on the queue
		musicQueue.update((arr) => {
			return arr.length != 0
				? arr.map((item, index) => (index === $trackIndex ? infoToStore : item))
				: [infoToStore, ...arr];
		});

		// musicQueue.update((arr) => [infoToStore, ...arr]);
		isPlaying.set(true);
	}

	async function addSongToQueue() {
		await fetchSongAudioUrl();
		musicQueue.update((arr) => [...arr, infoToStore]);
	}

	afterUpdate(() => {
		activateTextTruncateScroll();
		hasResults = false;
	});
</script>

<form action="/listen">
	<div class="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
		<label for="q" class="label m-4 text-white">
			<span>Search</span>
			<input class="input" type="text" name="q" />
		</label>

		<label for="type" class="label m-4 text-white">
			<span>Type</span>
			<select name="type" class="select">
				<option value="1">Song</option>
				<option value="2">Album</option>
			</select>
		</label>
	</div>
</form>

{#if data?.didUserSearch}
	{#key hasResults}
		<h5 class="h5 m-2 text-white">
			Search results for: <span class="font-bold">{data?.query}</span>
		</h5>
		<div class="flex h-screen flex-wrap justify-between">
			{#each data?.results as { type, videoId, name, thumbnails, artists, duration, album }}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="card-hover mx-4 my-4 h-[76px] w-[500px] overflow-hidden rounded-md transition-colors duration-200 hover:bg-secondary-900 hover:bg-opacity-20"
				>
					<div class="flex p-2">
						<div class="group relative flex-none grow-0">
							<img
								class="rounded group-hover:opacity-40"
								src={thumbnails[0].url}
								alt="cover"
								referrerpolicy="no-referrer"
							/>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								fill="currentColor"
								class="bi bi-play absolute inset-x-4 inset-y-3 cursor-pointer opacity-0 transition duration-300 ease-in-out hover:scale-150 group-hover:opacity-100"
								viewBox="0 0 16 16"
								on:click={() => {
									setSongInfoToStore(
										videoId,
										name,
										album,
										artists.map((e) => e.name).join(', '),
										thumbnails[0].url,
										duration
									);
									playSong();
								}}
							>
								<path
									d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"
								/>
							</svg>
						</div>

						<div class="ml-4 mr-4 grow self-center">
							<div class="flex flex-col items-start">
								<p class="text-truncate-scroll font-gt-walsheim-pro-medium">{name}</p>
								<p class="text-truncate-scroll font-gt-walsheim-pro-light">
									{artists.map((e) => e.name).join(', ')}
								</p>
							</div>
						</div>

						<div class="grid h-12 w-6 flex-none grow-0 content-center gap-2 self-center">
							<button
								class="justify-self-end"
								use:popup={threeDots}
								on:click={() => {
									setSongInfoToStore(
										videoId,
										name,
										album,
										artists.map((e) => e.name).join(', '),
										thumbnails[0].url,
										duration
									);
									console.log('Done setting info.... now popping up?');
								}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18"
									height="18"
									fill="currentColor"
									class="bi bi-three-dots"
									viewBox="0 0 16 16"
								>
									<path
										d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
									/>
								</svg>
							</button>

							<span class="justify-self-end font-gt-walsheim-pro-thin text-[12px]">
								{getMinAndSec(duration)}
							</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/key}
{/if}

<div class="card shadow-xl" data-popup="threeDotsActions">
	<div class="btn-group-vertical">
		<button on:click={addSongToQueue}>Add to queue</button>
		<button>Something here?</button>
		<button>Go to album</button>
		<div class="arrow bg-surface-100-800-token" />
	</div>
</div>
