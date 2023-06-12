<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	const currentUser = getContext<Writable<any>>('user');
</script>

<div>
	<h1 class="text-5xl text-white">
		Hello World! Welcome {$currentUser.username}
	</h1>
</div>
