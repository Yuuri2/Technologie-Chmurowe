import { pool } from "$lib/server/database/pool";
import { randomBytes } from "node:crypto";

function generateToken(): string {
    return randomBytes(32).toString('hex');
}

export async function createSession(userId: number, daysToLive: number = 7): Promise<string> {
    let token = generateToken();

    const expiration = new Date();
    expiration.setDate(expiration.getDate() + daysToLive);

    const query = `
        INSERT INTO sessions (user_id, token, expires_at)
        VALUES ($1, $2, $3)
        RETURNING token;
    `
    
    await pool.query(query, [userId, token, expiration]);
    return token;
}