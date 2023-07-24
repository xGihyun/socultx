<script lang="ts">
	import { isMusicLoading, musicQueue, areSongsSelected } from '$lib/music';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import { AudioPlayer, isPlaying, trackIndex } from 'svelte-mp3';
	import { browser } from '$app/environment';
	import { fade, fly } from 'svelte/transition';
	import { activateTextTruncateScroll } from 'text-truncate-scroll';
	import { receivedFriendRequests, sentFriendRequests } from '$lib/store';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { Spinner, Queue } from '.';
	import { ArrowLeft, People } from '$lib/assets/icons';

	export let supabase: SupabaseClient;
	export let userId: string;

	$: currentTab = 'Friends';
	$: showLyrics = false;
	$: nowPlayingKey = false;
	$: showFriendRequests = false;
	let receivedRequests: any[];
	let friends: any[];
	let sentRequests: any[];
	let currentUserActivity: string | null;
	$: (receivedRequests = []), (sentRequests = []), (friends = []), (currentUserActivity = null);

	// Whenever the user clicks on any of the tabs, return a different classname
	$: sidebarTabLogic = (clickedButtonName: string) => {
		if (currentTab === clickedButtonName) {
			return '!bg-primary-500 rounded-md p-2';
		}
		return 'p-2';
	};

	afterUpdate(() => {
		nowPlayingKey = !nowPlayingKey;
		if (browser) {
			activateTextTruncateScroll();
		}
	});

	isPlaying.subscribe(async (newState) => {
		if (newState === true && $musicQueue[$trackIndex] && currentUserActivity == null) {
			currentUserActivity = `♫ ${$musicQueue[$trackIndex].song} • ${$musicQueue[$trackIndex].artist}`;
			const { error } = await supabase
				.from('profiles')
				.update({ activity: currentUserActivity })
				.eq('id', userId);
			console.log(`Action: STARTING TO LISTEN (Music), User Id: ${userId}, Error: ${error}`);
		}
	});

	trackIndex.subscribe(async (newIndex) => {
		if ($musicQueue[newIndex]) {
			currentUserActivity = `♫ ${$musicQueue[newIndex].song} • ${$musicQueue[newIndex].artist}`;
			const { error } = await supabase
				.from('profiles')
				.update({ activity: currentUserActivity })
				.eq('id', userId);
			console.log(`Action: UPDATING ACTIVITY (Music), User Id: ${userId}, Error: ${error}`);
		}
	});
	// Everytime a user sends in a friend request to us, we search the user/s profiles and get info
	receivedFriendRequests.subscribe(async (list) => {
		receivedRequests = [];
		if (list == null) return;

		const { data, error } = await supabase
			.from('profiles')
			.select()
			.in(
				'id',
				list.map((person) => person.sender_id)
			);

		if (error) {
			console.log(error);
			receivedRequests = [];
			return;
		}

		// Loop over 'list' then classify which is pending or accepted
		list.forEach((item) => {
			let selectedElement = data.find((i) => i.id === item.sender_id);
			if (item.status === 'Pending') {
				receivedRequests.push(selectedElement);
			}
			if (item.status === 'Accepted') {
				// The user's friends
				friends.push(selectedElement);
			}
		});

		// Reassign both variables to achieve realtime stuff
		receivedRequests = receivedRequests;
		friends = friends;
		console.log('SIDEBAR: This is received requests -> ', receivedRequests);
	});

	// This subscribes to the database table "friend_requests" basically a watcher if someone sends us a friend request
	const receiverSubscriber = supabase
		.channel('friend_requests:changes')
		.on(
			'postgres_changes',
			{
				event: 'INSERT',
				schema: 'public',
				table: 'friend_requests',
				filter: `receiver_id=eq.${userId}`
			},
			(payload) => {
				console.log(
					'SIDEBAR (receiverSubscriber): Just in! received a new friend request from -> ',
					payload.new
				);
				$receivedFriendRequests.push(payload.new);
				$receivedFriendRequests = $receivedFriendRequests; // This line is very important! must reassign writable!
			}
		)
		.on(
			'postgres_changes',
			{
				event: 'UPDATE',
				schema: 'public',
				table: 'friend_requests',
				filter: `sender_id=eq.${userId}`
			},
			(payload) => {
				console.log(
					'SIDEBAR (recieverSubscriber): Just in! your friend request got accepted! -> ',
					payload.new
				);
				let index = $sentFriendRequests.findIndex((obj) => obj.id == payload.new.id);
				$sentFriendRequests[index] = payload.new;
				// $sentFriendRequests = $sentFriendRequests;
			}
		)
		.subscribe();

	// I think there's a better way to watch, this watches all of the rows in `profiles` btw
	const userStatusWatcher = supabase
		.channel('friend_status:changes')
		.on(
			'postgres_changes',
			{
				event: 'UPDATE',
				schema: 'public',
				table: 'profiles'
			},
			(payload) => {
				console.log('SIDEBAR (userStatusWatcher): ', payload, friends);
				// Find the user based on his/her id in the `friends` array
				let index = friends.findIndex((item) => item.id === payload.new.id);
				if (index != -1) {
					// If the found user is a friend, then reassign the variables to the newer ones
					friends[index].is_logged_in = payload.new.is_logged_in;
					friends[index].photo_url = payload.new.photo_url;
					friends[index].username = payload.new.username;
					friends[index].activity = payload.new.activity;
					// Apply update realtime
					nowPlayingKey = !nowPlayingKey;
				}
			}
		)
		.subscribe();

	// This is pretty much the same thing but for sending friend requests
	sentFriendRequests.subscribe(async (list) => {
		sentRequests = [];
		if (list === null) return;

		const { data, error } = await supabase
			.from('profiles')
			.select()
			.in(
				'id',
				list.map((person) => person.receiver_id)
			);

		if (error) {
			console.log(error);
			sentRequests = [];
			return;
		}

		// Loop over 'list' then classify which is pending or accepted
		list.forEach((item) => {
			let selectedElement = data.find((i) => i.id === item.receiver_id);
			if (item.status === 'Pending') {
				sentRequests.push(selectedElement);
			}
			if (item.status === 'Accepted') {
				// The user's friends
				friends.push(selectedElement);
			}
		});

		// Reassign both variables to achieve realtime stuff
		sentRequests = sentRequests;
		friends = friends;
		console.log('SIDEBAR (sentFriendRequests): This is sent requests -> ', sentRequests);
	});

	async function declineRequest(sender_id: string) {
		let row = $receivedFriendRequests?.find((item) => item.sender_id === sender_id);
		if (row) {
			const { error } = await supabase.from('friend_requests').delete().eq('id', row.id);

			if (error) {
				console.log(error);
				return;
			}
			console.log(`Declined friend request (will proceed to delete from db) from -> ${sender_id}`);
		}
		let index = receivedRequests.findIndex((item) => item.id === sender_id);
		receivedRequests.splice(index, 1);
		receivedRequests = receivedRequests; // This line is very important
		console.log(`Removed from pending list -> ${sender_id}`);
	}

	async function acceptRequest(sender_id: string) {
		let row = $receivedFriendRequests?.find((item) => item.sender_id === sender_id);
		if (row) {
			const { error } = await supabase
				.from('friend_requests')
				.update({
					status: 'Accepted'
				})
				.eq('id', row.id);

			if (error) {
				console.log(error);
				return;
			}
			console.log(`Friend ${sender_id} is now my bestfriend`);
		}
		let index = receivedRequests.findIndex((item) => item.id === sender_id);
		// Put the supposed element into the 'accepted' array first
		friends.push(receivedRequests[index]);
		// Remove the element from 'pending' array
		receivedRequests.splice(index, 1);
		receivedRequests = receivedRequests;
	}

	// First thing to do once the sidebar mounts
	onMount(async () => {
		// NOTE: Status' of these requests can be "Pending", "Accepted", or "Declined"

		// Grabs 'receivedFriendRequests'
		const { data: recFRequests, error: recFRequestsError } = await supabase
			.from('friend_requests')
			.select()
			.eq('receiver_id', userId);
		if (recFRequestsError) {
			console.log(recFRequestsError);
		}
		if (recFRequests) {
			console.log('ONMOUNT: receivedFriendRequests.set() => ', recFRequests);
			receivedFriendRequests.set(recFRequests);
		}

		// Grabs 'sentFriendRequests'
		const { data: sentFRequests, error: sentFRequestsError } = await supabase
			.from('friend_requests')
			.select()
			.eq('sender_id', userId);
		if (sentFRequestsError) {
			console.log(sentFRequestsError);
		}
		if (sentFRequests) {
			console.log('ONMOUNT: sentFriendRequests.set() => ', sentFRequests);
			sentFriendRequests.set(sentFRequests);
		}
	});

	onDestroy(() => {
		receiverSubscriber.unsubscribe();
		userStatusWatcher.unsubscribe();
	});
