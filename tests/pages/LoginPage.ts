import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {

  constructor(page: Page, test: any) {
    super(page, test);
  }

  async goto() {
  await this.page.goto(
    process.env.BASE_URL || 'https://workforce.noonstg.partners/en?project=PRJ1455'
  );
  await this.ensureCorrectProject();
}

  async enterEmail(email: string) {
    await this.page.getByPlaceholder('Enter your phone number or email').fill(email);
    await this.page.locator('button[type="submit"]').click();
    await this.waitForPageLoad();
  }

  async selectEmailOTP() {
    // Typically automatic in Noon workforce, but clicking if necessary
    await this.page.getByText('Continue with email OTP').click().catch(() => {});
    await this.waitForPageLoad();
  }

  async enterOTP(otp: string) {
    const otpInput = this.page.locator('input[maxlength="6"]');
    await otpInput.waitFor({ state: 'visible', timeout: 10000 });
    await otpInput.fill(otp);
    await this.page.locator('button[type="submit"]').click();
    await this.waitForPageLoad();
  }

  async getErrorMessage(): Promise<string> {
    return this.ai('Get the text of the error message');
  }
}