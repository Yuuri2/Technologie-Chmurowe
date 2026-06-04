import { test, expect } from '@playwright/test';

test.describe('Shopping List App - E2E Flow', () => {
    
    test('powinien przejść pełną ścieżkę użytkownika (rejestracja i logowanie)', async ({ page }) => {
        // Wykorzystujemy zmienną środowiskową, którą ustawi SvelteKit podczas testów (domyślnie port 4173 w trybie preview)
        const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:4173';
        
        // 1. Wejście na stronę główną
        await page.goto(baseUrl);
        await expect(page.locator('h1')).toContainText('Shopping list Center');

        // 2. Przejście do rejestracji
        await page.click('button:has-text("Register")');
        await expect(page.locator('h1')).toContainText('Register!');

        // Generujemy unikalnego użytkownika, żeby test nie wywalił się przez duplikat w bazie Azure
        const uniqueUsername = `user_${Date.now()}`;

        // 3. Wypełnienie formularza rejestracji
        await page.fill('input[name="username"]', uniqueUsername);
        await page.fill('input[name="password"]', 'Tajny@kod123');
        await page.fill('input[name="passwordCheck"]', 'Tajny@kod123');

        // Obsługa alertu przeglądarki po udanej rejestracji
        page.on('dialog', async dialog => {
            expect(dialog.message()).toContain('Konto założone pomyślnie');
            await dialog.accept();
        });

        // Wysyłamy formularz rejestracji
        await page.click('button[type="submit"]');

        // 4. Po alercie powinniśmy wylądować na ekranie logowania ("Sign In!")
        await expect(page.locator('h1')).toContainText('Sign In!');

        // 5. Logowanie nowym użytkownikiem
        await page.fill('input[name="username"]', uniqueUsername);
        await page.fill('input[name="password"]', 'Tajny@kod123');
        await page.click('button[type="submit"]');

        // 6. Asercja sukcesu: Powinniśmy zobaczyć nazwę zalogowanego użytkownika w panelu
        await expect(page.locator('#settingsPanel h4')).toContainText(uniqueUsername);
    });
});