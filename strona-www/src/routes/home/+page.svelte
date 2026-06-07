<script lang="ts">
    import LogoutButton from "$lib/components/LogoutButton.svelte";
    import { enhance } from "$app/forms";

    let { data, form } = $props();
</script>


<div id="back">
    <div id="front">
        <div id="settingsPanel">
            <h4 style="width: 50%; float: left; margin-left: 5%;">{data.user.username}</h4>
            <LogoutButton></LogoutButton>
        </div>
        <div id="userPanel">
            <form method="POST" action="?/create" use:enhance>
                <input type="text" name="nazwa" id="nazwa">
                <button type="submit"><b>+ Create New List</b></button>
                {#if form?.error}
                    <p style="color: red;" >{form.error}</p>
                {/if}
            </form>
            <div class="listGrid">
                {#each data.lists as list }
                    <div class="listSquare">
                        <h4>{list.nazwa}</h4>
                        <a href={`/products/${list.id}`}>Select</a>
                        <form action="?/delete" method="POST" use:enhance>
                            <input type="hidden" name="id" value={list.id}>
                            <button type="submit">X</button>
                        </form>
                    </div>
                {:else}
                    <p style="color: #aaa; margin-top: 20px;">You don't have any lists.</p>
                {/each}
            </div>

        </div>



    </div>
</div>
