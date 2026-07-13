import { test, expect } from '@playwright/test';

const BASE_URL = 'https://coffee-shop.cloudflare-cdnjs-entrypoint.workers.dev';

test('Homepage — verify hero content and navigate to Menu', async ({ page }) => {
  const response = await page.goto(`${BASE_URL}/`);
  expect(response?.status()).toBe(200);
  await page.waitForLoadState('domcontentloaded');

  // Brand heading
  await expect(page.getByRole('heading', { name: '☕ Bean & Brew', level: 1 })).toBeVisible();

  // Hero headline
  await expect(page.getByRole('heading', { name: 'Coffee, made slow. Served fast.', level: 1 })).toBeVisible();

  // Visit us section
  await expect(page.getByRole('heading', { name: 'Visit us', level: 2 })).toBeVisible();

  // Primary CTA button
  await expect(page.getByRole('button', { name: 'See the menu →' })).toBeVisible();

  // Click the CTA link and verify navigation to /menu
  await page.getByRole('link', { name: 'See the menu →' }).click();
  await page.waitForURL(/\/menu/);
  await page.waitForLoadState('domcontentloaded');
  expect(page.url()).toContain('/menu');
});

test('Homepage — navigate to About via hero button', async ({ page }) => {
  const response = await page.goto(`${BASE_URL}/`);
  expect(response?.status()).toBe(200);
  await page.waitForLoadState('domcontentloaded');

  // Click the 'About us' secondary CTA link
  await page.getByRole('main').getByRole('link', { name: 'About us' }).click();
  await page.waitForURL(/\/about/);
  await page.waitForLoadState('domcontentloaded');
  expect(page.url()).toContain('/about');
});

test('Homepage — global navigation links are all reachable', async ({ page }) => {
  const response = await page.goto(`${BASE_URL}/`);
  expect(response?.status()).toBe(200);
  await page.waitForLoadState('domcontentloaded');

  const nav = page.getByRole('navigation');

  // Navigation landmark is present
  await expect(nav).toBeVisible();

  // All nav links are present
  await expect(nav.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Menu', exact: true })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'About', exact: true })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'My orders', exact: true })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Feedback', exact: true })).toBeVisible();

  // Verify nav link hrefs
  await expect(nav.getByRole('link', { name: 'Home', exact: true })).toHaveAttribute('href', '/');
  await expect(nav.getByRole('link', { name: 'Menu', exact: true })).toHaveAttribute('href', '/menu');
  await expect(nav.getByRole('link', { name: 'About', exact: true })).toHaveAttribute('href', '/about');
  await expect(nav.getByRole('link', { name: 'My orders', exact: true })).toHaveAttribute('href', '/orders');
  await expect(nav.getByRole('link', { name: 'Feedback', exact: true })).toHaveAttribute('href', '/feedback');

  // Click Feedback and confirm URL changes
  await nav.getByRole('link', { name: 'Feedback', exact: true }).click();
  await page.waitForURL(/\/feedback/);
  await page.waitForLoadState('domcontentloaded');
  expect(page.url()).toContain('/feedback');
});