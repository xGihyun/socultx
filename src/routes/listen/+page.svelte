<script lang="ts">
	import { afterUpdate } from 'svelte';
	import { activateTextTruncateScroll } from 'text-truncate-scroll';
	import { musicQueue, currentSongInfo, isMusicLoading, fetchSongAudioUrl } from '$lib/music';
	import type { PageServerData } from './$types';
	import { Spinner } from '$lib/components';
	import { AlbumResults, SongResults } from '$lib/components/listen';

	export let data: PageServerData;

	$: hasResults = data.didUserSearch;
	$: showLoading = hasResults;

	afterUpdate(() => {
		activateTextTruncateScroll();
		hasResults = false;
	});
</script>

<form action="/listen" on:submit={() => (showLoading = true)}>
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

{#if showLoading == true}
	<div class="flex justify-center p-16 opacity-50">
		<Spinner />
	</div>
{/if}

{#if data.didUserSearch && showLoading == false}
	{#key hasResults}
		<h5 class="h5 m-2 text-white">
			Search results for: <span class="font-bold">{data?.query}</span>
		</h5>
		{#if data.type === 'song'}
			<SongResults results={data.results.songs} />
		{:else if data.type === 'album'}
			<AlbumResults results={data.results.albums} />
		{/if}
	{/key}
{/if}

<!-- Popup actions for song -->
<div class="card shadow-xl" data-popup="threeDotsActions">
	<div class="btn-group-vertical">
		<button
			disabled={$isMusicLoading}
			on:click={async () => {
				isMusicLoading.set(true);

				let song = await fetchSongAudioUrl($currentSongInfo.id);
				$currentSongInfo.url = song.url;
				$currentSongInfo.lyrics = song.lyrics;

				musicQueue.update((arr) => [...arr, $currentSongInfo]);
				isMusicLoading.set(false);
			}}>Add to queue</button
		>
		<button disabled={$isMusicLoading}>Go to artist</button>
		<button disabled={$isMusicLoading}>Go to album</button>
		<div class="arrow bg-surface-100-800-token" />
	</div>
</div>
