<script lang="ts">
	// import { googleAuthPopup } from '$lib/firebase/auth';
	// import { getContext } from 'svelte';
	// import { google } from '../assets/images';
	// import type { UserData } from '$lib/types';
	// import type { Writable } from 'svelte/store';
	// import { auth } from '$lib/firebase/firebase';
	// import { signOut } from 'firebase/auth';
	// import { currentUser } from '$lib/store';

	import Auth from '../components/Auth.svelte';

	export let data;
	export let form;

	// let user = getContext<Writable<UserData>>('user');

	// async function login() {
	// 	const user = await googleAuthPopup();

	// if (!user) return;

	// console.log('Setting stores...');

	// // Update the current store
	// currentUser.update(
	// 	(val) =>
	// 		(val = {
	// 			email: user.username || '',
	// 			is_logged_in: user.is_logged_in || false,
	// 			photo_url: user.photo_url || '',
	// 			uid: user.uid || '',
	// 			username: user.username || ''
	// 		})
	// );

	// console.log('Stores set!');

	// This uses realtime database from firebase note that -> firestore database != firebase/realtime database (rtdb)
	// Note that '.info/connected' is a special location within firebase database
	// const connectedRef = ref(rtdb, '.info/connected');
	// const connectionsRef = ref(rtdb, `users/${user.uid}/connections`);
	// const lastOnlineRef = ref(rtdb, `users/${user.uid}/lastOnline`);

	// onValue(connectedRef, (snap) => {
	// 	if (snap.val() == true) {
	// 		// We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
	// 		const con = push(connectionsRef);

	// 		// When I disconnect, remove this device
	// 		onDisconnect(con).remove();

	// 		// Add this device to my connections list
	// 		// this value could contain info about the device or a timestamp too
	// 		set(con, true);

	// 		// When I disconnect, update the last time I was seen online
	// 		onDisconnect(lastOnlineRef).set(serverTimestamp());
	// 	}
	// });
	// }
</script>

{#if data.user}
	<div class="flex h-full flex-col items-center justify-center">
		<!-- <p class="mb-10 text-5xl">Hello, {$userContext.username}</p> -->
		<p class="mb-10 text-5xl">Hello, {data.user.name}</p>
		<a class="variant-filled-secondary p-2" type="button" href="/profile">Go to profile</a>
	</div>
{:else}
	<div class="flex h-full flex-row items-center justify-around">
		<div>
			<h1
				class="animate-text select-none bg-gradient-to-br from-teal-500 via-purple-500 to-orange-500 box-decoration-clone bg-clip-text text-center font-gt-walsheim-pro-medium text-8xl uppercase text-transparent"
			>
				Socult
			</h1>
			<span>Social Media + Ultimate</span>
		</div>
		<Auth message={form?.message} />
	</div>
{/if}
