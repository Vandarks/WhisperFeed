import { test, expect } from '@playwright/test';

test.beforeEach('Sign in before each test', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('combobox').selectOption('fi');
    await expect(page.getByTestId('sign_in_header')).toBeVisible();
    await page.getByTestId('email_input').click();
    await page.getByTestId('email_input').fill('teacherwhisperfeed@gmail.com');
    await page.getByTestId('email_input').press('Tab');
    await page.getByTestId('password_input').fill('admin11!');
    await page.getByTestId('sign_in_button').click();
    await expect(page.getByTestId('create_event_button')).toBeVisible();
});

test('Create event - valid details', async ({ page }) => {
    await page.getByTestId('create_event_button').click();
    await expect(page.getByTestId('create_event_header')).toBeVisible();
    await page.getByTestId('event_name_input').click();
    await page.getByTestId('event_name_input').fill('testipw');
    await page.getByTestId('event_type_selection').selectOption('Event');
    await page.getByTestId('create_event_modal_button').click();
    await page.getByTestId('close_modal_button').click();
    await expect(page.getByText('testipw')).toBeVisible();
    await page.getByTestId('remove_event_button').click();
});

test('Create event - invalid name', async ({ page }) => {
    await page.getByTestId('create_event_button').click();
    await expect(page.getByTestId('create_event_header')).toBeVisible();
    await page.getByTestId('event_name_input').click();
    await page.getByTestId('event_name_input').fill('äää');
    await page.getByTestId('event_type_selection').selectOption('Course');
    await page.getByTestId('create_event_modal_button').click();
    await page.getByTestId('close_modal_button').click();
    await expect(page.getByText('äää')).toBeHidden();
});

test('Check invite code', async ({ page }) => {
    await page.getByTestId('create_event_button').click();
    await expect(page.getByTestId('create_event_header')).toBeVisible();
    await page.getByTestId('event_name_input').click();
    await page.getByTestId('event_name_input').fill('testipw');
    await page.getByTestId('event_type_selection').selectOption('Event');
    await page.getByTestId('create_event_modal_button').click();
    await page.getByTestId('close_modal_button').click();
    await expect(page.getByText('testipw')).toBeVisible();
    await expect(page.locator('css=.invcode').first()).not.toHaveText('');
    await page.getByTestId('remove_event_button').click();
});

test.afterEach(async ({ page }) => {
    await page.getByRole('button', { name: 'Delete all keys' }).click();
});