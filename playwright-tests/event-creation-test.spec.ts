import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByPlaceholder('name@company.com').click();
    await page.getByPlaceholder('name@company.com').fill('teacherwhisperfeed@gmail.com');
    await page.getByPlaceholder('name@company.com').press('Tab');
    await page.getByPlaceholder('••••••••').fill('admin11!');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
});

test('Create event', async ({ page }) => {
    await page.getByRole('button', { name: 'Create event' }).click();
    await expect(page.getByRole('heading', { name: 'Create event' })).toBeVisible();
    await page.getByPlaceholder('Enter a name - min. 5').click();
    await page.getByPlaceholder('Enter a name - min. 5').fill('testipw');
    await page.getByLabel('Type:').selectOption('Event');
    await page.locator('#defaultModal').getByRole('button', { name: 'Create event' }).click();
    await page.getByRole('button', { name: 'Close modal' }).click();
    await expect(page.getByText('testipw')).toBeVisible();
    await page.getByRole('button', { name: 'Remove Event' }).click();
});

test('Invalid event name', async ({ page }) => {
    await page.getByRole('button', { name: 'Create event' }).click();
    await page.getByLabel('Type:').selectOption('Course');
    await page.getByPlaceholder('Enter a name - min. 5').click();
    await page.getByPlaceholder('Enter a name - min. 5').fill('äää');
    await page.locator('#defaultModal').getByRole('button', { name: 'Create event' }).click();
    await page.getByRole('button', { name: 'Close modal' }).click();
    await expect(page.getByText('äää')).toBeHidden();
});

test('Check invite code', async ({ page }) => {
    await page.getByRole('button', { name: 'Create event' }).click();
    await expect(page.getByRole('heading', { name: 'Create event' })).toBeVisible();
    await page.getByPlaceholder('Enter a name - min. 5').click();
    await page.getByPlaceholder('Enter a name - min. 5').fill('testipw');
    await page.getByLabel('Type:').selectOption('Event');
    await page.locator('#defaultModal').getByRole('button', { name: 'Create event' }).click();
    await page.getByRole('button', { name: 'Close modal' }).click();
    await expect(page.getByText('testipw')).toBeVisible();
    await expect(page.locator('css=.invcode').first()).not.toHaveText('');
    await page.getByRole('button', { name: 'Remove Event' }).click();
});

test.afterEach(async ({ page }) => {
    await page.getByRole('button', { name: 'Delete all keys' }).click();
});