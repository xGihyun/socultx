<script lang="ts">
	import { afterUpdate, hasContext } from 'svelte';
	import { activateTextTruncateScroll } from 'text-truncate-scroll';
	import SongResults from './components/SongResults.svelte';
	import AlbumResults from './components/AlbumResults.svelte';
	import { musicQueue, currentSongInfo, isMusicLoading } from '$lib/music';
	import Spinner from '../../components/Spinner.svelte';
	export let data;

	$: hasResults = data.didUserSearch;
	$: showLoading = hasResults;

	afterUpdate(() => {
		activateTextTruncateScroll();
		hasResults = false;
	});
	console.log(data);
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
			disabled={$isMusicLoading}
			on:click={async () => {
				isMusicLoading.set(true);
				musicQueue.update((arr) => [...arr, $currentSongInfo]);
				isMusicLoading.set(false);
			}}>Add to queue</button
		>
		<button disabled={$isMusicLoading}>Go to artist</button>
		<button disabled={$isMusicLoading}>Go to album</button>
		<div class="arrow bg-surface-100-800-token" />
	</div>
</div>
