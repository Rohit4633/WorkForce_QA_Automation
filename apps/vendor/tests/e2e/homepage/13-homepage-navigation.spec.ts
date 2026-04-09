import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { HomePage } from '../../pages/HomePage';

test.describe('Homepage — Navigation', () => {

  // NAV-04 ───────────────────────────────────────────────────────────────────
  test('NAV-04: clicking the app logo from a sub-page navigates back to the homepage', async ({ page }) => {
    const homePage = new HomePage(page, test);
    await homePage.goto();

    // Navigate away to Reports first
    await homePage.clickNavReports();
    await expect(page).toHaveURL(/\/reports/, { timeout: 10000 });
    console.log('✅ On Reports page');

    // Click logo to go home
    await homePage.clickLogo();

    await expect(page).toHaveURL(/\/en(\?|$|\/(?!reports|business))/, { timeout: 10000 });
    console.log(`✅ Back on homepage: ${page.url()}`);

    await expect(page.getByRole('heading', { name: 'Team' })).toBeVisible({ timeout: 10000 });
    console.log('✅ "Team" heading visible on homepage');
  });

});
