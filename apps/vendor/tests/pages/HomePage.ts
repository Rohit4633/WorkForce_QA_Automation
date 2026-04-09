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
    // Wait for table to render before any interactions
    await this.page.waitForSelector('table', { state: 'visible', timeout: 15000 });
    await this.page.waitForTimeout(1000);
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
    // Wait for table rows to be present before collecting
    await this.page.waitForTimeout(1500);
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
    // Open dropdown once — clicking per-status would change the trigger text
    // (from "Filter by status" to the selected value), breaking subsequent re-opens
    await this.page.getByText('Filter by status').click();
    await this.page.waitForTimeout(500);
    for (const status of statuses) {
      await this.page.getByRole('option', { name: status }).click();
      await this.page.waitForTimeout(300);
    }
    // Close the dropdown
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(1500);
  }

  // ── Filter Modal ──────────────────────────────────────────────────────────
  async openFilterModal() {
    await this.page.getByRole('button', { name: 'Filter' }).click();
    await this.page.waitForTimeout(1000);
  }

  async filterByStatusInModal(status: string) {
    await this.page.getByRole('combobox', { name: 'Status' }).click();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('option', { name: status }).click();
    await this.page.waitForTimeout(300);
  }

  async filterByBusinessUnit(unit: string) {
    await this.page.getByRole('combobox', { name: 'Business Unit' }).click();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('option', { name: unit }).click();
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

  // ── Heading ───────────────────────────────────────────────────────────────
  async getTeamHeadingText(): Promise<string> {
    const heading = this.page.getByRole('heading', { level: 1 }).first();
    await heading.waitFor({ state: 'visible', timeout: 10000 });
    return (await heading.textContent())?.trim() || '';
  }

  async getTeamCount(): Promise<number> {
    const countHeading = this.page.getByRole('heading', { level: 1 }).nth(1);
    await countHeading.waitFor({ state: 'visible', timeout: 10000 });
    const text = await countHeading.textContent();
    return parseInt(text?.trim() || '0', 10);
  }

  // ── Row navigation ────────────────────────────────────────────────────────
  async clickFirstCandidateRow() {
    const firstRow = this.page.getByRole('row').filter({
      hasNot: this.page.getByRole('columnheader')
    }).first();
    await firstRow.waitFor({ state: 'visible', timeout: 10000 });
    await firstRow.click();
  }

  // ── Navigation sidebar ────────────────────────────────────────────────────
  async openDrawer() {
    const drawerBtn = this.page.getByRole('button', { name: 'open drawer' });
    const isVisible = await drawerBtn.isVisible({ timeout: 3000 }).catch(() => false);
    if (isVisible) {
      await drawerBtn.click();
      await this.page.waitForTimeout(800);
    }
  }

  async clickNavReports() {
    await this.openDrawer();
    await this.page.getByRole('button', { name: 'Reports' })
      .waitFor({ state: 'visible', timeout: 5000 });
    await this.page.getByRole('button', { name: 'Reports' }).click();
    await this.page.waitForTimeout(2000);
  }

  async clickNavBusinessSettings() {
    await this.openDrawer();
    await this.page.getByRole('button', { name: 'Business Settings' })
      .waitFor({ state: 'visible', timeout: 5000 });
    await this.page.getByRole('button', { name: 'Business Settings' }).click();
    await this.page.waitForTimeout(2000);
  }

  async clickLogo() {
    await this.page.getByRole('link', { name: /workforce application logo/i })
      .click();
    await this.page.waitForTimeout(2000);
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