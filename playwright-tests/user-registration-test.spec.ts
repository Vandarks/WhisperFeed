import { test, expect } from '@playwright/test';

test('Register account with invalid email format', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.getByTestId('sign_in_header')).toBeVisible();
  await page.getByTestId('sign_up_link').click();
  await expect(page.getByTestId('sign_up_header')).toBeVisible();
  await page.getByTestId('email_input').click();
  await page.getByTestId('email_input').fill('invalidemailformat');
  await page.getByTestId('email_input').press('Tab');
  await page.getByTestId('first_name_input').fill('invalid');
  await page.getByTestId('first_name_input').press('Tab');
  await page.getByTestId('last_name_input').fill('emailformat');
  await page.getByTestId('last_name_input').press('Tab');
  await page.getByTestId('password_input').fill('123456');
  await page.getByTestId('sign_up_button').click();
  await expect(page.getByTestId('create_event_button')).toBeHidden();
});

test('Register account with weak password', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.getByTestId('sign_in_header')).toBeVisible();
  await page.getByTestId('sign_up_link').click();
  await expect(page.getByTestId('sign_up_header')).toBeVisible();
  await page.getByTestId('email_input').click();
  await page.getByTestId('email_input').fill('weakpass@gmail.com');
  await page.getByTestId('email_input').press('Tab');
  await page.getByTestId('first_name_input').fill('Weak');
  await page.getByTestId('first_name_input').press('Tab');
  await page.getByTestId('last_name_input').fill('Password');
  await page.getByTestId('last_name_input').press('Tab');
  await page.getByTestId('password_input').fill('12345');
  await page.getByTestId('sign_up_button').click();
  await expect(page.getByText('Password should be at least 6 characters long')).toBeVisible();
});

test('Register new account with valid credentials and delete the user', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.getByTestId('sign_in_header')).toBeVisible();
  await page.getByTestId('sign_up_link').click();
  await expect(page.getByTestId('sign_up_header')).toBeVisible();
  await page.getByTestId('email_input').click();
  await page.getByTestId('email_input').fill('registertest@gmail.com');
  await page.getByTestId('email_input').press('Tab');
  await page.getByTestId('first_name_input').fill('Register');
  await page.getByTestId('first_name_input').press('Tab');
  await page.getByTestId('last_name_input').fill('Test');
  await page.getByTestId('last_name_input').press('Tab');
  await page.getByTestId('password_input').fill('123456');
  await page.getByTestId('sign_up_button').click();
  await expect(page.getByTestId('create_event_button')).toBeVisible();
  await page.getByTestId('settings_button').click();
  await page.getByTestId('delete_user_button').click();
  await expect(page.getByTestId('sign_up_header')).toBeVisible();
});