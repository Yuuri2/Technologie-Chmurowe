import { test, expect } from '@playwright/test';

test.describe('Shopping List App - E2E Flow', () => {
    
    test('powinien przejść pełną ścieżkę użytkownika (rejestracja i logowanie)', async ({ page }) => {
        const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:4173';
        
        // 1. Wejście na stronę główną
        await page.goto(baseUrl);
        await expect(page.locator('h1')).toContainText('Shopping list Center');

        // 2. Przejście do rejestracji
        // Tutaj selektor jest super precyzyjny (klika przycisk "Register" na stronie głównej)
        await page.locator('button:has-text("Register")').click(); 
        await expect(page.locator('h1')).toContainText('Register!');

        // Generujemy unikalnego użytkownika
        const uniqueUsername = `user_${Date.now()}`;

        // 3. Wypełnienie formularza rejestracji
        await page.fill('form[action="?/register"] input[name="username"]', uniqueUsername);
        await page.fill('form[action="?/register"] input[name="password"]', 'Tajny@kod123');
        await page.fill('form[action="?/register"] input[name="passwordCheck"]', 'Tajny@kod123');

        // Obsługa alertu przeglądarki po udanej rejestracji
        page.on('dialog', async dialog => {
            expect(dialog.message()).toContain('Konto założone pomyślnie');
            await dialog.accept();
        });

        // WYRAŹNIE wskazujemy, że chcemy kliknąć przycisk w formularzu REJESTRACJI
        await page.click('form[action="?/register"] button[type="submit"]');

        // 4. Po alercie powinniśmy wylądować na ekranie logowania ("Sign In!")
        await expect(page.locator('h1')).toContainText('Sign In!');

        // 5. Logowanie nowym użytkownikiem
        await page.fill('form[action="?/login"] input[name="username"]', uniqueUsername);
        await page.fill('form[action="?/login"] input[name="password"]', 'Tajny@kod123');
        
        // WYRAŹNIE wskazujemy, że chcemy kliknąć przycisk w formularzu LOGOWANIA
        await page.click('form[action="?/login"] button[type="submit"]');

        // 6. Asercja sukcesu: Powinniśmy zobaczyć nazwę zalogowanego użytkownika w panelu
        await expect(page.locator('#settingsPanel h4')).toContainText(uniqueUsername);
    });
});