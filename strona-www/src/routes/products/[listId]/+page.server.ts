import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/database/pool';


export const load: PageServerLoad = async ({ locals, params }) => {
    const list = params.slug;
    try {
        const productsResult = await pool.query('SELECT * FROM lists WHERE owner LIKE $1 AND list LIKE $2',[locals.user , list]);

        return {
            dbProducts: productsResult.rows
        };
    } catch (error) {
        return { dbProducts: [] };
    }
};