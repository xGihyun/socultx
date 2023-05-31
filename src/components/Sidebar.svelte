<script>
	import { Avatar } from "@skeletonlabs/skeleton";

	/**
	 * @type {any}
	 */
	export let users;
</script>

<ul class="list flex min-h-screen flex-col gap-2 bg-blue-900 px-10 py-32">
	{#each users as user, idx (idx)}
		<a href={`/chat/${user.uid}`}>
			<li>
				<div class="relative h-10 w-10">
					<Avatar src={user.photo_url} width="w-10" />
					{#if user.is_logged_in}
						<span
							class="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"
						/>
					{/if}
				</div>
				<div class="flex flex-col">
					<span class="flex-auto text-white">{user.username}</span>
					<span class="text-sm text-neutral-300">status</span>
				</div>
			</li>
		</a>
	{/each}
</ul>
