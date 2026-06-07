import type { PageServerLoad } from "./$types";
import { requireAuth } from "$lib/server/guard";
import { getUsersLists, removeUserList, CreateUserList } from "$lib/server/lists";
import type { Actions } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {
    const user = requireAuth(locals);
    return {
        user: user,
        lists: await getUsersLists(user.id)
    }
}

export const actions: Actions = {
    delete: async ({ locals, request }) => {
        const user = requireAuth(locals);
        const data = await request.formData();
        const listId = Number(data.get("id"));
        if(!listId) {
            return fail(400, {error: "nie podales id listy"});
        }
        try {
            await removeUserList(user.id, listId);
        } catch(error: any) {
            console.error("błąd podczas usuwania listy: ", error);
            return fail(500, { error: "błąd servera przy usuwaniu listy" });
        }
    },
    create: async ({ locals, request }) => {
            const data = await request.formData();
            const nazwa = data.get("nazwa")?.toString();
            const user = requireAuth(locals);
    
            if(!nazwa) {
                return fail(400, { error: "podaj nazwę" });
            }
            try {
                let listId = await CreateUserList(user.id, nazwa);
                
                return {
                    createdListId: listId
                }
            } catch(error: any) {
                console.error("błąd podczas tworzenia listy: ", error);
                return fail(500, { error: "błąd servera przy tworzeniu listy" });
            }
    }
}