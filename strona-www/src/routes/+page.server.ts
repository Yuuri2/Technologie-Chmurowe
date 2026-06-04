import { db } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    try {
        const listsResult = await db.query('SELECT * FROM lists'); 
        const productsResult = await db.query('SELECT * FROM products');

        return {
            dbLists: listsResult.rows,
            dbProducts: productsResult.rows
        };
    } catch (error) {
        console.error("Błąd pobierania z bazy (load):", error);
        return { dbLists: [], dbProducts: [] };
    }
};

export const actions: Actions = {
    register: async ({ request }) => {
        const data = await request.formData();
        const username = data.get('username') as string;
        const password = data.get('password') as string;

        if (!username || !password) {
            return fail(400, { error: 'Brakuje danych!' });
        }

        try {
            await db.query(
                'INSERT INTO users (id, username, password) VALUES (COALESCE((SELECT MAX(id) FROM users), 0) + 1, $1, $2)',
                [username, password]
            );
            return { success: true };
        } catch (err: any) {
            console.error("!!! BŁĄD REJESTRACJI !!!", err);
            
            if (err.code === '23505') {
                return fail(400, { error: 'Użytkownik o takiej nazwie już istnieje.' });
            }

            return fail(500, { error: `Błąd bazy danych: ${err.message || err}` });
        }
    },

    login: async ({ request }) => {
        const data = await request.formData();
        const username = data.get('username') as string;
        const password = data.get('password') as string;

        try {
            const result = await db.query(
                'SELECT * FROM users WHERE username = $1 AND password = $2',
                [username, password]
            );

            if (result.rows.length > 0) {
                return { success: true, user: result.rows[0] };
            } else {
                return fail(400, { error: 'Niepoprawne dane logowania.' });
            }
        } catch (err) {
            console.error("BŁĄD LOGOWANIA:", err);
            return fail(500, { error: 'Problem z połączeniem podczas logowania.' });
        }
    },
    
    deleteList: async ({ request }) => {
        const formData = await request.formData();
        const listId = Number(formData.get('listId'));
        const ownerId = Number(formData.get('ownerId'));

        try {
            await db.query(
                'DELETE FROM lists WHERE list = $1 AND owner = $2',
                [listId, ownerId]
            );
            return { success: true };
        } catch (err) {
            console.error("BŁĄD DELETE_LIST:", err);
            return fail(500, { error: 'Nie udało się usunąć listy.' });
        }
    },

    addProduct: async ({ request }) => {
        const formData = await request.formData();
        const listId = Number(formData.get('listId'));
        const ownerId = Number(formData.get('ownerId'));
        const productName = formData.get('productName')?.toString().trim();
        const quantity = Number(formData.get('quantity'));

        if (!productName || quantity < 1) {
            return fail(400, { error: 'Niepoprawna nazwa produktu lub ilość.' });
        }

        try {
            let prodResult = await db.query('SELECT id FROM products WHERE name = $1', [productName]);
            let productId;

            if (prodResult.rows.length === 0) {
                const insertProd = await db.query(
                    'INSERT INTO products (id, name) VALUES (COALESCE((SELECT MAX(id) FROM products), 0) + 1, $1) RETURNING id',
                    [productName]
                );
                productId = insertProd.rows[0].id;
            } else {
                productId = prodResult.rows[0].id;
            }

            await db.query(`
                INSERT INTO lists (owner, list, product, quantity) 
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (owner, list, product) 
                DO UPDATE SET quantity = lists.quantity + EXCLUDED.quantity
            `, [ownerId, listId, productId, quantity]);
            
            return { success: true };
        } catch (err) {
            console.error("BŁĄD W ADD_PRODUCT:", err);
            return fail(500, { error: 'Błąd podczas dodawania produktu.' });
        }
    },

    deleteProduct: async ({ request }) => {
        const formData = await request.formData();
        const ownerId = Number(formData.get('ownerId'));
        const listId = Number(formData.get('listId'));
        const productId = Number(formData.get('productId'));

        try {
            await db.query(
                'DELETE FROM lists WHERE owner = $1 AND list = $2 AND product = $3',
                [ownerId, listId, productId]
            );
            return { success: true };
        } catch (err) {
            console.error("BŁĄD DELETE_PRODUCT:", err);
            return fail(500, { error: 'Nie udało się usunąć produktu.' });
        }
    },

    editProduct: async ({ request }) => {
        const formData = await request.formData();
        const ownerId = Number(formData.get('ownerId'));
        const listId = Number(formData.get('listId'));
        const oldProductId = Number(formData.get('oldProductId'));
        const newProductName = formData.get('productName')?.toString().trim();
        const newQuantity = Number(formData.get('quantity'));

        if (!newProductName || newQuantity < 1) {
            return fail(400, { error: 'Niepoprawne dane.' });
        }

        try {
            // 1. Znajdź lub stwórz ID dla nowej nazwy produktu (ZABEZPIECZONE przed brakiem SERIAL)
            let prodResult = await db.query('SELECT id FROM products WHERE name = $1', [newProductName]);
            let newProductId;

            if (prodResult.rows.length === 0) {
                const insertProd = await db.query(
                    'INSERT INTO products (id, name) VALUES (COALESCE((SELECT MAX(id) FROM products), 0) + 1, $1) RETURNING id',
                    [newProductName]
                );
                newProductId = insertProd.rows[0].id;
            } else {
                newProductId = prodResult.rows[0].id;
            }

            // 2. Aktualizujemy wpis w liście zakupów
            if (oldProductId === newProductId) {
                // Zmieniła się tylko ilość
                await db.query(
                    'UPDATE lists SET quantity = $1 WHERE owner = $2 AND list = $3 AND product = $4',
                    [newQuantity, ownerId, listId, oldProductId]
                );
            } else {
                // Zmienił się produkt -> usuwamy stary wpis i nadpisujemy nowym
                await db.query('DELETE FROM lists WHERE owner = $1 AND list = $2 AND product = $3', [ownerId, listId, oldProductId]);
                await db.query(`
                    INSERT INTO lists (owner, list, product, quantity)
                    VALUES ($1, $2, $3, $4)
                    ON CONFLICT (owner, list, product)
                    DO UPDATE SET quantity = lists.quantity + EXCLUDED.quantity
                `, [ownerId, listId, newProductId, newQuantity]);
            }

            return { success: true };
        } catch (err) {
            console.error("BŁĄD EDIT_PRODUCT:", err);
            return fail(500, { error: 'Modyfikacja nie powiodła się.' });
        }
    }
};