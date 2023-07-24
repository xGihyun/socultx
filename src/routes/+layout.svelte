<script lang="ts">
	import '../theme.postcss';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';

	// This is needed for interactive popups
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { Toast, storePopup } from '@skeletonlabs/skeleton';
	import { onMount, setContext } from 'svelte';
	import { invalidate } from '$app/navigation';
	import type { RealtimeChannel } from '@supabase/supabase-js';
	import { Navbar, Sidebar } from '$lib/components';
	import { globalContext } from '$lib/store';

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	export let data;

	$: ({ supabase, session } = data);
	$: globalContext.set({
		session,
		supabase
	});

	// Set context especially if the user's auth state changes
	setContext('globalContext', globalContext);

	console.log('This is from +layout.svelte: ', session);

	onMount(() => {
		let specifiedChannel: RealtimeChannel;
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(async (event, _session) => {
			console.log('This is `_session` inside the onAuthStateChange: ', _session);

			if (_session) {
				// Update global context whenever user updates as well (e.g updating pfp)
				console.log(event);
				if (event === 'USER_UPDATED') {
					console.log('User either updated the PFP or Username...');
					// Refresh the token
					const { error } = await supabase.auth.refreshSession({
						refresh_token: _session.refresh_token
					});
					console.log('Are there any errors refreshing session? ==> ', error);
				}

				// Assign any channel name to connect to as long as all clients connect to the same channel
				specifiedChannel = supabase.channel('users');

				// Join the channel
				specifiedChannel.subscribe(async (status) => {
					if (status === 'SUBSCRIBED') {
						const presenceTrackStatus = await specifiedChannel.track({
							uid: _session.user.id
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
		<Navbar />
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
