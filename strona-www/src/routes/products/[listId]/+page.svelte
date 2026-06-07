<script lang="ts">
    import { goto } from "$app/navigation";
    
    let { data } = $props();

    //pobieram dane do listy
    let listResult = $state(data.dbListResult);
    let productList = $state(data.dbProducts);

    //powrót do listy list
    function seeHome(){
        goto('/home');
    }

    //szuka nazwy produktu o id productId
    function associateProduct(productId: number){
        return productList.find(el => el.id === productId).name;
    }

    //update list przy zmianie na stronie
    $effect(() => {
        productList = data.dbProducts;
        listResult = data.dbListResult;
    })
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
        {#each listResult as listRow, i (listRow.id)}
            <div
                class="productRow"
                onclick={() => toggleProduct(listRow.id)}
            >
                <span class="prodId">#{i + 1}</span>
                <span class="prodName">{associateProduct(listRow.product)}</span>
                <span class="prodQty">x{listRow.quantity}</span>
            </div>
        {:else}
            <p style="color: #aaa; margin-top: 20px;">No products on your list.</p>
        {/each}
    </div>
</div>