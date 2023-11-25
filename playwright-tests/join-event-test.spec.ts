import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByPlaceholder('name@company.com').click();
    await page.getByPlaceholder('name@company.com').fill('teacherwhisperfeed@gmail.com');
    await page.getByPlaceholder('name@company.com').press('Tab');
    await page.getByPlaceholder('••••••••').fill('admin11!');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
});

test('Join Event', async ({ page }) => {
    await page.getByPlaceholder('Enter event key').click();
    await page.getByPlaceholder('Enter event key').fill('IVJPq9');
    await page.getByRole('button', { name: 'Join event' }).click();
    await expect(page.getByText('PlayWright Test')).toBeVisible();
});

test('Join Event with invalid key', async ({ page }) => {
    await page.getByPlaceholder('Enter event key').click();
    await page.getByPlaceholder('Enter event key').fill('Yl2TW');
    await page.getByRole('button', { name: 'Join event' }).click();
    await expect(page.getByText('PlayWright Test')).toBeHidden();
});

test.afterEach(async ({ page }) => {
    await page.getByRole('button', { name: 'Delete all keys' }).click();
});