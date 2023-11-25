import { test, expect } from '@playwright/test';

test('Register account with invalid email format', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Sign up' }).click();
    await page.getByPlaceholder('name@company.com').click();
    await page.getByPlaceholder('name@company.com').fill('invalidemailformat');
    await page.getByPlaceholder('name@company.com').press('Tab');
    await page.getByPlaceholder('First name').fill('invalid');
    await page.getByPlaceholder('First name').press('Tab');
    await page.getByPlaceholder('Last name').fill('emailformat');
    await page.getByPlaceholder('Last name').press('Tab');
    await page.getByPlaceholder('••••••••').fill('123456');
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page.getByText('Create event')).toBeHidden();
  });

  test('Register account with weak password', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Sign up' }).click();
    await page.getByPlaceholder('name@company.com').click();
    await page.getByPlaceholder('name@company.com').fill('weakpass@mail.com');
    await page.getByPlaceholder('name@company.com').press('Tab');
    await page.getByPlaceholder('First name').fill('Weak');
    await page.getByPlaceholder('First name').press('Tab');
    await page.getByPlaceholder('Last name').fill('Pass');
    await page.getByPlaceholder('Last name').press('Tab');
    await page.getByPlaceholder('••••••••').fill('12345');
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page.getByText('Password should be at least 6 characters long')).toBeVisible();
  });

test('Register new account with valid credentials and delete the user', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Sign up' }).click();
    await page.getByPlaceholder('name@company.com').click();
    await page.getByPlaceholder('name@company.com').fill('registertest@gmail.com');
    await page.getByPlaceholder('name@company.com').press('Tab');
    await page.getByPlaceholder('First name').fill('Register');
    await page.getByPlaceholder('First name').press('Tab');
    await page.getByPlaceholder('Last name').fill('Test');
    await page.getByPlaceholder('Last name').press('Tab');
    await page.getByPlaceholder('••••••••').fill('123456');
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page.getByText('Create event')).toBeVisible();
    await page.getByRole('button', { name: 'settings logo' }).click();
    await page.getByRole('button', { name: 'delete_user' }).click();
    await expect(page.getByRole('heading', { name: 'Sign up with a new account' })).toBeVisible();
  });