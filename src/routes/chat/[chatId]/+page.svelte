<script lang="ts">
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
		Timestamp,
		limitToLast,
		endBefore,
		type DocumentData
	} from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { afterNavigate } from '$app/navigation';
	import type { Writable } from 'svelte/store';

	const user = getContext<Writable<any>>('user');

	export let data;

	let chatHistory: DocumentData[];
	$: chatHistory = data.chatHistory;

	let currentMessage = '';

	/**
	 * Send button that is used to be clicked manually or with code after `enter` since we are using `textbox` instead of `input`
	 * @type {HTMLButtonElement}
	 */
	let chatSend: HTMLButtonElement;

	/**
	 * Element used to scroll to bottom
	 * @type {HTMLElement}
	 */
	let chatElem: HTMLDivElement;
	let chatElemHeight = 0;
	let loadingMessages = false;
	let historyEmpty = false;

	/**
	 * Skeleton UI's scroll-to-bottom function. Runs after the user sends a message.
	 * @param {ScrollBehavior} behavior
	 */
	function scrollChatToBottom(behavior: ScrollBehavior) {
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
		if (chatElem.scrollTop === 0 && !loadingMessages && !historyEmpty && chatHistory.length >= 10) {
			console.log('Loading past messages...');

			loadingMessages = true;
			chatElemHeight = chatElem.scrollHeight;

			await loadMoreMessages();
			maintainScrollPosition();

			loadingMessages = false;
		}
	}

	let prevSnapshotSize = 10;
	let historySize = 10;

	async function loadMoreMessages() {
		const lastMessage = chatHistory[0];

		// If it's not equal to 10, it means that the previously fetched messages were the last batch of messages / the very first messages sent in the history
		// Check for this because even after loading the full history of messages, it still loads other messages causing duplicates
		if (prevSnapshotSize !== 10) {
			return;
		}

		const querySnapshot = await getOlderMessages(lastMessage.timestamp);

		prevSnapshotSize = querySnapshot.size;
		historySize += prevSnapshotSize;

		console.log(historySize);

		// Don't do anything if there are no more messages to be loaded
		if (querySnapshot.empty) {
			historyEmpty = true;
			loadingMessages = false;
			return;
		}

		// Append the newly loaded messages to the existing chat messages
		const newMessages = querySnapshot.docs.map(
			/** @returns {import('$lib/types').Message}  */
			(doc) => JSON.parse(JSON.stringify(doc.data()))
		);

		console.log('Newly loaded messages:');
		console.log(newMessages);

		newMessages.forEach((message) => {
			if (chatHistory.includes(message)) {
				console.log(message);
			}
		});

		chatHistory = [...newMessages, ...chatHistory];
	}

	/**
	 * @param {Timestamp} timestamp
	 * @returns {Promise<QuerySnapshot<import('firebase/firestore').DocumentData>>}
	 */
	async function getOlderMessages(timestamp: Timestamp): Promise<QuerySnapshot<DocumentData>> {
		const userMessageCollection = collection(
			db,
			`users/${$user.uid}/inbox/${data.chatId}/messages`
		);

		// Construct the query to get older messages
		const q = query(userMessageCollection, orderBy('timestamp'), endBefore(timestamp), limit(10));

		const querySnapshot = await getDocs(q);

		return querySnapshot;
	}

	// TODO: Is this the best way to do snapshots? (reassigning chatHistory over and over again...)
	// TODO: Only listen/run snapshot to the currently loaded messages, pls help
	const userMessageCollection = collection(db, `users/${$user.uid}/inbox/${data.chatId}/messages`);
	const q = query(userMessageCollection, orderBy('timestamp'), limitToLast(historySize));

	const unsubChat = onSnapshot(q, (snapshot) => {
		chatHistory = snapshot.docs.map((doc) => doc.data());
		// Sort in client side just to be sure
		// chatHistory.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
		scrollChatToBottom('smooth');
	});

	onDestroy(() => unsubChat());
	afterNavigate(() => {
		chatElem.scrollTop = chatElem.scrollHeight;
		// loadingMessages = false;
		// chatElemHeight = 0;
		// loadingMessages = false;
		// historyEmpty = false;
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
		<div class="input-group-divider input-group grid-cols-[1fr_auto] rounded-container-token">
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
