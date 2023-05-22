<script>
	import { onMount } from 'svelte';
	import '../app.css';
	import { auth } from '$lib/firebase';
	import { userInfo } from '$lib/store';
	import { page } from '$app/stores';
	import { onAuthStateChanged } from 'firebase/auth';
	import { goto } from '$app/navigation';

	// onMount(() => {
	// 	auth.onAuthStateChanged((user) => {
	// 		// console.log('Before: ' + testUsername);
	// 		// testUsername = user?.displayName;
	// 		// isUserLoggedIn = true;
	// 		// console.log('After: ' + testUsername);

	// 		if (!user) {
	// 			return;
	// 		}

	// 		console.log('User: ' + user?.displayName);
	// 		userInfo.set({
	// 			email: user?.email,
	// 			username: user?.displayName,
	// 			isLoggedIn: true
	// 		});
	// 	});
	// });
	onMount(() => {
		// onAuthStateChanged(auth, (user) => {
		// if (user === null) {
		// 	console.log("Hello")
		// } else {
		// 	if ($page.url.pathname != "login") {
		// 		goto("/login")
		// 	}
		// }
		// })

		// auth.onAuthStateChanged(async (user) => {
		// 	if (user === null) {
		// 		console.log('Hello');
		// 	} else {
		// 		if ($page.url.pathname != 'login') {
		// 			await goto('/login');
		// 		}
		// 	}
		// });

		onAuthStateChanged(auth, (user) => {
			const isLoggedIn = user !== null;
			const isLoginPage = $page.url.pathname === 'login';

			if (!isLoggedIn && !isLoginPage) {
				console.log('Hello');
			} else if (isLoggedIn && !isLoginPage) {
				goto('/');
			}
		});
	});
</script>

<slot />
