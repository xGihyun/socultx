<script lang="ts">
	// Your custom Skeleton theme:
	import '../theme.postcss';

	// This contains the bulk of Skeletons required styles:
	// NOTE: this will be renamed skeleton.css in the v2.x release.
	import '@skeletonlabs/skeleton/styles/skeleton.css';

	// Finally, your application's global stylesheet (sometimes labeled 'app.css')
	import '../app.postcss';

	// This is needed for interactive popups
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { Toast, storePopup } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import Navbar from '../components/Navbar.svelte';
	import Sidebar from '../components/Sidebar.svelte';
	import type { RealtimeChannel } from '@supabase/supabase-js';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	console.log('This is from +layout.svelte: ', session);

	onMount(() => {
		let specifiedChannel: RealtimeChannel;
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(async (event, _session) => {
			console.log('This is `_session` inside the onAuthStateChange: ', _session);

			if (_session) {
				// Assign any channel name to connect to as long as all clients connect to the same channel
				specifiedChannel = supabase.channel('users');

				// Join the channel
				specifiedChannel.subscribe(async (status) => {
					if (status === 'SUBSCRIBED') {
						const presenceTrackStatus = await specifiedChannel.track({
							uid: _session?.user.id
						});
						console.log(presenceTrackStatus);
					}
				});
			}

			if (event === 'SIGNED_OUT' && _session === null) {
				await specifiedChannel.unsubscribe();
			}

			// If the session has expired simply log the user out
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<div class="flex h-screen flex-col">
	{#if session}
		<Navbar picture={session.user.user_metadata.photo_url} {supabase} />
	{/if}
	<div class="flex w-full flex-1 overflow-hidden">
		<main class="relative flex-1 overflow-y-auto">
			<slot />
		</main>
		{#if session}
			<Sidebar />
		{/if}
	</div>
	<Toast />
</div>
