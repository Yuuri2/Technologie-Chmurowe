<script>
    import { goto } from "$app/navigation";

</script>

<div id="back">
    <div id="front">
        <div id="frontPageSign">
            <h1>Shopping list Center v2.0</h1>
        </div>
        <div id="SignInBtnContainer">
            <button class="UIButton" onclick={() => goto('/login')}>Log In</button>
            <button class="UIButton" onclick={() => goto('/register')}>Register</button>
        </div>
    </div>
</div>