import { pool } from '$lib/server/database/pool';

export async function register(username: string, password: string): Promise<number> {
    const query = `
        INSERT INTO users (username, password)
        VALUES ($1, $2)
        RETURNING id;
    `
    let result = await pool.query(query, [username, password]);
    return result.rows[0].id;
}