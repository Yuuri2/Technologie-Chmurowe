# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication >> should login existing user
- Location: tests/e2e/auth.spec.ts:4:3

# Error details

```
Error: page.goto: net::ERR_NAME_NOT_RESOLVED at https://tcwebapp-maszyna.azurewebsites.net/
Call log:
  - navigating to "https://tcwebapp-maszyna.azurewebsites.net/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Authentication', () => {
  4  |   test('should login existing user', async ({ page }) => {
> 5  |     await page.goto('https://tcwebapp-maszyna.azurewebsites.net');
     |                ^ Error: page.goto: net::ERR_NAME_NOT_RESOLVED at https://tcwebapp-maszyna.azurewebsites.net/
  6  |     await page.click('button:has-text("Log In")');
  7  |     await expect(page).toHaveURL('/login');
  8  |     await page.fill('input[name="username"]', 'test');
  9  |     await page.fill('input[name="password"]', 'aaa');
  10 |     await page.click('button:has-text("Login")');
  11 |     
  12 |     await expect(page).toHaveURL(/.*\/home/);
  13 |   });
  14 | });
```