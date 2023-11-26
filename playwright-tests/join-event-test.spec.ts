import { test, expect } from '@playwright/test';

test.beforeEach('Sign in before each test', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page.getByTestId('sign_in_header')).toBeVisible();
    await page.getByTestId('email_input').click();
    await page.getByTestId('email_input').fill('teacherwhisperfeed@gmail.com');
    await page.getByTestId('email_input').press('Tab');
    await page.getByTestId('password_input').fill('admin11!');
    await page.getByTestId('sign_in_button').click();
    await expect(page.getByTestId('create_event_button')).toBeVisible();
});

test('Join Event', async ({ page }) => {
    await page.getByTestId('join_event_input').click();
    await page.getByTestId('join_event_input').fill('IVJPq9');
    await page.getByTestId('join_event_button').click();
    await expect(page.getByText('PlayWright Test')).toBeVisible();
});

test('Join Event with invalid key', async ({ page }) => {
    await page.getByTestId('join_event_input').click();
    await page.getByTestId('join_event_input').fill('Yl2TW');
    await page.getByTestId('join_event_button').click();
    await expect(page.getByText('PlayWright Test')).toBeHidden();
});

test.afterEach(async ({ page }) => {
    await page.getByRole('button', { name: 'Delete all keys' }).click();
});