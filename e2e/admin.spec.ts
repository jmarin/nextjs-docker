// e2e/admin.spec.ts
// Playwright E2E test for the /admin UI
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

const waitForAdminUILoaded = async (page) => {
  await expect(page.getByRole('button', { name: /Add User/i })).toBeEnabled();
  await expect(page.getByRole('button', { name: /Add Role/i })).toBeEnabled();
};

test.describe('/admin UI', () => {
  test('should load the admin page and display users and roles', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await waitForAdminUILoaded(page);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Admin Panel/i);
    await expect(page.getByRole('heading', { name: /Users/i, level: 2 })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Roles/i, level: 2 })).toBeVisible();
  });

  test('should add a new user and display it in the table', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await waitForAdminUILoaded(page);
    const username = `TestUser_${Date.now()}`;
    await page.getByPlaceholder('Username').fill(username);
    await page.getByPlaceholder('Password').fill('pw12345!');
    await page.getByPlaceholder('Email').fill(`${username}@test.com`);
    const select = page.locator('select');
    await select.selectOption({ index: 1 });
    await page.getByRole('button', { name: /Add User/i }).click();
    await waitForAdminUILoaded(page);
    // Users table is now the second table
    await expect(page.locator('table').nth(1)).toContainText(username);
  });

  test('should add a new role and display it in the table', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await waitForAdminUILoaded(page);
    const role = `TestRole_${Date.now()}`;
    await page.getByPlaceholder('Role name').fill(role);
    await page.getByRole('button', { name: /Add Role/i }).click();
    await waitForAdminUILoaded(page);
    // Roles table is now the first table
    await expect(page.locator('table').first()).toContainText(role);
  });

  test('should add and then delete a user from the table', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await waitForAdminUILoaded(page);
    const username = `DeleteUser_${Date.now()}`;
    await page.getByPlaceholder('Username').fill(username);
    await page.getByPlaceholder('Password').fill('pw12345!');
    await page.getByPlaceholder('Email').fill(`${username}@test.com`);
    const select = page.locator('select');
    await select.selectOption({ index: 1 });
    await page.getByRole('button', { name: /Add User/i }).click();
    await waitForAdminUILoaded(page);
    // Users table is now the second table
    const row = page.locator('table').nth(1).locator('tr').filter({ hasText: username });
    await expect(row).toBeVisible();
    await row.scrollIntoViewIfNeeded();
    const deleteButton = row.getByRole('button', { name: /Delete/i });
    await expect(deleteButton).toBeEnabled();
    await deleteButton.click();
    await waitForAdminUILoaded(page);
    await expect(row).not.toBeVisible();
  });

  test('should delete a role from the table', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await waitForAdminUILoaded(page);
    const role = `DeleteRole_${Date.now()}`;
    await page.getByPlaceholder('Role name').fill(role);
    await page.getByRole('button', { name: /Add Role/i }).click();
    await waitForAdminUILoaded(page);
    // Roles table is now the first table
    const row = page.locator('table').first().locator('tr').filter({ hasText: role });
    await expect(row).toBeVisible();
    await row.scrollIntoViewIfNeeded();
    const deleteButton = row.getByRole('button', { name: /Delete/i });
    await expect(deleteButton).toBeEnabled();
    await deleteButton.click();
    await waitForAdminUILoaded(page);
    await expect(row).not.toBeVisible();
  });
});
