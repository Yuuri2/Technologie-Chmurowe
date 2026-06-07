<script lang="ts">
    let { data } = $props();
</script>

<div id="settingsPanel">
    <h4 style="width: 50%; float: left; margin-left: 5%;">{data.user.username}</h4>
    <button style="float: right;" class="UIButton ButtonProductPage" onclick={listSelection}>Go back</button>
</div>
<div id="userPanel">
    <div id="controllPanel">
        <button class="UIButton ButtonProductPage" style="background-color: #a2f2b8;" onclick={addProduct}><b>+</b></button>
        <form method="POST" action="?/deleteProduct" use:enhance style="display: contents;">
            <input type="hidden" name="ownerId" value={currentUser?.id} />
            <input type="hidden" name="listId" value={currentListId} />
            <input type="hidden" name="productId" value={selectedRowIndex !== null ? data.dbLists[selectedRowIndex]?.product : ''} />
            
            <button type="submit" class="UIButton ButtonProductPage" style="background-color: #a62443;" disabled={selectedRowIndex === null}>
                <b>X</b>
            </button>
        </form>
        <button class="UIButton ButtonProductPage" style="background-color: #f7f3a1;" onclick={startEdit}>Edit</button>
    </div>
    <div id="productPanel">
        {#each productsView as product, i (product.globalIndex)}
            <div
                class="productRow {selectedRowIndex === product.globalIndex ? 'selected' : ''}"
                onclick={() => toggleProduct(product.globalIndex)}
            >
                <span class="prodId">#{i + 1}</span>
                <span class="prodName">{product.productName}</span>
                <span class="prodQty">x{product.quantity}</span>
            </div>
        {:else}
            <p style="color: #aaa; margin-top: 20px;">No products on your list.</p>
        {/each}
    </div>
</div>