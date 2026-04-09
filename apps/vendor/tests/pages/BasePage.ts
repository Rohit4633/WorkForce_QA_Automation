import { Page } from '@playwright/test';
import { ai } from '@zerostep/playwright';

export class BasePage {
  readonly page: Page;
  readonly test: any;
  protected aiArgs: { page: Page; test: any };

  constructor(page: Page, test: any) {
    this.page = page;
    this.test = test;
    this.aiArgs = { page, test };
  }

  async ai(prompt: string) {
    return ai(prompt, this.aiArgs);
  }

  async aiAll(prompts: string[]) {
    return ai(prompts, this.aiArgs);
  }

  async waitForPageLoad() {
    await this.page.waitForTimeout(2000);
  }

  // ── Project Selection Handler ──────────────────────────────────────────
  // Call after every page.goto() to ensure correct project is loaded
  async ensureCorrectProject() {
    await this.page.waitForTimeout(1500);

    const currentURL = this.page.url();

    // If URL already has correct project — nothing to do
    if (currentURL.includes('project=PRJ1455')) {
      console.log('✅ Correct project already selected');
      return;
    }

    // URL is missing project param — handle project selector popup
    console.log('⚠️ Project not selected — handling project selector popup');

    // Check if project selector popup is visible
    const projectPopup = this.page.getByPlaceholder('Search for your project');
    const isPopupVisible = await projectPopup.isVisible();

    if (isPopupVisible) {
      // Try to click noon Test AE directly first
      const projectOption = this.page.getByText('noon Test AE').first();
      const isDirectVisible = await projectOption.isVisible();

      if (isDirectVisible) {
        console.log('Found noon Test AE directly — clicking');
        await projectOption.click();
      } else {
        // Search for it
        console.log('Searching for PRJ1455');
        await projectPopup.fill('PRJ1455');
        await this.page.waitForTimeout(1000);
        await this.page.getByText('noon Test AE').first().click();
      }

      // Wait for redirect to correct URL
      await this.page.waitForURL('**/en?project=PRJ1455', { timeout: 15000 });
      await this.page.waitForTimeout(2000);
      console.log('✅ Project selected successfully');

    } else {
      // Popup not visible — navigate directly to correct URL
      console.log('Popup not visible — navigating directly to correct URL');
      await this.page.goto(
        process.env.BASE_URL || 'https://workforce.noonstg.partners/en?project=PRJ1455'
      );
      await this.page.waitForTimeout(2000);
    }
  }
}