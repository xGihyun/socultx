<script lang="ts">
	// Your custom Skeleton theme:
	import '../theme.postcss';

	// This contains the bulk of Skeletons required styles:
	// NOTE: this will be renamed skeleton.css in the v2.x release.
	import '@skeletonlabs/skeleton/styles/skeleton.css';

	// Finally, your application's global stylesheet (sometimes labeled 'app.css')
	import '../app.postcss';

	// This is needed for interactive popups
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	import { allUsers, currentUser } from '$lib/store';
	import { getContext, onDestroy, onMount, setContext } from 'svelte';
	import Navbar from '../components/Navbar.svelte';
	import Sidebar from '../components/Sidebar.svelte';
	// import type { UserData } from '$lib/types';
	// import type { Writable } from 'svelte/store';
	import { auth, rtdb } from '$lib/client/firebase';
	import {
		ref,
		onValue,
		push,
		onDisconnect,
		set,
		serverTimestamp,
		type Unsubscribe,
		goOffline
	} from 'firebase/database';
	import { afterNavigate } from '$app/navigation';
	// import { getAuth, type Unsubscribe } from 'firebase/auth';
	// import { setCookie } from '$lib/cookie';

	export let data;

	// $: currentUser.set({
	// 	email: data.user?.username || '',
	// 	is_logged_in: data.user?.is_logged_in || false,
	// 	photo_url: data.user?.photo_url || '',
	// 	uid: data.user?.uid || '',
	// 	username: data.user?.username || ''
	// });

	// $: allUsers.set(data.users || []);

	// currentUser.set({
	// 	email: data.user?.username || '',
	// 	is_logged_in: data.user?.is_logged_in || false,
	// 	photo_url: data.user?.photo_url || '',
	// 	uid: data.user?.uid || '',
	// 	username: data.user?.username || ''
	// });

	// allUsers.set(data.users || []);

	// This is set at the root layout
	// setContext('users', allUsers);

	onMount(() => {
		let presenceListenerUnsub: Unsubscribe | null = null;

		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				console.log('Trying to establish a connection to the database, check firebase rtdb...');
				// This uses realtime database from firebase note that -> firestore database != firebase/realtime database (rtdb)
				// Note that '.info/connected' is a special location within firebase database
				const connectedRef = ref(rtdb, '.info/connected');
				const connectionsRef = ref(rtdb, `users/${user.uid}/connections`);
				const lastOnlineRef = ref(rtdb, `users/${user.uid}/lastOnline`);

				if (presenceListenerUnsub == null) {
					presenceListenerUnsub = onValue(connectedRef, (snap) => {
						if (snap.val() == true) {
							// We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
							const con = push(connectionsRef);
							// When I disconnect, remove this device
							onDisconnect(con).remove();
							// Add this device to my connections list
							// this value could contain info about the device or a timestamp too
							set(con, true);
							// When I disconnect, update the last time I was seen online
							onDisconnect(lastOnlineRef).set(serverTimestamp());
						}
					});
				}
			} else {
				console.log('User is not logged in');
				console.log('Not logged in, will not establish a connection to the database');
				if (presenceListenerUnsub != null) {
					console.log(`onValue listener is being used, preparing to unsub`);
					presenceListenerUnsub();
					console.log(`Going offline now...`);
					goOffline(rtdb);
				}
			}
		});

		return unsubscribe;
	});

	// let stufferinos = getAuth();
	// console.log(stufferinos.currentUser);
	// if (stufferinos.currentUser) {
	// 	console.log('User is logged in');

	// 	currentUser.set({
	// 		email: stufferinos.currentUser.email,
	// 		is_logged_in: true,
	// 		photo_url: stufferinos.currentUser.photoURL,
	// 		uid: stufferinos.currentUser.uid,
	// 		username: stufferinos.currentUser.displayName
	// 	});

	// setContext('user', currentUser);
	// } else {
	// 	console.log('user is not logged in');
	// }

	// let userContext = getContext<Writable<UserData>>('user');

	// afterNavigate(() => {
	// 	console.log('current user in +layout.svelte ', $currentUser);
	// 	console.log('usercontext in +layout.svelte', userContext);
	// 	if ($userContext.uid) {
	// 		console.log('User is now logged in?');
	// 	}
	// });

	// if ($currentUser.uid != '') {
	// 	console.log('will this run againaingianigna');
	// 	// This uses realtime database from firebase note that -> firestore database != firebase/realtime database (rtdb)
	// 	// Note that '.info/connected' is a special location within firebase database
	// 	const connectedRef = ref(rtdb, '.info/connected');
	// 	const connectionsRef = ref(rtdb, `users/${$currentUser.uid}/connections`);
	// 	const lastOnlineRef = ref(rtdb, `users/${$currentUser.uid}/lastOnline`);

	// 	onValue(connectedRef, (snap) => {
	// 		if (snap.val() == true) {
	// 			// We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
	// 			const con = push(connectionsRef);

	// 			// When I disconnect, remove this device
	// 			onDisconnect(con).remove();

	// 			// Add this device to my connections list
	// 			// this value could contain info about the device or a timestamp too
	// 			set(con, true);

	// 			// When I disconnect, update the last time I was seen online
	// 			onDisconnect(lastOnlineRef).set(serverTimestamp());
	// 		}
	// 	});
	// }
</script>

<div class="flex h-screen flex-col">
	{#if data.user}
		<Navbar picture={data.user.picture} />
	{/if}
	<div class="flex w-full flex-1 overflow-hidden">
		<main class="relative flex-1 overflow-y-auto">
			<slot />
		</main>
		<!-- {#if $userContext.is_logged_in} -->
		<!-- <Sidebar /> -->
		<!-- {/if} -->
	</div>
</div>
