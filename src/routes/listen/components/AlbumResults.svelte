<script lang="ts">
	import { musicQueue } from '$lib/store';
	// import { isPlaying, trackIndex } from 'svelte-mp3';
	// import type { PopupSettings } from '@skeletonlabs/skeleton';
	import type { AlbumDetailed } from 'ytmusic-api';

	// const threeDots: PopupSettings = {
	// 	event: 'click',
	// 	target: 'threeDotsActions',
	// 	placement: 'bottom'
	// };

	export let results: AlbumDetailed[];

	// // Input (261) -> Output (4:20)
	// function getMinAndSec(seconds: number) {
	// 	const minutes = Math.floor(seconds / 60);
	// 	const remainingSeconds = seconds % 60;
	// 	return minutes + ':' + remainingSeconds.toString().padStart(2, '0');
	// }

	// async function setSongInfoToStore(
	// 	songId: string,
	// 	songName: string,
	// 	albumInfo: { name: string; albumId: string },
	// 	artistName: string,
	// 	thumbnailUrl: string,
	// 	duration: number
	// ) {
	// 	infoToStore = {
	// 		id: songId,
	// 		song: songName,
	// 		artist: artistName,
	// 		album: albumInfo,
	// 		url: '',
	// 		cover_art_url: thumbnailUrl,
	// 		duration: getMinAndSec(duration)
	// 	};
	// }

	// async function fetchSongAudioUrl() {
	// 	const response = await fetch(`/listen/play/${infoToStore.id}`);
	// 	const songInfo = await response.json();
	// 	const audioSrc = songInfo.url;
	// 	infoToStore.url = audioSrc;
	// }

	// async function playSong() {
	// 	await fetchSongAudioUrl();
	// 	// Replace the current playing song on the queue
	// 	musicQueue.update((arr) => {
	// 		return arr.length != 0
	// 			? arr.map((item, index) => (index === $trackIndex ? infoToStore : item))
	// 			: [infoToStore, ...arr];
	// 	});

	// 	isPlaying.set(true);
	// }

	async function fetchAlbumDetails(playlistId: string) {
		// Just use Invidious api for playlists - "https://docs.invidious.io/api/#language"

		// Get the Track ID for every track by scraping from an unlisted Youtube playlist
		let properUrl = `https://y.com.sb/api/v1/playlists/${playlistId}`;
		let resp = await fetch(properUrl);
		console.log(await resp.json());
		// TODO: Implement album queing and playing
	}

	async function addAlbumToQueue(playlistId: string) {
		// console.log(albumId);
		// const response = await fetch(`/listen/album/${playlistId}`);
		// console.log(response);
		// await fetchSongAudioUrl();
		// musicQueue.update((arr) => [...arr, infoToStore]);
		console.log('Adding album to queue');
	}

	// console.log(results);
</script>

<div class="flex h-screen flex-wrap justify-evenly">
	{#each results as { albumId, name, thumbnails, artists, playlistId, year }}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="card group relative mx-4 my-4 h-72 w-48 rounded-md bg-surface-800 transition-colors duration-300"
		>
			<div class="transition-opacity duration-500 group-hover:opacity-20 group-hover:blur-sm">
				<div class="mt-4 flex justify-center">
					<img
						width="160"
						height="160"
						class="rounded-lg"
						src={thumbnails[2].url}
						alt="cover"
						referrerpolicy="no-referrer"
					/>
				</div>
				<div class="ml-4 mr-4 mt-4 flex flex-col items-start gap-2">
					<p class="text-truncate-scroll font-gt-walsheim-pro-medium text-lg">{name}</p>
					{#if artists && year}
						<p class="text-truncate-scroll font-gt-walsheim-pro-thin text-sm">
							{year} • {artists.map((e) => e.name).join(', ')}
						</p>
					{/if}
				</div>
			</div>
			<div class="absolute left-4 top-6 flex flex-col justify-center gap-4">
				<button
					class="variant-soft-secondary btn cursor-pointer bg-gradient-to-br text-lg opacity-0 transition duration-300 ease-in-out group-hover:opacity-100"
					on:click={() => addAlbumToQueue(albumId)}
				>
					Add to queue
				</button>

				<button
					class="variant-soft-secondary btn cursor-pointer bg-gradient-to-br text-lg opacity-0 transition duration-300 ease-in-out group-hover:opacity-100"
					on:click={() => fetchAlbumDetails(playlistId)}
				>
					Go to album
				</button>

				<button
					class="variant-soft-secondary btn cursor-pointer bg-gradient-to-br text-lg opacity-0 transition duration-300 ease-in-out group-hover:opacity-100"
				>
					Go to artist
				</button>

				<button
					class="variant-ghost-primary btn text-lg opacity-0 transition duration-300 ease-in-out hover:scale-105 group-hover:opacity-100"
				>
					Play album
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						fill="currentColor"
						class="bi bi-play mx"
						viewBox="0 0 16 16"
					>
						<path
							d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"
						/>
					</svg>
				</button>
			</div>
		</div>
	{/each}
</div>
