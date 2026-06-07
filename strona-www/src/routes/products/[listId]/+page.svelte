<script lang="ts">
    import { redirect } from "@sveltejs/kit";
    let { data } = $props();

    let productList = $derived.by(() =>{
        
    })

    function seeHome(){
    redirect(300, '/home');
    }

</script>

<div id="settingsPanel">
    <h4 style="width: 50%; float: left; margin-left: 5%;">{data.user.username}</h4>
    <button style="float: right;" class="UIButton ButtonProductPage" onclick={seeHome}>Go back</button>
</div>
<div id="userPanel">
    <div id="controllPanel">
        <!-- Dodawanie -->
        <button class="UIButton ButtonProductPage" style="background-color: #a2f2b8;">
            <b>+</b>
        </button>
        <!-- Usuwanie -->
        <button type="submit" class="UIButton ButtonProductPage" style="background-color: #a62443;">
            <b>X</b>
        </button>
        <!-- Edycja -->
        <button class="UIButton ButtonProductPage" style="background-color: #f7f3a1;">
            Edit
        </button>
    </div>
    <div id="productPanel">
        <!-- {#each productList as product, i (product.globalIndex)}
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
        {/each} -->
    </div>
</div>