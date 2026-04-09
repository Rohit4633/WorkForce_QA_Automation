import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CandidatePage extends BasePage {

  constructor(page: Page, test: any) {
    super(page, test);
  }

  async goto() {
    await this.page.goto('/');
    await this.ensureCorrectProject();
  }

  async clickAddCandidate() {
    await this.page.getByRole('button', { name: 'Add Candidate' }).click();
    await this.page.waitForTimeout(2000);
  }

  async fillFirstName(name: string) {
    await this.page.getByPlaceholder('First name').fill(name);
  }

  async fillLastName(name: string) {
    await this.page.getByPlaceholder('Last name').fill(name);
  }

  async selectCountryCode() {
    await this.page.locator('.MuiAutocomplete-wrapper').first().click();
    await this.page.waitForTimeout(1000);

    const combobox = this.page.getByRole('combobox', { name: 'Personal phone number' });
    await combobox.waitFor({ state: 'visible', timeout: 10000 });
    await combobox.fill('+91');
    await this.page.waitForTimeout(1000);

    const indiaOption = this.page.locator('.MuiListItemDecorator-root > .FlagIcon_flagWrapper__Ip2c9');
    const indiaOptionAlt = this.page.getByRole('option', { name: /india|IN|\+91/i }).first();

    if (await indiaOption.isVisible()) {
      await indiaOption.click();
    } else {
      await indiaOptionAlt.click();
    }
    await this.page.waitForTimeout(500);
  }

  async fillPhoneNumber(phone: string) {
    const phoneInput = this.page.getByRole('textbox', { name: 'Personal phone number' });
    await phoneInput.waitFor({ state: 'visible', timeout: 10000 });
    await phoneInput.fill(phone);
  }

  async selectNationality() {
    const nationality = this.page.getByRole('combobox', { name: 'Nationality' });
    await nationality.waitFor({ state: 'visible', timeout: 10000 });
    await nationality.click();
    await this.page.waitForTimeout(500);
    await nationality.fill('india');
    await this.page.waitForTimeout(1000);
    await this.page.getByRole('option', { name: 'IN India' }).click();
    await this.page.waitForTimeout(500);
  }

  async fillEmiratesId(id: string) {
    const emiratesInput = this.page.getByPlaceholder('123-4567-8901234-5');
    const emiratesInputAlt = this.page.getByLabel('Emirates ID');
    if (await emiratesInput.isVisible()) {
      await emiratesInput.fill(id);
    } else {
      await emiratesInputAlt.fill(id);
    }
  }

  async selectVisaSponsorship(answer: 'Yes' | 'No') {
    await this.page.getByRole('radio', { name: answer }).click();
  }

  async clickCreateProfile() {
    await this.page.getByRole('button', { name: 'Create Profile' }).click();
    await this.page.waitForTimeout(3000);
  }

  async verifyProfileInTable(firstName: string, lastName: string) {
    const fullName = `${firstName} ${lastName}`;
    await this.page.waitForTimeout(2000);
    return this.page.getByRole('row').filter({ hasText: fullName }).isVisible();
  }
}
