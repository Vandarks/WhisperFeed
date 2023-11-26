import { test, expect, Fixtures } from '@playwright/test';

test('create_event_and_save_key', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByTestId('email_input').click();
  await page.getByTestId('email_input').fill('play@test.fi');
  await page.getByTestId('email_input').press('Tab');
  await page.getByTestId('password_input').fill('admin11!');
  await page.getByTestId('password_input').press('Enter');
  await page.getByTestId('create_event_button').click();
  await page.getByTestId('event_name_input').click();
  await page.getByTestId('event_name_input').fill('Feedback Test');
  await page.getByTestId('event_type_selection').selectOption('Event');
  await page.getByTestId('create_event_modal_button').click();
  await page.getByTestId('close_modal_button').click();
  await expect(page.getByText('Feedback Test')).toBeVisible();
  let key = await page.locator('css=.invcode').first().innerText();
  await page.getByTestId('sign_out_button').click();

  await page.goto('http://localhost:3000/');
  await page.getByTestId('email_input').click();
  await page.getByTestId('email_input').fill('wright@test.fi');
  await page.getByTestId('email_input').press('Tab');
  await page.getByTestId('password_input').fill('admin11');
  await page.getByTestId('password_input').press('Enter');
  await page.getByTestId('join_event_input').click();
  await page.getByTestId('join_event_input').fill(key);
  await page.getByTestId('join_event_button').click();
  await expect(page.getByText('Feedback Test')).toBeVisible();
  await page.getByTestId('radio_button_good').click();
  await page.getByTestId('feedback_area').click();
  await page.getByTestId('feedback_area').fill('Works!');
  await page.getByTestId('send_feedback_button').click();
  await page.getByTestId('sign_out_button').click();

  await page.goto('http://localhost:3000/');
  await page.getByTestId('email_input').click();
  await page.getByTestId('email_input').fill('play@test.fi');
  await page.getByTestId('email_input').press('Tab');
  await page.getByTestId('password_input').fill('admin11!');
  await page.getByTestId('password_input').press('Enter');
  await page.getByTestId('show_feedback_button').click();
  await expect(page.getByTestId('modal_good_text')).toHaveText('Good: 1');
  await expect(page.getByTestId('modal_review_text')).toHaveText('Works!'); 
  await page.getByTestId('close_modal_button').click();
  await page.getByTestId('remove_event_button').click();
  await expect(page.getByText('Feedback Test')).toBeHidden();
});