import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/database/pool';
import { requireAuth } from "$lib/server/guard";
import type { Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
    const list = params.listId;
    const user = requireAuth(locals);
    try {
        const query = `
            SELECT p.* FROM product p
            JOIN lista l ON p.list_id = l.id
            WHERE p.list_id = $1 AND l.user_id = $2
        `;

        const listResult = await pool.query(query, [list, user.id]);

        return {
            dbListResult: listResult.rows,
            user: user
        };
    } catch (error) {
        return {
            dbListResult: [],
            user: user
        };
    }
};

export const actions: Actions = {
    addProduct: async ({ request, params, locals }) => {
        const data = await request.formData();
        const listId = Number(params.listId);
        const nazwa = data.get("productName")?.toString();
        const qtt = Number(data.get("quantity")?.toString()) || 1;
        const user = requireAuth(locals);

        if (!listId || Number.isNaN(listId)) {
            return fail(400, { error: "Brak prawidłowego ID listy" });
        }
        if (!nazwa) {
            return fail(400, { error: "Podaj nazwę produktu" });
        }

        try {
            const query = `
                INSERT INTO product (list_id, nazwa, quantity)
                SELECT $1, $2, $3
                FROM lista
                WHERE id = $1 AND user_id = $4
                RETURNING id;
            `;

            const result = await pool.query(query, [listId, nazwa, qtt, user.id]);

            if (result.rows.length === 0) {
                return fail(403, { error: "Brak uprawnień do dodawania w tej liście" });
            }

            return {
                newProductId: result.rows[0].id
            };
        } catch (error) {
            console.error(error);
            return fail(500, { error: "Błąd serwera podczas dodawania produktu" });
        }
    },

    editProduct: async ({ request, locals }) => {
        const data = await request.formData();
        const productId = Number(data.get("productId"));
        const nowaNazwa = data.get("productName")?.toString();
        const nowaIlosc = Number(data.get("quantity"));
        const user = requireAuth(locals);

        if (!productId || Number.isNaN(productId)) {
            return fail(400, { error: "Niepoprawne ID produktu" });
        }
        if (!nowaNazwa) {
            return fail(400, { error: "Nazwa produktu nie może być pusta" });
        }

        try {
            const query = `
                UPDATE product 
                SET nazwa = $1, quantity = $2
                WHERE id = $3 AND list_id IN (
                    SELECT id FROM lista WHERE user_id = $4
                )
                RETURNING id;
            `;

            const result = await pool.query(query, [nowaNazwa, nowaIlosc, productId, user.id]);

            if (result.rows.length === 0) {
                return fail(403, { error: "Nie masz uprawnień do edycji tego produktu lub produkt nie istnieje" });
            }

            return { success: true };
        } catch (error) {
            console.error(error);
            return fail(500, { error: "Błąd serwera podczas edycji" });
        }
    },

    deleteProduct: async ({ request, locals }) => {
        const data = await request.formData();
        const productId = Number(data.get("productId"));
        const user = requireAuth(locals);

        if (!productId || Number.isNaN(productId)) {
            return fail(400, { error: "Niepoprawne ID produktu" });
        }

        try {
            const query = `
                DELETE FROM product 
                WHERE id = $1 AND list_id IN (
                    SELECT id FROM lista WHERE user_id = $2
                )
                RETURNING id;
            `;

            const result = await pool.query(query, [productId, user.id]);

            if (result.rows.length === 0) {
                return fail(403, { error: "Nie masz uprawnień do usunięcia tego produktu lub produkt nie istnieje" });
            }

            return { success: true };
        } catch (error) {
            console.error(error);
            return fail(500, { error: "Błąd serwera podczas usuwania" });
        }
    }
};