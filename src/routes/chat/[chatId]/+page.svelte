<script>
	import { enhance } from '$app/forms';
	import { getContext, onDestroy } from 'svelte';
	import ChatMessage from '../components/ChatMessage.svelte';
	import {
		QuerySnapshot,
		collection,
		getDocs,
		limit,
		onSnapshot,
		orderBy,
		query,
		startAfter,
		Timestamp,
		limitToLast
	} from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { afterNavigate } from '$app/navigation';

	const user = getContext('user');

	export let data;

	$: chatHistory = data.chatHistory;

	let currentMessage = '';

	/**
	 * Send button that is used to be clicked manually or with code after `enter` since we are using `textbox` instead of `input`
	 * @type {HTMLButtonElement}
	 */
	let chatSend;

	/**
	 * Element used to scroll to bottom
	 * @type {HTMLElement}
	 */
	let chatElem;
	let chatElemHeight = 0;
	let loadingMessages = false;
	let historyEmpty = false;

	/**
	 * Skeleton UI's scroll-to-bottom function. Runs after the user sends a message.
	 * @param {ScrollBehavior} behavior
	 */
	function scrollChatToBottom(behavior) {
		setTimeout(() => {
			if (chatElem) {
				chatElem.scrollTo({ top: chatElem.scrollHeight, behavior });
			}
		}, 0);
	}

	function maintainScrollPosition() {
		if (historyEmpty) {
			return;
		} else if (loadingMessages) {
			chatElem.scrollTop = chatElem.scrollHeight - chatElemHeight;
		} else {
			chatElem.scrollTop = chatElem.scrollHeight;
		}
	}

	async function loadMessagesOnScroll() {
		if (chatElem.scrollTop === 0 && !loadingMessages && !historyEmpty) {
			console.log('Loading past messages...');

			loadingMessages = true;
			chatElemHeight = chatElem.scrollHeight;

			await loadMoreMessages();
			maintainScrollPosition();

			loadingMessages = false;
		}
	}

	async function loadMoreMessages() {
		const lastMessage = chatHistory[0];
		const querySnapshot = await getOlderMessages(lastMessage.timestamp);

		// Don't do anything if there are no more messages to be loaded
		if (querySnapshot.empty) {
			historyEmpty = true;
			loadingMessages = false;
			return;
		}

		// Append the newly loaded messages to the existing chat messages
		const newMessages = querySnapshot.docs.map(
			(doc) => /** @type {import('$lib/types').Message} */ (JSON.parse(JSON.stringify(doc.data())))
		);

		console.log('Newly loaded messages:');
		console.log(newMessages);

		chatHistory = [...newMessages, ...chatHistory];
	}

	/**
	 * @param {Timestamp} startAfterTimestamp
	 * @returns {Promise<QuerySnapshot<import('firebase/firestore').DocumentData>>}
	 */
	async function getOlderMessages(startAfterTimestamp) {
		console.log(startAfterTimestamp);
		const userMessageCollection = collection(
			db,
			`users/${$user.uid}/inbox/${data.chatId}/messages`
		);

		// Construct the query to get older messages
		const q = query(
			userMessageCollection,
			orderBy('timestamp'),
			startAfter(startAfterTimestamp),
			limit(10)
		);

		const querySnapshot = await getDocs(q);

		return querySnapshot;
	}

	const userMessageCollection = collection(db, `users/${$user.uid}/inbox/${data.chatId}/messages`);
	const q = query(userMessageCollection, orderBy('timestamp'), limitToLast(10));

	// TODO: Is this the best way to do snapshots? (reassigning chatHistory over and over again...)
	const unsubChat = onSnapshot(q, (snapshot) => {
		chatHistory = snapshot.docs.map(
			(doc) => /** @type {import('$lib/types').Message} */ (doc.data())
		);
		chatHistory.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
		maintainScrollPosition();
	});

	onDestroy(() => unsubChat());
	afterNavigate(() => {
		chatElem.scrollTop = chatElem.scrollHeight;
	});
</script>

<div
	class="h-full space-y-4 overflow-y-auto px-5 py-10"
	bind:this={chatElem}
	on:scroll={loadMessagesOnScroll}
>
	{#each chatHistory as message}
		<ChatMessage
			username={message.sender_username}
			message={message.content}
			uid={$user.uid || ''}
			senderId={message.sender_uid}
			photoURL={message.sender_photo_url}
			timestamp={message.timestamp}
		/>
	{/each}
	<div class="h-32" />
</div>
<div class="absolute bottom-10 left-1/2 w-full max-w-3xl -translate-x-1/2">
	<form
		class="contents"
		title="Send message"
		action={`/chat/${data.chatId}?/send`}
		method="post"
		use:enhance
	>
		<div class="input-group input-group-divider rounded-container-token grid-cols-[1fr_auto]">
			<textarea
				bind:value={currentMessage}
				class="w-full resize-none border-0 bg-transparent outline-none ring-0"
				name="content"
				id="content"
				placeholder="Aa"
				rows="1"
				aria-label="send message"
				on:keydown={(event) => {
					if (event.key === 'Enter' && !event.shiftKey) {
						event.preventDefault();
						chatSend.click();
					}
				}}
			/>
			<button
				class="variant-filled-primary max-w-fit"
				on:click={() => scrollChatToBottom('smooth')}
				bind:this={chatSend}>Send</button
			>
		</div>
	</form>
</div>
