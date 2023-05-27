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

<ul class="list mt-20 min-h-screen bg-blue-900 p-10 flex flex-col gap-2">
	{#each users as user, idx (idx)}
		<li class="">
      <div class="w-10 h-10 relative">
        <img src={user.photoURL} alt="profile pic" class="rounded-full" />
        {#if user.isLoggedIn}
          <span class="w-3 h-3 bg-green-500 absolute bottom-0 right-0 rounded-full border-2 border-white" />
        {/if}
      </div>
			<!-- <span class="text-white">(icon)</span> -->
      <div class="flex flex-col">
        <span class="flex-auto text-white">{user.username}</span>
        <span class="text-sm text-">status</span>
      </div>
		</li>
	{/each}
</ul>
