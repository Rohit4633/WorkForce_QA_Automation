import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { HomePage } from '../../pages/HomePage';
import { loadVendorCandidate } from '../../helpers/data-helpers';

test.describe('Homepage', () => {

  // CHK-HOME-01 ────────────────────────────────────────────────────────────
  test('CHK-HOME-01: homepage shows Ahlan! greeting with candidate name and Candidate role', async ({ page }) => {
    const homePage = new HomePage(page, test);
    await homePage.goto();

    const candidate = loadVendorCandidate();

    // Use toHaveText() for auto-waiting instead of raw innerText()
    await expect(page.getByRole('heading', { level: 5 })).toHaveText('Ahlan!');

    await expect(page.getByRole('heading', { level: 3 }).first()).toContainText(
      candidate.firstName, { ignoreCase: true }
    );

    await expect(page.getByRole('heading', { level: 4 }).first()).toHaveText('Candidate');
  });

  // CHK-HOME-02 ────────────────────────────────────────────────────────────
  test('CHK-HOME-02: homepage shows IMPORTANT DOCUMENTS section with 4 key documents', async ({ page }) => {
    const homePage = new HomePage(page, test);
    await homePage.goto();

    await expect(page.getByText('IMPORTANT DOCUMENTS')).toBeVisible();

    for (const doc of ['Passport', 'Emirates ID', 'Labour Card', 'Driving License']) {
      await expect(page.getByRole('heading', { level: 3, name: doc })).toBeVisible();
    }
  });

  // CHK-HOME-03 ────────────────────────────────────────────────────────────
  test('CHK-HOME-03: each important document card shows a status badge', async ({ page }) => {
    const homePage = new HomePage(page, test);
    await homePage.goto();

    const validStatuses = ['Missing', 'Pending', 'Incomplete', 'Complete', 'Expired'];

    for (const doc of ['Passport', 'Emirates ID', 'Labour Card', 'Driving License']) {
      const status = await homePage.getDocumentStatus(doc);
      expect(validStatuses).toContain(status);
    }
  });

  // CHK-HOME-04 ────────────────────────────────────────────────────────────
  test('CHK-HOME-04: View Other Documents reveals additional documents', async ({ page }) => {
    const homePage = new HomePage(page, test);
    await homePage.goto();

    // Initially, "View Other Documents" button is visible
    await expect(page.getByRole('button', { name: 'View Other Documents' })).toBeVisible();

    // Expand
    await homePage.expandOtherDocuments();

    // Button text toggles
    await expect(page.getByRole('button', { name: 'Only Important Documents' })).toBeVisible();

    // Other documents are now visible
    for (const doc of ['Health Card', 'Health Insurance', 'Visa']) {
      await expect(page.getByRole('heading', { level: 3, name: doc })).toBeVisible();
    }
  });

  // CHK-HOME-05 ────────────────────────────────────────────────────────────
  test('CHK-HOME-05: QR code link navigates to the QR code page', async ({ page }) => {
    const homePage = new HomePage(page, test);
    await homePage.goto();

    // QR code is a link with href="/en/qr"
    await page.locator('a[href="/en/qr"]').click();
    await page.waitForTimeout(1500);

    await expect(page).toHaveURL(/\/en\/qr/);
    await expect(page.getByRole('heading', { name: 'My QR Code' })).toBeVisible();
  });

});
