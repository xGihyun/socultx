<script>
	import { enhance } from '$app/forms';
	import { getContext, onDestroy } from 'svelte';
	import ChatMessage from '../components/ChatMessage.svelte';
	import { collection, onSnapshot } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { afterNavigate } from '$app/navigation';

	const userContext = getContext('user');

	export let data;

	$: chatHistory = data.chatHistory;

	let currentMessage = '';

	/**
	 * Scroll to bottom
	 * @type {HTMLButtonElement}
	 */
	let chatSend;

	/**
	 * Scroll to bottom
	 * @type {HTMLElement}
	 */
	let elemChat;

	/**
	 * Skeleton UI's scroll-to-bottom function
	 * @param {ScrollBehavior} behavior
	 */
	function scrollChatBottom(behavior) {
		setTimeout(() => {
			elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
			console.log('scrolling...');
		}, 0);
	}

	const userMessageCollection = collection(
		db,
		`users/${$userContext.uid}/inbox/${data.chatId}/messages`
	);

	// TODO: Is this the best way to do snapshots? (reassigning chatHistory over and over again...)
	const unsubChat = onSnapshot(userMessageCollection, (snapshot) => {
		chatHistory = snapshot.docs.map(
			(doc) => /** @type {import('$lib/types').Message} */ (doc.data())
		);
		chatHistory.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
		scrollChatBottom('smooth');
	});

	onDestroy(() => unsubChat());
	afterNavigate(() => scrollChatBottom('smooth'));
</script>

<div class="relative flex w-full flex-col">
	<div bind:this={elemChat} class="flex h-full flex-col gap-5 overflow-y-scroll px-5 py-10">
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
	<!-- <div class="fixed bottom-10 left-1/2 -translate-x-1/2 lg:absolute"> -->
	<div class="relative mx-10 flex justify-center">
		<form
			class="contents"
			title="Send message"
			action={`/chat/${data.chatId}?/send`}
			method="post"
			use:enhance
		>
			<div
				class="input-group input-group-divider rounded-container-token w-full max-w-3xl grid-cols-[1fr_auto]"
			>
				<!-- <button class="input-group-shim">+</button> -->
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
					on:click={() => scrollChatBottom('smooth')}
					bind:this={chatSend}>Send</button
				>
			</div>
		</form>
	</div>
</div>
