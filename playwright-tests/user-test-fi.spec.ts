import { test, expect } from '@playwright/test';

test.beforeEach('Sign in before each test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('combobox').selectOption('fi');
});

test('Sign in with valid credentials', async ({ page }) => {
  await expect(page.getByTestId('sign_in_header')).toBeVisible();
  await page.getByTestId('email_input').click();
  await page.getByTestId('email_input').fill('teacherwhisperfeed@gmail.com');
  await page.getByTestId('email_input').press('Tab');
  await page.getByTestId('password_input').fill('admin11!');
  await page.getByTestId('sign_in_button').click();
  await expect(page.getByTestId('create_event_button')).toBeVisible();
});

test('Sign out', async ({ page }) => {
  await expect(page.getByTestId('sign_in_header')).toBeVisible();
  await page.getByTestId('email_input').click();
  await page.getByTestId('email_input').fill('teacherwhisperfeed@gmail.com');
  await page.getByTestId('email_input').press('Tab');
  await page.getByTestId('password_input').fill('admin11!');
  await page.getByTestId('sign_in_button').click();
  await expect(page.getByTestId('create_event_button')).toBeVisible();
  await page.getByTestId('sign_out_button').click();
  await expect(page.getByTestId('sign_in_header')).toBeVisible();
});

test('Invalid credentials', async ({ page }) => {
  await expect(page.getByTestId('sign_in_header')).toBeVisible();
  await page.getByTestId('email_input').click();
  await page.getByTestId('email_input').fill('jakakak@gml.com');
  await page.getByTestId('email_input').press('Tab');
  await page.getByTestId('password_input').fill('nonytOntarpeeksipitka11!');
  await page.getByTestId('sign_in_button').click();
  await expect(page.getByText('Invalid username or password')).toBeVisible();
});
