import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    if(!locals.user){
        console.error("NIE JEST ZALOGOWANY");
    }
    return {
        user: locals.user
    }
}