<script lang="ts">
    import LogoutButton from "$lib/components/LogoutButton.svelte";
    let { data } = $props();
</script>
<div>
    <h1>home</h1>
    <h3>{data.user.id}</h3>
    <h3>{data.user.username}</h3>
    <LogoutButton></LogoutButton>
</div>