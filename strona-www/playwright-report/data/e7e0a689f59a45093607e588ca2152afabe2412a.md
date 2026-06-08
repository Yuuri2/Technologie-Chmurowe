# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shopping-list.spec.ts >> Product lists function >> should add a new list and delete it
- Location: tests/e2e/shopping-list.spec.ts:10:3

# Error details

```
Error: page.goto: NS_ERROR_UNKNOWN_HOST
Call log:
  - navigating to "https://tcwebapp-maszyna.azurewebsites.net/", waiting until "load"

```

# Page snapshot

```yaml
- article "Server Not Found" [ref=e3]:
  - img "Illustration of a fox looking at disconnected network cables." [ref=e5]
  - generic [ref=e7]:
    - heading "Server Not Found" [level=1] [ref=e8]
    - paragraph [ref=e9]:
      - text: Nightly can’t connect to the server at
      - strong [ref=e10]: tcwebapp-maszyna.azurewebsites.net
    - generic [ref=e11]:
      - heading "What can you do about it?" [level=3] [ref=e12]
      - paragraph [ref=e13]: Try connecting on a different device. Check your modem or router. Disconnect and reconnect to Wi-Fi.
    - paragraph [ref=e14]:
      - link "Learn more…" [ref=e15] [cursor=pointer]:
        - /url: https://support.mozilla.org/1/firefox/150.0.2/Linux/en-US/server-not-found-connection-problem
    - button "Try Again" [ref=e18]:
      - generic [ref=e20]:
        - generic: Try Again
```

# Test source

```ts
  1  | import { expect, type Page } from '@playwright/test';
  2  | 
  3  | export async function loginUser(page: Page) {
> 4  |   await page.goto('/'); 
     |              ^ Error: page.goto: NS_ERROR_UNKNOWN_HOST
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