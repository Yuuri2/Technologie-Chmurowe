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
    // 1. Zmieniamy zapytanie na prostsze i bezpieczniejsze.
    // Pobieramy TYLKO to, co absolutnie niezbędne, bez aliasów, które mogą mieszać w wielkości liter.
    const query = `
        SELECT 
            sessions.expires_at,
            users.id,
            users.username
        FROM sessions
        JOIN users ON sessions.user_id = users.id
        WHERE sessions.token = $1
        LIMIT 1;
    `;
    
    try {
        const result = await pool.query(query, [token]);
        
        if (result.rows.length === 0) {
            return null;
        }

        const row = result.rows[0];

        const now = new Date();
        if (now > new Date(row.expires_at)) {
            await deleteSession(token);
            return null;
        }

        return {
            id: Number(row.id),
            username: String(row.username)
        };

    } catch (error: any) {
        console.error(error.toString());
        return null;
    }
}

export async function deleteSession(token: string): Promise<void> {
    const query = 'DELETE FROM sessions WHERE token = $1;';
    await pool.query(query, [token]);
}