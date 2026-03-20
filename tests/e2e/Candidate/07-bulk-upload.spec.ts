 import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { BulkUploadPage } from '../../pages/BulkUploadPage';
import { createBulkUploadTemplate, generateBulkCandidates } from '../../helpers/create-bulk-template';

test.describe('Candidate — Bulk Upload', () => {

  test('bulk upload 5 candidates and verify in table', async ({ page }) => {
    const bulkUploadPage = new BulkUploadPage(page, test);

    // ── Step 1: Navigate to homepage ──────────────────────────────────────
    await page.goto('/');
    await bulkUploadPage.ensureCorrectProject();

    // ── Step 2: Generate 5 candidates and create template ─────────────────
    const candidates = generateBulkCandidates(5);
    const templatePath = createBulkUploadTemplate(candidates);

    candidates.forEach(c => console.log(`📋 Candidate: ${c.firstName} ${c.lastName}`));

    // ── Step 3: Click Bulk Upload ─────────────────────────────────────────
    await bulkUploadPage.clickBulkUpload();

    // ── Step 4: Skip download template (we already have our file) ─────────
    // Click Next to go to Upload Sheet step
    await bulkUploadPage.clickNext();

    // ── Step 5: Upload the pre-filled template ────────────────────────────
    await bulkUploadPage.uploadFile(templatePath);

    // ── Step 6: Click Next to process ────────────────────────────────────
    await bulkUploadPage.clickNext();

    // ── Step 7: Wait for success message ─────────────────────────────────
    await bulkUploadPage.waitForSuccess();

    // ── Step 8: Verify success count ──────────────────────────────────────
    const successCount = await bulkUploadPage.getSuccessRowCount();
    console.log(`✅ ${successCount} rows processed successfully`);
    expect(successCount).toBeGreaterThan(0);

    // ── Step 9: Click Back to Team ────────────────────────────────────────
    await bulkUploadPage.clickBackToTeam();

    // Wait for homepage to fully load after bulk upload
    await page.waitForTimeout(3000);
    await page.waitForLoadState('domcontentloaded');
    
    // ── Step 10: Verify all candidates appear in table ────────────────────
    for (const candidate of candidates) {
  // Clear search first
  await page.getByPlaceholder('Search').clear();
  await page.waitForTimeout(1000);

  // Search for candidate
  await page.getByPlaceholder('Search').fill(candidate.firstName);
  await page.waitForTimeout(2500); // give search time to filter

  // Verify with longer timeout
  const row = page.getByRole('row').filter({ hasText: candidate.firstName });
  await expect(row.first()).toBeVisible({ timeout: 15000 });
  console.log(`✅ ${candidate.firstName} ${candidate.lastName} found in table`);

  // Clear between searches
  await page.getByPlaceholder('Search').clear();
  await page.waitForTimeout(500);
    }
});
});
