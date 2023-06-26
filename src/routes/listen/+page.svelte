<script lang="ts">
	// import { musicQueue } from '$lib/store';
	// import { isPlaying, trackIndex } from 'svelte-mp3';
	import { afterUpdate } from 'svelte';
	import { activateTextTruncateScroll } from 'text-truncate-scroll';
	import SongResults from './components/SongResults.svelte';
	import AlbumResults from './components/AlbumResults.svelte';
	// import type { Song } from '$lib/types';

	export let data;

	$: hasResults = data.didUserSearch;
	// let infoToStore: Song;

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

	// 	// musicQueue.update((arr) => [infoToStore, ...arr]);
	// 	isPlaying.set(true);
	// }

	// async function addSongToQueue() {
	// 	await fetchSongAudioUrl();
	// 	musicQueue.update((arr) => [...arr, infoToStore]);
	// }

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
				<option value="song">Song</option>
				<option value="album">Album</option>
			</select>
		</label>
	</div>
</form>

{#if data.didUserSearch}
	{#key hasResults}
		<h5 class="h5 m-2 text-white">
			Search results for: <span class="font-bold">{data?.query}</span>
		</h5>
		{#if data.type === 'song'}
			<SongResults results={data.results} />
		{:else if data.type === 'album'}
			<AlbumResults results={data.results} />
		{/if}
	{/key}
{/if}
