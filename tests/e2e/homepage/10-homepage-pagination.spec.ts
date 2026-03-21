import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { HomePage } from '../../pages/HomePage';

test.describe('Homepage — Pagination', () => {

  test('click next page shows different candidates', async ({ page }) => {
    const homePage = new HomePage(page, test);
    await homePage.goto();

    // Get first page candidates
    const firstPageResults = await homePage.getSearchResults();
    expect(firstPageResults.length).toBeGreaterThan(0);
    console.log(`📄 Page 1 has ${firstPageResults.length} candidates`);
    console.log(`First candidate on page 1: ${firstPageResults[0]}`);

    // Click next page
    await page.getByRole('button', { name: 'Go to next page' }).click();
    await page.waitForTimeout(1500);

    // Get second page candidates
    const secondPageResults = await homePage.getSearchResults();
    expect(secondPageResults.length).toBeGreaterThan(0);
    console.log(`📄 Page 2 has ${secondPageResults.length} candidates`);
    console.log(`First candidate on page 2: ${secondPageResults[0]}`);

    // Verify pages show different candidates
    expect(firstPageResults[0]).not.toBe(secondPageResults[0]);
    console.log('✅ Page 2 shows different candidates than page 1');

    // Click previous page to go back
    await page.getByRole('button', { name: 'Go to previous page' }).click();
    await page.waitForTimeout(1500);

    // Verify we are back to page 1
    const backToFirstPage = await homePage.getSearchResults();
    expect(backToFirstPage[0]).toBe(firstPageResults[0]);
    console.log('✅ Previous page navigates back to page 1 correctly');
  });
});