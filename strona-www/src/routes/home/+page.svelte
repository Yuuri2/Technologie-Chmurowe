<script lang="ts">
    import LogoutButton from "$lib/components/LogoutButton.svelte";
    import { enhance } from "$app/forms";
    import type { PageData } from './$types';
    import type { ActionData } from "./createList/$types";

    let { data, form }: { data: PageData, form: ActionData | null } = $props();
</script>
<div>
    <h1>home</h1><LogoutButton></LogoutButton>
    <form method="POST" action="?/create" use:enhance>
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
            <form action="?/delete" method="POST" use:enhance>
                <input type="hidden" name="id" value="{list.id}">
                <button type="submit">X</button>
            </form>
        </div>
    {/each}
</div>