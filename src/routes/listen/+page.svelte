<script>
    import { enhance } from '$app/forms';

    // /** @type {import('./$types').ActionData} */    
    export let form;
    // export let data;
</script>

<form action="/listen" method="get">
    <label for="q" class="text-white">
        Search
    </label>
    <input type="text" name="q">
</form>

{#if form?.success}
    <p>You searched for: {form?.query}</p>
{/if}