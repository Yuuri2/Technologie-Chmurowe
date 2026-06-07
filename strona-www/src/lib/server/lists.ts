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

export async function CreateUserList(userId: number, name: string): Promise<number>{
    const query = `
        INSERT INTO lista (user_id, nazwa)
        VALUES ($1, $2)
        RETURNING id;
    `;
    const result = await pool.query(query, [userId, name]);
    return result.rows[0].id;
}