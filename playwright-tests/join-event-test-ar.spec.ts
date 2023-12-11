import { test, expect } from '@playwright/test';
import { login } from './loginconfig';
import { after } from 'node:test';
import { Page } from '@playwright/test';
let eventKey = '';
const createEvent = async (page: Page) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('combobox').selectOption('ar');
    await expect(page.getByTestId('sign_in_header')).toBeVisible();
    login(page, "admin@test.fi", "admin11!");
    await page.getByTestId('create_event_button').click();
    await expect(page.getByTestId('create_event_header')).toBeVisible();
    await page.getByTestId('event_name_input').click();
    await page.getByTestId('event_name_input').fill('PlayWright Test');
    await page.getByTestId('event_type_selection').selectOption('Event');
    await page.getByTestId('create_event_modal_button').click();
    await page.getByTestId('close_modal_button').click();
    await expect(page.getByText('PlayWright Test')).toBeVisible();
    eventKey = await page.locator('css=.invcode').first().innerText();
    await page.getByTestId('sign_out_button').click();
    await page.goto('http://localhost:3000/');
    await page.getByRole('combobox').selectOption('ar');
    await expect(page.getByTestId('sign_in_header')).toBeVisible();
    login(page, "teacherwhisperfeed@gmail.com", "admin11!");
    await expect(page.getByTestId('create_event_button')).toBeVisible();
}


test('Join Event', async ({ page }) => {

    //Join an event with valid event key
    await createEvent(page);
    await page.getByTestId('join_event_input').click();
    await page.getByTestId('join_event_input').fill(eventKey);
    await page.getByTestId('join_event_button').click();
    await expect(page.getByText('PlayWright Test')).toBeVisible();
    await page.getByTestId('sign_out_button').click();
    await deleteEvent(page);

    //Tries to join an event with invalid event key
    await createEvent(page);
    await page.getByTestId('join_event_input').click();
    await page.getByTestId('join_event_input').fill('Yl2TW');
    await page.getByTestId('join_event_button').click();
    await expect(page.getByText('PlayWright Test')).toBeHidden();
    await page.getByTestId('sign_out_button').click();
    await deleteEvent(page);
});

const deleteEvent = async (page: Page) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('combobox').selectOption('ar');
    await expect(page.getByTestId('sign_in_header')).toBeVisible();
    login(page, "admin@test.fi", "admin11!");
    await expect(page.getByText('PlayWright Test')).toBeVisible();
    await page.getByTestId('remove_event_button').click();
    await expect(page.getByText('PlayWright Test')).toBeHidden();
    let hidden = false
    while(hidden == false){
        await page.waitForTimeout(2000);
        await page.goto('http://localhost:3000/');
        if(await page.locator('text=Playwright Test').isHidden()){
            hidden = true
        } else {
            await page.getByTestId('remove_event_button').first().click();
        }
    }
    await page.getByTestId('sign_out_button').click();
}
