import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/database/pool';

export const load: PageServerLoad = async () => {
    try {
        const productsResult = await pool.query('SELECT * FROM lists WHERE owner LIKE x AND list LIKE y');

        return {
            dbProducts: productsResult.rows
        };
    } catch (error) {
        return { dbProducts: [] };
    }
};