import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should login existing user', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL('/login');
    await page.fill('input[name="username"]', 'test');
    await page.fill('input[name="password"]', 'aaa');
    await page.click('button:has-text("Login")');
    
    await expect(page).toHaveURL(/.*\/home/);
  });
});