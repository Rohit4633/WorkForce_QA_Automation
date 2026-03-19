import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { DocumentsPage } from '../../pages/DocumentsPage';
import { loadCreatedCandidate } from '../../helpers/test-state';

test.describe('Candidate — Documents Section', () => {

  test('emirates ID appears in documents and delete is disabled', async ({ page }) => {
    const documentsPage = new DocumentsPage(page, test);

    // ── Step 1: Load candidate from create test ───────────────────────────
    const { firstName, lastName, emiratesId } = loadCreatedCandidate();
    console.log(`Opening profile: ${firstName} ${lastName}`);
    console.log(`Verifying Emirates ID: ${emiratesId}`);

    // ── Step 2: Navigate to homepage ──────────────────────────────────────
    await page.goto('/');
    await documentsPage.ensureCorrectProject();

    // ── Step 3: Search for candidate ─────────────────────────────────────
    await page.getByPlaceholder('Search').fill(firstName);
    await page.waitForTimeout(1500);

    // ── Step 4: Click candidate row to open profile ───────────────────────
    const row = page.getByRole('row').filter({ hasText: `${firstName} ${lastName}` }).first();
    await expect(row).toBeVisible({ timeout: 10000 });
    await row.click();
    await page.waitForURL(/\/member\//, { timeout: 15000 });
    await page.waitForTimeout(2000);
    console.log(`✅ Profile page opened`);

    // ── Step 5: Scroll to Documents section ───────────────────────────────
    await documentsPage.scrollToDocuments();
    console.log(`✅ Scrolled to Documents section`);

    // ── Step 6: Verify Emirates ID exists with correct number ─────────────
    const idExists = await documentsPage.verifyEmiratesIdExists(emiratesId);
    expect(idExists).toBe(true);
    console.log(`✅ Emirates ID ${emiratesId} found in Documents`);

    // ── Step 7: Verify type is Emirates ID ───────────────────────────────
    const typeExists = await documentsPage.verifyEmiratesIdType();
    expect(typeExists).toBe(true);
    console.log(`✅ Document type "Emirates ID" verified`);

    // ── Step 8: Open three dots menu ─────────────────────────────────────
    await documentsPage.openEmiratesIdMenu();
    console.log(`✅ Three dots menu opened`);

    // ── Step 9: Verify Delete is disabled ────────────────────────────────
    const deleteDisabled = await documentsPage.isDeleteDisabled();
    expect(deleteDisabled).toBe(true);
    console.log(`✅ Delete button is disabled for Emirates ID`);
  });
});