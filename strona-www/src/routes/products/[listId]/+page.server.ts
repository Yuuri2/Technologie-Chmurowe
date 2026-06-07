import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/database/pool';
import { requireAuth } from "$lib/server/guard";

export const load: PageServerLoad = async ({ locals, params }) => {
    const list = params.listId;
    const user = requireAuth(locals);
    try {
        const query = `
            SELECT p.* FROM product p
            JOIN lista l ON p.list_id = l.id
            WHERE p.list_id = $1 AND l.user_id = $2
        `;

        const listResult = await pool.query(query, [list, user.id]);

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