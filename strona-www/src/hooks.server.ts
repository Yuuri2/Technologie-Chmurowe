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
            event.locals.user = undefined;
        }
    } else {
        event.locals.user = undefined;
    }

    const response = await resolve(event);

    return response;
}