<script>
	// import { logout } from '$lib/firebase/auth';
	import '../app.css';
</script>

<!-- Log out WIP -->
<nav class="flex h-20 bg-black px-20 py-5">
	<form method="post">
		<button class="bg-white p-2">Log Out</button>
	</form>
	<!-- <button class="bg-white p-2" on:click={logout}>Log Out</button> -->
</nav>
<main class="px-20 py-5">
	<slot />
</main>
