import { test, expect } from '@playwright/test';
import { login } from './loginconfig';

test.beforeEach('Sign in before each test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('combobox').selectOption('fi');
});

test('Sign in with valid credentials', async ({ page }) => {
  await expect(page.getByTestId('sign_in_header')).toBeVisible();
  login(page, "teacherwhisperfeed@gmail.com", "admin11!");
  await expect(page.getByTestId('create_event_button')).toBeVisible();
});

test('Sign out', async ({ page }) => {
  await expect(page.getByTestId('sign_in_header')).toBeVisible();
  login(page, "teacherwhisperfeed@gmail.com", "admin11!");
  await expect(page.getByTestId('create_event_button')).toBeVisible();
  await page.getByTestId('sign_out_button').click();
  await expect(page.getByTestId('sign_in_header')).toBeVisible();
});

test('Invalid credentials', async ({ page }) => {
  await expect(page.getByTestId('sign_in_header')).toBeVisible();
  login(page, "jakakak@gml.com", "nonytOntarpeeksipitka11!");
  await expect(page.getByText('Invalid username or password')).toBeVisible();
});
