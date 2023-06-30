<script lang="ts">
	import {
		currentSongInfo,
		fetchAlbumDetails,
		isMusicLoading,
		musicQueue,
		setSongInfoToStore
	} from '$lib/music';
	import type { Song } from '$lib/types';
	import { isPlaying } from 'svelte-mp3';
	import type { AlbumDetailed } from '$lib/types';
	import AlbumMarquee from './AlbumMarquee.svelte';

	export let results: AlbumDetailed[];

	async function addAlbumToQueue(
		albumName: string,
		albumId: string,
		albumCover: string,
		artistName: string,
		playlistId: string
	) {
		if ($isMusicLoading) return;

		isMusicLoading.set(true);
		let albumTracks = await fetchAlbumDetails(playlistId);
		let tracks: Song[] = [];
		console.log(albumTracks);
		console.log('Adding album to queue please wait...');
		for (let i = 0; i < albumTracks.length; i++) {
			setSongInfoToStore(
				albumTracks[i].videoId,
				albumTracks[i].title,
				{ name: albumName, albumId: albumId },
				artistName,
				albumCover,
				albumTracks[i].lengthSeconds
			);

			tracks.push($currentSongInfo);
		}
		musicQueue.update((arr) => arr.concat(tracks));

		console.log('Album tracks added to queue');
		isMusicLoading.set(false);
	}
</script>

<div class="flex h-screen flex-wrap justify-evenly">
	{#each results as { albumId, name, thumbnails, artists, playlistId, year }}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="card group relative mx-4 my-4 h-72 w-48 rounded-md bg-surface-800 transition-colors duration-300"
		>
			<div
				class={$isMusicLoading
					? ''
					: 'transition-opacity duration-500 group-hover:opacity-20 group-hover:blur-sm'}
			>
				<div class="mt-4 flex justify-center">
					<img
						width="160"
						height="160"
						class="rounded-lg"
						src={thumbnails[1].url}
						alt="cover"
						referrerpolicy="no-referrer"
					/>
				</div>
				<div class="ml-4 mr-4 mt-4 flex flex-col items-start gap-2 overflow-hidden">
					<AlbumMarquee upper={name} lower={`${year} • ${artists.map((e) => e.name).join(', ')}`} />
				</div>
			</div>
			{#if $isMusicLoading == false}
				<div class="absolute left-4 top-6 flex flex-col justify-center gap-4">
					<button
						class="variant-soft-secondary btn cursor-pointer bg-gradient-to-br text-lg opacity-0 transition duration-300 ease-in-out hover:scale-105 group-hover:opacity-100"
						on:click={() =>
							addAlbumToQueue(
								name,
								albumId,
								thumbnails[thumbnails.length - 1].url,
								artists.map((e) => e.name).join(', '),
								playlistId
							)}
					>
						Add to queue
					</button>

					<button
						class="variant-soft-secondary btn cursor-pointer bg-gradient-to-br text-lg opacity-0 transition duration-300 ease-in-out hover:scale-105 group-hover:opacity-100"
						on:click={() => fetchAlbumDetails(playlistId)}
					>
						Go to album
					</button>

					<button
						class="variant-soft-secondary btn cursor-pointer bg-gradient-to-br text-lg opacity-0 transition duration-300 ease-in-out hover:scale-105 group-hover:opacity-100"
					>
						Go to artist
					</button>

					<button
						class="variant-ghost-primary btn text-lg opacity-0 transition duration-300 ease-in-out hover:scale-105 group-hover:opacity-100"
						on:click={() => {
							addAlbumToQueue(
								name,
								albumId,
								thumbnails[thumbnails.length - 1].url,
								artists.map((e) => e.name).join(', '),
								playlistId
							);

							isPlaying.set(true);
						}}
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
			{/if}
		</div>
	{/each}
</div>
