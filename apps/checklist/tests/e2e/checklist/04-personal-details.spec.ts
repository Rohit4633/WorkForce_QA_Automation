import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { PersonalDetailsPage } from '../../pages/PersonalDetailsPage';
import { loadVendorCandidate } from '../../helpers/data-helpers';

test.describe('Personal Details', () => {

  // CHK-PD-01 ────────────────────────────────────────────────────────────────
  test('CHK-PD-01: personal details shows first name and last name matching last created candidate', async ({ page }) => {
    const detailsPage = new PersonalDetailsPage(page, test);
    const candidate = loadVendorCandidate();

    await detailsPage.goto();
    await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();

    const firstName = await detailsPage.getFirstName();
    expect(firstName.toLowerCase()).toBe(candidate.firstName.toLowerCase());

    const lastName = await detailsPage.getLastName();
    expect(lastName.toLowerCase()).toBe(candidate.lastName.toLowerCase());
  });

  // CHK-PD-02 ────────────────────────────────────────────────────────────────
  test('CHK-PD-02: personal details shows phone number matching last created candidate', async ({ page }) => {
    const detailsPage = new PersonalDetailsPage(page, test);
    const candidate = loadVendorCandidate();

    await detailsPage.goto();

    const phone = await detailsPage.getPersonalPhone();
    expect(phone.replace(/\s/g, '')).toBe(candidate.phone);
  });

  // CHK-PD-03 ────────────────────────────────────────────────────────────────
  test('CHK-PD-03: personal details shows correct nationality for the candidate phone country code', async ({ page }) => {
    const detailsPage = new PersonalDetailsPage(page, test);
    const candidate = loadVendorCandidate();

    await detailsPage.goto();

    const nationality = await detailsPage.getNationality();

    // +91 → India, +971 → United Arab Emirates
    if (candidate.phone.startsWith('+91')) {
      expect(nationality).toBe('India');
    } else if (candidate.phone.startsWith('+971')) {
      expect(nationality).toContain('United Arab Emirates');
    } else {
      expect(nationality.length).toBeGreaterThan(0);
    }
  });

  // CHK-PD-04 ────────────────────────────────────────────────────────────────
  test('CHK-PD-04: personal details page shows all four information sections', async ({ page }) => {
    const detailsPage = new PersonalDetailsPage(page, test);

    await detailsPage.goto();

    // Each section accordion button has a heading inside — use the button role to avoid strict-mode
    for (const section of ['Basic information', 'Contact information', 'Personal information', 'System information']) {
      await expect(page.getByRole('button', { name: section })).toBeVisible();
    }
  });

});
