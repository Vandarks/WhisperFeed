import { Page } from "@playwright/test"

const login = async (page: Page, email: string, password: string) => {
  await page.getByTestId('email_input').click();
  await page.getByTestId('email_input').fill(email);
  await page.getByTestId('email_input').press('Tab');
  await page.getByTestId('password_input').fill(password);
  await page.getByTestId('sign_in_button').click();
}

export { login }