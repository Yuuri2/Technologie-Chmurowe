<script lang="ts">
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";
    let { form } = $props();
</script>

<div id="back">
    <div id="front">
        <div id="frontPageSign">
            <h1>Sign In!</h1>
        </div>
        <form method="POST" use:enhance>
        {#if form?.error}
            <p color="red">{form.error}</p>
        {/if}
        <b>Username: </b>
            <input class="UIInput" type="text" name="username"required/>
        <b>Password: </b>
            <input class="UIInput" type="password" name="password"required/>
        <button type="submit" class="UIButton SubmitBtn">Login</button>
        <button type="button" class="UIButton" onclick={() => goto('/')}>← Go back</button>
    </form>
    </div>
</div>