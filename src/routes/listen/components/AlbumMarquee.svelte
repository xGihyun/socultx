<script lang="ts">
	import { onMount } from 'svelte';

	export let upper: string;
	export let lower: string;
	$: isUpperMoving = false;
	let upperElement: HTMLElement;

	function checkIfTextOverflows() {
		let parentElement = upperElement.parentElement;
		if (upperElement.clientWidth > parentElement?.clientWidth) {
			console.log('Overflowing element: ', upperElement);
			setTimeout(() => {
				isUpperMoving = !isUpperMoving;
			}, 1000);
		}
	}

	onMount(() => {
		checkIfTextOverflows();
	});
</script>

{#if isUpperMoving}
	<!-- svelte-ignore a11y-distracting-elements -->
	<marquee
		bind:this={upperElement}
		class="font-gt-walsheim-pro-medium text-lg"
		behavior="sliding"
		direction="left"
		scrolldelay="50"
	>
		{upper}
	</marquee>
{:else}
	<p bind:this={upperElement} class="truncate font-gt-walsheim-pro-medium text-lg">
		{upper}
	</p>
{/if}

<p class="w-full truncate font-gt-walsheim-pro-thin text-sm">
	{lower}
</p>
