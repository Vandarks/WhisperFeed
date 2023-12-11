import { test, expect } from '@playwright/test';
import { login } from './loginconfig';


test('end-to-end-test', async ({ page }) => {
    //Sign up
    await page.goto('http://localhost:3000/');
    await page.getByRole('combobox').selectOption('ar');
    await page.getByTestId('sign_up_link').click();
    await page.getByTestId('email_input').click();
    await page.getByTestId('email_input').fill('e2e@test.fi');
    await page.getByTestId('email_input').press('Tab');
    await page.getByTestId('first_name_input').fill('End');
    await page.getByTestId('first_name_input').press('Tab');
    await page.getByTestId('last_name_input').fill('ToEnd');
    await page.getByTestId('last_name_input').press('Tab');
    await page.getByTestId('password_input').fill('admin11!');
    await page.getByTestId('sign_up_button').click();

    //Create event, save invite code and sign out
    await page.getByTestId('create_event_button').click();
    await page.getByTestId('event_name_input').click();
    await page.getByTestId('event_name_input').fill('End-to-end Test');
    await page.getByTestId('event_type_selection').selectOption('Event');
    await page.getByTestId('create_event_modal_button').click();
    await page.getByTestId('close_modal_button').click();
    await expect(page.getByText('End-to-end Test')).toBeVisible();
    let key = await page.locator('css=.invcode').first().innerText();
    await page.getByTestId('sign_out_button').click();
    await page.getByTestId('sign_in_link').click();

    //Sign in with new user
    login(page, "tester@test.fi", "admin11");

    //Join event with invite code
    await page.getByTestId('join_event_input').click();
    await page.getByTestId('join_event_input').fill(key);
    await page.getByTestId('join_event_button').click();
    await expect(page.getByText('End-to-end Test')).toBeVisible();

    //Give feedback
    await page.getByTestId('radio_button_good').click();
    await page.getByTestId('feedback_area').click();
    await page.getByTestId('feedback_area').fill('Works!');
    await page.getByTestId('send_feedback_button').click();
    await page.getByTestId('sign_out_button').click();

    //Sign in with event creator
    login(page, "e2e@test.fi", "admin11!");

    // check feedback
    await page.getByTestId('show_feedback_button').click();
    await expect(page.getByTestId('modal_good_text')).toHaveText('جيد: 1');
    await expect(page.getByTestId('modal_review_text')).toHaveText('Works!');
    await page.getByTestId('close_modal_button').click();
    await page.getByTestId('remove_event_button').click();
    await expect(page.getByText('End-to-end Test')).toBeHidden();

    //Delete user
    await page.getByTestId('settings_button').click();
    await page.getByTestId('delete_user_button').click();
    await expect(page.getByTestId('sign_in_header')).toBeVisible();

});
