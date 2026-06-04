import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Każe Vitestowi szukać testów jednostkowych TYLKO wewnątrz src/
    include: ['src/**/*.{test,spec}.{js,ts}'],
    // Dla absolutnej pewności jawnie ignorujemy folder z testami E2E
    exclude: ['tests/**/*', 'node_modules/**/*']
  }
});