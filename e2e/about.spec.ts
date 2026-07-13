import { test, expect } from '@playwright/test';

const BASE_URL = 'https://coffee-shop.cloudflare-cdnjs-entrypoint.workers.dev';
const ABOUT_URL = `${BASE_URL}/about`;

test('About — verify story sections are rendered', async ({ page }) => {
  const response = await page.goto(ABOUT_URL);
  expect(response?.status()).toBe(200);
  await page.waitForLoadState('domcontentloaded');

  // Verify 'OUR STORY' section heading is visible
  await expect(page.getByText('OUR STORY')).toBeVisible();

  // Verify the main heading is visible
  await expect(page.getByRole('heading', { name: 'Small shop, big beans.' })).toBeVisible();

  // Verify the global navigation is present
  await expect(page.getByRole('navigation')).toBeVisible();

  // Verify nav links are present
  await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Menu', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'About', exact: true })).toBeVisible();

  // Verify the 'Order a drink' CTA link is present
  const orderLink = page.getByRole('link', { name: 'Order a drink' });
  await expect(orderLink).toBeVisible();

  // Click 'Order a drink' and confirm navigation to /menu
  await orderLink.click();
  await page.waitForURL(`${BASE_URL}/menu`);
  await page.waitForLoadState('domcontentloaded');
  expect(page.url()).toContain('/menu');
});

test('About — navigate to Feedback via "Say hello" link', async ({ page }) => {
  const response = await page.goto(ABOUT_URL);
  expect(response?.status()).toBe(200);
  await page.waitForLoadState('domcontentloaded');

  // Verify the 'Say hello' link is present
  const sayHelloLink = page.getByRole('link', { name: 'Say hello' });
  await expect(sayHelloLink).toBeVisible();

  // Click 'Say hello' and confirm navigation to /feedback
  await sayHelloLink.click();
  await page.waitForURL(`${BASE_URL}/feedback`);
  await page.waitForLoadState('domcontentloaded');
  expect(page.url()).toContain('/feedback');
});

test('About — story section content blocks are rendered', async ({ page }) => {
  const response = await page.goto(ABOUT_URL);
  expect(response?.status()).toBe(200);
  await page.waitForLoadState('domcontentloaded');

  // Verify 'The beans' section
  await expect(page.getByText('The beans')).toBeVisible();
  await expect(page.getByText('Traceable to the farm')).toBeVisible();

  // Verify 'The roast' section
  await expect(page.getByText('The roast')).toBeVisible();
  await expect(page.getByText('Small batches, weekly')).toBeVisible();

  // Verify 'The people' section
  await expect(page.getByText('The people')).toBeVisible();
  await expect(page.getByText('Ten baristas, one dog')).toBeVisible();

  // Verify footer
  await expect(page.getByRole('contentinfo')).toHaveText('© Bean & Brew — a demo app.');
});

test('About — nav links have correct hrefs', async ({ page }) => {
  const response = await page.goto(ABOUT_URL);
  expect(response?.status()).toBe(200);
  await page.waitForLoadState('domcontentloaded');

  const nav = page.getByRole('navigation');

  await expect(nav.getByRole('link', { name: 'Home', exact: true })).toHaveAttribute('href', '/');
  await expect(nav.getByRole('link', { name: 'Menu', exact: true })).toHaveAttribute('href', '/menu');
  await expect(nav.getByRole('link', { name: 'About', exact: true })).toHaveAttribute('href', '/about');
  await expect(nav.getByRole('link', { name: 'My orders', exact: true })).toHaveAttribute('href', '/orders');
  await expect(nav.getByRole('link', { name: 'Feedback', exact: true })).toHaveAttribute('href', '/feedback');
});

test('About — CTA links have correct hrefs', async ({ page }) => {
  const response = await page.goto(ABOUT_URL);
  expect(response?.status()).toBe(200);
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main');

  await expect(main.getByRole('link', { name: 'Order a drink' })).toHaveAttribute('href', '/menu');
  await expect(main.getByRole('link', { name: 'Say hello' })).toHaveAttribute('href', '/feedback');
});