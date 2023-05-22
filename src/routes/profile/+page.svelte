<script>
	// import { onMount } from 'svelte';
	// import { userInfo } from '../../lib/store';

	export let data;
	// onMount(() => {
	// 	const savedState = localStorage.getItem('userStuff');
	// 	if (savedState) {
	// 		userInfo.set(JSON.parse(savedState));
	// 	}
	// 	console.log($userInfo);
	// });
</script>

<div>Hello World! Welcome {data.user.username}</div>

