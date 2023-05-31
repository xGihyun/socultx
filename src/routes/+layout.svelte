<script>
	// Your selected Skeleton theme:
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';

	// This contains the bulk of Skeletons required styles:
	// NOTE: this will be renamed skeleton.css in the v2.x release.
	import '@skeletonlabs/skeleton/styles/skeleton.css';

	// Finally, your application's global stylesheet (sometimes labeled 'app.css')
	import '../app.postcss';
	import { allUsers, currentUser } from '$lib/store';
	import { getContext, setContext } from 'svelte';
	import { AppShell } from '@skeletonlabs/skeleton';
	import { Sidebar } from '../components';

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

	$: userContext = getContext('user');
	$: allUsersContext = getContext('users');
	
	// TODO: Make allUsers reactive, when someone logs in, the green circle appears; when a new user appears, they will appear on the sidebar, etc.
</script>

<AppShell>
	<svelte:fragment slot="header">
		<nav class="fixed flex h-20 w-full bg-black px-20 py-5">
			{#if $userContext.is_logged_in}
				<form method="post" action="/logout">
					<button class="bg-white p-2">Log Out</button>
				</form>
				<a class="mx-20 bg-neutral-700 p-2 text-white" type="button" href="/">Listen</a>
				<a class="bg-neutral-700 p-2 text-white" type="button" href="/chat"
					>Chat {$userContext.is_logged_in}</a
				>
			{/if}
		</nav>
	</svelte:fragment>
	<!-- (sidebarLeft) -->
	<svelte:fragment slot="sidebarRight">
		{#if $userContext.is_logged_in}
			<Sidebar users={$allUsersContext} />
		{/if}
	</svelte:fragment>
	<!-- (pageHeader) -->
	<!-- Router Slot -->
	<main class="h-screen px-5 py-32 overflow-hidden">
		<slot />
	</main>
	<!-- ---- / ---- -->
	<!-- <svelte:fragment slot="pageFooter">Page Footer</svelte:fragment> -->
	<!-- (footer) -->
</AppShell>
