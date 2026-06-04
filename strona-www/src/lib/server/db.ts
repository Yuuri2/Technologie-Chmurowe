import pg from 'pg';
import { env } from '$env/dynamic/private';

const { Pool } = pg;

// Sprawdzamy czy zmienna istnieje, jeśli nie (np. lokalnie), dajemy czytelny fallback
const connectionString = env.DATABASE_URL;

if (!connectionString) {
    console.warn("⚠️ Ostrzeżenie: Brak zmiennej DATABASE_URL w środowisku!");
}

export const db = new Pool({
    connectionString: connectionString
});