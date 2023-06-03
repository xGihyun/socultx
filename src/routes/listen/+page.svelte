<script>
	export let data;
	console.log(data);
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
	<div class="overflow flex h-screen flex-wrap justify-around overflow-y-auto">
		{#each data?.results as { type, videoId, name, thumbnails }, i}
			<div class="card h-42 mx-2 my-6 w-48 p-2">
				<div>
					<img src={thumbnails[0].url} alt="cover" />
					<p class="truncate p-2 font-semibold">
						{name}
					</p>
				</div>
			</div>
		{/each}
	</div>
{/if}
