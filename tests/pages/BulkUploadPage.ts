 import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import * as path from 'path';

export class BulkUploadPage extends BasePage {

  constructor(page: Page, test: any) {
    super(page, test);
  }

  // ── Click Bulk Upload button ──────────────────────────────────────────────
  async clickBulkUpload() {
    await this.page.getByRole('button', { name: 'Bulk Upload' }).click();
    await this.page.waitForTimeout(1000);
  }

  // ── Click Download Template Sheet ─────────────────────────────────────────
  async downloadTemplateSheet(): Promise<string> {
    const downloadPromise = this.page.waitForEvent('download', { timeout: 30000 });
    await this.page.getByText('Download Template').click();
    const download = await downloadPromise;
    const filePath = await download.path();
    console.log(`📄 Template downloaded: ${download.suggestedFilename()}`);
    return filePath || '';
  }

  // ── Upload the filled template ─────────────────────────────────────────────
  async uploadFile(filePath: string) {
    // Use file input to upload
    const fileInput = this.page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);
    await this.page.waitForTimeout(2000);
    console.log(`📤 File uploaded: ${filePath}`);
  }

  // ── Click Next button ─────────────────────────────────────────────────────
  async clickNext() {
    await this.page.getByRole('button', { name: 'Next' }).click();
    await this.page.waitForTimeout(2000);
  }

  // ── Wait for Back to Team button ──────────────────────────────────────────
  async waitForSuccess() {
    await this.page.getByText('Your New Candidates Imported Successfully')
      .waitFor({ state: 'visible', timeout: 60000 });
    console.log(`✅ Import successful`);
  }

  // ── Click Back to Team ────────────────────────────────────────────────────
  async clickBackToTeam() {
    await this.page.getByRole('button', { name: 'Back to Team' }).click();
    await this.page.waitForTimeout(4000);
  }

  // ── Verify candidates in table ────────────────────────────────────────────
  async verifyCandidateInTable(firstName: string): Promise<boolean> {
    const row = this.page.getByRole('row').filter({ hasText: firstName });
    return await row.isVisible();
  }

  // ── Get success row count ─────────────────────────────────────────────────
  async getSuccessRowCount(): Promise<number> {
    const text = await this.page.getByText(/row has been processed successfully|rows have been processed successfully/).textContent();
    const match = text?.match(/(\d+) row/);
    return match ? parseInt(match[1]) : 0;
  }
}
