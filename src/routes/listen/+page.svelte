<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { activateTextTruncateScroll } from 'text-truncate-scroll';
	import SongResults from './components/SongResults.svelte';
	import AlbumResults from './components/AlbumResults.svelte';
	import { musicQueue, currentSongInfo, fetchSongAudioUrl } from '$lib/music';
	export let data;

	$: hasResults = data.didUserSearch;
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

<!-- Popup actions for song -->
<div class="card shadow-xl" data-popup="threeDotsActions">
	<div class="btn-group-vertical">
		<button
			on:click={async () => {
				$currentSongInfo.url = await fetchSongAudioUrl($currentSongInfo.id);
				musicQueue.update((arr) => [...arr, $currentSongInfo]);
			}}>Add to queue</button
		>
		<button>Go to artist</button>
		<button>Go to album</button>
		<div class="arrow bg-surface-100-800-token" />
	</div>
</div>
