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

  // ── Verify Emirates ID row exists with correct number ────────────────────
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

  // ── Click three dots menu on Emirates ID row ──────────────────────────────
  async openEmiratesIdMenu() {
    const row = this.page.getByRole('row')
      .filter({ hasText: 'Emirates ID' })
      .first();
    await row.getByRole('button').last().click();
    await this.page.waitForTimeout(500);
  }

  // ── Verify Delete button is disabled ──────────────────────────────────────
  async isDeleteDisabled(): Promise<boolean> {
    const deleteBtn = this.page.getByText('Delete').last();

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
}