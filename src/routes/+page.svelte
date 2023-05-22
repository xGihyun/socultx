<script>
	import { userInfo } from '../lib/store';
	import { app, db, auth } from '../lib/firebase';
	import { onMount } from 'svelte';
	import {
		GoogleAuthProvider,
		browserLocalPersistence,
		browserSessionPersistence,
		getAuth,
		getRedirectResult,
		indexedDBLocalPersistence,
		setPersistence,
		signInWithPopup,
		signInWithRedirect
	} from 'firebase/auth';

	// export let data;

	// Get user info if available in localstorage
	// onMount(() => {
	// 	const savedState = localStorage.getItem('userStuff');
	// 	if (savedState) {
	// 		userInfo.set(JSON.parse(savedState));
	// 	}
	// 	console.log($userInfo);
	// });

	async function test() {
		// Persist in session
		// https://firebase.google.com/docs/auth/web/auth-state-persistence
		setPersistence(auth, browserSessionPersistence).then(() => {
			return googleAuthPopup();
		});
	}

	// It will login via a popup window, might not be good for mobile
	async function googleAuthPopup() {
		const provider = new GoogleAuthProvider();
		try {
			const result = await signInWithPopup(auth, provider);
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential?.accessToken;
			const user = result.user;

			userInfo.set({
				email: user?.email,
				username: user?.displayName,
				isLoggedIn: true,
			});

			// let dataToStore;

			// const docRef = doc(db, 'users', user.uid);
			// const docSnap = await getDoc(docRef);

			// if (!docSnap.exists()) {
			// 	// Get reference to the user path where the users will be stored (?)
			// 	const userRef = doc(db, 'user', user.uid);

			// 	// The data that you wanna store

			// 	dataToStore = {
			// 		email: user.email,
			// 		posts: ['Hello, World']
			// 	};

			// 	// Store data to db
			// 	await setDoc(userRef, dataToStore, { merge: true });
			// } else {
			// 	const userData = docSnap.data();
			// 	dataToStore = userData;
			// }

			// This will set a session cookie
			// setCookie('userUID', user.uid, 7);
			// This will show the stuff

			// Save username in localstorage
			// setCookie('userStuff', JSON.stringify($userInfo), 7);
		} catch (error) {
			// Handle Errors here.
			console.error(error);
		}
	}

	async function getMyUserName() {
		console.log('Username from session: ' + $userInfo.username);
	}

	/**
	 * @param {string} name
	 * @param {string | number | boolean} value
	 * @param {number} expirationDays
	 */
	// function setCookie(name, value, expirationDays) {
	// 	const expirationDate = new Date();
	// 	expirationDate.setDate(expirationDate.getDate() + expirationDays);

	// 	const cookieValue =
	// 		encodeURIComponent(value) + '; expires=' + expirationDate.toUTCString() + '; path=/';
	// 	document.cookie = name + '=' + cookieValue;
	// }
</script>

{#if $userInfo.isLoggedIn}
	<button on:click={getMyUserName}>What's my username</button>
	<p>Hello {$userInfo.username}</p>
	<a href="/profile">Go to profile</a>
{:else}
	<button on:click={test}>Log In</button>
{/if}

<button on:click={getMyUserName}>Test</button>
