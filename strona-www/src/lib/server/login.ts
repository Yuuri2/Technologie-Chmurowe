import { pool } from "$lib/server/database/pool";
import type { user } from "$lib/server/types";

export async function login(username: string, password: string): Promise<user> {
    const query = `
        SELECT id, username 
        FROM users 
        WHERE username = $1 AND password = crypt($2, password);
    `;

    let result = await pool.query(query, [username, password]);

    if (result.rows.length === 0) {
        throw Error("zły login lub hasło");
    }

    return {
        id: result.rows[0].id,
        username: result.rows[0].username
    }
}