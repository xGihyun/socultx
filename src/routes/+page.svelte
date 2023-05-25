<script>
	import { doc, getDoc, setDoc } from 'firebase/firestore';
	import { db } from '../lib/firebase/firebase';
	import { googleAuthPopup } from '$lib/firebase/auth';
	import { uid } from 'uid';

	export let data;

	// Handle user stuff
	let isLoggedIn = data.user?.isLoggedIn || false;
	let username = data.user?.username || null;
	let email = data.user?.email || null;
	let userUID = data.uid || null;
	let posts = data.posts || [];

	/**
	 * The user data to store
	 * @type {import('$lib/types').PostData}
	 */
	let dataToStore = {
		email: email,
		posts: posts
	};

	// After logging in, take the data that the current user has, including their posts
	async function login() {
		const user = await googleAuthPopup();

		if (!user) return;

		isLoggedIn = user.isLoggedIn;
		email = user.email;
		username = user.username;
		userUID = user.uid;
		dataToStore.posts = user.posts;
	}

	/**
	 * The value from the input
	 * @type {string}
	 */
	let inputText;

	async function postBlog() {
		if (!userUID) {
			console.log('No user!');
			return;
		}

		console.log('Posting...');

		const docRef = doc(db, 'users', userUID);
		const docSnap = await getDoc(docRef);
		const userData = docSnap.data();
		const postID = uid(32);

		dataToStore = JSON.parse(JSON.stringify(userData));

		// Only allow to push posts if there is an input
		if (!inputText) {
			console.log('Must input text!');
			return;
		}

		// This might seem too repetitive, I'm too lazy
		dataToStore.posts.push({
			content: inputText,
			userUID: userUID,
			user: username || '',
			id: postID
		});

		// Store data to database
		await setDoc(docRef, dataToStore, { merge: true });

		console.log('Posted!');
	}

	/**
	 * Delete blog based on the unique identifier of the post
	 * @param {string} id
	 */
	async function deleteBlog(id) {
		if (!userUID) {
			console.log('No user!');
			return;
		}

		console.log('Deleting...');
		console.log(id);

		const docRef = doc(db, 'users', userUID);
		const docSnap = await getDoc(docRef);
		const userData = docSnap.data();

		dataToStore = JSON.parse(JSON.stringify(userData));

		// Find the index of the post with the specified ID
		const index = dataToStore.posts.findIndex((post) => post.id === id);

		// Remove the post from the array
		if (index !== -1) {
			dataToStore.posts.splice(index, 1);
		}

		// Store data to database
		await setDoc(docRef, dataToStore, { merge: true });

		console.log('Deleted!');
	}
</script>

{#if isLoggedIn}
	<div class="flex flex-col items-center justify-center">
		<p class="mb-10 text-5xl text-white">Hello {username}</p>
		<div class="mb-10">
			<form title="Post Blog">
				<input class="p-2" bind:value={inputText} />
				<button class="bg-blue-600 p-2 text-white" on:click={postBlog}>Post</button>
			</form>
		</div>
		<span class="text-3xl text-white">Posts</span>
		<div class="h-80 w-full max-w-3xl overflow-y-scroll px-10">
			{#each dataToStore.posts as post, idx (idx)}
				<div class="mb-2 flex justify-between gap-2">
					<p class="text-white">Post #{idx + 1}: {post.content}</p>
					<button class="bg-red-600 p-2 text-white" on:click={() => deleteBlog(post.id)}
						>Delete</button
					>
				</div>
			{/each}
		</div>
		<a class="bg-neutral-700 p-2 text-white" type="button" href="/profile">Go to profile</a>
	</div>
{:else}
	<!-- Testing out tailwind lol :D -->
	<div>
		<span class="text-4xl px-8 py-3 rounded-full bg-indigo-500 text-white font-semibold">SOCULT</span>
	</div>
	<button class="bg-neutral-700 p-2 text-white" on:click={login}>Log In</button>
{/if}

<!-- <button on:click={getMyUserName}>Test</button> -->
