import { error, fail, redirect, type RequestEvent } from "@sveltejs/kit";
import { register } from "$lib/server/register";
import { createSession } from "$lib/server/auth";
import type { Actions } from "./$types";

export const actions: Actions = {
    default: async ({ request, cookies }: RequestEvent) => {
        const data = await request.formData();
        const username = data.get('username')?.toString().trim();
        const password = data.get('password')?.toString();
        const pswdCheck = data.get('pswdCheck')?.toString();

        if(!username || !password){
            return fail(400, {error: "login i haslo jest wymagane"});
        }
        if(username.length < 3) {
            return fail (400, {error: "nazwa za krótka"});
        }
        if(password.length < 3){
            return fail(400, {error: "haslo za krótkie"});
        }
        if(password !== pswdCheck){
            return fail(400, {error: "hasła nie są indentyczne"});
        }

        try {
            const expiery = 7;

            const userId = await register(username, password);
            
            const token = await createSession(userId, expiery);

            cookies.set("session", token, {
                path: '/',
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === 'production', // z tego co rozumiem to zabezbiecza przed tym że nie używamy http a nie https przy przesyle ciastek
                maxAge: 60*60*24*expiery // czas w sekundach
            });

        } catch (error: any){
            if (error.code === '23505') { // podobno to jest kod error jak już istnieje taka nazwa
                return fail(409, {error: "nazwa użytkownika zajęta"});
            }

            console.error("błąd przy rejestracji: ", error);
            return fail(500, {error: "błąd server przy rejestracji"});
        }

        throw redirect(303, "/home");
    }
}