<script lang="ts">
	import { isPlaying, trackIndex } from 'svelte-mp3';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
	import type { SongDetailed } from '$lib/types';
	import { fetchSongAudioUrl, getMinAndSec, setSongInfoToStore } from '$lib/music';
	import { musicQueue, currentSongInfo, isMusicLoading } from '$lib/music';

	export let results: SongDetailed[];
	const popupConfig: PopupSettings = {
		event: 'click',
		target: 'threeDotsActions',
		placement: 'bottom'
	};

	async function playSong() {
		if ($isMusicLoading) return;

		isMusicLoading.set(true);
		$currentSongInfo.url = (await fetchSongAudioUrl($currentSongInfo.id)).url;
		// Replace the current playing song on the queue
		musicQueue.update((arr) => {
			return arr.length != 0
				? arr.map((item, index) => (index === $trackIndex ? $currentSongInfo : item))
				: [$currentSongInfo, ...arr];
		});

		isMusicLoading.set(false);
		isPlaying.set(true);
	}
</script>

<div class="flex h-screen flex-wrap justify-between">
	{#each results as { videoId, name, thumbnails, artists, duration, album }}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="card-hover mx-4 my-4 h-[76px] w-[500px] overflow-hidden rounded-md transition-colors duration-200 hover:bg-secondary-900 hover:bg-opacity-20"
		>
			<div class="flex p-2">
				<div class="group relative flex-none grow-0">
					<img
						class="rounded group-hover:opacity-40"
						src={thumbnails[thumbnails.length - 1].url}
						alt="cover"
						referrerpolicy="no-referrer"
					/>
					<button
						class="absolute inset-x-4 inset-y-3 outline-none"
						disabled={$isMusicLoading}
						on:click={() => {
							setSongInfoToStore(
								videoId,
								name,
								album,
								artists.map((e) => e.name).join(', '),
								thumbnails[thumbnails.length - 1].url,
								duration.text ?? duration.seconds
							);
							playSong();
						}}
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
						class="justify-self-end outline-none"
						disabled={$isMusicLoading}
						use:popup={popupConfig}
						on:click={() => {
							console.log(thumbnails[thumbnails.length - 1]);
							console.log(duration);
							setSongInfoToStore(
								videoId,
								name,
								album,
								artists.map((e) => e.name).join(', '),
								thumbnails[thumbnails.length - 1].url,
								duration.text ?? duration.seconds
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
						{duration.text ?? getMinAndSec(duration.seconds)}
					</span>
				</div>
			</div>
		</div>
	{/each}
</div>
