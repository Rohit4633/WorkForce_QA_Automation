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
    await this.page.waitForLoadState('networkidle');
  }
}