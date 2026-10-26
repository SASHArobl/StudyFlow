import { expect, test, type Page } from '@playwright/test';

const sections = [
  ['today', 'Сегодня'],
  ['subjects', 'Предметы'],
  ['tasks', 'Задачи'],
  ['planner', 'Планировщик'],
  ['focus', 'Фокус'],
  ['analytics', 'Аналитика'],
  ['settings', 'Настройки'],
] as const;

async function openNavigation(page: Page) {
  await expect(page.locator('.workspace')).toBeVisible();
  const trigger = page.getByRole('button', {
    name: 'Открыть навигацию',
    exact: true,
  });
  if (await trigger.isVisible()) await trigger.click();
}

async function navigate(page: Page, label: string) {
  await openNavigation(page);
  await page
    .getByRole('link', { name: label, exact: true })
    .filter({ visible: true })
    .click();
}

test.beforeEach(async ({ page }) => {
  const response = await page.request.post('/api/auth/login', {
    headers: { Origin: 'http://127.0.0.1:3100' },
    data: {
      email: process.env.STUDYFLOW_TEST_EMAIL,
      password: process.env.STUDYFLOW_TEST_PASSWORD,
    },
  });
  expect(response.ok()).toBe(true);
  await page.goto('/app');
  await expect(
    page.getByRole('heading', { name: 'Сегодня', exact: true }),
  ).toBeVisible();
});

test('all seven sections navigate without document or RSC requests', async ({
  page,
}) => {
  const requests: string[] = [];
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    if (request.isNavigationRequest() || request.headers().rsc === '1')
      requests.push(request.url());
  });
  for (const [id, label] of [...sections.slice(1), sections[0]]) {
    await navigate(page, label);
    await expect(page).toHaveURL(new RegExp(`view=${id}$`));
    await expect(
      page.getByRole('heading', { name: label, exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: label, exact: true }),
    ).toBeFocused();
    await expect(
      page.locator('.desktop-sidebar a[aria-current="page"]'),
    ).toHaveText(label);
    if (id !== 'settings')
      await expect(
        page.getByText('Временная страница', { exact: true }),
      ).toBeVisible();
    else
      await expect(
        page.getByRole('heading', { name: 'Профиль', exact: true }),
      ).toBeVisible();
    await expect(page).toHaveTitle(`${label} · StudyFlow`);
  }
  expect(requests).toEqual([]);
  expect(errors).toEqual([]);
});

test('direct URLs, reload, Back and Forward keep the selected section', async ({
  page,
}) => {
  await page.goto('/app?view=tasks');
  await expect(
    page.getByRole('heading', { name: 'Задачи', exact: true }),
  ).toBeVisible();
  await navigate(page, 'Планировщик');
  await page.goBack();
  await expect(
    page.getByRole('heading', { name: 'Задачи', exact: true }),
  ).toBeVisible();
  await page.goForward();
  await expect(
    page.getByRole('heading', { name: 'Планировщик', exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Планировщик', exact: true }),
  ).toBeVisible();
  await page.goto('/');
  await expect(page).toHaveURL(/\/app$/);
  await expect(
    page.getByRole('heading', { name: 'Сегодня', exact: true }),
  ).toBeVisible();
});

test('keyboard search is real navigation with focus restoration and an empty state', async ({
  page,
}) => {
  const trigger = page.getByRole('button', {
    name: 'Поиск раздела',
    exact: true,
  });
  await trigger.focus();
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog', { name: 'Перейти в раздел' });
  const input = dialog.getByLabel('Название раздела');
  await expect(input).toBeFocused();
  await input.fill('несуществующий');
  await expect(dialog.getByRole('status')).toHaveText(
    'Раздел не найден. Попробуйте другое название.',
  );
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await input.fill('Planner');
  await page.keyboard.press('ArrowDown');
  await expect(
    dialog.getByRole('link', { name: /^Планировщик(?: Planner)?$/ }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Планировщик', exact: true }),
  ).toBeFocused();
});

test('mobile drawer traps focus, dismisses and closes when resizing to desktop', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'Drawer only appears below 960 CSS px.');
  const trigger = page.getByRole('button', {
    name: 'Открыть навигацию',
    exact: true,
  });
  await trigger.click();
  const drawer = page.getByRole('dialog', { name: 'Навигация', exact: true });
  await expect(drawer).toBeVisible();
  for (let count = 0; count < 16; count++) {
    await page.keyboard.press('Tab');
    expect(
      await page.evaluate(() =>
        Boolean(document.activeElement?.closest('dialog[open]')),
      ),
    ).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.click();
  await page.mouse.click(350, 200);
  await expect(drawer).not.toBeVisible();
  await trigger.click();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(drawer).not.toBeVisible();
  await expect(page.locator('.desktop-sidebar')).toBeVisible();
});

test('light, dark and system appearance persist and follow OS changes', async ({
  page,
}) => {
  await openNavigation(page);
  let theme = page
    .getByLabel('Тема', { exact: true })
    .filter({ visible: true });
  await theme.selectOption('dark');
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await openNavigation(page);
  theme = page.getByLabel('Тема', { exact: true }).filter({ visible: true });
  await expect(theme).toHaveValue('dark');
  await theme.selectOption('light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  await theme.selectOption('system');
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).not.toHaveClass(/dark/);
});

test('theme still changes when browser storage rejects saving', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('Storage blocked', 'SecurityError');
    };
  });
  await page.reload();
  await openNavigation(page);
  await page
    .getByLabel('Тема', { exact: true })
    .filter({ visible: true })
    .selectOption('dark');
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(page.getByRole('status').filter({ visible: true })).toHaveText(
    'Тема изменена, но браузер не позволил сохранить выбор.',
  );
});

test('unknown view renders an actionable error without selecting a fake section', async ({
  page,
}) => {
  await page.goto('/app?view=unknown');
  await expect(
    page.getByRole('alert', { name: 'Такого раздела нет' }),
  ).toContainText('Такого раздела нет');
  await expect(page.locator('.desktop-sidebar a[aria-current]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Открыть «Сегодня»' }).click();
  await expect(
    page.getByRole('heading', { name: 'Сегодня', exact: true }),
  ).toBeVisible();
});

test('skip link reaches main content with the keyboard', async ({ page }) => {
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Перейти к содержимому' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
});

test('layouts reflow at approved widths and screenshots capture both themes', async ({
  page,
  isMobile,
}, testInfo) => {
  if (!isMobile) {
    for (const width of [320, 390, 768, 960, 1280, 1440, 1600]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <= innerWidth &&
            document.documentElement.scrollHeight <= innerHeight,
        ),
      ).toBe(true);
      await expect(page.locator('.desktop-sidebar')).toBeVisible({
        visible: width >= 960,
      });
      if (width >= 960) {
        const box = await page.locator('.desktop-sidebar').boundingBox();
        expect(box?.width).toBe(
          width >= 1440 ? 264 : width >= 1200 ? 248 : 216,
        );
      }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
  }
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: testInfo.outputPath('shell-light.png'),
    fullPage: true,
    animations: 'disabled',
  });
  await openNavigation(page);
  await page
    .getByLabel('Тема', { exact: true })
    .filter({ visible: true })
    .selectOption('dark');
  if (isMobile) await page.keyboard.press('Escape');
  await page.screenshot({
    path: testInfo.outputPath('shell-dark.png'),
    fullPage: true,
    animations: 'disabled',
  });
  if (isMobile) {
    await openNavigation(page);
    await page.screenshot({
      path: testInfo.outputPath('mobile-navigation.png'),
      fullPage: true,
      animations: 'disabled',
    });
  }
});
