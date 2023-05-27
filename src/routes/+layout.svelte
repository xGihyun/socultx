<script>
	// Your selected Skeleton theme:
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	import { AppShell } from '@skeletonlabs/skeleton';

	// This contains the bulk of Skeletons required styles:
	// NOTE: this will be renamed skeleton.css in the v2.x release.
	import '@skeletonlabs/skeleton/styles/skeleton.css';

	// Finally, your application's global stylesheet (sometimes labeled 'app.css')
	import '../app.postcss';
	import { Sidebar } from '../components';

	export let data;

	const user = data.user;

	// console.log(data)
</script>

<!-- Log out WIP -->
<!-- <nav class="flex h-20 bg-black px-20 py-5">
	<form method="post" action="/logout">
		<button class="bg-white p-2">Log Out</button>
	</form>
	<a class="mx-20 bg-neutral-700 p-2 text-white" type="button" href="/">Listen</a>
	<a class="bg-neutral-700 p-2 text-white" type="button" href="/chat">Chat</a>
</nav>
<div class="flex">
	<main class="px-20 flex-1 py-5">
		<slot />
	</main>
	<Sidebar />
</div> -->

<AppShell>
	<svelte:fragment slot="header">
		<nav class="fixed flex h-20 w-full bg-black px-20 py-5">
			<!-- Get user profile -->
			<!-- {#if user.isLoggedIn} -->
				<form method="post" action="/logout">
					<button class="bg-white p-2">Log Out</button>
				</form>
			<!-- {/if} -->
			<a class="mx-20 bg-neutral-700 p-2 text-white" type="button" href="/">Listen</a>
			<a class="bg-neutral-700 p-2 text-white" type="button" href="/chat">Chat</a>
		</nav>
	</svelte:fragment>
	<!-- (sidebarLeft) -->
	<svelte:fragment slot="sidebarRight">
		<Sidebar users={data.users} />
	</svelte:fragment>
	<!-- (pageHeader) -->
	<!-- Router Slot -->
	<main class="mt-20 px-20 py-5">
		<slot />
	</main>
	<!-- ---- / ---- -->
	<!-- <svelte:fragment slot="pageFooter">Page Footer</svelte:fragment> -->
	<!-- (footer) -->
</AppShell>

<!-- Sidebar -->
