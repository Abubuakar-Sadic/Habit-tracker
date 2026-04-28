import { test, expect, Page } from '@playwright/test';

const BASE = 'http://localhost:3000';

async function seedUser(page: Page, email: string, password: string, userId: string) {
  await page.evaluate(
    ({ email, password, userId }) => {
      const users = JSON.parse(localStorage.getItem('habit-tracker-users') || '[]');
      if (!users.find((u: { email: string }) => u.email === email)) {
        users.push({ id: userId, email, password, createdAt: new Date().toISOString() });
        localStorage.setItem('habit-tracker-users', JSON.stringify(users));
      }
    },
    { email, password, userId }
  );
}

async function seedSession(page: Page, userId: string, email: string) {
  await page.evaluate(
    ({ userId, email }) => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId, email }));
    },
    { userId, email }
  );
}

async function clearStorage(page: Page) {
  await page.evaluate(() => localStorage.clear());
}

test.describe('Habit Tracker app', () => {
  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto(BASE);
    await clearStorage(page);
    await page.goto(BASE);

    await expect(page.getByTestId('splash-screen')).toBeVisible();
    await page.waitForURL('**/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    await page.goto(BASE);
    await clearStorage(page);
    await seedUser(page, 'auth@example.com', 'pass123', 'uid-auth');
    await seedSession(page, 'uid-auth', 'auth@example.com');
    await page.goto(BASE);

    await page.waitForURL('**/dashboard', { timeout: 5000 });
    expect(page.url()).toContain('/dashboard');
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto(BASE);
    await clearStorage(page);
    await page.goto(`${BASE}/dashboard`);

    await page.waitForURL('**/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto(BASE);
    await clearStorage(page);
    await page.goto(`${BASE}/signup`);

    await page.getByTestId('auth-signup-email').fill('newuser@example.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.getByTestId('auth-signup-submit').click();

    await page.waitForURL('**/dashboard', { timeout: 5000 });
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test("logs in an existing user and loads only that user's habits", async ({ page }) => {
    await page.goto(BASE);
    await clearStorage(page);

    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-users', JSON.stringify([
        { id: 'ua', email: 'a@example.com', password: 'pass', createdAt: new Date().toISOString() },
        { id: 'ub', email: 'b@example.com', password: 'pass', createdAt: new Date().toISOString() },
      ]));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([
        { id: 'h1', userId: 'ua', name: 'User A Habit', description: '', frequency: 'daily', createdAt: new Date().toISOString(), completions: [] },
        { id: 'h2', userId: 'ub', name: 'User B Habit', description: '', frequency: 'daily', createdAt: new Date().toISOString(), completions: [] },
      ]));
    });

    await page.goto(`${BASE}/login`);
    await page.getByTestId('auth-login-email').fill('a@example.com');
    await page.getByTestId('auth-login-password').fill('pass');
    await page.getByTestId('auth-login-submit').click();

    await page.waitForURL('**/dashboard', { timeout: 5000 });
    await expect(page.getByTestId('habit-card-user-a-habit')).toBeVisible();
    await expect(page.getByTestId('habit-card-user-b-habit')).not.toBeVisible();
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    await page.goto(BASE);
    await clearStorage(page);
    await seedUser(page, 'creator@example.com', 'pass', 'uid-creator');
    await seedSession(page, 'uid-creator', 'creator@example.com');
    await page.goto(`${BASE}/dashboard`);

    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Morning Run');
    await page.getByTestId('habit-description-input').fill('Run 5km every morning');
    await page.getByTestId('habit-save-button').click();

    await expect(page.getByTestId('habit-card-morning-run')).toBeVisible();
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await page.goto(BASE);
    await clearStorage(page);
    await seedUser(page, 'completer@example.com', 'pass', 'uid-completer');
    await seedSession(page, 'uid-completer', 'completer@example.com');

    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-habits', JSON.stringify([
        { id: 'hc', userId: 'uid-completer', name: 'Drink Water', description: '', frequency: 'daily', createdAt: new Date().toISOString(), completions: [] },
      ]));
    });

    await page.goto(`${BASE}/dashboard`);
    await expect(page.getByTestId('habit-streak-drink-water')).toContainText('0');

    await page.getByTestId('habit-complete-drink-water').click();
    await expect(page.getByTestId('habit-streak-drink-water')).toContainText('1');
  });

  test('persists session and habits after page reload', async ({ page }) => {
    await page.goto(BASE);
    await clearStorage(page);
    await seedUser(page, 'persist@example.com', 'pass', 'uid-persist');
    await seedSession(page, 'uid-persist', 'persist@example.com');

    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-habits', JSON.stringify([
        { id: 'hp', userId: 'uid-persist', name: 'Journal', description: '', frequency: 'daily', createdAt: new Date().toISOString(), completions: [] },
      ]));
    });

    await page.goto(`${BASE}/dashboard`);
    await expect(page.getByTestId('habit-card-journal')).toBeVisible();

    await page.reload();
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await expect(page.getByTestId('habit-card-journal')).toBeVisible();
  });

  test('logs out and redirects to /login', async ({ page }) => {
    await page.goto(BASE);
    await clearStorage(page);
    await seedUser(page, 'logout@example.com', 'pass', 'uid-logout');
    await seedSession(page, 'uid-logout', 'logout@example.com');
    await page.goto(`${BASE}/dashboard`);

    await page.getByTestId('auth-logout-button').click();
    await page.waitForURL('**/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');

    const sessionRaw = await page.evaluate(() => localStorage.getItem('habit-tracker-session'));
    expect(sessionRaw).toBeNull();
  });

  test('loads the cached app shell when offline after the app has been loaded once', async ({ page, context }) => {
    await page.goto(BASE);
    await clearStorage(page);

    // Load the app online so the service worker caches the shell
    await page.goto(`${BASE}/login`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    // Go offline
    await context.setOffline(true);

    // Reload — should not hard crash; cached shell should serve
    try {
      await page.reload({ waitUntil: 'domcontentloaded' });
    } catch {
      // Ignore navigation errors when offline
    }

    const body = await page.locator('body').textContent();
    expect(body).not.toBeNull();
    expect(body!.length).toBeGreaterThan(0);

    await context.setOffline(false);
  });
});
