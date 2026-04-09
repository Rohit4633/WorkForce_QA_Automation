import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class BusinessSettingsPage extends BasePage {

  constructor(page: Page, test: any) {
    super(page, test);
  }

  // ── Navigate to Business Settings ─────────────────────────────────────────
  async goToBusinessSettings() {
    const businessSettingsBtn = this.page.getByRole('button', { name: 'Business Settings' });
    const isVisible = await businessSettingsBtn.isVisible({ timeout: 3000 }).catch(() => false);

    if (isVisible) {
      await businessSettingsBtn.click();
    } else {
      console.log('Business Settings button not visible — navigating directly');
      await this.page.goto(
        'https://workforce.noonstg.partners/en/business-settings?project=PRJ1455'
      );
    }

    // Wait for progressbar to disappear and page to fully settle
    await this.page.waitForSelector('[role="progressbar"]', { state: 'hidden', timeout: 15000 })
      .catch(() => console.log('No progressbar found — continuing'));
    await this.page.waitForTimeout(2000);
  }

  // ── Verify page loaded correctly ──────────────────────────────────────────
  async isPageLoaded(): Promise<boolean> {
    try {
      await this.page.getByRole('heading', { name: 'Contacts' })
        .waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  // ── Click Add contact button ───────────────────────────────────────────────
  async clickAddContact() {
    // Wait for the Add button to be ready (page fully loaded)
    const addBtn = this.page.getByRole('button', { name: 'Add' });
    await addBtn.waitFor({ state: 'visible', timeout: 15000 });
    await addBtn.click();
    await this.page.waitForTimeout(1000);
  }

  // ── Select Contact Type ────────────────────────────────────────────────────
  async selectContactType(type: 'Finance Contact' | 'Business Contact') {
    await this.page.getByRole('combobox', { name: 'Contact Type' }).click();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('option', { name: type }).click();
    await this.page.waitForTimeout(300);
  }

  // ── Fill Title ─────────────────────────────────────────────────────────────
  async fillTitle(title: string) {
    await this.page.getByRole('textbox', { name: 'Title' }).fill(title);
    await this.page.waitForTimeout(300);
  }

  // ── Fill Name ──────────────────────────────────────────────────────────────
  async fillName(name: string) {
    await this.page.getByRole('textbox', { name: 'Name' }).fill(name);
    await this.page.waitForTimeout(300);
  }

  // ── Fill Phone Number with +971 UAE country code ───────────────────────────
  async fillPhoneNumber(phone: string) {
    const codeButton = this.page.locator('button').filter({ hasText: 'Code' }).first();
    await codeButton.click();
    await this.page.waitForTimeout(800);

    const listbox = this.page.getByRole('listbox');
    await listbox.waitFor({ state: 'visible', timeout: 5000 });
    await this.page.waitForTimeout(300);

    await listbox.getByRole('option').first().click();
    await this.page.waitForTimeout(500);

    await this.page.getByRole('textbox', { name: 'Phone Number' }).fill(phone);
    await this.page.waitForTimeout(300);
  }

  // ── Fill Email ─────────────────────────────────────────────────────────────
  async fillEmail(email: string) {
    await this.page.getByRole('textbox', { name: 'Email' }).fill(email);
    await this.page.waitForTimeout(300);
  }

  // ── Click Apply ────────────────────────────────────────────────────────────
  async clickApply() {
    await this.page.getByRole('button', { name: 'Apply' }).click();
    await this.page.waitForTimeout(2000);
  }

  // ── Click Cancel ───────────────────────────────────────────────────────────
  async clickCancel() {
    await this.page.getByRole('button', { name: 'Cancel' }).click();
    await this.page.waitForTimeout(1000);
  }

  // ── Verify contact exists in table ────────────────────────────────────────
  async verifyContactExists(name: string): Promise<boolean> {
    try {
      await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await this.page.waitForTimeout(1000);
      const row = this.page.getByRole('row').filter({ hasText: name });
      await expect(row.first()).toBeVisible({ timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  // ── Get contact row data ───────────────────────────────────────────────────
  async getContactRowData(name: string): Promise<Record<string, string>> {
    const row = this.page.getByRole('row').filter({ hasText: name }).first();
    const cells = row.getByRole('cell');
    const count = await cells.count();
    const data: Record<string, string> = {};
    const headers = ['contactType', 'title', 'name', 'phoneNumber', 'email'];
    for (let i = 0; i < Math.min(count, headers.length); i++) {
      data[headers[i]] = (await cells.nth(i).textContent())?.trim() || '';
    }
    return data;
  }

  // ── Open three dots menu for a contact ────────────────────────────────────
  async openContactMenu(name: string) {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(500);
    const row = this.page.getByRole('row').filter({ hasText: name }).first();
    await row.scrollIntoViewIfNeeded();
    await row.getByRole('button').last().click();
    await this.page.waitForTimeout(500);
  }

  // ── Click Edit from menu ───────────────────────────────────────────────────
  async clickEdit() {
    await this.page.getByRole('menuitem', { name: 'Edit' }).click();
    await this.page.waitForTimeout(1000);
  }

  // ── Click Delete from menu ────────────────────────────────────────────────
  async clickDelete() {
    await this.page.getByRole('menuitem', { name: 'Delete' }).click();
    await this.page.waitForTimeout(500);
  }

  // ── Confirm deletion in dialog (if present) ───────────────────────────────
  async confirmDelete() {
    // Some MUI dialogs use "Delete" button, others use "Confirm"
    const confirmBtn = this.page
      .getByRole('button', { name: 'Delete' })
      .or(this.page.getByRole('button', { name: 'Confirm' }))
      .or(this.page.getByRole('button', { name: 'Yes' }));
    const visible = await confirmBtn.first().isVisible({ timeout: 3000 }).catch(() => false);
    if (visible) {
      await confirmBtn.first().click();
      await this.page.waitForTimeout(1500);
    }
  }

  // ── Check whether a contact row is still visible ──────────────────────────
  async isContactVisible(name: string): Promise<boolean> {
    await this.page.waitForTimeout(1000);
    return this.page.getByRole('row').filter({ hasText: name }).isVisible().catch(() => false);
  }
}