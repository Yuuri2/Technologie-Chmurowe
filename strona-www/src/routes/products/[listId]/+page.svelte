<script lang="ts">
    import { goto } from "$app/navigation";
    
    let { data } = $props();

    //pobieram dane do listy
    let listResult = $state(data.dbListResult);
    let selectedRowIndex = $state<number | null>(null);
    //powrót do listy list
    function seeHome(){
        goto('/home');
    }
    function toggleProduct(productId: number){
        if(selectedRowIndex === productId){
            selectedRowIndex = null;
        }
        else{
            selectedRowIndex = productId;
        }
    }

    //update list przy zmianie na stronie
    $effect(() => {
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
        <button class="UIButton ButtonProductPage" style="background-color: #a2f2b8;" onclick={addProduct}>
            <b>+</b>
        </button>
        <!-- Usuwanie -->
        <button type="submit" class="UIButton ButtonProductPage" style="background-color: #a62443;" onclick={deleteProduct}>
            <b>X</b>
        </button>
        <!-- Edycja -->
        <button class="UIButton ButtonProductPage" style="background-color: #f7f3a1;" onclick={editProduct}>
            Edit
        </button>
    </div>
    <div id="productPanel">
        {#each listResult as listRow, i (listRow.id)}
            <div
                class="productRow {selectedRowIndex === listRow.id ? 'Selected' : ''}"
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