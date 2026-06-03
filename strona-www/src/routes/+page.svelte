<script lang="ts">
    //selektor strony
    let currentPage = $state('home');

    //dane trafiające do formularza
    let username = $state('');
    let password = $state('');
    let passwordCheck = $state('');

    //struktura mimikująca bazę
    interface DbUser { id: number; username: string; password: string; }
    interface DbProduct { id: number; name: string; }
    interface DbList { owner: number; list: number; product: number; quantity: number; }
    //konstruktor obiektu produkt
    interface Product{
        id: number;
        productName: string;
        quantity: number;
    }
    //przykładowe dane w bazie
    let dbUsers = $state<DbUser[]>([
        { id: 0, username: 'Adrian', password: '2137' },
        { id: 1, username: 'Asag', password: '22' },
        { id: 2, username: 'Teo', password: 'teorzechy' },
        { id: 3, username: 'Zbigniew K', password: 'I<3Lodz' }
    ]);

    let dbProducts = $state<DbProduct[]>([
        { id: 0, name: 'Orange' },
        { id: 1, name: 'Bread' },
        { id: 2, name: 'Tomato' }
    ]);

    let dbLists = $state<DbList[]>([
        { owner: 1, list: 1, product: 0, quantity: 6 },
        { owner: 3, list: 1, product: 1, quantity: 2 }
    ]);

    //Stan sesji
    let currentUser = $state<DbUser | null>(null);
    let currentListId = $state<number | null>(null);
    let selectedListId = $state<number | null>(null);
    let selectedRowIndex = $state<number | null>(null);
    
    //Zmienne do dodawania i edycji produktu
    let isAddingProduct = $state(false);
    let isEditingProduct = $state(false)
    let newName = $state('');
    let newQuantity = $state(1);
    //Grupowanie list urzytkownika
    let userLists = $derived.by(() => {
        if (!currentUser) return [];

        const myRecords = dbLists.filter(l => l.owner === currentUser!.id);
        const uniqueListIds = [...new Set(myRecords.map(l => l.list))];
        
        return uniqueListIds.map(id => {
            const listItems = myRecords.filter(l => l.list === id);
            return {
                id: id,
                name: `Shopping List #${id}`,
                itemsCount: listItems.reduce((sum) => ++sum, 0),
                date: new Date().toLocaleDateString()
            };
        });
    });
    //produkty na liście
    let productsView = $derived.by(() => {
        if (!currentUser || currentListId === null) return [];
        return dbLists
            .map((record, index) => ({ record, index }))
            .filter(item => item.record.owner === currentUser!.id && item.record.list === currentListId)
            .map(item => {
                const productDef = dbProducts.find(p => p.id === item.record.product);
                return {
                    globalIndex: item.index,
                    productId: item.record.product,
                    productName: productDef ? productDef.name : 'Unknown',
                    quantity: item.record.quantity
                };
            });
    });

    //rejestracja
    function RegistrationValidation(){
        if (password === '' || passwordCheck === '') {
            alert('Password is missing!');
            return;
        }
        if (password === passwordCheck) {
            // Przesyłanie do bazy
            const nextUserId = dbUsers.length > 0 ? Math.max(...dbUsers.map(u => u.id)) + 1 : 0;
            const newUser = { id: nextUserId, username, password };
            dbUsers.push(newUser);
            homePage();
        }
        else{
            alert('Passwords are not identical');
        }
    }
    //logowanie
    function handleLogIn(){
        //Sprawdzanie w bazie
        const user = dbUsers.find(u => u.username === username && u.password === password);
        if (user) {
            currentUser = user;
            listSelection();
        } else {
            alert("Niepoprawne dane");
        }
    }

    function toggleProduct(globalIndex: number){
        if(selectedRowIndex === globalIndex){
            selectedRowIndex = null;
            return;
        }
        selectedRowIndex = globalIndex;
    }

    function toggleList(id: number){
        if(selectedListId === id){
            selectedListId = null;
            return;
        }
        selectedListId = id;
}

    function openList(listId: number) {
        currentListId = listId;
        selectedRowIndex = null;
        productsPage();
    }

    function createNewList() {
        if (!currentUser) return;
        const myRecords = dbLists.filter(l => l.owner === currentUser!.id);
        const nextListId = myRecords.length > 0 ? Math.max(...myRecords.map(l => l.list)) + 1 : 1;
        currentListId = nextListId;
        productsPage();
    }
    function deleteList() {
        if (!currentUser || selectedListId === null) return;
        dbLists = dbLists.filter(i => !(i.list === selectedListId && i.owner === currentUser!.id));
        
        selectedListId = null;
    }

    function addProduct(){
        newName = '';
        newQuantity = 1;
        isAddingProduct = true;
    }
    function loadProduct(){
        if (newName.trim() === '') return;

        let productDef = dbProducts.find(p => p.name.toLowerCase() === newName.trim().toLowerCase());
        if (!productDef) {
            const nextProdId = dbProducts.length > 0 ? Math.max(...dbProducts.map(p => p.id)) + 1 : 0;
            productDef = { id: nextProdId, name: newName.trim() };
            dbProducts.push(productDef);
        }
        const existingRecord = dbLists.find(l => l.owner === currentUser!.id && l.list === currentListId! && l.product === productDef!.id);
        if (existingRecord) {
            existingRecord.quantity += newQuantity;
        } else {
            dbLists.push({
                owner: currentUser!.id,
                list: currentListId!,
                product: productDef.id,
                quantity: newQuantity
            });
        }
        isAddingProduct = false;
    }
    function deleteProduct(){
        if (selectedRowIndex === null) return;
        
        dbLists = dbLists.filter((_, idx) => idx !== selectedRowIndex);
        selectedRowIndex = null;
    }
    function startEdit() {
        if (selectedRowIndex === null) return;

        const record = dbLists[selectedRowIndex];
        if (record) {
            const productDef = dbProducts.find(p => p.id === record.product);
            newName = productDef ? productDef.name : '';
            newQuantity = record.quantity;
            isEditingProduct = true;
        }
    }

    function editProduct(){
        if (selectedRowIndex === null || newName.trim() === '' || !currentUser || currentListId === null) return;

        let productDef = dbProducts.find(p => p.name.toLowerCase() === newName.trim().toLowerCase());
        if (!productDef) {
            const nextProdId = dbProducts.length > 0 ? Math.max(...dbProducts.map(p => p.id)) + 1 : 0;
            productDef = { id: nextProdId, name: newName.trim() };
            dbProducts.push(productDef);
        }

        dbLists[selectedRowIndex].product = productDef.id;
        dbLists[selectedRowIndex].quantity = newQuantity;

        isEditingProduct = false;
        selectedRowIndex = null;
    }

    //Zmienianie sceny strony
    function registerPage(){
        currentPage = 'register';
    }
    function logInPage(){
        currentPage = 'logIn';
    }
    function homePage(){
        currentPage = "home";
        username = '';
        password = '';
        passwordCheck = '';
        currentUser = null;
        currentListId = null;
    }
    function productsPage(){
        currentPage = 'productList';
    }
    function listSelection(){
        currentPage = 'selectList';
    }

