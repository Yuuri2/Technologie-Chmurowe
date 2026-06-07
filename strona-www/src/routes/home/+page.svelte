<script lang="ts">
    import LogoutButton from "$lib/components/LogoutButton.svelte";
    let { data } = $props();
</script>
<div>
    <h1>home</h1><LogoutButton></LogoutButton>
    <form action="/home/createList">
        <input type="text" name="nazwa" id="nazwa">
        <button type="submit">stwórz</button>
    </form>
    {#each data.lists as list }
        <div>
            <h4>{list.nazwa}</h4>
            <a href="/products/{list.id}">&#8594;</a>
        </div>
    {/each}
</div>