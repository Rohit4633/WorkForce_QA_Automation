import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { HomePage } from '../../pages/HomePage';

test.describe('Homepage — Search', () => {

  test('search by candidate name shows matching results', async ({ page }) => {
    const homePage = new HomePage(page, test);
    await homePage.goto();

    await homePage.searchCandidate('Tanya');
    await page.waitForTimeout(1500);
    const results = await homePage.getSearchResults();

    expect(results.length).toBeGreaterThan(0);
    results.forEach(name => {
      expect(name.toLowerCase()).toContain('tanya');
    });
  });

  test('search with no matching results shows empty table', async ({ page }) => {
    const homePage = new HomePage(page, test);
    await homePage.goto();

    await homePage.searchCandidate('XYZNONEXISTENTCANDIDATE123');
    await page.waitForTimeout(2000);

    const count = await homePage.getTableRowCount();
    expect(count).toBe(0);
  });

  test('clearing search restores full candidate list', async ({ page }) => {
    const homePage = new HomePage(page, test);
    await homePage.goto();

    const initialCount = await homePage.getTableRowCount();

    await homePage.searchCandidate('Tanya');
    const filteredCount = await homePage.getTableRowCount();

    await homePage.clearSearch();
    const restoredCount = await homePage.getTableRowCount();

    expect(restoredCount).toBe(initialCount);
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });
});