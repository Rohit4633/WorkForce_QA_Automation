import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CandidatePage extends BasePage {

  constructor(page: Page, test: any) {
    super(page, test);
  }

  async clickAddCandidate() {
    await this.page.getByRole('button', { name: 'Add Candidate' }).click();
    await this.page.waitForTimeout(1000);
  }

  async fillFirstName(name: string) {
    await this.page.getByPlaceholder('First name').fill(name);
  }

  async fillLastName(name: string) {
    await this.page.getByPlaceholder('Last name').fill(name);
  }

  async selectCountryCode() {
    // Open country code dropdown
    await this.page.locator('.MuiAutocomplete-wrapper').first().click();
    await this.page.waitForTimeout(500);
    // Type +91 to search for India
    await this.page.getByRole('combobox', { name: 'Personal phone number' }).fill('+91');
    await this.page.waitForTimeout(500);
    // Click India option from list
    await this.page.locator('.MuiListItemDecorator-root > .FlagIcon_flagWrapper__Ip2c9').click();
    await this.page.waitForTimeout(500);
  }

  async fillPhoneNumber(phone: string) {
    await this.page.getByRole('textbox', { name: 'Personal phone number' }).fill(phone);
  }

  async selectNationality() {
    await this.page.getByRole('combobox', { name: 'Nationality' }).click();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('combobox', { name: 'Nationality' }).fill('india');
    await this.page.waitForTimeout(500);
    await this.page.getByRole('option', { name: 'IN India' }).click();
    await this.page.waitForTimeout(500);
  }

  async fillEmiratesId(id: string) {
    await this.page.getByPlaceholder('123-4567-8901234-5').fill(id);
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
