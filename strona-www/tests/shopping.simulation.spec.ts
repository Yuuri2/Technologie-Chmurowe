import { test, expect } from '@playwright/test';

test.describe('Shopping List App - E2E Flow', () => {
    
    test('powinien przejść pełną ścieżkę użytkownika (rejestracja i logowanie)', async ({ page }) => {
        const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:4173';
        
        await page.goto(baseUrl);
        await expect(page.locator('h1')).toContainText('Shopping list Center');

        await page.locator('button:has-text("Register")').click(); 
        await expect(page.locator('h1')).toContainText('Register!');

        const uniqueUsername = `user_${Date.now()}`;

        // 1. Wypełniamy rejestrację
        await page.fill('form[action="?/register"] input[name="username"]', uniqueUsername);
        await page.fill('form[action="?/register"] input[name="password"]', 'Tajny@kod123');
        await page.fill('form[action="?/register"] input[name="passwordCheck"]', 'Tajny@kod123');

        // Obsługa okna alert (musi być zadeklarowana PRZED kliknięciem)
        page.on('dialog', async dialog => {
            expect(dialog.message()).toContain('Konto założone pomyślnie');
            await dialog.accept();
        });

        // 2. Klikamy rejestrację i czekamy na przełączenie widoku
        await page.click('form[action="?/register"] button[type="submit"]');

        // 3. Czekamy, aż nagłówek zmieni się na "Sign In!" i upewniamy się, że stary formularz zniknął
        await expect(page.locator('h1')).toContainText('Sign In!');
        // POPRAWKA: Prawidłowa asercja w Playwright to .toBeHidden()
        await expect(page.locator('form[action="?/register"]')).toBeHidden(); 

        // 4. Dopiero teraz bezpiecznie wypełniamy logowanie
        await page.fill('form[action="?/login"] input[name="username"]', uniqueUsername);
        await page.fill('form[action="?/login"] input[name="password"]', 'Tajny@kod123');
        
        // 5. Klikamy logowanie
        await page.click('form[action="?/login"] button[type="submit"]');

        // 6. Asercja końcowa
        await expect(page.locator('#settingsPanel h4')).toContainText(uniqueUsername);
    });
});