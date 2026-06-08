import { test, expect } from '@playwright/test';
import { loginUser, createList } from './helpers';

test.describe('Product page functions', () => {

  test.beforeEach(async ({ page }) => {
    await loginUser(page);
    await createList(page);
  });

  test('Products can be added, edited and deleted', async ({ page }) => {
    // Bezpieczne przejście do produktów z oczekiwaniem na załadowanie strony
    await page.locator('.listSquare h4').first().click();
    await page.waitForLoadState('networkidle'); 
    await expect(page).toHaveURL(/.*\/products.*/);

    // Dodawanie produktu
    await page.getByText('+', { exact: false }).click();
    await expect(page.locator('input[name="productName"]')).toBeVisible();

    await page.fill('input[name="productName"]', 'Milk');
    await page.fill('input[name="quantity"]', '2');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.locator('.productRow').first()).toBeVisible();

    // Edycja produktu
    await page.locator('.productRow').first().click();
    await page.getByRole('button', { name: 'Edit' }).click();
    await page.fill('input[name="productName"]', 'Oat Milk');
    await page.fill('input[name="quantity"]', '1');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.locator('.prodName').first()).toHaveText('Oat Milk');

    // Usunięcie produktu - POPRAWKA SELEKTORA
    // Szukamy elementu zawierającego tekst "X" lub "x" bezpośrednio w pierwszym wierszu produktu
    const firstRow = page.locator('.productRow').first();
    await firstRow.locator('button, [role="button"]').filter({ hasText: /X/i }).click();

    // Sprawdzamy, czy wiersz zniknął
    await expect(firstRow).toBeHidden();
  });
});