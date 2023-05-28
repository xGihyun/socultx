<script>
	import { enhance } from '$app/forms';
	import { db } from '$lib/firebase/firebase.js';
	import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
	import ChatMessage from '../components/ChatMessage.svelte';
	import { uid } from 'uid';
	// import { onMount } from 'svelte';

	export let data;
	console.log(`THIS IS DATA!!!!!!!!!!!!!!`);
	console.log(data);

	// STARRRRRTTTTTTTTTTTTTTTTTT

	// $: messages = data.messages;
	// const senderUserID = data.user?.uid // Your own user id
	// let doesChatExist = false,
	// 	senderObject = {},
	// 	receiverObject = {};

	// // First create variables for (the sender and the receiver) need proper type here idk how
	// data.users?.forEach((item) => {
	// 	if (item.uid === data.user?.uid) {
	// 		senderObject = item;
	// 	} else if (item.uid === data.receiverId) {
	// 		receiverObject = item;
	// 	}
	// });

	// console.log(`The sender is: `);
	// console.log(senderObject);

	// console.log(`The receiver is: `);
	// console.log(receiverObject);

	// // Then check if a chat between the sender and receiver already exists
	// doesChatExist = senderObject.inbox.some((inboxItem1) => {
	// 	receiverObject.inbox.some((inboxItem2) => inboxItem1.chat_id === inboxItem2.chat_id);
	// });

	// console.log(`WHERES THE FKING BOOLEAN: ${doesChatExist}`);

	// // Check if the chat exists
	// if (doesChatExist) {
	// 	// No need to create new random chat id
	// 	// Simply load the information needed to chat
	// 	console.log('Both sender and receiver already has a chat!');
	// } else {
	// 	// Generate random chat id
	// 	let randomChatId = uid(64);
	// 	// Add both random chat id to the respective users' inbox

	// 	// SENDER
	// 	updateDoc(doc(db, `users`, senderObject.uid), {
	// 		inbox: arrayUnion({
	// 			chat_id: randomChatId,
	// 			chat_name: receiverObject.username
	// 		})
	// 	});

	// 	// RECEIVER
	// 	updateDoc(doc(db, `users`, receiverObject.uid), {
	// 		inbox: arrayUnion({
	// 			chat_id: randomChatId,
	// 			chat_name: senderObject.username
	// 		})
	// 	});

	// 	console.log("Success! added chat to both users' inbox");
	// }

	// onMount(async () => {
	// });

	// ENDDDDDDDDDDDDDDDDDDDDDDDDD

	// let doesChatExist = false;
	// for (let i = 0; i < userObjects?.length; i++) {

	// }

	// If not then we generate a random uid for the chat

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

	// const userUnsub = onSnapshot(
	// 	collection(db, `users/${data.receiverUID}/conversations/${data.userUID}/messages`), (snapshot) => {
	// 	/**
	// 	 * @type {import("@firebase/firestore").DocumentData[]}
	// 	 */
	// 	// let test = []
	// 	snapshot.forEach((doc) => {
	// 		// test.push(doc.data())
	// 		// messages = doc.data();
	// 	})

	// 	console.log("Snapshot test:")
	// 	// console.log(test)
	// 	// messages = test
	// 	// messages.concat(test);
	// 	// console.log("Test snapshot")
	// 	// console.log(test)

	// });
</script>

<div class="relative w-full">
	<div class="flex h-screen flex-col gap-4 overflow-y-scroll px-5 py-32">
		<!-- {#each messages as message, idx (idx)}
			<ChatMessage
				username={message.sender_username}
				message={message.content}
				uid={data.userUID}
				senderId={message.sender_id}
				photoURL={message.photo_url}
			/>
			<span class="text-white font-bold">{message.sender_username}</span>
		    <span class="text-white">{message.content}</span>
		{/each} -->
	</div>
	<div class="fixed bottom-10 left-1/2 -translate-x-1/2 lg:absolute">
		<!-- <form title="Add Post" action={`/chat/${data.receiverUID}?/add`} method="post" use:enhance>
			<input class="p-2" name="content" />
			<button class="bg-blue-600 p-2 text-white">Send</button>
		</form> -->
	</div>
</div>
