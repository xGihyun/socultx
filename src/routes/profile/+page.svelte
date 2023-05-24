<script>
	// import { onMount } from 'svelte';
	// import { userInfo } from '../../lib/store';

	export let data;

	let username = data.user?.username;
</script>

<div>
	<h1 class="text-white text-5xl">
		Hello World! Welcome {username}
	</h1>
</div>

