import { test, expect } from '@playwright/test';
import { loginUser, createList } from './helpers';

test.describe('Product page functions', () => {
  let uniqueListName: string;

  test.beforeEach(async ({ page }) => {
    await loginUser(page);
    // Każde uruchomienie testu dostaje swoją unikalną listę
    uniqueListName = `list-prod-${Date.now()}`;
    await createList(page, uniqueListName);
  });

  test('Products can be added, edited and deleted', async ({ page }) => {
    // Wejście do naszej unikalnej listy
    await page.locator('.listSquare', { hasText: uniqueListName }).locator('h4').click();
    await page.waitForLoadState('networkidle'); 
    await expect(page).toHaveURL(/.*\/products.*/);

    // === DODAWANIE PRODUKTU ===
    await page.getByText('+', { exact: false }).click();
    await expect(page.locator('input[name="productName"]')).toBeVisible();

    await page.fill('input[name="productName"]', 'Milk');
    await page.fill('input[name="quantity"]', '2');
    await page.getByRole('button', { name: 'Save' }).click();

    const firstRow = page.locator('.productRow').first();
    await expect(firstRow).toBeVisible();

    // === EDYCJA PRODUKTU ===
    await firstRow.click(); 
    await page.locator('#controllPanel').getByRole('button', { name: 'Edit' }).click();

    await page.fill('input[name="productName"]', 'Oat Milk');
    await page.fill('input[name="quantity"]', '1');
    await page.getByRole('button', { name: 'Save' }).click();

    await page.waitForLoadState('networkidle');

    await expect(page.locator('.prodName').first()).toHaveText('Oat Milk');

    // === USUWANIE PRODUKTU ===
    await firstRow.click(); 

    const deleteButton = page.locator('#controllPanel').getByRole('button', { name: 'X', exact: false });
    
    // 4. KLUCZOWA POPRAWKA: Czekamy nie tylko aż będzie widoczny, ale aż będzie WŁĄCZONY (czyli Svelte przetworzyło kliknięcie)
    await expect(deleteButton).toBeEnabled({ timeout: 5000 });

    // 5. Dopiero teraz klikamy bezpiecznie
    await deleteButton.click();

    // Wiersz powinien zniknąć
    await expect(firstRow).toBeHidden();

    // === SPRZĄTANIE: Usuwamy całą listę, żeby nie śmiecić w bazie ===
    await page.click('button:has-text("Go back")');
    await page.waitForLoadState('networkidle');
    
    const listCard = page.locator('.listSquare', { hasText: uniqueListName });
    await listCard.getByRole('button', { name: 'X', exact: true }).click();
    await expect(listCard).toBeHidden();
  });
});