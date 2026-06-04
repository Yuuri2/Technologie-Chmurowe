<script lang="ts">
    import { enhance } from "$app/forms";
    let { form } = $props();
</script>
<h1>register</h1>
<form method="POST" use:enhance>
    {#if form?.error}
        <p color="red">{form.error}</p>
    {/if}
    <div>
        <label for="username">Login:</label>
        <input type="text" name="username" id="username" required minlength="3">
    </div>
    <div>
        <label for="password">Password:</label>
        <input type="password" name="password" id="password" required minlength="3">
    </div>
    <button type="submit">Rejestruj</button>
</form>