</script>
<div id="back">
    <div id="front">
        {#if currentPage === 'home'}
        <div id="frontPageSign">
            <h1>Shopping list Center</h1>
        </div>
        <div id="SignInBtnContainer">
            <button class="UIButton" onclick={logInPage}>Log In</button>
            <button class="UIButton" onclick={registerPage}>Register</button>
        </div>

        {:else if currentPage === 'register'}
        <div id="frontPageSign">
            <h1>Register!</h1>
        </div>
        <div id="SignInBtnContainer">
            <b>Username: </b><input class="UIInput" type="text" name="Name" bind:value={username}/>
            <b>Password: </b><input class="UIInput" type="password" name="Password" bind:value={password}/>
            <b>Confirm Password: </b><input class="UIInput" type="password" name="PasswordCheck" bind:value={passwordCheck}/>
            <button class="UIButton SubmitBtn" onclick={RegistrationValidation}>Submit</button>
            <button class="UIButton" onclick={homePage}>← Go back</button>
        </div>

        {:else if currentPage === 'logIn'}
        <div id="frontPageSign">
            <h1>Sign In!</h1>
        </div>
        <div id="SignInBtnContainer">
            <b>Username: </b><input class="UIInput" type="text" name="Name" bind:value={username}/>
            <b>Password: </b><input class="UIInput" type="password" name="Password" bind:value={password}/>
            <button class="UIButton SubmitBtn" onclick={handleLogIn}>Submit</button>
            <button class="UIButton" onclick={homePage}>← Go back</button>
        </div>

        {:else if currentPage === "selectList"}
        <div id="settingsPanel">
            <h4 style="width: 50%; float: left; margin-left: 5%;">{currentUser?.username}</h4>
            <button style="float: right;" class="UIButton ButtonProductPage" onclick={homePage}>Log out</button>
        </div>
        <div id="userPanel">
            <div id="controllPanel">
                <button class="UIButton" style="background-color: #a2f2b8; height: 100%; width: 20%; border-radius: 10px;" onclick={createNewList}>
                    <b>+ Create New List</b>
                </button>
                <button class="UIButton" style="background-color: #a62443; height: 100%; width: 20%; border-radius: 10px;" onclick={deleteList}>
                    <b>- Delete List</b>
                </button>
            </div>
            
            <div class="listGrid">
                {#each userLists as list (list.id)}
                    <div class="listSquare {selectedListId === list.id ? 'selected' : ''}" 
                        onclick={() => toggleList(list.id)}
                        ondblclick={() => openList(list.id)}>
                        <h3>{list.name}</h3>
                        <p>{list.itemsCount} total items</p>
                        <small>Created: {list.date}</small>
                    </div>
                {:else}
                    <p style="color: #aaa; margin-top: 20px;">You don't have any lists.</p>
                {/each}
            </div>
        </div>

        {:else if currentPage === 'productList'}
        <div id="settingsPanel">
            <h4 style="width: 50%; float: left; margin-left: 5%;">{currentUser?.username}</h4>
            <button style="float: right;" class="UIButton ButtonProductPage" onclick={listSelection}>Go back</button>
        </div>
        <div id="userPanel">
            <div id="controllPanel">
                <button class="UIButton ButtonProductPage" style="background-color: #a2f2b8;" onclick={addProduct}><b>+</b></button>
                <button class="UIButton ButtonProductPage" style="background-color: #a62443;" onclick={deleteProduct}><b>X</b></button>
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

        {#if isAddingProduct}
            <div class="modalOverlay">
                <div class="modalBox">
                    <h2>Add New Product</h2>
                    
                    <div class="modalInputGroup">
                        <b>Product Name:</b>
                        <input class="UIInput modalInput" type="text" placeholder="e.g. Milk" bind:value={newName} />
                    </div>

                    <div class="modalInputGroup">
                        <b>Quantity:</b>
                        <input class="UIInput modalInput" type="number" min="1" bind:value={newQuantity} />
                    </div>

                    <div class="modalActions">
                        <button class="UIButton modalBtn save" onclick={loadProduct}>Save</button>
                        <button class="UIButton modalBtn cancel" onclick={() => isAddingProduct = false}>Cancel</button>
                    </div>
                </div>
            </div>
        {/if}
        {#if isEditingProduct}
            <div class="modalOverlay">
                <div class="modalBox">
                    <h2>Edit product</h2>
                    <div class="modalInputGroup">
                        <b>Product Name:</b>
                        <input class="UIInput modalInput" type="text" bind:value={newName} />
                    </div>

                    <div class="modalInputGroup">
                        <b>Quantity:</b>
                        <input class="UIInput modalInput" type="number" bind:value={newQuantity} />
                    </div>

                    <div class="modalActions">
                        <button class="UIButton modalBtn save" onclick={editProduct}>Save</button>
                        <button class="UIButton modalBtn cancel" onclick={() => isEditingProduct = false}>Cancel</button>
                    </div>
                </div>
            </div>
        {/if}

        {/if}
    </div>
</div>
<style>
:global(body){
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    color: black;
    font-family: sans-serif;
}

#back{
    background-color: #b9b9b9;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
}
#front{
    width: 60%;
    height: 100%;
    background-color: #ffffff;
    padding: 20px;
    box-sizing: border-box;
    border-radius: 25px;
    border: 2px solid black;
}
#frontPageSign{
    width: 100%;
    height: 20%;
    display: flex;
    justify-content: center;
}
#SignInBtnContainer{
    width: 100%;
    height: 60%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

#settingsPanel{
    width: 100%;
    height: 10%;
}

