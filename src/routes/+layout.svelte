<script>
	import '../app.css';
</script>

<!-- Log out WIP -->
<nav class="flex h-20 bg-black px-20 py-5">
	<form method="post" action="/logout">
		<button class="bg-white p-2">Log Out</button>
	</form>
	<a class="mx-20 bg-neutral-700 p-2 text-white" type="button" href="/">Listen</a>
	<a class="bg-neutral-700 p-2 text-white" type="button" href="/chat">Chat</a>
</nav>
<main class="px-20 py-5">
	<slot />
</main>
