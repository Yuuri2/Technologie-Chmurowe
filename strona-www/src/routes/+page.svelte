<script lang="ts">
    //selektor strony
    let currentPage = $state('home');

    //dane trafiające do formularza
    let username = $state('');
    let password = $state('');
    let passwordCheck = $state('');

    //testowe dane do logowania
    let savedName = "admin";
    let savedPswd = "2137";
    //konstruktor obiektu produkt
    interface Product{
        id: number;
        productName: string;
        quantity: number;
    }
    //lista pomocnicza do wyświetlania
    let products = $state<Product[]>([]);

    //Zmienne do dodawania i edycji produktu
    let isAddingProduct = $state(false);
    let isEditingProduct = $state(false)
    let newName = $state('');
    let newQuantity = $state(1);

    let selectedProductId = $state<number | null>(null);

    //rejestracja
    function RegistrationValidation(){
        if (password === '' || passwordCheck === '') {
            alert('Password is missing!');
            return;
        }
        if (password === passwordCheck) {
            alert('Welcome ' + username);
            // Przesyłanie do bazy
        

            //
        }
        else{
            alert('Passwords are not identical');
        }
    }
    //logowanie
    function handleLogIn(){
        //Sprawdzanie w bazie
        if(username == savedName && password == savedPswd){
            alert("Welcome back!");
            productsPage();
        }
        else{
            alert("Niepoprawne dane");
        }
    }

    function toggleProduct(id: number){
        if(selectedProductId === id){
            selectedProductId = null;
            return;
        }
        selectedProductId = id;
    }

    function addProduct(){
        isAddingProduct = true;
    }
    function loadProduct(){
        if (newName.trim() === '') return;

        const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        let product: Product = ({
            id: nextId,
            productName: newName,
            quantity: newQuantity
        });

        products.push(product);

        // Czyszczenie i zamknięcie okienka
        newName = '';
        newQuantity = 1;
        isAddingProduct = false;
    }
    function deleteProduct(){
        if (selectedProductId === null) return;

        const filtered = products.filter(p => p.id !== selectedProductId);
        products = filtered.map((item, index) => {
            return {
                ...item,
                id: index + 1
            };
        });
        selectedProductId = null;
    }
    function startEdit() {
        if (selectedProductId === null) return;

        const productToEdit = products.find(p => p.id === selectedProductId);
        if (productToEdit) {
            newName = productToEdit.productName;
            newQuantity = productToEdit.quantity;
            isEditingProduct = true;
        }
    }

    function editProduct(){
        if (selectedProductId === null || newName.trim() === '') return;
        
        const productToEdit = products.find(p => p.id === selectedProductId);
        
        if (productToEdit) {
            productToEdit.productName = newName;
            productToEdit.quantity = newQuantity;
        }
        newName = '';
        newQuantity = 1;
        isEditingProduct = false;
        selectedProductId = null;
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
    }
    function productsPage(){
        currentPage = 'productList';
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
            <button class="UIButton SubmitBtn" onclick={productsPage}>Submit</button>
            <button class="UIButton" onclick={homePage}>← Go back</button>
        </div>

        {:else if currentPage === 'productList'}
        <div id="settingsPanel">
            <h4 style="width: 50%; float: left; margin-left: 5%;">{username}</h4>
            <button style="float: right;" class="UIButton ButtonProductPage" onclick={homePage}>Log out</button>
        </div>
        <div id="userPanel">
            <div id="controllPanel">
                <button class="UIButton ButtonProductPage" style="background-color: #a2f2b8;" onclick={addProduct}><b>+</b></button>
                <button class="UIButton ButtonProductPage" style="background-color: #a62443;" onclick={deleteProduct}><b>X</b></button>
                <button class="UIButton ButtonProductPage" style="background-color: #f7f3a1;" onclick={startEdit}>Edit</button>
            </div>
            <div id="productPanel">
                {#each products as product (product.id)}
                    <div 
                        class="productRow {selectedProductId === product.id ? 'selected' : ''}"
                        onclick={() => toggleProduct(product.id)}
                    >
                        <span class="prodId">#{product.id}</span>
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
                        <button class="UIButton modalBtn cancel" onclick={() => {isEditingProduct = false; newQuantity=1; newName = ''}}>Cancel</button>
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
}

#productPanel{
    width: 100%;
    height: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
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

/* Podświetlenie wybranego produktu */
.productRow.selected {
    background-color: #e3f2fd;
    border: 2px solid #2196f3;
}

.productRow:hover {
    background-color: #f0f0f0;
}

.prodId { color: #888; width: 10%; }
.prodName { font-weight: bold; width: 60%; text-align: left; }
.prodQty { width: 20%; text-align: right; }

/* Style dla Modali (Overlay i Box) */
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

</style>