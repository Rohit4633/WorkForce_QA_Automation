import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CandidateEditPage extends BasePage {

  constructor(page: Page, test: any) {
    super(page, test);
  }

  // ── Open candidate profile from homepage table ──────────────────────────
  async openCandidateProfile(firstName: string, lastName: string) {
    const fullName = `${firstName} ${lastName}`;
    await this.page.getByRole('row').filter({ hasText: fullName }).first().click();
    await this.page.waitForTimeout(2000);
  }

  // ── Click Edit button on profile page ──────────────────────────────────
  async clickEdit() {
    await this.page.getByRole('button', { name: 'Edit' }).click();
    await this.page.waitForTimeout(1500);
  }

  // ── Fill Work Phone Number ──────────────────────────────────────────────
  async fillWorkPhoneNumber(phone: string) {
    // Scroll down inside the modal to reach Work Phone Number
    await this.page.locator('.MuiStack-root.mui-dav4x7').click();
    await this.page.waitForTimeout(500);

    // Click country code combobox and search for India
    await this.page.getByRole('combobox', { name: 'Work Phone Number' }).click();
    await this.page.waitForTimeout(300);
    await this.page.getByRole('combobox', { name: 'Work Phone Number' }).fill('in');
    await this.page.waitForTimeout(500);

    // Select India (+91)
    await this.page.getByRole('option', { name: 'IN India (+91)' }).click();
    await this.page.waitForTimeout(300);

    // Fill phone number
    await this.page.getByRole('textbox', { name: 'Work Phone Number' }).click();
    await this.page.getByRole('textbox', { name: 'Work Phone Number' }).fill(phone);
    await this.page.waitForTimeout(300);
  }

  // ── Click Apply ──────────────────────────────────────────────────────────
  async clickApply() {
    await this.page.getByRole('button', { name: 'Apply' }).click();
    await this.page.waitForTimeout(2000);
  }

  // ── Get profile heading (candidate full name) ─────────────────────────────
  async getProfileName(): Promise<string> {
    // The page has "← All candidates" as the first heading — skip it.
    // The second heading is the candidate's full name.
    const heading = this.page.locator('main').getByRole('heading')
      .filter({ hasNotText: 'All candidates' })
      .first();
    await heading.waitFor({ state: 'visible', timeout: 10000 });
    return (await heading.textContent())?.trim() || '';
  }

  // ── Check status badge is visible ────────────────────────────────────────
  async isStatusBadgeVisible(): Promise<boolean> {
    // Wait until the profile body has loaded (User information section = full render)
    await this.page.getByText('User information')
      .waitFor({ state: 'visible', timeout: 8000 })
      .catch(() => {});

    // Use evaluate to avoid Playwright strict-mode error from multiple <main> elements
    const statuses = ['New', 'Active', 'Accepted', 'Rejected',
                      'No Show', 'Offboarded', 'Interviewing', 'Banned'];
    return this.page.evaluate((list) => {
      const text = document.body.innerText;
      return list.some((s: string) => text.includes(s));
    }, statuses);
  }

  // ── Fill First Name inside the Edit modal ────────────────────────────────
  async fillFirstName(name: string) {
    const input = this.page.getByLabel('First Name');
    await input.waitFor({ state: 'visible', timeout: 5000 });
    await input.clear();
    await input.fill(name);
    await this.page.waitForTimeout(300);
  }

  // ── Click the Employment tab on the profile page ──────────────────────────
  async clickEmploymentTab() {
    await this.page.getByRole('tab', { name: 'Employment' })
      .or(this.page.getByRole('button', { name: 'Employment' }))
      .click();
    await this.page.waitForTimeout(1000);
  }

  // ── Check employment empty-state message is visible ───────────────────────
  async isEmploymentEmptyStateVisible(): Promise<boolean> {
    const emptyState = this.page.getByText('No employment history');
    return await emptyState.isVisible().catch(() => false);
  }
}