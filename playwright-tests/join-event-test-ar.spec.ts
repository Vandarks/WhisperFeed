import { test, expect } from '@playwright/test';
import { login } from './loginconfig';

test.beforeEach('Sign in before each test', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('combobox').selectOption('ar');
    await expect(page.getByTestId('sign_in_header')).toBeVisible();
    login(page, "teacherwhisperfeed@gmail.com", "admin11!");
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
    await page.getByTestId('delete_all_keys_button').click();
});