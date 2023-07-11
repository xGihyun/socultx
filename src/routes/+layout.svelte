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
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	console.log('This is from +layout.svelte: ', session);

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			console.log('This is `_session` inside the onAuthStateChange: ', _session);

			// Means the user is logged in check console
			if (_session) {
				// Channel for online users
				const specifiedChannel = supabase.channel('users');

				// Join the channel
				specifiedChannel.subscribe(async (status) => {
					if (status === 'SUBSCRIBED') {
						const presenceTrackStatus = await specifiedChannel.track({
							uid: _session?.user.id
						});
						console.log(presenceTrackStatus);
					} else {
						console.log(status);
					}
				});
			}
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
		<!-- {#if data.user}
			<Sidebar />
		{/if} -->
	</div>
	<Toast />
</div>
