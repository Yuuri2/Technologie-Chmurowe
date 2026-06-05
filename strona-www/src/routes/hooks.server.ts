import { authenticateUser } from "$lib/server/auth";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({event, resolve}) => {
    const token = event.cookies.get("session");

    if(token) {
        const user = await authenticateUser(token);

        if(user) {
            event.locals.user = user;
        } else {
            event.cookies.delete("session", { path: '/' });
            event.locals.user = null;
        }
    } else {
        event.locals.user = null;
    }

    const response = await resolve(event);

    return response;
}