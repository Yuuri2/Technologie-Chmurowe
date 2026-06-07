<script lang="ts">
    import { goto } from "$app/navigation";
    import { enhance } from "$app/forms";

    let { data } = $props();

    //pobieram dane do listy
    let listResult = $state(data.dbListResult);
    let selectedRowIndex = $state<number | null>(null);
    
    let tempName = $state('');
    let tempQuant = $state(1);

    let isAdding = $state(false);
    let isEditing = $state(false);

    function toggleProduct(productId: number){
        if(selectedRowIndex === productId){
            selectedRowIndex = null;
        }
        else{
            selectedRowIndex = productId;
        }
    }

    function addModalOpened(){
        tempName = '';
        tempQuant = 1;
        isAdding = true;
    }
    function editModalOpened(){
        if(selectedRowIndex){
            isEditing = true;
        }
    }

    //update list przy zmianie na stronie
    $effect(() => {
        listResult = data.dbListResult;
    })
</script>

<div id="back">
    <div id="front">
        {#if !isAdding && !isEditing}
        <div id="settingsPanel">
            <h4 style="width: 50%; float: left; margin-left: 5%;">{data.user.username}</h4>
            <button style="float: right;" class="UIButton" onclick={() => goto('/home')}>Go back</button>
        </div>
        <div id="userPanel">
            <div id="controllPanel">
                <!-- Dodawanie -->
                <button class="UIButton " style="background-color: #a2f2b8;" onclick={addModalOpened}>
                    <b>+</b>
                </button>
                <!-- Usuwanie -->
                <form method="POST" action="?/deleteProduct" use:enhance={() => {
                    return async ({ update }) => {
                        selectedRowIndex = null;
                        await update();
                    };
                }} style="display: inline;">
                    <input type="hidden" name="productId" value={selectedRowIndex} />
                    <button type="submit" class="UIButton" style="background-color: #a62443;" disabled={selectedRowIndex === null}>
                        <b>X</b>
                    </button>
                </form>
                <!-- Edycja -->
                <button class="UIButton" style="background-color: #f7f3a1;" onclick={editModalOpened} disabled={selectedRowIndex === null}>
                    Edit
                </button>
            </div>
            <div id="productPanel">
                {#each listResult as listRow, i (listRow.id)}
                    <div
                        class="productRow {selectedRowIndex === listRow.id ? 'Selected' : ''}"
                        role="button"
                        tabindex="0"
                        onclick={() => toggleProduct(listRow.id)}
                    >
                        <span class="prodId">#{i + 1}</span>
                        <span class="prodName">{listRow.nazwa}</span>
                        <span class="prodQty">x{listRow.quantity}</span>
                    </div>
                {:else}
                    <p style="color: #aaa; margin-top: 20px;">No products on your list.</p>
                {/each}
            </div>
        </div>
        {:else if isAdding}
            <div class="modalOverlay">
                <form method="POST" action="?/addProduct" use:enhance={() => {
                    // Ta część wykonuje się PRZED wysłaniem (np. można tu włączyć loader)
                    return async ({ result, update }) => {
                        // Ta część wykonuje się PO odpowiedzi z serwera
                        if (result.type === 'success') {
                            isAdding = false; // Zamknij modal tylko, gdy sukces
                        }
                        await update(); // Odświeża dane na stronie (data.dbLists, itd.)
                    };
                }} class="modalBox">
                    <h2>Add New Product</h2>

                    <div class="modalInputGroup">
                        <b>Product Name:</b>
                        <input class="UIInput modalInput" type="text" name="productName" placeholder="e.g. Milk" bind:value={tempName} required />
                    </div>

                    <div class="modalInputGroup">
                        <b>Quantity:</b>
                        <input class="UIInput modalInput" type="number" name="quantity" min="1" bind:value={tempQuant} required />
                    </div>

                    <div class="modalActions">
                        <button type="submit" class="UIButton modalBtn save">Save</button>
                        <button type="button" class="UIButton modalBtn cancel" onclick={() => isAdding = false}>Cancel</button>
                    </div>
                </form>
            </div>
        {:else if isEditing}
            <div class="modalOverlay">
                <form method="POST" action="?/editProduct" use:enhance={() => {
                    return async ({ result, update }) => {
                        if (result.type === 'success') {
                            isEditing = false;
                        }
                        await update(); 
                    };
                }} class="modalBox">
                    <h2>Edit product</h2>

                    <div class="modalInputGroup">
                        <b>Product Name:</b>
                        <input class="UIInput modalInput" type="text" name="productName" bind:value={tempName} required />
                    </div>

                    <div class="modalInputGroup">
                        <b>Quantity:</b>
                        <input class="UIInput modalInput" type="number" name="quantity" min="1" bind:value={tempQuant} required />
                    </div>

                    <div class="modalActions">
                        <button type="submit" class="UIButton modalBtn save">Save</button>
                        <button type="button" class="UIButton modalBtn cancel" onclick={() => isEditing = false}>Cancel</button>
                    </div>
                </form>
            </div>
        {/if}
    </div>
</div>

