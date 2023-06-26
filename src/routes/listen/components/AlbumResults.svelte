<script lang="ts">
	import { musicQueue } from '$lib/store';
	// import { isPlaying, trackIndex } from 'svelte-mp3';
	// import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
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

	async function addAlbumToQueue() {
		// await fetchSongAudioUrl();
		// musicQueue.update((arr) => [...arr, infoToStore]);
		console.log('Adding album to queue');
	}
	console.log(results);
</script>

<div class="flex h-screen flex-wrap justify-between">
	{#each results as { albumId, name, thumbnails, artists, playlistId, year }}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="card-hover mx-8 h-[280px] w-[200px]">
			<div class="flex justify-center">
				<img
					width="200"
					height="200"
					class="rounded-lg"
					src={thumbnails[2].url}
					alt="cover"
					referrerpolicy="no-referrer"
				/>
			</div>
		</div>
	{/each}
</div>

<!-- Popup actions for song -->
<div class="card shadow-xl" data-popup="threeDotsActions">
	<div class="btn-group-vertical">
		<button on:click={addAlbumToQueue}>Add to queue</button>
		<button>Go to artist</button>
		<button>Go to album</button>
		<div class="arrow bg-surface-100-800-token" />
	</div>
</div>
