import { test, expect } from '@playwright/test';
import { login } from './loginconfig';

const loginAsTeacher = async (page: any) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('combobox').selectOption('ar');
    await expect(page.getByTestId('sign_in_header')).toBeVisible();
    login(page, "teacherwhisperfeed@gmail.com", "admin11!");
    await expect(page.getByTestId('create_event_button')).toBeVisible();
}

test('Create event', async ({ page }) => {
    //creates an event with valid details
    await loginAsTeacher(page);
    await page.getByTestId('create_event_button').click();
    await expect(page.getByTestId('create_event_header')).toBeVisible();
    await page.getByTestId('event_name_input').click();
    await page.getByTestId('event_name_input').fill('testipw');
    await page.getByTestId('event_type_selection').selectOption('Event');
    await page.getByTestId('create_event_modal_button').click();
    await page.getByTestId('close_modal_button').click();
    await expect(page.getByText('testipw')).toBeVisible();
    await page.getByTestId('remove_event_button').click();
    await expect(page.getByText('testipw')).toBeHidden();
    let hidden = false
    while(hidden == false){
        await page.goto('http://localhost:3000/');
        if(await page.locator('text=testipw').isHidden()){
            hidden = true
        } else {
            await page.getByTestId('remove_event_button').first().click();
        }
    }

    //tries to create an event with invalid details
    await loginAsTeacher(page);
    await page.getByTestId('create_event_button').click();
    await expect(page.getByTestId('create_event_header')).toBeVisible();
    await page.getByTestId('event_name_input').click();
    await page.getByTestId('event_name_input').fill('äää');
    await page.getByTestId('event_type_selection').selectOption('Course');
    await page.getByTestId('create_event_modal_button').click();
    await page.getByTestId('close_modal_button').click();
    await expect(page.getByText('äää')).toBeHidden();

    //creates an event and checks that the event key is not empty
    await loginAsTeacher(page);
    await page.getByTestId('create_event_button').click();
    await expect(page.getByTestId('create_event_header')).toBeVisible();
    await page.getByTestId('event_name_input').click();
    await page.getByTestId('event_name_input').fill('testipw');
    await page.getByTestId('event_type_selection').selectOption('Event');
    await page.getByTestId('create_event_modal_button').click();
    await page.getByTestId('close_modal_button').click();
    await expect(page.getByText('testipw').first()).toBeVisible();
    await expect(page.locator('css=.invcode').first()).not.toHaveText('');
    await page.getByTestId('remove_event_button').click();
    await expect(page.getByText('testipw')).toBeHidden();
    hidden = false
    while(hidden == false){
        await page.goto('http://localhost:3000/');
        if(await page.locator('text=testipw').isHidden()){
            hidden = true
        } else {
            await page.getByTestId('remove_event_button').first().click();
        }
    }
});