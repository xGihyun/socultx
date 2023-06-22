<script lang="ts">
	import { musicQueue } from '$lib/store';
	import { isPlaying } from 'svelte-mp3';
	import { afterUpdate, beforeUpdate, onMount, tick } from 'svelte';
	import { activateTextTruncateScroll } from 'text-truncate-scroll';
	export let data;

	$: hasResults = data.didUserSearch;

	// function getMinAndSec(seconds: number) {
	// 	const min = Math.floor(seconds / 60);
	// 	const secs = seconds % 60;
	// 	return min.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
	// }

	// Input (261) -> Output (4:20)
	function getMinAndSec(seconds: number) {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return minutes + ':' + remainingSeconds.toString().padStart(2, '0');
	}

	async function playAudioStream(
		songId: string,
		songName: string,
		artistName: string,
		thumbnailUrl: string,
		duration: number
	) {
		const response = await fetch(`/listen/play/${songId}`);
		const songInfo = await response.json();
		const audioSrc = songInfo.url;
		console.log(songInfo);
		let infoToStore = {
			song: songName,
			artist: artistName,
			url: audioSrc,
			cover_art_url: thumbnailUrl,
			duration: getMinAndSec(duration)
		};
		console.log(infoToStore);

		// Add the song to the queue (array)
		musicQueue.update((arr) => [...arr, infoToStore]);
		isPlaying.set(true);
		// Set a session storage item
		// sessionStorage.setItem('nowPlaying', JSON.stringify(infoToStore));
		// musicQueue.set(JSON.stringify(infoToStore));
	}

	// let songNameClass = 'font-gt-walsheim-pro-medium';
	// let artistNameClass = 'font-gt-walsheim-pro-thin';

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
		<div class="overflow flex h-screen flex-wrap justify-evenly">
			{#each data?.results as { type, videoId, name, thumbnails, artists, duration }, i}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div class="h-[60px] w-96 overflow-hidden">
					<div class="flex">
						<div class="group relative flex-none">
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
								class="bi bi-play absolute inset-x-4 inset-y-3 cursor-pointer opacity-0 group-hover:opacity-100"
								viewBox="0 0 16 16"
								on:click={() =>
									playAudioStream(
										videoId,
										name,
										artists.map((e) => e.name).join(', '),
										thumbnails[0].url,
										duration
									)}
							>
								<path
									d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"
								/>
							</svg>
						</div>

						<div class="mx-2 grow self-center">
							<div class="flex flex-col items-start">
								<p class="text-truncate-scroll font-gt-walsheim-pro-medium">{name}</p>
								<p class="text-truncate-scroll font-gt-walsheim-pro-light">
									{artists.map((e) => e.name).join(', ')}
								</p>
							</div>
						</div>
						<span>Add to Queue</span>
						<span class="mx-2 flex-none self-center font-gt-walsheim-pro-thin text-[12px]">
							{getMinAndSec(duration)}
						</span>
					</div>
				</div>
			{/each}
		</div>
	{/key}
{/if}
