import { test, expect } from '@playwright/test';
import { loginUser } from './helpers';

test.describe('Product lists function', () => {

  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test('should add a new list and delete it', async ({ page }) => {
    // Tworzymy unikalną nazwę listy, np. "lista-1717882100"
    const uniqueListName = `lista-${Date.now()}`;

    await page.fill('input[name="nazwa"]', uniqueListName);
    await page.click('button:has-text("+ Create New List")');

    // 1. Sprawdzamy, czy nasza konkretna lista się pojawiła
    const listCard = page.locator('.listSquare', { hasText: uniqueListName });
    await expect(listCard).toBeVisible();

    // 2. Klikamy przycisk "X" DOKŁADNIE wewnątrz naszej unikalnej listy
    await listCard.getByRole('button', { name: 'X', exact: true }).click();

    // 3. PANCERNA ASERCJA: Sprawdzamy, czy nasza lista zniknęła (ignorując inne śmieci w bazie)
    await expect(listCard).toBeHidden();
  });
});