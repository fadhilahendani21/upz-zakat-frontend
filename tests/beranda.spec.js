import { test, expect } from '@playwright/test';

test('halaman Beranda dapat dibuka', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await expect(
    page.getByRole('heading', {
      name: 'Menunaikan Zakat, Membersamai Umat',
    })
  ).toBeVisible();

  await expect(
    page.getByRole('button', { name: 'Tunaikan Zakat' })
  ).toBeVisible();
});