#userPanel{
    width: 100%;
    height: 90%;
    border-radius: 25px;
    border: 2px solid black;
    display: flex;
    flex-direction: column;
    align-items: center;
}

#controllPanel{
    width: 100%;
    height: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
}

#productPanel{
    width: 100%;
    height: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
}

.listGrid {
    width: 100%;
    height: 90%;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;
    box-sizing: border-box;
    overflow-y: auto;
    justify-content: center;
    align-items: flex-start;
}

.listSquare {
    width: 180px;
    height: 180px;
    background-color: #f9f9f9;
    border: 2px solid #ddd;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
    padding: 10px;
    text-align: center;
}

.listSquare h3 {
    margin: 10px 0;
    color: #333;
}

.listSquare p {
    color: #666;
    font-weight: bold;
}

.listSquare small {
    margin-top: 15px;
    color: #999;
}

.listSquare:hover {
    transform: scale(1.05);
    border-color: #2196f3;
    box-shadow: 0px 5px 15px rgba(0,0,0,0.1);
}

.UIButton{
    width: 30%;
    height: 10%;
    margin: 10px;
    background-color: white;
    border-radius: 25px;
    border: 2px solid black;
    transition: width 0.2s ease-in-out, height 0.2s ease-in-out;
}
.SubmitBtn {
    margin-top: 20px;
    background-color: #73AD21;
    color: white;
    border: none;
}

