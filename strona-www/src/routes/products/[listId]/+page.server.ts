import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/database/pool';
import { requireAuth } from "$lib/server/guard";

export const load: PageServerLoad = async ({ locals, params }) => {
    const list = params.listId;
    const user = requireAuth(locals);
    try {
        const listResult = await pool.query('SELECT * FROM lists WHERE owner = $1 AND list = $2',[locals.user , list]);
        const productsResult = await pool.query('SELECT * FROM products');

        return {
            dbProducts: productsResult.rows,
            dbListResult: listResult.rows,
            user: user
        };
    } catch (error) {
        return { dbProducts: [], dbListResult: [] };
    }
};