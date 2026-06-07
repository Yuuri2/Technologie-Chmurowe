import { pool } from "$lib/server/database/pool";

export interface ListResult {
    id: number;
    nazwa: string;
}

export async function getUsersLists(userId: number): Promise<ListResult[]> {
    const query = `
        SELECT id, nazwa FROM lista WHERE user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
}