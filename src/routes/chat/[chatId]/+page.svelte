<script>
	import { enhance } from '$app/forms';
	import { db } from '$lib/firebase/firebase.js';
	import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import ChatMessage from '../components/ChatMessage.svelte';

	export let data;
	$: messages = data.messages;

	console.log(`This is messages thingyerslkjerlksjelr`);
	console.log(messages);
	// Current user (you)
	// const user = data.user;
	// const conversations = data.;
	// console.log(data)
	// $: receiverUsername = "Person"
	// const getUsernameOfReceiver = async () => {
	// 	const user2 = await getDoc(doc(db, `users/${data.user2}`))
	// 	const receiver = user2.data()?.username;
	// 	receiverUsername = receiver;
	// }

	// onMount(async () => {
	// 	await getUsernameOfReceiver();
	// })

	const userUnsub = onSnapshot(
		collection(db, `users/${data.receiverUID}/conversations/${data.userUID}/messages`), (snapshot) => {
		/**
		 * @type {import("@firebase/firestore").DocumentData[]}
		 */
		// let test = []
		snapshot.forEach((doc) => {
			// test.push(doc.data())
			// messages = doc.data();
		})
    
		console.log("Snapshot test:")
		// console.log(test)
		// messages = test
		// messages.concat(test);
		// console.log("Test snapshot")
		// console.log(test)
		
	});

</script>

<div class="relative w-full">
  <div class="flex flex-col gap-4 overflow-y-scroll h-screen py-32 px-5">
    {#each messages as message, idx (idx)}
      <ChatMessage username={message.sender_username} message={message.content} uid={data.userUID} senderId={message.sender_id} photoURL={message.photo_url} />
      <!-- <span class="text-white font-bold">{message.sender_username}</span>
      <span class="text-white">{message.content}</span> -->
    {/each}
  </div>
  <div class="fixed lg:absolute bottom-10 left-1/2 -translate-x-1/2">
    <form title="Add Post" action={`/chat/${data.receiverUID}?/add`} method="post" use:enhance>
      <input class="p-2" name="content" />
      <button class="bg-blue-600 p-2 text-white">Send</button>
    </form>
  </div>
</div>
