import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { requireAuth } from "$lib/server/guard";

export const load: PageServerLoad = async ({ locals }) => {
    const user = requireAuth(locals);
}