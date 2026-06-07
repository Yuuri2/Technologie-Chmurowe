import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { requireAuth } from "$lib/server/guard";

export const load: PageServerLoad = async ({ locals }) => {
    requireAuth(locals);
    return {
        user: locals.user
    }
}