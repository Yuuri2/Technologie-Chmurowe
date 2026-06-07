<script lang="ts">
    import LogoutButton from "$lib/components/LogoutButton.svelte";
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";

    let { data, form } = $props();
</script>


<div id="back">
    <div id="front">
        <div id="settingsPanel">
            <h4 style="width: 50%; float: left; margin-left: 5%; height: 100%;">{data.user.username}</h4>
            <LogoutButton></LogoutButton>
        </div>
        <div id="userPanel">
            <div id="controllPanel">
                <form method="POST" action="?/create" use:enhance>
                    <input type="text" class="ListInput" name="nazwa" id="nazwa">
                    <button type="submit" class="ListCreationBtn"><b>+ Create New List</b></button>
                    {#if form?.error}
                        <p style="color: red;" >{form.error}</p>
                    {/if}
                </form>
            </div>
            <div class="listGrid">
                {#each data.lists as list }
                    <div class="listSquare" onclick={() =>( goto(`/products/${list.id}`)) }>
                        <h4>{list.nazwa}</h4>
                        <form action="?/delete" style="background-color: #a62443; width: 30%; height: 30%" method="POST" use:enhance >
                            <input type="hidden" name="id" value={list.id}>
                            <button type="submit""><b>X</b></button>
                        </form>
                    </div>
                {:else}
                    <p style="color: #aaa; margin-top: 20px;">You don't have any lists.</p>
                {/each}
            </div>

        </div>



    </div>
</div>
