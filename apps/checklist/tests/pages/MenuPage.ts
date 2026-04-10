import { BasePage } from './BasePage';

export class MenuPage extends BasePage {

  // ── Open menu ─────────────────────────────────────────────────────────────

  async openMenu() {
    // On inner pages (non-homepage) there are exactly 2 buttons in main:
    //   1st = back-navigation button (header left side)
    //   2nd = hamburger menu button (header right side)
    // Using .last() reliably targets the menu button from any inner page.
    // Note: CSS 'button' selector won't work here — MUI renders role="button" on non-button elements.
    await this.page.locator('main').getByRole('button').last().click();
    await this.page.waitForTimeout(1000);
  }

  // ── Menu content ──────────────────────────────────────────────────────────

  async getCandidateName(): Promise<string> {
    const dialog = this.page.getByRole('dialog');
    return dialog.locator('p').first().innerText();
  }

  async getRole(): Promise<string> {
    const dialog = this.page.getByRole('dialog');
    return dialog.getByRole('heading', { level: 5 }).innerText();
  }

  async getPhoneNumber(): Promise<string> {
    const dialog = this.page.getByRole('dialog');
    // Phone number is the paragraph after "Personal Phone Number" heading
    const phoneSection = dialog.getByRole('heading', { name: 'Personal Phone Number' }).locator('..');
    return phoneSection.locator('p').last().innerText();
  }

  async getVendorName(): Promise<string> {
    const dialog = this.page.getByRole('dialog');
    const vendorSection = dialog.getByRole('heading', { name: 'Vendor Name' }).locator('..');
    return vendorSection.locator('p').last().innerText();
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  async navigateTo(section: 'Documents' | 'Work Information' | 'Interviews' | 'Personal Details') {
    const dialog = this.page.getByRole('dialog');
    await dialog.getByRole('link', { name: section }).click();
    await this.page.waitForTimeout(2000);
  }

  async clickChangeLanguage() {
    const dialog = this.page.getByRole('dialog');
    await dialog.getByRole('link', { name: 'Change Language' }).click();
    await this.page.waitForTimeout(1500);
  }

  async clickLogout() {
    const dialog = this.page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Logout' }).click();
    await this.page.waitForTimeout(2000);
  }

  async isMenuVisible(): Promise<boolean> {
    return this.page.getByRole('dialog').isVisible();
  }
}
