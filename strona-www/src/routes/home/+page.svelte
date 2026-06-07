<script lang="ts">
    import LogoutButton from "$lib/components/LogoutButton.svelte";
    let { data } = $props();
</script>
<div>
    <h1>home</h1>
    <LogoutButton></LogoutButton>
    {#each data.lists as list }
        <h4>{list.nazwa}</h4>
        <a href="/products/{list.id}">&#8594;</a>
    {/each}
</div>