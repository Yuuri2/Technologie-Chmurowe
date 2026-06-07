<script lang="ts">
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";
    let { form } = $props();
    
</script>
<div id="back">
    <div id="front">
        <div id="frontPageSign">
            <h1>Register!</h1>
        </div>
        <form method="POST" use:enhance id="SignInBtnContainer">
            <b>Username: </b>
            <input type="text" name="username" class="UIInput" required minlength="3">

            <b>Password: </b>
            <input type="password" name="password" class="UIInput" required minlength="3">
            
            <b>Confirm Password: </b>
            <input type="password" name="pswdCheck" class="UIInput" required minlength="3">
            <button type="submit" class="UIButton SubmitBtn">Submit</button>
            <button type="button" class="UIButton" onclick={() => goto('/')}>← Go back</button>
        </form>
    </div>
</div>