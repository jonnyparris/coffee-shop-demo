import { test, expect } from '@playwright/test';

const BASE_URL = 'https://coffee-shop.cloudflare-cdnjs-entrypoint.workers.dev';
const MENU_URL = `${BASE_URL}/menu`;

test('Menu — browse items and open a drink customisation page', async ({ page }) => {
  const response = await page.goto(MENU_URL);
  expect(response?.status()).toBe(200);
  await page.waitForLoadState('domcontentloaded');

  // Verify the page heading 'Menu' is visible
  await expect(page.getByRole('heading', { name: 'Menu', level: 2 })).toBeVisible();

  // Verify at least one 'Customize' link is present
  const customizeLinks = page.getByRole('link', { name: 'Customize' });
  await expect(customizeLinks.first()).toBeVisible();

  // Click the 'Customize' link for the Espresso item
  const espressoLink = page.locator('a[href*="item=espresso"]').first();
  await expect(espressoLink).toBeVisible();
  await espressoLink.click();

  await page.waitForURL(/item=espresso/);
  await page.waitForLoadState('domcontentloaded');

  // Confirm the URL contains the espresso order query parameter
  expect(page.url()).toContain('item=espresso');
});

test('Menu — customize a Latte order', async ({ page }) => {
  const response = await page.goto(MENU_URL);
  expect(response?.status()).toBe(200);
  await page.waitForLoadState('domcontentloaded');

  // Verify the page heading is visible before interacting
  await expect(page.getByRole('heading', { name: 'Menu', level: 2 })).toBeVisible();

  // Click the 'Customize' link for the Latte item
  const latteLink = page.locator('a[href*="item=latte"]').first();
  await expect(latteLink).toBeVisible();
  await latteLink.click();

  await page.waitForURL(/item=latte/);
  await page.waitForLoadState('domcontentloaded');

  // Confirm the URL contains the latte order query parameter
  expect(page.url()).toContain('item=latte');
});

test('Menu — customize a Cold Brew order', async ({ page }) => {
  const response = await page.goto(MENU_URL);
  expect(response?.status()).toBe(200);
  await page.waitForLoadState('domcontentloaded');

  // Verify the page heading is visible before interacting
  await expect(page.getByRole('heading', { name: 'Menu', level: 2 })).toBeVisible();

  // Click the 'Customize' link for the Cold Brew item
  const coldBrewLink = page.locator('a[href*="item=cold-brew"]').first();
  await expect(coldBrewLink).toBeVisible();
  await coldBrewLink.click();

  await page.waitForURL(/item=cold-brew/);
  await page.waitForLoadState('domcontentloaded');

  // Confirm the URL contains the cold-brew order query parameter
  expect(page.url()).toContain('item=cold-brew');
});

test('Menu — page structure and navigation links', async ({ page }) => {
  const response = await page.goto(MENU_URL);
  expect(response?.status()).toBe(200);
  await page.waitForLoadState('domcontentloaded');

  // Verify the site logo/brand link
  await expect(page.getByRole('link', { name: '☕ Bean & Brew' })).toBeVisible();

  // Verify navigation links are present with correct hrefs
  const nav = page.getByRole('navigation');
  await expect(nav.getByRole('link', { name: 'Home', exact: true })).toHaveAttribute('href', '/');
  await expect(nav.getByRole('link', { name: 'Menu', exact: true })).toHaveAttribute('href', '/menu');
  await expect(nav.getByRole('link', { name: 'About', exact: true })).toHaveAttribute('href', '/about');
  await expect(nav.getByRole('link', { name: 'My orders', exact: true })).toHaveAttribute('href', '/orders');
  await expect(nav.getByRole('link', { name: 'Feedback', exact: true })).toHaveAttribute('href', '/feedback');

  // Verify the footer text
  await expect(page.getByRole('contentinfo')).toHaveText('© Bean & Brew — a demo app.');
});

test('Menu — all drink items and their Customize link hrefs', async ({ page }) => {
  const response = await page.goto(MENU_URL);
  expect(response?.status()).toBe(200);
  await page.waitForLoadState('domcontentloaded');

  // Verify drink names are visible using exact: true to avoid strict-mode violations
  // (many subtitles also contain the word "espresso")
  await expect(page.getByText('Espresso', { exact: true })).toBeVisible();
  await expect(page.getByText('Cortado', { exact: true })).toBeVisible();
  await expect(page.getByText('Flat White', { exact: true })).toBeVisible();
  await expect(page.getByText('Latte', { exact: true })).toBeVisible();
  await expect(page.getByText('Cappuccino', { exact: true })).toBeVisible();
  await expect(page.getByText('Mocha', { exact: true })).toBeVisible();
  await expect(page.getByText('Cold Brew', { exact: true })).toBeVisible();
  await expect(page.getByText('Chai Latte', { exact: true })).toBeVisible();

  // Verify Customize link hrefs for each drink
  await expect(page.locator('a[href="/order?item=espresso"]')).toBeVisible();
  await expect(page.locator('a[href="/order?item=cortado"]')).toBeVisible();
  await expect(page.locator('a[href="/order?item=flat-white"]')).toBeVisible();
  await expect(page.locator('a[href="/order?item=latte"]')).toBeVisible();
  await expect(page.locator('a[href="/order?item=cappuccino"]')).toBeVisible();
  await expect(page.locator('a[href="/order?item=mocha"]')).toBeVisible();
  await expect(page.locator('a[href="/order?item=cold-brew"]')).toBeVisible();
  await expect(page.locator('a[href="/order?item=chai"]')).toBeVisible();
});