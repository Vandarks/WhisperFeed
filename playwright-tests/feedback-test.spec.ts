import { test, expect } from '@playwright/test';
import { login } from './loginconfig';

test('Create event and save key', async ({ page }) => {

  const email1 = "play@test.fi"
  const email2 = "wright@test.fi"
  const pass1 = "admin11!"
  const pass2 = "admin11"

  await page.goto('http://localhost:3000/');
  await expect(page).toHaveTitle('WhisperFeed');

  // login with first user
  login(page, email1, pass1);
  
  // create event
  await page.getByTestId('create_event_button').click();
  await page.getByTestId('event_name_input').click();
  await page.getByTestId('event_name_input').fill('Feedback Test');
  await page.getByTestId('event_type_selection').selectOption('Event');
  await page.getByTestId('create_event_modal_button').click();
  await page.getByTestId('close_modal_button').click();
  await expect(page.getByText('Feedback Test')).toBeVisible();
  let key = await page.locator('css=.invcode').first().innerText();
  console.log("invite code: " + key);
  await page.getByTestId('sign_out_button').click();

  // login with another user
  login(page, email2, pass2);

  // give feedback to event and sign out
  await page.getByTestId('join_event_input').click();
  await page.getByTestId('join_event_input').fill(key);
  await page.getByTestId('join_event_button').click();
  await expect(page.getByText('Feedback Test')).toBeVisible();
  await page.getByTestId('radio_button_good').click();
  await page.getByTestId('feedback_area').click();
  await page.getByTestId('feedback_area').fill('Works!');
  await page.getByTestId('send_feedback_button').click();
  await page.getByTestId('sign_out_button').click();

  // sign in with original user
  login(page, email1, pass1);

  // check feedback
  await page.getByTestId('show_feedback_button').click();
  await expect(page.getByTestId('modal_good_text')).toHaveText('Good: 1');
  await expect(page.getByTestId('modal_review_text')).toHaveText('Works!'); 
  await page.getByTestId('close_modal_button').click();

  // remove event
  await page.getByTestId('remove_event_button').click();

  // await page.getByTestId('remove_event_button').click();
  await expect(page.getByText('Feedback Test')).toBeHidden();
});