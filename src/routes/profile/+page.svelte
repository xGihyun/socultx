<script>
	import { getContext } from 'svelte';

	const currentUser = getContext('user');
</script>

<div>
	<h1 class="text-5xl text-white">
		Hello World! Welcome {$currentUser.username}
	</h1>
</div>
