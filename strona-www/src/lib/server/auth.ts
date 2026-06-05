import { pool } from "$lib/server/database/pool";
import { randomBytes } from "node:crypto";
import type { user } from "$lib/server/types";


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

export async function authenticateUser(token: string): Promise<user | null> {
    const query = `
        SELECT 
            s.id AS session_id,
            s.expires_at,
            u.id AS user_id,
            u.username
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = $1
        LIMIT 1;
    `;
    try {
        const result = await pool.query(query, [token])
        if(result.rows.length === 0) {
            return null;
        }

        const sessionData = result.rows[0];

        const now = new Date();
        if(now > new Date(sessionData.expires_at)) {
            await deleteSession(token)
            return null;
        }

        return {
            id: sessionData.user_id,
            username: sessionData.username
        }
    } catch (error: any) {
        console.error(error.toString());
        return null;
    }
}

export async function deleteSession(token: string): Promise<void> {
    const query = 'DELETE FROM sessions WHERE token = $1;';
    await pool.query(query, [token]);
}