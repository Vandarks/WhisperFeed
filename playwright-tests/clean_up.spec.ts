import { test, expect } from '@playwright/test';
import { login } from './loginconfig';
import { SourceTextModule } from 'vm';

test("clear all", async ({ page }) => {
    //poistaa kaikki tapahtumat testikäyttäjiltä
    let hidden = false;
    page.goto('http://localhost:3000/');
    await login(page, "tester@test.fi", "admin11");
    await expect(page.getByTestId('create_event_button')).toBeVisible();
    while(!hidden){
        try {
            await page.waitForSelector('[data-testid="remove_event_button"]', { state: 'attached', timeout: 5000 });
            await page.getByTestId('remove_event_button').first().click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            await expect(page.getByTestId('create_event_button')).toBeVisible();
            console.log("not hidden");
        } catch (error) {
            hidden = true;
            console.log("hidden");
        }
    }
    hidden = false;
    await page.getByTestId('sign_out_button').click();
    await page.goto('http://localhost:3000/');
    await login(page, "teacherwhisperfeed@gmail.com", "admin11!");
    await expect(page.getByTestId('create_event_button')).toBeVisible();
    while(!hidden){
        try {
            await page.waitForSelector('[data-testid="remove_event_button"]', { state: 'attached', timeout: 5000 });
            await page.getByTestId('remove_event_button').first().click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            await expect(page.getByTestId('create_event_button')).toBeVisible();
            console.log("not hidden");
        } catch (error) {
            hidden = true;
            console.log("hidden");
        }
    }
    hidden = false;
    await page.getByTestId('sign_out_button').click();
    await page.goto('http://localhost:3000/');
    await login(page, "play@test.fi", "admin11!");
    await expect(page.getByTestId('create_event_button')).toBeVisible();
    while(!hidden){
        try {
            await page.waitForSelector('[data-testid="remove_event_button"]', { state: 'attached', timeout: 5000 });
            await page.getByTestId('remove_event_button').first().click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            await expect(page.getByTestId('create_event_button')).toBeVisible();
            console.log("not hidden");
        } catch (error) {
            hidden = true;
            console.log("hidden");
        }
    }
    hidden = false;
    await page.getByTestId('sign_out_button').click();
    await page.goto('http://localhost:3000/');
    await login(page, "admin@test.fi", "admin11!");
    await expect(page.getByTestId('create_event_button')).toBeVisible();
    while(!hidden){
        try {
            await page.waitForSelector('[data-testid="remove_event_button"]', { state: 'attached', timeout: 5000 });
            await page.getByTestId('remove_event_button').first().click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            await expect(page.getByTestId('create_event_button')).toBeVisible();
            console.log("not hidden");
        } catch (error) {
            hidden = true;
            console.log("hidden");
        }
    }
    await page.getByTestId('sign_out_button').click();

    //poistaa tarvittava testikäyttäjät
    await page.goto('http://localhost:3000/');
    await login(page, "e2e@test,fii", "admin11!");
    if(await page.isVisible('data-testid=settings_button')){
        await page.getByTestId('settings_button').click();
        await page.getByTestId('delete_user_button').click();
    }
    await page.goto('http://localhost:3000/');
    await expect(page.getByTestId('sign_in_header')).toBeVisible();
    await page.getByTestId('email_input').click();
    await page.getByTestId('email_input').fill('registertest@gmail.com');
    await page.getByTestId('password_input').click();
    await page.getByTestId('password_input').fill('admin11!');
    await page.getByTestId('sign_in_button').click();
    if(await page.isVisible('data-testid=settings_button')){
        await page.getByTestId('settings_button').click();
        await page.getByTestId('delete_user_button').click();
    }
    
});
