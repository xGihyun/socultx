<script>
	import { enhance } from '$app/forms';
	import { getContext } from 'svelte';
	import ChatMessage from '../components/ChatMessage.svelte';
	import { collection, onSnapshot } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';

	const userContext = getContext('user');

	export let data;

	$: chatHistory = data.chatHistory;

	const userMessageCollection = collection(
		db,
		`users/${$userContext.uid}/inbox/${data.chatId}/messages`
	);

	// TODO: Is this the best way to do snapshots? (reassigning chatHistory over and over again...)
	const unsubChat = onSnapshot(userMessageCollection, (snapshot) => {
		chatHistory = snapshot.docs.map(
			(doc) => /** @type {import('$lib/types').Message} */ (doc.data())
		);
		chatHistory.sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
	});
</script>

<div class="relative w-full">
	<div class="flex h-full flex-col gap-4 overflow-y-scroll px-5 py-32">
		{#each chatHistory as message}
			<ChatMessage
				username={message.sender_username}
				message={message.content}
				uid={$userContext.uid || ''}
				senderId={message.sender_uid}
				photoURL={message.sender_photo_url}
			/>
		{/each}
	</div>
	<div class="fixed bottom-10 left-1/2 -translate-x-1/2 lg:absolute">
		<form title="Send message" action={`/chat/${data.chatId}?/send`} method="post" use:enhance>
			<input class="p-2" name="content" />
			<button class="bg-blue-600 p-2 text-white">Send</button>
		</form>
	</div>
</div>
