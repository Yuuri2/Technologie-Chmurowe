import { test, expect } from '@playwright/test';
import { loginUser, createList } from './helpers';

test.describe('Product page functions', () => {

  test.beforeEach(async ({ page }) => {
    await loginUser(page);
    await createList(page);
  });

  test('Products can be added, edited and deleted', async ({ page }) => {
    await page.locator('.listSquare').first().click();
    await page.getByRole('button', { name: '+' }).click();

    await page.fill('input[name="productName"]', 'Milk');
    await page.fill('input[name="quantity"]', '2');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.locator('.productRow').first()).toBeVisible();

    await page.locator('.productRow').first().click();
    await page.getByRole('button', { name: 'Edit' }).click();
    await page.fill('input[name="productName"]', 'Oat Milk');
    await page.fill('input[name="quantity"]', '1');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.locator('.prodName').first()).toHaveText('Oat Milk');

    await page.locator('.productRow').first().click();
    await page.getByRole('button', { name: 'X' }).click();

    await expect(page.locator('.productRow')).toHaveCount(0);
  });
});