<script>
	import { enhance } from '$app/forms';

	export let data;

	const users = data.users || [];
</script>

<div class="flex flex-col items-center justify-center">Chat is under construction!</div>

<div class="flex justify-start">
	<div class="grid grid-cols-[auto_1fr] gap-2">
		<!-- <Avatar src="https://i.pravatar.cc/?img={bubble.avatar}" width="w-12" /> -->
		<span class="text-white">Icon</span>
		<div class="card space-y-2 rounded-tl-none bg-neutral-400 p-4">
			<header class="flex items-center justify-between">
				<p class="font-bold">Other user's name</p>
				<!-- <small class="opacity-50">timestamp</small> -->
			</header>
			<p>their message</p>
		</div>
	</div>
</div>

<div class="flex justify-end">
	<div class="grid grid-cols-[1fr_auto] gap-2">
		<div class="card space-y-2 rounded-tr-none bg-blue-800 p-4">
			<header class="flex items-center justify-between">
				<p class="font-bold text-white">Current user's name</p>
				<!-- <small class="opacity-50">timestamp</small> -->
			</header>
			<p class="text-white">your message</p>
		</div>
		<!-- <Avatar src="https://i.pravatar.cc/?img={bubble.avatar}" width="w-12" /> -->
		<span class="text-white">Icon</span>
	</div>
</div>

<form title="Add Post" action="/chat/add" method="post" use:enhance>
	<input class="p-2" name="content" />
	<button class="bg-blue-600 p-2 text-white">Send</button>
</form>
