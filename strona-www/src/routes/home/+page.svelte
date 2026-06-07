<script lang="ts">
    import LogoutButton from "$lib/components/LogoutButton.svelte";
    import { enhance } from "$app/forms";
    let { data, form } = $props();
</script>
<div>
    <h1>home</h1><LogoutButton></LogoutButton>
    <form method="POST" action="/home/createList" use:enhance>
        <input type="text" name="nazwa" id="nazwa">
        <button type="submit">stwórz</button>
        {#if form?.error}
            <p style="color: red;" >{form.error}</p>
        {/if}
    </form>
    {#each data.lists as list }
        <div>
            <h4>{list.nazwa}</h4>
            <a href="/products/{list.id}">&#8594;</a>
        </div>
    {/each}
</div>