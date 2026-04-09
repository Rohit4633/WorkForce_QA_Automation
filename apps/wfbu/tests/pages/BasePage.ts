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

  async ensureCorrectProject() {
    await this.page.waitForTimeout(1500);

    const currentURL = this.page.url();

    if (currentURL.includes('project=PRJ1455')) {
      console.log('✅ Correct project already selected');
      return;
    }

    console.log('⚠️ Project not selected — handling project selector popup');

    const projectPopup = this.page.getByPlaceholder('Search for your project');
    const isPopupVisible = await projectPopup.isVisible();

    if (isPopupVisible) {
      const projectOption = this.page.getByText('noon Test AE').first();
      const isDirectVisible = await projectOption.isVisible();

      if (isDirectVisible) {
        console.log('Found noon Test AE directly — clicking');
        await projectOption.click();
      } else {
        console.log('Searching for PRJ1455');
        await projectPopup.fill('PRJ1455');
        await this.page.waitForTimeout(1000);
        await this.page.getByText('noon Test AE').first().click();
      }

      await this.page.waitForURL('**/en?project=PRJ1455', { timeout: 15000 });
      await this.page.waitForTimeout(2000);
      console.log('✅ Project selected successfully');

    } else {
      console.log('Popup not visible — navigating directly to correct URL');
      await this.page.goto(
        process.env.BASE_URL || 'https://workforce.noonstg.partners/en?project=PRJ1455'
      );
      await this.page.waitForTimeout(2000);
    }
  }
}
