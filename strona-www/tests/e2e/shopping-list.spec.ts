import { test, expect } from '@playwright/test';
import { loginUser, createList } from './helpers';

test.describe('Product lists function', () => {

  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test('should add a new list and delete it', async ({ page }) => {
    const uniqueListName = `lista-clean-${Date.now()}`;

    // Tworzymy listę za pomocą uaktualnionego helpera
    const listCard = await createList(page, uniqueListName);

    // Klikamy przycisk "X" DOKŁADNIE wewnątrz naszej unikalnej listy
    await listCard.getByRole('button', { name: 'X', exact: true }).click();

    // Sprawdzamy, czy nasza lista bezpowrotnie zniknęła
    await expect(listCard).toBeHidden();
  });
});