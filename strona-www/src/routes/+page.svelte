<script>
    let currentPage = $state('home');

    let username = $state('');
    let password = $state('');
    let passwordCheck = $state('');

    let savedName = "admin";
    let savedPswd = "2137";
    function Register(){
        currentPage = 'register';
    }
    function LogIn(){
        currentPage = 'logIn';
    }
    function GoHome(){
        currentPage = "home";
        username = '';
        password = '';
        passwordCheck = '';
    }

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

    function handleLogIn(){
        if(username == savedName && password == savedPswd){
            alert("Welcome back!");
        }
        else{
            alert("Niepoprawne dane");
        }
    }

</script>
<div id="back">
    <div id="front">

        {#if currentPage === 'home'}
        <div id="frontPageSign">
            <h1>Shopping list Center</h1>
        </div>
        <div id="SignInBtnContainer">
            <button class="UIButton" onclick={LogIn}>Log In</button>
            <button class="UIButton" onclick={Register}>Register</button>
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
            <button class="UIButton" onclick={GoHome}>← Go back</button>
        </div>

        {:else if currentPage === 'logIn'}
        <div id="frontPageSign">
            <h1>Sign In!</h1>
        </div>
        <div id="SignInBtnContainer">
            <b>Username: </b><input class="UIInput" type="text" name="Name" bind:value={username}/>
            <b>Password: </b><input class="UIInput" type="password" name="Password" bind:value={password}/>
            <button class="UIButton SubmitBtn" onclick={handleLogIn}>Submit</button>
            <button class="UIButton" onclick={GoHome}>← Go back</button>
        </div>

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
</style>