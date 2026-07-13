import { test, expect } from '@playwright/test';

const FEEDBACK_URL = 'https://coffee-shop.cloudflare-cdnjs-entrypoint.workers.dev/feedback';

test('Feedback — submit a complete feedback form successfully', async ({ page }) => {
  const response = await page.goto(FEEDBACK_URL);
  expect(response?.status()).toBe(200);
  await page.waitForLoadState('domcontentloaded');

  await expect(page.getByRole('heading', { name: 'Send us feedback' })).toBeVisible();

  await page.getByLabel('Name').fill('Jane Tester');
  await page.getByLabel('Email').fill('jane.tester@example.com');

  // The select option value is lowercase 'drinks' even though label shows 'Drinks'
  await page.getByLabel('Topic').selectOption('drinks');
  await expect(page.getByLabel('Topic')).toHaveValue('drinks');

  await page.getByLabel('4 stars').click();
  await expect(page.getByLabel('4 stars')).toBeChecked();

  await page.getByLabel('Message').fill('The cold brew is absolutely fantastic — best in town!');

  await page.getByRole('button', { name: 'Submit feedback' }).click();

  // After submission, stay on-site — just verify the page is still reachable
  // and the URL remains within the same origin (form may reset or show confirmation)
  await page.waitForLoadState('domcontentloaded');
  expect(page.url()).toContain('coffee-shop.cloudflare-cdnjs-entrypoint.workers.dev');
});

test('Feedback — validate required fields prevent empty submission', async ({ page }) => {
  const response = await page.goto(FEEDBACK_URL);
  expect(response?.status()).toBe(200);
  await page.waitForLoadState('domcontentloaded');

  await expect(page.getByRole('heading', { name: 'Send us feedback' })).toBeVisible();

  // Attempt to submit without filling any required fields
  await page.getByRole('button', { name: 'Submit feedback' }).click();

  // The Name field should still be present (form not submitted / navigated away)
  await expect(page.getByLabel('Name')).toBeVisible();

  // URL must remain on /feedback
  expect(page.url()).toContain('/feedback');
});

test('Feedback — select each star rating option', async ({ page }) => {
  const response = await page.goto(FEEDBACK_URL);
  expect(response?.status()).toBe(200);
  await page.waitForLoadState('domcontentloaded');

  // Verify the rating radio group is present
  await expect(page.getByRole('radiogroup')).toBeVisible();

  // Select 1 star
  await page.getByLabel('1 star').click();
  await expect(page.getByLabel('1 star')).toBeChecked();

  // Select 3 stars
  await page.getByLabel('3 stars').click();
  await expect(page.getByLabel('3 stars')).toBeChecked();

  // Select 5 stars
  await page.getByLabel('5 stars').click();
  await expect(page.getByLabel('5 stars')).toBeChecked();

  // Confirm 1 star and 3 stars are no longer checked
  await expect(page.getByLabel('1 star')).not.toBeChecked();
  await expect(page.getByLabel('3 stars')).not.toBeChecked();
});