import { expect, type Page } from '@playwright/test';

export async function loginUser(page: Page) {
  await page.goto('https://tcwebapp-maszyna.azurewebsites.net');
  await page.click('button:has-text("Log In")');

  await page.fill('input[name="username"]', 'test');
  await page.fill('input[name="password"]', 'aaa');
  await page.click('button:has-text("Login")');
  
  // Czekaj aż zaloguje się i zostaniesz na /home
  await expect(page).toHaveURL(/.*\/home/);
  await expect(page.locator('h4')).toBeVisible(); // Username powinien być widoczny
}

export async function createList(page:Page) {
    await page.fill('input[name="nazwa"]', 'lista');
    await page.click('button:has-text("+ Create New List")');
    await expect(page.locator('h4:has-text("lista")')).toBeVisible();
}
