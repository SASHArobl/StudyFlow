import { expect, test } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../src/lib/supabase/database.types';
import { confirmationLink, localTestConfig } from './mail';

const origin = 'http://127.0.0.1:3100';
const headers = { Origin: origin };

test('anonymous access, expired links, validation and CSRF are rejected', async ({
  page,
  request,
}) => {
  await page.goto('/app?view=settings');
  await expect(page).toHaveURL(/\/login$/);
  expect(
    (
      await request.post('/api/account/profile', { headers, data: {} })
    ).status(),
  ).toBe(401);
  expect(
    (
      await request.patch('/api/account/profile', {
        headers,
        data: {
          expected_user_id: crypto.randomUUID(),
          display_name: 'Intruder',
          expected_version: '1',
        },
      })
    ).status(),
  ).toBe(401);
  expect(
    (
      await request.post('/api/auth/reset-password', {
        headers,
        data: {
          password: 'new-password-12345',
          confirmation: 'new-password-12345',
        },
      })
    ).status(),
  ).toBe(401);
  expect(
    (
      await request.post('/api/auth/login', {
        headers: { Origin: 'https://attacker.example' },
        data: {},
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post('/api/auth/register', {
        headers,
        data: { email: 'bad', password: 'short', confirmation: 'short' },
      })
    ).status(),
  ).toBe(422);
  await page.goto('/reset-password');
  await expect(page).toHaveURL(/forgot-password\?notice=session-required/);
  await page.goto(
    '/auth/confirm?code=used-or-invalid&next=https://attacker.example',
  );
  await expect(page).toHaveURL(/login\?notice=invalid-link/);
  await expect(page.getByRole('status')).toContainText(
    'Ссылка недействительна',
  );
  await page.goto('/register');
  await page
    .getByRole('button', { name: 'Создать аккаунт', exact: true })
    .click();
  await expect(page.getByLabel('Email', { exact: true })).toBeFocused();
  await expect(page.getByLabel('Email', { exact: true })).toHaveAttribute(
    'aria-invalid',
    'true',
  );
});

test('real registration, confirmation, profile isolation, persistence, logout and recovery', async ({
  page,
  request,
}, testInfo) => {
  test.setTimeout(120_000);
  const email = `flow-${crypto.randomUUID()}@studyflow.test`;
  const password = `Test-only-${crypto.randomUUID()}`;
  const newPassword = `Changed-only-${crypto.randomUUID()}`;
  await page.goto('/register');
  await page.getByLabel('Email', { exact: true }).fill(email);
  await page.getByLabel('Пароль', { exact: true }).fill(password);
  await page.getByLabel('Повторите пароль', { exact: true }).fill(password);
  await page
    .getByRole('button', { name: 'Создать аккаунт', exact: true })
    .click();
  await expect(page.getByRole('status')).toContainText('Подтвердите email');
  const unconfirmed = await request.post('/api/auth/login', {
    headers,
    data: { email, password },
  });
  expect(unconfirmed.status()).toBe(403);
  await page.goto(await confirmationLink(email));
  await expect(page).toHaveURL(/\/app$/);
  await expect(
    page.getByRole('heading', { name: 'Сегодня', exact: true }),
  ).toBeVisible();
  await page.goto('/app?view=settings');
  await expect(page.getByLabel('Email · подтверждён')).toHaveValue(email);
  await page.getByLabel('Имя', { exact: true }).fill('Александр');
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Профиль сохранён.');
  await page.reload();
  await expect(page.getByLabel('Имя', { exact: true })).toHaveValue(
    'Александр',
  );
  await page.screenshot({
    path: testInfo.outputPath('profile.png'),
    fullPage: true,
  });
  const profileResponse = await page.request.post('/api/account/profile', {
    headers,
    data: {},
  });
  expect(profileResponse.headers()['cache-control']).toContain('no-store');
  const own = (await profileResponse.json()) as {
    profile: { user_id: string; version: string };
  };
  expect(
    (
      await page.request.patch('/api/account/profile', {
        headers,
        data: {
          expected_user_id: own.profile.user_id,
          display_name: 'stale',
          expected_version: '1',
        },
      })
    ).status(),
  ).toBe(409);
  expect(
    (
      await page.request.post('/api/account/profile', {
        headers,
        data: { user_id: crypto.randomUUID() },
      })
    ).status(),
  ).toBe(422);

  expect(
    (
      await page.request.patch('/api/account/profile', {
        headers,
        data: {
          expected_user_id: crypto.randomUUID(),
          display_name: 'Wrong account',
          expected_version: own.profile.version,
        },
      })
    ).status(),
  ).toBe(409);

  // Direct publishable-key RPCs must be protected independently of the Next.js UI.
  const { url, key } = localTestConfig();
  const first = createClient<Database>(url, key, {
    db: { schema: 'api' },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const anonymous = await first.rpc('profile');
  expect(anonymous.error).not.toBeNull();
  const signed = await first.auth.signInWithPassword({ email, password });
  expect(signed.error).toBeNull();
  const token = signed.data.session!.access_token;
  const direct = await first.rpc('profile');
  expect(direct.error).toBeNull();
  expect((direct.data as { user_id: string }).user_id).toBe(
    own.profile.user_id,
  );
  const second = createClient<Database>(url, key, {
    db: { schema: 'api' },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  expect(
    (
      await second.auth.signInWithPassword({
        email: process.env.STUDYFLOW_TEST_EMAIL!,
        password: process.env.STUDYFLOW_TEST_PASSWORD!,
      })
    ).error,
  ).toBeNull();
  const other = await second.rpc('profile');
  expect(other.error).toBeNull();
  expect((other.data as { user_id: string }).user_id).not.toBe(
    own.profile.user_id,
  );
  const tableAttempt = await fetch(
    `${url}/rest/v1/profiles?user_id=eq.${own.profile.user_id}`,
    {
      headers: {
        apikey: key,
        Authorization: `Bearer ${token}`,
        'Accept-Profile': 'app_data',
      },
    },
  );
  expect(tableAttempt.ok).toBe(false);
  expect((await first.auth.signOut({ scope: 'local' })).error).toBeNull();
  const revoked = await fetch(`${url}/rest/v1/rpc/profile`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${token}`,
      'Content-Profile': 'api',
      'Content-Type': 'application/json',
    },
    body: '{}',
  });
  expect(revoked.status).toBe(403);
  expect(((await revoked.json()) as { code: string }).code).toBe('28000');
  await second.auth.signOut({ scope: 'local' });

  await page.getByRole('button', { name: 'Выйти', exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  expect(
    (
      await page.request.post('/api/account/profile', { headers, data: {} })
    ).status(),
  ).toBe(401);
  await page.getByLabel('Email', { exact: true }).fill(email);
  await page.getByLabel('Пароль', { exact: true }).fill('incorrect-password');
  await page.getByRole('button', { name: 'Войти', exact: true }).click();
  await expect(page.locator('.auth-panel').getByRole('alert')).toContainText(
    'Проверьте email и пароль',
  );
  await page.getByRole('link', { name: 'Забыли пароль?' }).click();
  await expect(page).toHaveURL(/\/forgot-password$/);
  await expect(
    page.getByRole('heading', { name: 'Восстановить доступ' }),
  ).toBeVisible();
  await page.getByLabel('Email', { exact: true }).fill(email);
  await page.getByRole('button', { name: 'Отправить ссылку' }).click();
  await expect(page.getByRole('status')).toContainText('Если аккаунт');
  const recoveryLink = await confirmationLink(email, true);
  await page.goto(recoveryLink);
  await expect(page).toHaveURL(/\/reset-password$/);
  await page.getByLabel('Пароль', { exact: true }).fill(newPassword);
  await page.getByLabel('Повторите пароль', { exact: true }).fill(newPassword);
  await page
    .getByRole('button', { name: 'Сохранить пароль', exact: true })
    .click();
  await expect(page).toHaveURL(/login\?notice=password-reset/);
  expect(
    (
      await request.post('/api/auth/login', {
        headers,
        data: { email, password },
      })
    ).status(),
  ).toBe(401);
  await page.getByLabel('Email', { exact: true }).fill(email);
  await page.getByLabel('Пароль', { exact: true }).fill(newPassword);
  await page.getByRole('button', { name: 'Войти', exact: true }).click();
  await expect(page).toHaveURL(/\/app$/);
  await expect(
    page.getByRole('heading', { name: 'Сегодня', exact: true }),
  ).toBeVisible();
});

test('SSR refresh persists cookies, static HTML stays generic, and logout reaches another tab', async ({
  page,
  context,
  request,
}) => {
  expect(
    (
      await page.request.post('/api/auth/login', {
        headers,
        data: {
          email: process.env.STUDYFLOW_TEST_EMAIL,
          password: process.env.STUDYFLOW_TEST_PASSWORD,
        },
      })
    ).ok(),
  ).toBe(true);
  const html = await (await request.get('/app?view=settings')).text();
  expect(html).not.toContain(process.env.STUDYFLOW_TEST_EMAIL);
  expect(html).not.toContain('access_token');
  // Force the SDK's stored expiry boundary, retaining the real signed token and
  // refresh token. This exercises a real provider refresh, not mocked success.
  const cookies = (await context.cookies())
    .filter((cookie) => /auth-token(?:\.\d+)?$/.test(cookie.name))
    .sort((a, b) => a.name.localeCompare(b.name));
  const encoded = cookies.map((cookie) => cookie.value).join('');
  expect(encoded.startsWith('base64-')).toBe(true);
  const session = JSON.parse(
    Buffer.from(encoded.slice(7), 'base64url').toString(),
  ) as { expires_at: number; refresh_token: string };
  const previousRefresh = session.refresh_token;
  session.expires_at = 1;
  const replacement = `base64-${Buffer.from(JSON.stringify(session)).toString('base64url')}`;
  expect(replacement.length).toBeLessThan(3800);
  await context.clearCookies({ name: /auth-token(?:\.\d+)?$/ });
  const cookie = cookies[0]!;
  await context.addCookies([
    { ...cookie, name: cookie.name.replace(/\.\d+$/, ''), value: replacement },
  ]);
  const refreshed = await page.request.post('/api/account/profile', {
    headers,
    data: {},
  });
  expect(refreshed.ok()).toBe(true);
  expect(refreshed.headers()['cache-control']).toContain('no-store');
  expect(refreshed.headers()['pragma']).toBe('no-cache');
  const updated = (await context.cookies())
    .filter((cookie) => /auth-token(?:\.\d+)?$/.test(cookie.name))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((cookie) => cookie.value)
    .join('');
  const newSession = JSON.parse(
    Buffer.from(updated.slice(7), 'base64url').toString(),
  ) as { refresh_token: string };
  expect(newSession.refresh_token !== previousRefresh).toBe(true);
  await page.goto('/app');
  await expect(
    page.getByRole('heading', { name: 'Сегодня', exact: true }),
  ).toBeVisible();
  const other = await context.newPage();
  await other.goto('/app?view=settings');
  await expect(other.getByLabel('Email · подтверждён')).toHaveValue(
    process.env.STUDYFLOW_TEST_EMAIL!,
  );
  await page.getByRole('button', { name: 'Выйти', exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(other).toHaveURL(/\/login$/);
});

test('auth layouts reflow, respect dark appearance and support keyboard submission', async ({
  page,
}, testInfo) => {
  await page.goto('/login');
  await page.getByLabel('Email', { exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Пароль', { exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('button', { name: 'Войти', exact: true }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('Email', { exact: true })).toBeFocused();
  const originalViewport = page.viewportSize()!;
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.setViewportSize(originalViewport);
  await page.goto('/register');
  await page.screenshot({
    path: testInfo.outputPath('auth-light.png'),
    fullPage: true,
  });
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.screenshot({
    path: testInfo.outputPath('auth-dark.png'),
    fullPage: true,
  });
});
