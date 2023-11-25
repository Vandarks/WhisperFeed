import { test, expect } from '@playwright/test';

test('Sign in', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByPlaceholder('name@company.com').click();
  await page.getByPlaceholder('name@company.com').fill('teacherwhisperfeed@gmail.com');
  await page.getByPlaceholder('name@company.com').press('Tab');
  await page.getByPlaceholder('••••••••').fill('admin11!');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByText('Create event')).toBeVisible();
});

test('Sign out', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByPlaceholder('name@company.com').click();
  await page.getByPlaceholder('name@company.com').fill('teacherwhisperfeed@gmail.com');
  await page.getByPlaceholder('name@company.com').press('Tab');
  await page.getByPlaceholder('••••••••').fill('admin11!');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Sign in with your account'})).toBeVisible();
});

test('Invalid credentials', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByPlaceholder('name@company.com').click();
  await page.getByPlaceholder('name@company.com').fill('jakakak@gml.com');
  await page.getByPlaceholder('••••••••').click();
  await page.getByPlaceholder('••••••••').fill('nonytOntarpeeksipitka11!');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByText('Invalid username or password')).toBeVisible();
});