</script>

<ul
	class="list flex w-72 flex-col gap-2 overflow-y-auto border-l-[1px] border-neutral-800 px-5 py-8"
>
	<li>
		<button class={sidebarTabLogic('Friends')} on:click={() => (currentTab = 'Friends')}>
			Friends
		</button>
		<button
			class={sidebarTabLogic('Activity')}
			on:click={() => {
				currentTab = 'Activity';
				nowPlayingKey = !nowPlayingKey;
			}}
		>
			Activity
		</button>
	</li>

	<!-- Now playing div block -->
	<div
		class={$musicQueue.length >= 1 && currentTab === 'Activity' ? 'visible' : 'invisible absolute'}
	>
		<div class="card overflow-hidden">
			<div class="m-2.5 flex">
				<div class="group relative flex-none">
					<img
						src={$musicQueue[$trackIndex]?.cover_art_url}
						alt="cover"
						class="rounded group-hover:opacity-40"
						referrerpolicy="no-referrer"
					/>
					<button on:click={() => (showLyrics = !showLyrics)}>
						<!-- NOTE: put SVG in assets/icons -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							fill="currentColor"
							class="bi bi-music-note-list absolute inset-x-3 inset-y-3 cursor-pointer fill-primary-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
							viewBox="0 0 16 16"
						>
							<path d="M12 13c0 1.105-1.12 2-2.5 2S7 14.105 7 13s1.12-2 2.5-2 2.5.895 2.5 2z" />
							<path fill-rule="evenodd" d="M12 3v10h-1V3h1z" />
							<path d="M11 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 16 2.22V4l-5 1V2.82z" />
							<path
								fill-rule="evenodd"
								d="M0 11.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 .5 7H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 .5 3H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5z"
							/>
						</svg>
					</button>
				</div>
				{#key nowPlayingKey}
					<div class="mx-2 my-auto flex flex-col items-start">
						<p class="text-truncate-scroll font-gt-walsheim-pro-medium">
							{$musicQueue[$trackIndex]?.song}
						</p>
						<p class="text-truncate-scroll font-gt-walsheim-pro-thin">
							{$musicQueue[$trackIndex]?.artist}
						</p>
					</div>
				{/key}
			</div>

			{#if browser}
				<!-- Check out the library I used - https://github.com/Khandakar227/svelte-mp3 -->
				<!-- Maybe the timer problem is on the library? idk -->

				<AudioPlayer
					style="margin: 0.5em;"
					loop="repeat-all"
					showTrackNum={true}
					showShuffle={false}
					color="white"
					urls={$musicQueue.map((song) => song.url)}
				/>
			{/if}
		</div>
	</div>

	{#if currentTab === 'Friends'}
		<div class="flex h-full flex-col">
			<div class="flex-grow overflow-auto">
				{#if showFriendRequests}
					{#if receivedRequests.length === 0 && sentRequests.length === 0}
						<p in:fade={{ duration: 500 }} class="my-2 font-gt-walsheim-pro-thin">
							Nothing here! Try adding some friends (•_•)
						</p>
					{/if}
					<!-- Received friend requests -->
					{#if receivedRequests.length >= 1}
						<div>
							<p class="my-2 font-gt-walsheim-pro-medium">Pending friend requests</p>
							{#each receivedRequests as item}
								<div class="card group p-2">
									<div class="relative flex gap-2">
										<a class="hover:scale-105" href={`/profile/${item.id}`}>
											<Avatar src={item.photo_url} width="w-12" referrerpolicy="no-referrer" />
										</a>
										<div class="self-center group-hover:opacity-40 group-hover:blur-sm">
											<span class="w-fit text-lg">{item.username}</span>
										</div>
										<button
											class="variant-glass-primary btn absolute left-16 cursor-pointer rounded-md bg-gradient-to-br px-2 text-lg opacity-0 transition duration-300 ease-in-out hover:scale-105 group-hover:opacity-100"
											on:click={() => acceptRequest(item.id)}
										>
											Accept
										</button>

										<button
											class="variant-glass-error btn absolute right-2 cursor-pointer rounded-md bg-gradient-to-br px-2 text-lg opacity-0 transition duration-300 ease-in-out hover:scale-105 group-hover:opacity-100"
											on:click={() => declineRequest(item.id)}
										>
											Decline
										</button>
									</div>
								</div>
							{/each}
						</div>
					{/if}
					<!-- Sent friend requests -->
					{#if sentRequests.length >= 1}
						<div>
							<p class="my-2 font-gt-walsheim-pro-medium">Sent friend requests</p>
							{#each sentRequests as item}
								<div class="card group p-2">
									<div class="relative flex gap-2">
										<a class="hover:scale-105" href={`/profile/${item.id}`}>
											<Avatar src={item.photo_url} width="w-12" referrerpolicy="no-referrer" />
										</a>
										<div class="self-center">
											<span class="w-fit text-lg">{item.username}</span>
										</div>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				{:else}
					<!-- Friends list -->
					{#each friends as friend}
						<a href={`/`}>
							<div
								class="flex rounded-md p-2 transition-colors duration-200 hover:bg-secondary-900 hover:bg-opacity-40"
							>
								<div class="relative h-10 w-10 self-center">
									<Avatar src={friend.photo_url} width="w-10" referrerpolicy="no-referrer" />
									{#if friend.is_logged_in}
										<span
											class="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"
										/>
									{/if}
								</div>
								<div class="mx-4 self-center">
									<span class="line-clamp-1 flex-auto">{friend.username}</span>
									{#if friend.activity}
										{#key nowPlayingKey}
											<span class="text-truncate-scroll text-sm opacity-75">{friend.activity}</span>
										{/key}
									{/if}
								</div>
							</div>
						</a>
					{/each}
				{/if}
			</div>
			<div class="flex-none self-start">
				<button
					on:click={() => (showFriendRequests = !showFriendRequests)}
					class="flex gap-2 font-gt-walsheim-pro-thin text-sm opacity-50 hover:opacity-100"
				>
					<!-- NOTE: Put SVGs in assets/icons like a component and export it on index.ts for good practice -->
					{#if showFriendRequests}
						<ArrowLeft styles="self-center fill-secondary-900" />
						<span>Back to friends view</span>
					{:else}
						<People styles="self-center fill-secondary-900" />
						<span>View friend requests</span>
					{/if}
				</button>
			</div>
		</div>
	{:else if currentTab === 'Activity'}
		{#if showLyrics}
			<div class="flex-column mb-4 mt-4 overflow-auto pl-2 pr-2" in:fly={{ y: -20, duration: 400 }}>
				<p class="whitespace-pre-wrap font-gt-walsheim-pro-thin text-sm">
					{$musicQueue[$trackIndex].lyrics}
				</p>
			</div>
		{:else}
			{#if $musicQueue.length >= 2}
				<div class="flex items-center justify-between pt-2">
					<p class="ml-2">Next from queue</p>
					<!-- Use buttons for clicks! -->
					<button
						on:click={() => {
							// Use reverse for loop
							for (let index = $areSongsSelected.selectedIndexes.length - 1; index >= 0; index--) {
								musicQueue.update((currentQueue) => {
									currentQueue.splice($areSongsSelected.selectedIndexes[index], 1);
									if ($trackIndex > $areSongsSelected.selectedIndexes[index]) $trackIndex--;
									return currentQueue;
								});
							}
							areSongsSelected.set({ state: false, selectedIndexes: [] });
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							height="24"
							width="24"
							class={$areSongsSelected.state
								? 'visible mr-2 cursor-pointer fill-surface-600 transition-colors duration-300 hover:scale-105 hover:fill-error-400'
								: 'invisible'}
						>
							<g>
								<path fill="none" d="M0 0h24v24H0z" />
								<path
									d="M7 4V2h10v2h5v2h-2v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6H2V4h5zM6 6v14h12V6H6zm3 3h2v8H9V9zm4 0h2v8h-2V9z"
								/>
							</g>
						</svg>
					</button>
				</div>
			{:else if $musicQueue.length == 0}
				<div in:fade={{ duration: 500 }} class="mb-4 mt-4 font-gt-walsheim-pro-thin">
					Try adding some music •ᴗ•
				</div>
			{/if}

			{#if $isMusicLoading}
				<div class="flex justify-center p-16 opacity-50">
					<Spinner />
				</div>
			{:else}
				<Queue />
			{/if}
		{/if}
	{/if}
</ul>
