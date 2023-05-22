<script>
	import { onMount } from 'svelte';
	import '../app.css';
	import { auth } from '$lib/firebase';
	import { userInfo } from '$lib/store';

	onMount(() => {
		auth.onAuthStateChanged((user) => {
			// console.log('Before: ' + testUsername);
			// testUsername = user?.displayName;
			// isUserLoggedIn = true;
			// console.log('After: ' + testUsername);

			if (!user) {
				return;
			}

			console.log('User: ' + user?.displayName);
			userInfo.set({
				email: user?.email,
				username: user?.displayName,
				isLoggedIn: true
			});
		});
	});
</script>

<slot />
