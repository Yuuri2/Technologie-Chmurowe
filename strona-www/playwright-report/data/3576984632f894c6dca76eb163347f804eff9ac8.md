# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: products.spec.ts >> Product page functions >> Products can be added, edited and deleted
- Location: tests/e2e/products.spec.ts:11:3

# Error details

```
Error: page.goto: net::ERR_NAME_NOT_RESOLVED at https://tcwebapp-maszyna.azurewebsites.net/
Call log:
  - navigating to "https://tcwebapp-maszyna.azurewebsites.net/", waiting until "load"

```

# Test source

```ts
  1  | import { expect, type Page } from '@playwright/test';
  2  | 
  3  | export async function loginUser(page: Page) {
> 4  |   await page.goto('/'); 
     |              ^ Error: page.goto: net::ERR_NAME_NOT_RESOLVED at https://tcwebapp-maszyna.azurewebsites.net/
  5  |   await page.waitForLoadState('networkidle');
  6  |   await page.click('button:has-text("Log In")');
  7  | 
  8  |   await page.fill('input[name="username"]', 'test');
  9  |   await page.fill('input[name="password"]', 'aaa');
  10 |   await page.click('button:has-text("Login")');
  11 |   
  12 |   await expect(page).toHaveURL(/.*\/home/);
  13 |   await expect(page.locator('h4')).toBeVisible();
  14 | }
  15 | 
  16 | export async function createList(page:Page) {
  17 |     await page.fill('input[name="nazwa"]', 'lista');
  18 |     await page.click('button:has-text("+ Create New List")');
  19 |     await expect(page.locator('h4:has-text("lista")')).toBeVisible();
  20 |     await page.waitForLoadState('networkidle');
  21 | }
  22 | 
```