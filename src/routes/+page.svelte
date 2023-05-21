<script>
	import {
		PUBLIC_FIREBASE_API_KEY,
		PUBLIC_FIREBASE_APP_ID,
		PUBLIC_FIREBASE_AUTH_DOMAIN,
		PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
		PUBLIC_FIREBASE_PROJECT_ID,
		PUBLIC_FIREBASE_STORAGE_BUCKET
	} from '$env/static/public';
    import { userInfo } from '../lib/store';
	import { initializeApp } from 'firebase/app';
	import { getFirestore, collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore/lite';
    import { onMount } from 'svelte';
	import {
		GoogleAuthProvider,
		getAuth,
		getRedirectResult,
		signInWithPopup,
		signInWithRedirect
	} from 'firebase/auth';
    export let data;
    $: isUserLoggedIn = data.isUserLoggedIn;

    // Get user info if available in localstorage
    onMount(() => {
        const savedState = localStorage.getItem('userStuff');
        if (savedState) {
            userInfo.set(JSON.parse(savedState));
        }
        console.log($userInfo);
    })
	// Follow this pattern to import other Firebase services
	// import { } from 'firebase/<service>';
	const firebaseConfig = {
		apiKey: PUBLIC_FIREBASE_API_KEY,
		authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
		projectId: PUBLIC_FIREBASE_PROJECT_ID,
		storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
		messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
		appId: PUBLIC_FIREBASE_APP_ID
	};

	const app = initializeApp(firebaseConfig);
	const db = getFirestore(app);
	const auth = getAuth(app);

	// It will login via a popup window, might not be good for mobile
	async function googleAuthPopup() {
		const provider = new GoogleAuthProvider();
		try {
			const result = await signInWithPopup(auth, provider);
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential?.accessToken;
			const user = result.user;
            
            // Save user info from "store" variable
            userInfo.set({
                email: user.email,
                username: user.displayName
            })

			console.log('User: ' + user);
			console.log('Token: ' + token);
            
			let dataToStore;

			const docRef = doc(db, 'users', user.uid);
			const docSnap = await getDoc(docRef);

			if (!docSnap.exists()) {
				// Get reference to the user path where the users will be stored (?)
				const userRef = doc(db, 'user', user.uid);

				// The data that you wanna store
				dataToStore = {
					email: user.email,
					posts: ['Hello, World']
				};

				// Store data to db
				await setDoc(userRef, dataToStore, { merge: true });
			} else {
				const userData = docSnap.data();
				dataToStore = userData;
			}

            // This will set a session cookie
            setCookie('userUID', user.uid, 7);
            // This will show the stuff
            isUserLoggedIn = true;
            // Save username in localstorage
            localStorage.setItem('userStuff', JSON.stringify($userInfo));

		} catch (error) {
			// Handle Errors here.
			console.error(error);
		}

	}

    async function getMyUserName() {
        console.log($userInfo);
    }

    /**
	 * @param {string} name
	 * @param {string | number | boolean} value
	 * @param {number} expirationDays
	 */
    function setCookie(name, value, expirationDays) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + expirationDays);

        const cookieValue = encodeURIComponent(value) + '; expires=' + expirationDate.toUTCString() + '; path=/';
        document.cookie = name + '=' + cookieValue;
    }

</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

{#if isUserLoggedIn}
    <button on:click={getMyUserName}>What's my username</button>
    <a href="/profile">Go to profile</a>
{:else} 
    <button on:click={googleAuthPopup}>Log In</button>
{/if}