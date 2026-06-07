import { redirect } from "@sveltejs/kit";

export function requireAuth(locals: App.Locals, redirectTo: string = "/") {
    if(!locals.user) {
        throw redirect(303, redirectTo);
    }
}