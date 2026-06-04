import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  // Zdejmujemy restrykcyjne flagi zależne od CI – Playwright i tak domyślnie 
  // uruchomi testy stabilnie w jednym workerze, jeśli tak wskazano poniżej
  forbidOnly: false,
  retries: 2, // Pozwalamy na 2 powtórzenia w razie problemów sieciowych z Azure
  workers: 1, 
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Uproszczony serwer – usunęliśmy sekcję 'env', ponieważ zmienna DATABASE_URL 
  // jest już dostępna w systemie Linux w GitHub Actions i serwer Vite/Preview 
  // automatycznie ją wychwyci, jeśli nie nadpiszemy jej pustym stringiem.
  webServer: {
    command: 'npm run build && npm run preview',
    port: 4173,
    reuseExistingServer: true,
  },
});