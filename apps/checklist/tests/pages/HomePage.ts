import { BasePage } from './BasePage';

export class HomePage extends BasePage {

  async goto() {
    await this.page.goto('/en');
    // Wait for the homepage content to fully render before proceeding
    await this.page.getByText('IMPORTANT DOCUMENTS').waitFor({ timeout: 15000 });
    await this.page.waitForTimeout(500);
  }

  // ── Header greeting ──────────────────────────────────────────────────────

  async getGreeting(): Promise<string> {
    return this.page.getByRole('heading', { level: 5 }).innerText();
  }

  async getCandidateName(): Promise<string> {
    // h3 elements: candidate name comes before document names in DOM order
    return this.page.getByRole('heading', { level: 3 }).first().innerText();
  }

  async getRole(): Promise<string> {
    return this.page.getByRole('heading', { level: 4 }).first().innerText();
  }

  // ── QR code ──────────────────────────────────────────────────────────────

  async clickQrCode() {
    await this.page.getByRole('link', { name: '' }).filter({ has: this.page.locator('img') }).first().click();
    await this.page.waitForTimeout(1500);
  }

  // ── Documents section ─────────────────────────────────────────────────────

  async isImportantDocumentsSectionVisible(): Promise<boolean> {
    return this.page.getByText('IMPORTANT DOCUMENTS').isVisible();
  }

  async getDocumentStatus(documentName: string): Promise<string> {
    const card = this.page.locator('main').getByText(documentName).locator('..').locator('..');
    return card.locator('h6').innerText();
  }

  async clickDocument(documentName: string) {
    await this.page.getByRole('heading', { level: 3, name: documentName }).click();
    await this.page.waitForTimeout(1500);
  }

  async getImportantDocumentNames(): Promise<string[]> {
    // All h3 headings inside the important section (before the separator)
    const cards = this.page.locator('main').getByRole('heading', { level: 3 });
    return cards.allInnerTexts();
  }

  // ── View Other Documents toggle ───────────────────────────────────────────

  async isViewOtherDocumentsVisible(): Promise<boolean> {
    return this.page.getByRole('button', { name: 'View Other Documents' }).isVisible();
  }

  async expandOtherDocuments() {
    await this.page.getByRole('button', { name: 'View Other Documents' }).click();
    await this.page.waitForTimeout(1000);
  }

  async collapseOtherDocuments() {
    await this.page.getByRole('button', { name: 'Only Important Documents' }).click();
    await this.page.waitForTimeout(1000);
  }

  async isOtherDocumentsExpanded(): Promise<boolean> {
    return this.page.getByRole('button', { name: 'Only Important Documents' }).isVisible();
  }

  // ── Menu ──────────────────────────────────────────────────────────────────

  async openMenu() {
    // On homepage the menu button is the first button in main (no back button on this page)
    await this.page.locator('main').getByRole('button').first().click();
    await this.page.waitForTimeout(1000);
  }
}
