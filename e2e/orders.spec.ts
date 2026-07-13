import { test, expect } from '@playwright/test';

const BASE_URL = 'https://coffee-shop.cloudflare-cdnjs-entrypoint.workers.dev';

test('My Orders — empty state and navigate to Menu', async ({ page }) => {
  // Navigate to the My Orders page and assert HTTP 200
  const response = await page.goto(`${BASE_URL}/orders`);
  expect(response?.status()).toBe(200);
  await page.waitForLoadState('domcontentloaded');

  // Verify the 'My orders' page heading is visible
  await expect(page.getByRole('heading', { name: 'My orders', level: 2 })).toBeVisible();

  // Verify the empty-state alert text is visible
  await expect(page.getByRole('alert')).toContainText('No orders yet');
  await expect(page.getByRole('alert')).toContainText("You haven't placed any orders in this browser.");

  // Verify the 'Start an order' link is present in the main content
  const startOrderLink = page.getByRole('link', { name: 'Start an order', exact: true });
  await expect(startOrderLink).toBeVisible();

  // Assert the href of the 'Start an order' link points to /menu
  await expect(startOrderLink).toHaveAttribute('href', '/menu');

  // Click 'Start an order' and confirm navigation to /menu
  await startOrderLink.click();
  await page.waitForURL(`${BASE_URL}/menu`);
  await page.waitForLoadState('domcontentloaded');

  // Confirm the browser URL has changed to /menu
  expect(page.url()).toContain('/menu');
});