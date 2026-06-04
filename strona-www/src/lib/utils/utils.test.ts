import { describe, it, expect } from 'vitest';

function validateProduct(name: string, quantity: number) {
    if (!name || name.trim() === '') return false;
    if (quantity < 1) return false;
    return true;
}

describe('Product Validation', () => {
    it('should pass with valid data', () => {
        expect(validateProduct('Milk', 2)).toBe(true);
    });

    it('should fail with empty name', () => {
        expect(validateProduct('', 5)).toBe(false);
    });

    it('should fail with zero quantity', () => {
        expect(validateProduct('Bread', 0)).toBe(false);
    });
});