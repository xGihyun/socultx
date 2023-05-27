<script>
	import { enhance } from "$app/forms";

  export let data;

  // Current user (you)
  const user = data.user;

  // The user you are currently talking to
</script>

<form title="Add Post" action={`/chat/${data.user2}?/add`} method="post" use:enhance>
	<input class="p-2" name="content" />
	<button class="bg-blue-600 p-2 text-white">Send</button>
</form>