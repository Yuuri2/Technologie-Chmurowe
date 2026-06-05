import type { Actions } from "@sveltejs/kit";
import { login } from "$lib/server/login";
import { createSession } from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";
import { dev } from "$app/environment";


export const actions: Actions = {
    default: async ({request, cookies}) => {
        const data = await request.formData();
        const username = data.get("username")?.toString().trim();
        const password = data.get("password")?.toString();

        if(!username || !password) {
            throw fail(400, {error: "login i haslo są wymagana"});
        }

        try {
            const user = await login(username, password);

            const expiration = 7;
            const token = await createSession(user.id, expiration);

            cookies.set("session", token, {
                path: '/',
                httpOnly: true,
                sameSite: "strict",
                secure: !dev,
                maxAge: 60 * 60 * 24 * expiration
            });
        } catch (error: any) {
            if(error.message === "zły login lub hasło") {
                return fail(401, {error: "zły login lub hasło"});
            }

            console.error("błąd servera podczas logowania");
            return fail(500, {error: "błąd serwera"});
        }

        throw redirect(303, "/");
    }
}