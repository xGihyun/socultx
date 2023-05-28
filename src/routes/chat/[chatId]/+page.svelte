<script>
	import { enhance } from '$app/forms';
	import { db } from '$lib/firebase/firebase.js';
	import {
		addDoc,
		arrayUnion,
		collection,
		doc,
		getDoc,
		getDocs,
		onSnapshot,
		setDoc,
		updateDoc
	} from 'firebase/firestore';
	import ChatMessage from '../components/ChatMessage.svelte';
	import { uid } from 'uid';
	import { onDestroy } from 'svelte';

	export let data;
	// console.log(`THIS IS DATA!!!!!!!!!!!!!!`);
	// console.log(data);

	// NOTE: TO GIHYUN, PLEASE CLEAR UR 'USERS' ENTRY IN THE DATABASE OR JUST PROBABLY ADD `inbox` property
	// ALSO THE CODE WORKS AFFF LIKE U CAN CHAT REALTIME NOW... ILL PROLLY WORK ON GROUPCHATS OR SOMETHING
	// ALSO U CAN OPTIMIZE CODE THE WAY U WANT, I DELETED OTHER FILES AND STUFF AIGHT IMMA FADE NOW LOL

	/**
	 * @type {any[]}
	 */
	$: chatHistory = [];
	// const senderUserID = data.user?.uid // Your own user id

	// First create variables for (the sender and the receiver) need proper type here idk how
	$: doesChatExist = false;
	let senderObject = {},
		receiverObject = {},
		randomChatId;

	// STARRRRRTTTTTTTTTTTTTTTTTT

	const getChatHistory = async (chat_id) => {
		const messagesCollection = collection(db, `chats/${chat_id}/messages`);
		const messageDocs = await getDocs(messagesCollection);

		// Process the message documents
		chatHistory = messageDocs.docs.map((doc) => doc.data());

		// Return the retrieved messages
	};

	const generateNewChat = async () => {
		// Generate random chat id
		randomChatId = uid(64);
		// Add both random chat id to the respective users' inbox

		// TODO: Optimization use await or a function or something
		// SENDER
		await updateDoc(doc(db, `users`, senderObject.uid), {
			inbox: arrayUnion({
				chat_id: randomChatId,
				chat_name: receiverObject.username
			})
		});

		console.log("Added chat to sender's inbox");

		// RECEIVER
		await updateDoc(doc(db, `users`, receiverObject.uid), {
			inbox: arrayUnion({
				chat_id: randomChatId,
				chat_name: senderObject.username
				// TODO: Possibly add photo url in the future
			})
		});

		console.log("Added chat to receiver's inbox");

		// Finally create the chat inside `chats/`
		// Create the main document with random chatId
		const chatDocRef = doc(db, 'chats', randomChatId);
		await setDoc(chatDocRef, {
			members: [senderObject, receiverObject]
		});
	};

	data.users?.forEach((item) => {
		if (item.uid === data.user?.uid) {
			senderObject = item;
		} else if (item.uid === data.receiverId) {
			receiverObject = item;
		}
	});

	console.log(`The sender is: `);
	console.log(senderObject);

	console.log(`The receiver is: `);
	console.log(receiverObject);

	// Then check if a chat between the sender and receiver already exists
	doesChatExist = senderObject.inbox.some((inboxItem1) => {
		return receiverObject.inbox.some((inboxItem2) => {
			if (inboxItem1.chat_id === inboxItem2.chat_id) {
				randomChatId = inboxItem1.chat_id; // Assign random chat id for use
				return true; // Return true to indicate the chat exists
			}
			return false; // Return false to continue checking other inbox items
		});
	});

	// Check if the chat exists
	if (doesChatExist) {
		// No need to create new random chat id

		console.log('Both sender and receiver already has a chat! - ID: ' + randomChatId);
		// Simply load the information needed to chat
		// getDoc(`chats`)
		getChatHistory(randomChatId).then(() => {
			console.log('GRABBED ALL OF THE MESSAGES!');
			console.log(chatHistory);
		});
		// const docSnap = await getDoc(userRef);
	} else {
		generateNewChat().then(() => {
			console.log('Generated new chat!');
		});
	}

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

	const unsubChat = onSnapshot(collection(db, `chats/${randomChatId}/messages`), (snapshot) => {
		chatHistory = snapshot.docs.map((doc) => doc.data());
		chatHistory.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
	});

	onDestroy(unsubChat);
</script>

<div class="relative w-full">
	<div class="flex h-screen flex-col gap-4 overflow-y-scroll px-5 py-32">
		{#each chatHistory as message}
			<ChatMessage
				username={message.sender_username}
				message={message.content}
				uid={senderObject.uid}
				senderId={message.sender_id}
				photoURL={message.photo_url}
			/>
			<!-- <span class="font-bold text-white">{message.sender_username}</span>
			<span class="text-white">{message.content}</span> -->
		{/each}
	</div>
	<div class="fixed bottom-10 left-1/2 -translate-x-1/2 lg:absolute">
		<form
			title="Send message"
			action={`/chat/${receiverObject.uid}?/add`}
			method="post"
			use:enhance
		>
			<input type="hidden" name="chatID" bind:value={randomChatId} />

			<input class="p-2" name="content" />
			<button class="bg-blue-600 p-2 text-white">Send</button>
		</form>
	</div>
</div>
