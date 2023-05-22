<script>
	// import { userInfo } from '../lib/store';
	import { app, db, auth } from '../lib/firebase';
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

	/** @type {import('./$types').LayoutData} */
	export let data;

	// Handle user stuff
	$: isLoggedIn = data.user?.isLoggedIn || false;
	$: username = data.user?.username || '' || null;
	$: email = data.user?.email || '' || null;

	// Persist in session function, may or may not need
	// async function test() {
	// 	// https://firebase.google.com/docs/auth/web/auth-state-persistence
	// 	setPersistence(auth, browserSessionPersistence).then(() => {
	// 		return googleAuthPopup();
	// 	});
	// }

	// It will login via a popup window, might not be good for mobile
	async function googleAuthPopup() {
		const provider = new GoogleAuthProvider();
		try {
			const result = await signInWithPopup(auth, provider);
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential?.accessToken;
			const user = result.user;

			username = user.displayName;
			email = user.email;
			isLoggedIn = true;

			// DO NOT REMOVE
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
			setCookie('userUID', user.uid, 7);
			// This will show the stuff

			// Save username in localstorage
			setCookie(
				'userStuff',
				// JSON.stringify(data.user),
				JSON.stringify({
					username: user.displayName,
					email: user.email,
					isLoggedIn: true
				}),
				7
			);
		} catch (error) {
			// Handle Errors here.
			console.error(error);
		}
	}

	async function getMyUserName() {
		console.log('Username from session: ' + data);
	}

	/**
	 * @param {string} name
	 * @param {string | number | boolean} value
	 * @param {number} expirationDays
	 */
	function setCookie(name, value, expirationDays) {
		const expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate() + expirationDays);

		const cookieValue = value + '; expires=' + expirationDate.toUTCString() + '; path=/';
		document.cookie = name + '=' + cookieValue + ';secure=true';
	}
</script>

{#if isLoggedIn}
	<button on:click={getMyUserName}>What's my username</button>
	<p>Hello {username}</p>
	<a href="/profile">Go to profile</a>
{:else}
	<button on:click={googleAuthPopup}>Log In</button>
{/if}

<button on:click={getMyUserName}>Test</button>
