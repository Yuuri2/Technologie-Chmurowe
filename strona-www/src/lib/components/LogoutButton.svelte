<script lang="ts">
    import { enhance } from "$app/forms";
</script>
<form method="POST" action="/logout" class="backButtonContainer" use:enhance>
    <button class="backButton">
        Log out
    </button>
</form>