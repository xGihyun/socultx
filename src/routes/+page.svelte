<script lang="ts">
	import { Avatar, toastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { sentFriendRequests, receivedFriendRequests } from '$lib/store';
	import { Auth } from '$lib/components';

	export let data;
	export let form;

	$: ({ supabase, session } = data);
	$: searchResults = form?.results;

	// Create a variable that grabs the list of 'Accepted/Pending' requests made by the user
	// this variable is a modified array of strings, i decided to do the format `${i.id}_${i.status}` to make use of .includes
	// As of now, this thing isn't real time, but it isn't really a big deal, all the user needs to do is reload the page and afaik it won't cause any bugs whatsoever
	// as long as the user is unable to click the 'Add Friend' button avoiding duplicates in the database
	$: alreadySentRequests = $sentFriendRequests
		.map((i) => `${i.receiver_id}_${i.status}`)
		.concat($receivedFriendRequests.map((i) => `${i.sender_id}_${i.status}`));

	async function addFriend(uid: string, username: string) {
		const { data, error } = await supabase
			.from('friend_requests')
			.insert({
				sender_id: session?.user.id,
				receiver_id: uid
			})
			.select();

		if (error) {
			console.log(`Failed to send friend request to ${uid}, Error: ${error}`);
			const failedFriendRequestToast: ToastSettings = {
				message: `Failed to send friend to ${username}`,
				timeout: 5000,
				background: 'variant-filled-danger'
			};
			toastStore.trigger(failedFriendRequestToast);
			return;
		}

		console.log(`Sending friend request to ${uid}, Error: ${error}, Data: `, data);

		const sendFriendRequestToast: ToastSettings = {
			message: `Friend request sent to ${username}`,
			timeout: 5000,
			background: 'variant-filled-primary',
			action: {
				label: 'Undo',
				response: async () => {
					await supabase.from('friend_requests').delete().eq('id', data[0].id);
				}
			}
		};

		toastStore.trigger(sendFriendRequestToast);

		// $sentFriendRequests?.push(data[0]);
		// $sentFriendRequests = $sentFriendRequests; // This line is very important! must reassign writable!

		// If something needs to be updated and reactive, just use update() on store
		// I haven't tested it yet but I think it should work?
		// If it does, do it for the other stores as well
		sentFriendRequests.update((val) => [...val, data[0]]);

		alreadySentRequests = $sentFriendRequests
			.map((i) => `${i.receiver_id}_${i.status}`)
			.concat($receivedFriendRequests.map((i) => `${i.sender_id}_${i.status}`));
	}
</script>

{#if session}
	{#if form}
		<!-- If user searches from the navbar -->
		<div class="items-left mx-4 flex h-full w-80 flex-col justify-start">
			<div class="my-4 text-2xl">People</div>
			{#each searchResults as item}
				<div class="variant-glass-surface my-2 rounded-md p-2">
					<div class="flex h-16 gap-2">
						<a href={`/profile/${item.id}`}>
							<Avatar src={item.photo_url} width="w-16" referrerpolicy="no-referrer" />
						</a>
						<div class="my-2 flex flex-grow flex-col">
							<a href={`/profile/${item.id}`} class="w-fit">
								<span class="text-lg">{item.username}</span>
							</a>
							<span class="font-gt-walsheim-pro-thin">{item.bio || ''}</span>
						</div>

						<!-- Add friend button -->
						{#if alreadySentRequests.includes(`${item.id}_Pending`)}
							<div class="m-auto">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="mr-2 h-6 w-6 fill-warning-600"
									height="1em"
									viewBox="0 0 640 512"
								>
									<path
										d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"
									/></svg
								>
							</div>
						{:else if alreadySentRequests.includes(`${item.id}_Accepted`)}
							<div class="m-auto">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="mr-2 h-6 w-6 fill-primary-600"
									height="1em"
									viewBox="0 0 640 512"
								>
									<path
										d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"
									/></svg
								>
							</div>
						{:else}
							<div class="m-auto">
								<button on:click={() => addFriend(item.id, item.username)}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="mr-2 h-6 w-6 fill-secondary-600"
										height="1em"
										viewBox="0 0 640 512"
									>
										<path
											d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"
										/></svg
									>
								</button>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<!-- Dashboard? -->
		<div class="flex h-full flex-col items-center justify-center">
			<p class="mb-10 text-5xl">Hello, {session.user.user_metadata.username}</p>
			<a class="variant-filled-secondary p-2" type="button" href="/profile">Go to profile</a>
		</div>
	{/if}
{:else}
	<div class="flex h-full flex-row items-center justify-around">
		<div>
			<h1
				class="animate-text select-none bg-gradient-to-br from-teal-500 via-purple-500 to-orange-500 box-decoration-clone bg-clip-text text-center font-gt-walsheim-pro-medium text-8xl uppercase text-transparent"
			>
				Socult
			</h1>
			<span>Social Media + Ultimate</span>
		</div>
		<Auth sb={supabase} />
	</div>
{/if}
