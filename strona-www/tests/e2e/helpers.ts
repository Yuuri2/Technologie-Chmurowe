import { expect, type Page } from '@playwright/test';

export async function loginUser(page: Page) {
  await page.goto('/'); 
  await page.waitForLoadState('networkidle');
  await page.click('button:has-text("Log In")');

  await page.fill('input[name="username"]', 'test');
  await page.fill('input[name="password"]', 'aaa');
  await page.click('button:has-text("Login")');
  
  await expect(page).toHaveURL(/.*\/home/);
  await expect(page.locator('.username h3')).toBeVisible();
}

export async function createList(page: Page, listName: string) {
  await page.fill('input[name="nazwa"]', listName);
  await page.click('button:has-text("+ Create New List")');
  
  const listCard = page.locator('.listSquare', { hasText: listName });
  await expect(listCard).toBeVisible();
  await page.waitForLoadState('networkidle');
  return listCard;
}

export async function deleteFirstList(page: Page) {
    // Wchodzimy na stronę główną, gdzie są listy
    await page.goto('https://tcwebapp-maszyna.azurewebsites.net/home');
    
    // Szukamy pierwszego kafelka listy i klikamy w nim przycisk usuwania (X)
    await page.locator('.listSquare').first().getByRole('button', { name: 'X', exact: true }).click();
    
    // Opcjonalnie: czekamy chwilę, aż sieć odpocznie po usunięciu
    await page.waitForLoadState('networkidle');
}
