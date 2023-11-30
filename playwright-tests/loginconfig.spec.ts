
/*
create a function for this and export it for others to use

  await page.getByTestId('email_input').click();
  await page.getByTestId('email_input').fill(email1);
  await page.getByTestId('email_input').press('Tab');
  await page.getByTestId('password_input').fill(pass1);
  await page.getByTestId('password_input').press('Enter');


*/

import { Page } from "@playwright/test"

const login = async (page: Page, email: string, password: string) => {
  await page.getByTestId('email_input').click();
  await page.getByTestId('email_input').fill(email);
  await page.getByTestId('email_input').press('Tab');
  await page.getByTestId('password_input').fill(password);
  await page.getByTestId('password_input').press('Enter');
}

export { login }