.ButtonProductPage{
    height: 60%;
    width: 15%;
}
.UIButton:hover{
    transform: scale(1.1);
    cursor: pointer;
}

.UIInput {
    width: 50%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #cecece;
    border-radius: 5px;
}

.productRow {
    width: 90%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    margin: 5px 0;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 12px;
    box-sizing: border-box;
    cursor: pointer;
    transition: background-color 0.2s, border-color 0.2s;
}

.productRow.selected {
    background-color: #e3f2fd;
    border: 2px solid #2196f3;
}

.productRow:hover {
    background-color: #f0f0f0;
}

.prodId { color: #888; width: 15%; }
.prodName { font-weight: bold; width: 55%; text-align: left; }
.prodQty { width: 20%; text-align: right; }

.modalOverlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.modalBox {
    background-color: white;
    width: 400px;
    padding: 30px;
    border-radius: 25px;
    border: 2px solid black;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.3);
}

.modalInputGroup {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
}

.modalInput {
    width: 100% !important;
    box-sizing: border-box;
}

.modalActions {
    display: flex;
    gap: 15px;
    width: 100%;
    justify-content: center;
    margin-top: 15px;
}

.modalBtn {
    width: 120px !important;
    height: 45px !important;
    margin: 0 !important;
}

.modalBtn.save {
    background-color: #73AD21;
    color: white;
    border: none;
}

.modalBtn.cancel {
    background-color: #e0e0e0;
    border: 2px solid #ccc;
}

.listSquare.selected {
    background-color: #ffebee;
    border: 2px solid #a62443;
}
</style>
