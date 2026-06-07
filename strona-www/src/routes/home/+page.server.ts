import type { PageServerLoad } from "./$types";
import { requireAuth } from "$lib/server/guard";
import { getUsersLists } from "$lib/server/lists";

export const load: PageServerLoad = async ({ locals }) => {
    const user = requireAuth(locals);
    return {
        lists: await getUsersLists(user.id)
    }
}