import { BasePage } from './BasePage';

export class PersonalDetailsPage extends BasePage {

  async goto() {
    await this.page.goto('/en/details');
    await this.page.waitForTimeout(2000);
  }

  async isPageLoaded(): Promise<boolean> {
    return this.page.getByRole('heading', { name: 'Personal Details' }).isVisible();
  }

  // ── Basic information ────────────────────────────────────────────────────

  async getFirstName(): Promise<string> {
    const section = this.page.getByText('First Name').locator('..');
    return section.locator('p').last().innerText();
  }

  async getLastName(): Promise<string> {
    const section = this.page.getByText('Last Name').locator('..');
    return section.locator('p').last().innerText();
  }

  async getNationality(): Promise<string> {
    const section = this.page.getByText('Nationality').locator('..');
    return section.locator('p').last().innerText();
  }

  // ── Contact information ───────────────────────────────────────────────────

  async getPersonalPhone(): Promise<string> {
    // Find the paragraph that starts with a + sign (phone number format)
    return this.page.locator('main').evaluate((main) => {
      const els = main.querySelectorAll('p, span');
      for (const el of Array.from(els)) {
        const text = (el.textContent || '').trim();
        if (text.startsWith('+') && text.length >= 10) {
          return text;
        }
      }
      return '';
    });
  }

  // ── System information ────────────────────────────────────────────────────

  async getUserName(): Promise<string> {
    const section = this.page.getByText('User Name').locator('..');
    return section.locator('p').last().innerText();
  }
}
