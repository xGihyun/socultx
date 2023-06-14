<script lang="ts">
	import '../../app.postcss';
	export let data;

	async function playAudioStream(
		songId: string,
		songName: string,
		artistName: string,
		thumbnailUrl: string
	) {
		const response = await fetch(`/listen/play/${songId}`);
		const songInfo = await response.json();
		const audioSrc = songInfo.url;
		console.log(songInfo);
	}
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
	<h5 class="h5 m-2 text-white">
		Search results for: <span class="font-bold">{data?.query}</span>
	</h5>
	<div class="overflow flex h-screen flex-wrap justify-evenly">
		{#each data?.results as { type, videoId, name, thumbnails, artists }, i}
			<button
				type="button"
				class="btn m-0 p-0"
				on:click={() =>
					playAudioStream(videoId, name, artists.map((e) => e.name).join(', '), thumbnails[0].url)}
			>
				<div class="card h-[60px] w-96 overflow-hidden">
					<div class="flex">
						<img src={thumbnails[0].url} alt="cover" />
						<div class="mx-2 my-auto flex flex-col items-start truncate">
							<p class="truncate font-gt-walsheim-pro-medium">{name}</p>
							<p class="truncate font-gt-walsheim-pro-thin">
								{artists.map((e) => e.name).join(', ')}
							</p>
						</div>
					</div>
				</div>
			</button>
		{/each}
	</div>
{/if}
