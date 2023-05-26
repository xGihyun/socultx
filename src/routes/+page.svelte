<script>
	import { enhance } from '$app/forms';
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
	$: allUsers = data.users || [];

	/**
	 * The user data to store
	 * @type {import('$lib/types').UserData}
	 */
	let dataToStore = {
		username: username,
		uid: userUID,
		email: email,
		isLoggedIn: isLoggedIn,
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

	// /**
	//  * Delete blog based on the unique identifier of the post
	//  * @param {string} id
	//  */
	// async function deleteBlog(id) {
	// 	if (!userUID) {
	// 		console.log('No user!');
	// 		return;
	// 	}

	// 	console.log(`Deleting post... ${id}`);

	// 	const docRef = doc(db, 'users', userUID);
	// 	const docSnap = await getDoc(docRef);
	// 	const userData = docSnap.data();

	// 	dataToStore = JSON.parse(JSON.stringify(userData));

	// 	// Find the index of the post with the specified ID
	// 	const index = dataToStore.posts.findIndex(
	// 		(/** @type {{ id: string; }} */ post) => post.id === id
	// 	);
	// 	// dataToStore.posts

	// 	// Remove the post from the array
	// 	if (index !== -1) {
	// 		dataToStore.posts.splice(index, 1);
	// 	}

	// 	// Store data to database
	// 	await setDoc(docRef, dataToStore, { merge: true });

	// 	console.log('Deleted!');
	// }
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
			{#each allUsers as user, idx (idx)}
				<div class="my-5 flex flex-col gap-2">
					{#each user.posts as post, idx (idx)}
						<p class="font-bold text-white">{user.username}</p>
						<div class="flex gap-2 items-center">
							<p class="text-white">{post.content}</p>
							{#if user.uid === userUID}
								<form action={`/delete-post?id=${post.id}`} method="post" use:enhance>
									<button class="bg-red-600 p-2 text-white w-fit">Delete</button>
								</form>
							{/if}
						</div>
					{/each}
				</div>
			{/each}
		</div>
		<a class="bg-neutral-700 p-2 text-white" type="button" href="/profile">Go to profile</a>
	</div>
{:else}
	<!-- Testing out tailwind lol :D -->
	<div>
		<span class="rounded-full bg-indigo-500 px-8 py-3 text-4xl font-semibold text-white">SOCULT</span>
	</div>
	<button class="bg-neutral-700 p-2 text-white" on:click={login}>Log In</button>
{/if}