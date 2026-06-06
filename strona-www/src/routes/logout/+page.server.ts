import { redirect } from "@sveltejs/kit";
import { deleteSession } from "$lib/server/auth";
import type { Actions } from "@sveltejs/kit";

export const actions: Actions = {
    default: async ({ cookies }) => {
        const token = cookies.get("session");

        if(token) {
            await deleteSession(token);

            cookies.delete("session", { path: '/' });
        }

        throw redirect(303, '/');
    }
}