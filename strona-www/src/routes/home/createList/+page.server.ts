import type { Actions } from "@sveltejs/kit";
import { CreateUserList } from "$lib/server/lists";
import { requireAuth } from "$lib/server/guard";
import { fail } from "@sveltejs/kit";

export const actions: Actions = {
    default: async ({ locals, request }) => {
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