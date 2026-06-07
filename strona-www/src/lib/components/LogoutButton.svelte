<script lang="ts">
    import { enhance } from "$app/forms";
</script>
<form method="POST" action="/logout" use:enhance>
    <button style="float: right; height 80%;" class="UIButton">
        Log out
    </button>
</form>