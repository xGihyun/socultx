<script>
	// Your custom Skeleton theme:
	import '../theme.postcss';

	// This contains the bulk of Skeletons required styles:
	// NOTE: this will be renamed skeleton.css in the v2.x release.
	import '@skeletonlabs/skeleton/styles/skeleton.css';

	// Finally, your application's global stylesheet (sometimes labeled 'app.css')
	import '../app.postcss';

	import { allUsers, currentUser } from '$lib/store';
	import { getContext, setContext } from 'svelte';
	import { Sidebar } from '../components';
	import { AppShell, AppBar, Avatar } from '@skeletonlabs/skeleton';

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
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar padding="px-20 py-5" border="border-b-[1px] border-neutral-800">
			<svelte:fragment slot="lead">
				<a href="/" class="font-heading-token text-4xl uppercase">socult</a>
			</svelte:fragment>

			<svelte:fragment slot="trail">
				<a class="variant-filled-secondary rounded-md p-2" type="button" href="/listen">Listen</a>
				<a
					class="variant-filled-secondary rounded-md bg-neutral-700 p-2 text-white"
					type="button"
					href="/chat">Chat</a
				>
				<form method="post" action="/logout">
					<button class="variant-filled-primary rounded-md bg-white p-2">Log Out</button>
				</form>
				<a href="/profile">
					<Avatar src={$userContext.photo_url} width="w-10" />
				</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<svelte:fragment slot="sidebarRight">
		{#if $userContext.is_logged_in}
			<Sidebar />
		{/if}
	</svelte:fragment>

	<div class="h-full py-10">
		<slot />
	</div>
</AppShell>
