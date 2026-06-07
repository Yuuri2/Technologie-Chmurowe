<script lang="ts">
    import { enhance } from "$app/forms";
</script>
<form method="POST" action="/logout" use:enhance>
    <button style="float: right;" class="UIButton">
        Log out
    </button>
</form>