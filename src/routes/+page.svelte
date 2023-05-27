<script>
	import { enhance } from '$app/forms';
	import { doc, getDoc, setDoc, onSnapshot, collection } from 'firebase/firestore';
	import { db } from '../lib/firebase/firebase';
	import { googleAuthPopup } from '$lib/firebase/auth';
	import { uid } from 'uid';

	export let data;

	// Handle user stuff
	$: isLoggedIn = data.user?.isLoggedIn || false;
	let username = data.user?.username || null;
	let email = data.user?.email || null;
	let userUID = data.uid || null;
	let posts = data.posts || [];
	let photoURL = data.user?.photoURL || null;
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
		posts: posts,
		photoURL: null
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

	// TODO: ONSNAPSHOT
	const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
		/**
		 * @type {import("@firebase/firestore").DocumentData[]}
		 */
		let test = []
		snapshot.forEach((doc) => {
			test.push(doc.data())
		})
		
		allUsers = test;
		// console.log("Test snapshot")
		// console.log(test)
	});

</script>

{#if isLoggedIn}
	<div class="flex flex-col items-center justify-center">
		<p class="mb-10 text-5xl text-white">Hello {username}</p>
		<div class="mb-10">
			<form title="Add Post" action="/posts/add" method="post" use:enhance>
				<input class="p-2" name="content"/>
				<button class="bg-blue-600 p-2 text-white">Post</button>
			</form>
		</div>
		<span class="text-3xl text-white">Posts</span>
		<div class="h-96 w-full max-w-3xl overflow-y-scroll px-10">
			{#each allUsers as user, idx (idx)}
				<div class="my-5 flex flex-col gap-2">
					{#each user.posts as post, idx (idx)}
						<p class="font-bold text-white">{user.username}</p>
						<div class="flex gap-2 items-center">
							<p class="text-white">{post.content}</p>
							{#if user.uid === userUID}
								<form title="Delete Post" action={`/posts/delete?id=${post.id}`} method="post" use:enhance>
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