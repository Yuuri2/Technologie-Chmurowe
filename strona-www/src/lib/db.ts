import pg from 'pg';
import { env } from '$env/dynamic/private'; // SvelteKit automatycznie zaczyta plik .env

const { Pool } = pg;

export const db = new Pool({

});