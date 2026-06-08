import { test, expect } from '@playwright/test';
import { loginUser } from './helpers';

test.describe('Product lists function', () => {

  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test('should add a new list and delete it', async ({ page }) => {
    await page.fill('input[name="nazwa"]', 'lista');
    await page.click('button:has-text("+ Create New List")');

    await expect(page.locator('h4').first()).toHaveText('lista');
await page.locator('.listSquare').first().getByRole('button', { name: 'X', exact: true }).click();

    await expect(page.locator('.listSquare')).toHaveCount(0);
  });
});