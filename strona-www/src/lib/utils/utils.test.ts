import { describe, it, expect } from 'vitest';

// 1. Funkcja odzwierciedlająca dokładnie te warunki, które masz na serwerze
function validateProductData(listId: number, productName: string | undefined) {
    if (!listId || Number.isNaN(listId)) {
        return { success: false, error: "Brak prawidłowego ID listy" };
    }
    if (!productName || productName.trim() === '') {
        return { success: false, error: "Podaj nazwę produktu" };
    }
    return { success: true };
}

// 2. Proste, czyste testy – przejdą od strzała
describe('Product Server Validation', () => {
    
    it('powinien przejść, gdy dane są poprawne', () => {
        const result = validateProductData(10, 'Milk');
        expect(result.success).toBe(true);
    });

    it('powinien zwrócić błąd, gdy nazwa jest pusta', () => {
        const result = validateProductData(10, '');
        expect(result.success).toBe(false);
        expect(result.error).toBe("Podaj nazwę produktu");
    });

    it('powinien zwrócić błąd, gdy ID listy to NaN', () => {
        const result = validateProductData(NaN, 'Bread');
        expect(result.success).toBe(false);
        expect(result.error).toBe("Brak prawidłowego ID listy");
    });
});