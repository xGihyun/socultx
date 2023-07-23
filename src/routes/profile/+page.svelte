<script lang="ts">
	import { UserAvatar } from '$lib/components/user';
	import type { UserData } from '$lib/types';

	export let data;

	$: user = data.session?.user?.user_metadata as UserData;
</script>

<!-- <div>
	<h1 class="text-5xl text-white">
		Hello World! Welcome {user?.username}
	</h1>
</div> -->
<div class="relative h-40 w-full lg:h-80">
	<div class="h-40 bg-surface-300-600-token lg:h-80" />
</div>

<UserAvatar {user} />
