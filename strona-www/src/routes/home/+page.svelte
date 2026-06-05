<script lang="ts">
    let { data } = $props();
</script>
<div>
    home
    <h1>{data.user.id}</h1>
    <h1>{data.user.username}</h1>
</div>