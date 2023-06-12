<script lang="ts">
	// Your custom Skeleton theme:
	import '../theme.postcss';

	// This contains the bulk of Skeletons required styles:
	// NOTE: this will be renamed skeleton.css in the v2.x release.
	import '@skeletonlabs/skeleton/styles/skeleton.css';

	// Finally, your application's global stylesheet (sometimes labeled 'app.css')
	import '../app.postcss';

	import { allUsers, currentUser } from '$lib/store';
	import { getContext, setContext } from 'svelte';
	import Navbar from '../components/Navbar.svelte';
	import Sidebar from '../components/Sidebar.svelte';
	import type { UserData } from '$lib/types';
	import type { Writable } from 'svelte/store';

	export let data;

	$: currentUser.set({
		email: data.user?.username || '',
		is_logged_in: data.user?.is_logged_in || false,
		photo_url: data.user?.photo_url || '',
		uid: data.user?.uid || '',
		username: data.user?.username || ''
	});

	$: allUsers.set(data.users || []);

	// This is set at the root layout
	setContext('user', currentUser);
	setContext('users', allUsers);

	$: userContext = getContext<Writable<UserData>>('user');
</script>

<div class="flex h-screen flex-col">
	<Navbar />
	<div class="flex w-full flex-1 overflow-hidden">
		<main class="relative flex-1 overflow-y-auto">
			<slot />
		</main>
		{#if $userContext.is_logged_in}
			<Sidebar />
		{/if}
	</div>
</div>
