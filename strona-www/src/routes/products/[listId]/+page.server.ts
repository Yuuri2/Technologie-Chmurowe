import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/database/pool';
import { requireAuth } from "$lib/server/guard";

export const load: PageServerLoad = async ({ locals, params }) => {
    const list = params.listId;
    const user = requireAuth(locals);
    try {
        const listResult = await pool.query('SELECT * FROM product WHERE ist_id = $1',[list]);

        return {
            dbListResult: listResult.rows,
            user: user
        };
    } catch (error) {
        return {
            dbListResult: [],
            user: user
         };
    }
};