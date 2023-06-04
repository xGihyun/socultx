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
	<!-- experimenting for now idk what im doing geez -->
	<div class="overflow flex h-screen flex-wrap justify-around">
		{#each data?.results as { type, videoId, name, thumbnails, artists }, i}
			<div class="card mx-2 my-6 w-48 overflow-hidden">
				<div class="flex">
					<img class="-translate-x-8" src={thumbnails[1].url} alt="cover" />
					<div class="-translate-x-8 truncate p-2">
						<p class="truncate font-semibold">{name}</p>
						<p>{artists.map((e) => e.name).join(', ')}</p>
					</div>
				</div>
			</div>
		{/each}
	</div>
{/if}
