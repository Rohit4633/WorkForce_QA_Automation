import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ReportsPage extends BasePage {

  constructor(page: Page, test: any) {
    super(page, test);
  }

  // ── Navigate to Reports tab ───────────────────────────────────────────────
  async goToReports() {
    // Try multiple locator strategies for the Reports sidebar button
    const reportsBtn = this.page.getByRole('button', { name: 'Reports' });
    const reportsBtnAlt = this.page.locator('button').filter({ hasText: 'Reports' });
    const reportsBtnNav = this.page.locator('nav button').filter({ hasText: 'Reports' });

    if (await reportsBtn.isVisible()) {
      await reportsBtn.click();
    } else if (await reportsBtnAlt.isVisible()) {
      await reportsBtnAlt.click();
    } else if (await reportsBtnNav.isVisible()) {
      await reportsBtnNav.click();
    } else {
      // Last resort — navigate directly to reports URL
      await this.page.goto(
        'https://workforce.noonstg.partners/en/reports?project=PRJ1455'
      );
    }
    await this.page.waitForTimeout(2000);
  }

  // ── Search for a report ───────────────────────────────────────────────────
  async searchReport(name: string) {
    await this.page.getByPlaceholder('Search for a report').fill(name);
    await this.page.waitForTimeout(1000);
  }

  // ── Select a report ───────────────────────────────────────────────────────
  async selectReport(name: string) {
    const row = this.page.getByRole('row').filter({ hasText: name });
    await row.getByRole('button', { name: 'Select' }).click();
    await this.page.waitForTimeout(2000);
  }

  // ── Set date range ────────────────────────────────────────────────────────
  async setStartDate(date: string) {
    await this.page.getByPlaceholder('YYYY-MM-DD').first().fill(date);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(500);
  }

  async setEndDate(date: string) {
    await this.page.getByPlaceholder('YYYY-MM-DD').last().fill(date);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(500);
  }

  // ── Click Generate ────────────────────────────────────────────────────────
  async clickGenerate() {
    await this.page.getByRole('button', { name: 'Generate' }).click();
    await this.page.waitForTimeout(3000);
  }

  // ── Get all rows from report table (current page only) ────────────────────
  async getReportTableData(): Promise<Record<string, string>[]> {
    const rows = this.page.getByRole('row').filter({
      hasNot: this.page.getByRole('columnheader')
    });
    const count = await rows.count();
    const data: Record<string, string>[] = [];

    // Get headers — use lowercase for consistent matching
    const headerRow = this.page.getByRole('columnheader');
    const headerCount = await headerRow.count();
    const headers: string[] = [];
    for (let i = 0; i < headerCount; i++) {
      const text = await headerRow.nth(i).textContent();
      headers.push(text?.trim().toLowerCase() || `col${i}`);
    }

    // Get data rows
    for (let i = 0; i < count; i++) {
      const cells = rows.nth(i).getByRole('cell');
      const cellCount = await cells.count();
      const row: Record<string, string> = {};
      for (let j = 0; j < cellCount; j++) {
        const cellText = await cells.nth(j).textContent();
        row[headers[j]] = cellText?.trim() || '';
      }
      data.push(row);
    }

    console.log(`📊 Found ${data.length} rows in report table`);
    return data;
  }

  // ── Download report ───────────────────────────────────────────────────────
  async downloadReport(): Promise<string> {
    const downloadPromise = this.page.waitForEvent('download', { timeout: 30000 });
    await this.page.getByRole('button', { name: 'Download' }).click();
    const download = await downloadPromise;
    const filePath = await download.path();
    console.log(`📥 Report downloaded: ${download.suggestedFilename()}`);
    await this.page.waitForTimeout(1000);
    return filePath || '';
  }

  // ── Read CSV report ───────────────────────────────────────────────────────
  readCSVReport(filePath: string): Record<string, string>[] {
    const XLSX = require('xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows: Record<string, string>[] = XLSX.utils.sheet_to_json(sheet);
    console.log(`📄 CSV has ${rows.length} data rows`);
    return rows;
  }

  // ── Click Back to all Reports ─────────────────────────────────────────────
  async clickBackToAllReports() {
    await this.page.getByText('Back to all Reports').click();
    await this.page.waitForTimeout(2000);
  }

  // ── Get start of current month ────────────────────────────────────────────
  getStartOfMonth(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}-01`;
  }

  // ── Get today's date ──────────────────────────────────────────────────────
  getToday(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}