import { expect, test } from '@playwright/test';

test('the foundation renders without backend credentials or runtime errors', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle('StudyFlow');
  await expect(
    page.getByRole('heading', { name: 'StudyFlow', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Техническая основа проекта готова.'),
  ).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
  await page.screenshot({
    path: testInfo.outputPath('foundation.png'),
    fullPage: true,
  });
});
