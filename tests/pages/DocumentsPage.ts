import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DocumentsPage extends BasePage {

  constructor(page: Page, test: any) {
    super(page, test);
  }

  // ── Scroll to Documents section ──────────────────────────────────────────
  async scrollToDocuments() {
    await this.page.getByText('Documents').scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);
  }

  // ── Click Add button in Documents section ────────────────────────────────
  async clickAddDocument() {
    await this.page.getByRole('button', { name: 'Add' }).last().click();
    await this.page.waitForTimeout(1000);
  }

  // ── Select document type from dropdown ───────────────────────────────────
  async selectDocumentType(type: string) {
    await this.page.getByRole('combobox', { name: 'Document type' }).click();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('option', { name: type }).click();
    await this.page.waitForTimeout(500);
  }

  // ── Fill Passport Number ─────────────────────────────────────────────────
  async fillPassportNumber(number: string) {
    await this.page.getByRole('textbox', { name: 'Passport Number' }).fill(number);
    await this.page.waitForTimeout(300);
  }

  // ── Fill Issue Date ───────────────────────────────────────────────────────
  async fillIssueDate(date: string) {
    await this.page.getByRole('textbox', { name: 'Issue Date' }).fill(date);
    await this.page.waitForTimeout(300);
  }

  // ── Fill Expiry Date ──────────────────────────────────────────────────────
  async fillExpiryDate(date: string) {
    await this.page.getByRole('textbox', { name: 'Expiry Date' }).fill(date);
    await this.page.waitForTimeout(300);
  }

  // ── Fill Date of Birth ────────────────────────────────────────────────────
  async fillDateOfBirth(date: string) {
    await this.page.getByRole('textbox', { name: 'Date of Birth' }).fill(date);
    await this.page.waitForTimeout(300);
  }

  // ── Select Country ────────────────────────────────────────────────────────
  async selectCountry(country: string) {
    await this.page.getByRole('combobox', { name: 'Country' }).click();
    await this.page.waitForTimeout(300);
    await this.page.getByRole('option', { name: country }).first().click();
    await this.page.waitForTimeout(300);
  }

  // ── Click Save ────────────────────────────────────────────────────────────
  async clickSave() {
    await this.page.getByRole('button', { name: 'Save' }).click();
    await this.page.waitForTimeout(2000);
  }

  // ── Click Cancel ──────────────────────────────────────────────────────────
  async clickCancel() {
    await this.page.getByRole('button', { name: 'Cancel' }).click();
    await this.page.waitForTimeout(1000);
  }

  // ── Verify document exists in table ──────────────────────────────────────
  async verifyDocumentExists(docType: string): Promise<boolean> {
    const row = this.page.getByRole('row').filter({ hasText: docType });
    return await row.isVisible();
  }

  // ── Verify Emirates ID exists with correct number ────────────────────────
  async verifyEmiratesIdExists(emiratesId: string): Promise<boolean> {
    const row = this.page.getByRole('row').filter({ hasText: emiratesId });
    return await row.isVisible();
  }

  // ── Verify Emirates ID type is shown ─────────────────────────────────────
  async verifyEmiratesIdType(): Promise<boolean> {
    const row = this.page.getByRole('row')
      .filter({ hasText: 'Emirates ID' })
      .first();
    return await row.isVisible();
  }

  // ── Open three dots menu on a document row ────────────────────────────────
  async openDocumentMenu(docType: string) {
    const row = this.page.getByRole('row').filter({ hasText: docType }).first();
    await row.getByRole('button').last().click();
    await this.page.waitForTimeout(500);
  }

  // ── Click View from three dots menu ──────────────────────────────────────
  async clickView() {
    await this.page.getByRole('menuitem', { name: 'View' }).click();
    await this.page.waitForTimeout(1000);
  }

  // ── Click Edit from three dots menu ──────────────────────────────────────
  async clickEdit() {
    await this.page.getByRole('menuitem', { name: 'Edit' }).click();
    await this.page.waitForTimeout(1000);
  }

  // ── Click Delete from three dots menu ────────────────────────────────────
  async clickDelete() {
    await this.page.getByRole('menuitem', { name: 'Delete' }).click();
    await this.page.waitForTimeout(1000);
  }

  // ── Verify View document modal is open ────────────────────────────────────
  async verifyViewModalOpen(): Promise<boolean> {
    return await this.page.getByText('View document').isVisible();
  }

  // ── Verify Edit document modal is open ───────────────────────────────────
  async verifyEditModalOpen(): Promise<boolean> {
    return await this.page.getByText('Edit document').isVisible();
  }

  // ── Close modal with X button ─────────────────────────────────────────────
  async closeModal() {
    await this.page.getByRole('button', { name: 'Close' })
      .or(this.page.locator('button').filter({ has: this.page.locator('img') }).last())
      .click();
    await this.page.waitForTimeout(1000);
  }

  // ── Verify Delete is disabled ─────────────────────────────────────────────
  async isDeleteDisabled(): Promise<boolean> {
    const deleteBtn = this.page.getByRole('menuitem', { name: 'Delete' });
    const isDisabled = await deleteBtn.evaluate(el => {
      return el.hasAttribute('disabled') ||
        el.getAttribute('aria-disabled') === 'true' ||
        el.classList.contains('disabled') ||
        getComputedStyle(el).pointerEvents === 'none' ||
        getComputedStyle(el).opacity === '0.5' ||
        (el as HTMLElement).style.color === 'rgb(158, 158, 158)';
    });
    return isDisabled;
  }

  // ── Open Emirates ID menu ─────────────────────────────────────────────────
  async openEmiratesIdMenu() {
    const row = this.page.getByRole('row')
      .filter({ hasText: 'Emirates ID' })
      .first();
    await row.getByRole('button').last().click();
    await this.page.waitForTimeout(500);
  }
}