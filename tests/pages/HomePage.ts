import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {

  constructor(page: Page, test: any) {
    super(page, test);
  }

  // ── Navigation ──────────────────────────────────────────────────────────
  async goto() {
    await this.page.goto('/');
    await this.ensureCorrectProject();
  }

  // ── Search ───────────────────────────────────────────────────────────────
  async searchCandidate(name: string) {
    await this.page.getByPlaceholder('Search').fill(name);
    await this.page.waitForTimeout(1500);
  }

  async clearSearch() {
    await this.page.getByPlaceholder('Search').clear();
    await this.page.waitForTimeout(1500);
  }

  async getSearchResults(): Promise<string[]> {
    const rows = this.page.getByRole('row').filter({
      hasNot: this.page.getByRole('columnheader')
    });
    const count = await rows.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await rows.nth(i).locator('td').first().textContent();
      if (text) names.push(text.trim());
    }
    return names;
  }

  // ── Filter by Status (top dropdown) ──────────────────────────────────────
  async filterByStatus(status: string) {
    await this.page.getByText('Filter by status').click();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('option', { name: status }).click();
    await this.page.waitForTimeout(1500);
  }

  async selectMultipleStatuses(statuses: string[]) {
    await this.page.getByText('Filter by status').click();
    await this.page.waitForTimeout(500);
    for (const status of statuses) {
      await this.page.getByRole('option', { name: status }).click();
      await this.page.waitForTimeout(300);
    }
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(1500);
  }

  // ── Filter Modal ──────────────────────────────────────────────────────────
  async openFilterModal() {
    await this.page.getByRole('button', { name: 'Filter' }).click();
    await this.page.waitForTimeout(1000);
  }

  async closeFilterModal() {
    // Click backdrop to close modal
    await this.page.locator('.MuiDrawer-backdrop').click();
    await this.page.waitForTimeout(500);
  }

  async filterByBusinessUnit(unit: string) {
    await this.page.getByRole('combobox', { name: 'Business unit' }).click();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('option', { name: unit }).click();
    await this.page.waitForTimeout(300);
  }

  async filterByStatusInModal(status: string) {
    await this.page.getByRole('combobox', { name: 'Status' }).click();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('option', { name: status }).click();
    await this.page.waitForTimeout(300);
  }

  async applyFilters() {
    await this.page.getByRole('button', { name: 'Apply' }).click();
    await this.page.waitForTimeout(2000);
  }

  async resetFilters() {
    await this.page.getByRole('button', { name: 'Reset' }).click();
    await this.page.waitForTimeout(2000);
  }

  // ── Table Helpers ──────────────────────────────────────────────────────────
  async getTableRowCount(): Promise<number> {
    await this.page.waitForTimeout(1000);
    const rows = this.page.getByRole('row').filter({
      hasNot: this.page.getByRole('columnheader')
    });
    return await rows.count();
  }

  async getColumnValues(columnIndex: number): Promise<string[]> {
    const rows = this.page.getByRole('row').filter({
      hasNot: this.page.getByRole('columnheader')
    });
    const count = await rows.count();
    const values: string[] = [];
    for (let i = 0; i < count; i++) {
      const cell = await rows.nth(i).locator('td').nth(columnIndex).textContent();
      if (cell) values.push(cell.trim());
    }
    return values;
  }

  async getAllStatusValues(): Promise<string[]> {
    return this.getColumnValues(3);
  }

  // ── Download ───────────────────────────────────────────────────────────────
  async clickDownload(): Promise<string> {
    const downloadPromise = this.page.waitForEvent('download', { timeout: 30000 });
    await this.page.getByRole('button', { name: 'Download' }).click();
    const download = await downloadPromise;
    const filePath = await download.path();
    console.log(`✅ File downloaded: ${download.suggestedFilename()}`);
    return filePath || '';
  }
}