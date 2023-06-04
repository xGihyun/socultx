<!-- <script>
	export let data;

	// This is nothing for now
	/**
	 * @type {any[]}
	 */
	$: inboxes = data.inboxes || [];
</script> -->

<!-- <div class="flex h-full"> -->
<!-- <ul class="list flex h-full max-w-xs flex-col gap-2 bg-indigo-900 px-10 py-32">
		{#each inboxes as inbox, idx (idx)}
			<a href={`/chat/${inbox.id}`}>
				<li>
					<div class="relative h-10 w-10">
						<img src={inbox.data.photo_url} alt="inbox" class="rounded-full" />
					</div>
					<div class="flex flex-col">
						<span class="line-clamp-1 flex-auto text-white">{inbox.data.username}</span>
						<span class="line-clamp-1 text-sm text-neutral-300">status</span>
					</div>
				</li>
			</a>
		{/each}
	</ul> -->
<!-- </div> -->
<slot />
