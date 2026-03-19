import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CandidateEditPage extends BasePage {

  constructor(page: Page, test: any) {
    super(page, test);
  }

  // ── Open candidate profile from homepage table ──────────────────────────
  async openCandidateProfile(firstName: string, lastName: string) {
    const fullName = `${firstName} ${lastName}`;
    await this.page.getByRole('row').filter({ hasText: fullName }).first().click();
    await this.page.waitForTimeout(2000);
  }

  // ── Click Edit button on profile page ──────────────────────────────────
  async clickEdit() {
    await this.page.getByRole('button', { name: 'Edit' }).click();
    await this.page.waitForTimeout(1500);
  }

  // ── Fill Work Phone Number ──────────────────────────────────────────────
  async fillWorkPhoneNumber(phone: string) {
    // Scroll down inside the modal to reach Work Phone Number
    await this.page.locator('.MuiStack-root.mui-dav4x7').click();
    await this.page.waitForTimeout(500);

    // Click country code combobox and search for India
    await this.page.getByRole('combobox', { name: 'Work Phone Number' }).click();
    await this.page.waitForTimeout(300);
    await this.page.getByRole('combobox', { name: 'Work Phone Number' }).fill('in');
    await this.page.waitForTimeout(500);

    // Select India (+91)
    await this.page.getByRole('option', { name: 'IN India (+91)' }).click();
    await this.page.waitForTimeout(300);

    // Fill phone number
    await this.page.getByRole('textbox', { name: 'Work Phone Number' }).click();
    await this.page.getByRole('textbox', { name: 'Work Phone Number' }).fill(phone);
    await this.page.waitForTimeout(300);
  }

  // ── Click Apply ──────────────────────────────────────────────────────────
  async clickApply() {
    await this.page.getByRole('button', { name: 'Apply' }).click();
    await this.page.waitForTimeout(2000);
  }
}