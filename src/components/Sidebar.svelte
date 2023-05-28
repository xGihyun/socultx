<script>
	// import { onMount } from 'svelte';

	/**
	 * @type {import("@firebase/firestore").DocumentData[]}
	 */
	export let users;
	// // Get user profile?
	// onMount(() => {

	// })
</script>

<ul class="list py-32 flex min-h-screen flex-col gap-2 bg-blue-900 px-10">
	{#each users as user, idx (idx)}
		<a href={`/chat/${user.uid}`}>
			<li>
				<div class="relative h-10 w-10">
					<img src={user.photoURL} alt="profile pic" class="rounded-full" />
					{#if user.isLoggedIn}
						<span
							class="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"
						/>
					{/if}
				</div>
				<!-- <span class="text-white">(icon)</span> -->
				<div class="flex flex-col">
					<span class="flex-auto text-white">{user.username}</span>
					<span class="text- text-sm">status</span>
				</div>
			</li>
		</a>
	{/each}
</ul>
