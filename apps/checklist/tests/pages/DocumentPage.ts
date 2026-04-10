import { BasePage } from './BasePage';

export class DocumentPage extends BasePage {

  async navigateTo(documentSlug: string) {
    await this.page.goto(`/en/document/${documentSlug}`);
    await this.page.waitForTimeout(2000);
  }

  // ── Document header ───────────────────────────────────────────────────────

  async getDocumentTitle(): Promise<string> {
    return this.page.getByRole('heading', { level: 3 }).innerText();
  }

  async getDocumentStatus(): Promise<string> {
    return this.page.getByRole('heading', { level: 6 }).innerText();
  }

  // ── Step indicator ────────────────────────────────────────────────────────

  async getStepNames(): Promise<string[]> {
    // Wait for the step list to render before reading
    await this.page.getByRole('list').waitFor({ state: 'visible', timeout: 10000 });
    const steps = this.page.getByRole('list').getByRole('listitem');
    const texts: string[] = [];
    const count = await steps.count();
    for (let i = 0; i < count; i++) {
      const text = await steps.nth(i).innerText();
      texts.push(text.trim());
    }
    return texts;
  }

  async getStepCount(): Promise<number> {
    await this.page.getByRole('list').waitFor({ state: 'visible', timeout: 10000 });
    return this.page.getByRole('list').getByRole('listitem').count();
  }

  // ── Upload options ────────────────────────────────────────────────────────

  async isTakePhotoVisible(): Promise<boolean> {
    return this.page.getByRole('button', { name: 'Take a photo' }).isVisible();
  }

  async isChooseFromGalleryVisible(): Promise<boolean> {
    return this.page.getByRole('button', { name: 'Choose from gallery' }).isVisible();
  }

  // ── Guidelines ────────────────────────────────────────────────────────────

  async getGuidelineTexts(): Promise<string[]> {
    const guidelines = this.page.getByText('Please follow the guidelines below:')
      .locator('..')
      .locator('p');
    const all = await guidelines.allInnerTexts();
    return all.filter(t => t.trim() !== 'Please follow the guidelines below:');
  }

  // ── Back navigation ───────────────────────────────────────────────────────

  async goBack() {
    await this.page.getByRole('button').first().click();
    await this.page.waitForTimeout(1500);
  }
}
