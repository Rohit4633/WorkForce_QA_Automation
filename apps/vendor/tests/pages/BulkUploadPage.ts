import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class BulkUploadPage extends BasePage {

  constructor(page: Page, test: any) {
    super(page, test);
  }

  async clickBulkUpload() {
    await this.page.getByRole('button', { name: 'Bulk Upload' }).click();
    // Wait for the bulk upload modal/panel to appear
    await this.page.waitForTimeout(2000);
  }

  async downloadTemplateSheet(): Promise<string> {
    const downloadPromise = this.page.waitForEvent('download', { timeout: 30000 });
    await this.page.getByText('Download Template').click();
    const download = await downloadPromise;
    const filePath = await download.path();
    console.log(`📄 Template downloaded: ${download.suggestedFilename()}`);
    return filePath || '';
  }

  async uploadFile(filePath: string) {
    // Always prefer direct file input injection — most reliable approach
    const fileInput = this.page.locator('input[type="file"]');

    // Wait for file input to be present in DOM (modal must be open)
    await fileInput.waitFor({ state: 'attached', timeout: 15000 });

    await fileInput.first().setInputFiles(filePath);
    await this.page.waitForTimeout(2000);
    console.log(`📤 File uploaded: ${filePath}`);
  }

  async clickNext() {
    await this.page.getByRole('button', { name: 'Next' }).click();
    await this.page.waitForTimeout(2000);
  }

  async waitForSuccess() {
    await this.page.getByText('Your New Candidates Imported Successfully')
      .waitFor({ state: 'visible', timeout: 90000 });
    console.log(`✅ Import successful`);
  }

  async waitForError() {
    await this.page.getByText('Oops! File Errors Detected')
      .waitFor({ state: 'visible', timeout: 30000 });
    console.log(`⚠️ Error screen detected`);
  }

  async getFailedRowCount(): Promise<number> {
    const text = await this.page.getByText(/row has failed|rows have failed/).textContent();
    const match = text?.match(/(\d+) row/);
    return match ? parseInt(match[1]) : 0;
  }

  async getSuccessRowCount(): Promise<number> {
    const text = await this.page.getByText(/row has been processed successfully|rows have been processed successfully/).textContent();
    const match = text?.match(/(\d+) row/);
    return match ? parseInt(match[1]) : 0;
  }

  async downloadErrorReport(): Promise<string> {
    const downloadPromise = this.page.waitForEvent('download', { timeout: 30000 });
    await this.page.getByRole('button', { name: 'Download Error Report' }).click();
    const download = await downloadPromise;
    const filePath = await download.path();
    console.log(`📥 Error report downloaded: ${download.suggestedFilename()}`);
    await this.page.waitForTimeout(1000);
    return filePath || '';
  }

  async readErrorReport(filePath: string): Promise<string[]> {
    const XLSX = require('xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const headerRow = rows[0] || [];
    const resultColIndex = headerRow.findIndex((col: string) =>
      col?.toString().toLowerCase().includes('result')
    );

    if (resultColIndex === -1) {
      console.log('⚠️ Result column not found in error report');
      return [];
    }

    console.log(`📋 Result column found at index: ${resultColIndex}`);
    const errors: string[] = [];
    for (let i = 2; i < rows.length; i++) {
      const row = rows[i];
      const result = row?.[resultColIndex]?.toString().trim();
      if (result && result !== 'OK' && result !== '') {
        errors.push(result);
        console.log(`❌ Row ${i + 1} error: ${result}`);
      }
    }

    console.log(`📊 Total errors found: ${errors.length}`);
    return errors;
  }

  async isReUploadEnabled(): Promise<boolean> {
    const btn = this.page.getByRole('button', { name: 'Re-Upload' });
    const isDisabled = await btn.isDisabled();
    return !isDisabled;
  }

  async clickReUpload() {
    const reUploadBtn = this.page.getByRole('button', { name: 'Re-Upload' });
    await reUploadBtn.waitFor({ state: 'visible', timeout: 10000 });
    await expect(reUploadBtn).toBeEnabled({ timeout: 10000 });
    await reUploadBtn.click();
    await this.page.waitForTimeout(1500);
  }

  async clickBackToTeam() {
    await this.page.getByRole('button', { name: 'Back to Team' }).click();
    await this.page.waitForTimeout(4000);
  }

  async verifyCandidateInTable(firstName: string): Promise<boolean> {
    const row = this.page.getByRole('row').filter({ hasText: firstName });
    return await row.isVisible();
  }
}