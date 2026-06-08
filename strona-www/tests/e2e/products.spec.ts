import { test, expect } from '@playwright/test';
import { loginUser, createList } from './helpers';

test.describe('Product page functions', () => {

  test.beforeEach(async ({ page }) => {
    await loginUser(page);
    await createList(page);
  });

  test('Products can be added, edited and deleted', async ({ page }) => {
    await page.locator('.listSquare h4').first().click();
    await expect(page).toHaveURL(/.*\/products.*/);
    await page.getByRole('button', { name: '+', exact: true }).click();
    await expect(page.locator('input[name="productName"]')).toBeVisible();

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