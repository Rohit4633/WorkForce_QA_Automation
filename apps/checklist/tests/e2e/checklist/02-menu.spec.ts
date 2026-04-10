import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { HomePage } from '../../pages/HomePage';
import { MenuPage } from '../../pages/MenuPage';
import { loadVendorCandidate } from '../../helpers/data-helpers';

test.describe('Menu', () => {

  // CHK-MENU-01 ─────────────────────────────────────────────────────────────
  test('CHK-MENU-01: menu shows candidate name, phone number and vendor name matching last created candidate', async ({ page }) => {
    const homePage = new HomePage(page, test);
    const menuPage = new MenuPage(page, test);
    const candidate = loadVendorCandidate();

    await homePage.goto();
    await homePage.openMenu();

    await expect(page.getByRole('dialog')).toBeVisible();

    const name = await menuPage.getCandidateName();
    expect(name.toLowerCase()).toContain(candidate.firstName.toLowerCase());

    const phone = await menuPage.getPhoneNumber();
    expect(phone).toContain(candidate.phone.replace('+', '').substring(0, 6)); // partial match on phone digits

    const vendor = await menuPage.getVendorName();
    expect(vendor).toBe('1455 Noon Test AE');
  });

  // CHK-MENU-02 ─────────────────────────────────────────────────────────────
  test('CHK-MENU-02: Work Information page shows empty state for candidate with no employment', async ({ page }) => {
    const homePage = new HomePage(page, test);
    const menuPage = new MenuPage(page, test);

    await homePage.goto();
    await homePage.openMenu();
    await menuPage.navigateTo('Work Information');

    await expect(page).toHaveURL(/\/en\/employment/);
    await expect(page.getByRole('heading', { name: 'Work Information' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'No employment details' })).toBeVisible();
  });

  // CHK-MENU-03 ─────────────────────────────────────────────────────────────
  test('CHK-MENU-03: Interviews page shows no upcoming interviews for new candidate', async ({ page }) => {
    const homePage = new HomePage(page, test);
    const menuPage = new MenuPage(page, test);

    await homePage.goto();
    await homePage.openMenu();
    await menuPage.navigateTo('Interviews');

    await expect(page).toHaveURL(/\/en\/interviews/);
    // Use level: 3 to avoid strict-mode match with the "There's no Upcoming Interviews!" h6
    await expect(page.getByRole('heading', { name: 'Interviews', level: 3 })).toBeVisible();
    await expect(page.getByText("There's no Upcoming Interviews!")).toBeVisible();
  });

  // CHK-MENU-04 ─────────────────────────────────────────────────────────────
  test('CHK-MENU-04: Documents link in menu navigates back to homepage', async ({ page }) => {
    const homePage = new HomePage(page, test);
    const menuPage = new MenuPage(page, test);

    // Navigate away first
    await page.goto('/en/employment');
    await page.waitForTimeout(1500);

    await menuPage.openMenu();
    await menuPage.navigateTo('Documents');

    await expect(page).toHaveURL(/\/en$/);
    await expect(page.getByText('IMPORTANT DOCUMENTS')).toBeVisible();
  });

});
