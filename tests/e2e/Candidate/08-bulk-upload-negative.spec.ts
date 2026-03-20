import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { BulkUploadPage } from '../../pages/BulkUploadPage';
import { loadCreatedCandidate } from '../../helpers/test-state';
import {
  createMissingFieldsTemplate,
  createDuplicateTemplate,
  createFixedTemplate
} from '../../helpers/create-bulk-template';

test.describe('Candidate — Bulk Upload Negative Scenarios', () => {

  // ── Test 1: Missing Mandatory Fields ──────────────────────────────────────
  test('upload with missing mandatory fields shows error then fix and re-upload', async ({ page }) => {
    const bulkUploadPage = new BulkUploadPage(page, test);

    // Step 1 — Navigate to homepage
    await page.goto('/');
    await bulkUploadPage.ensureCorrectProject();

    // Step 2 — Create template with missing fields
    const invalidFilePath = createMissingFieldsTemplate();
    console.log('📄 Created template with missing mandatory fields');

    // Step 3 — Click Bulk Upload
    await bulkUploadPage.clickBulkUpload();

    // Step 4 — Skip to upload step
    await bulkUploadPage.clickNext();

    // Step 5 — Upload invalid file
    await bulkUploadPage.uploadFile(invalidFilePath);

    // Step 6 — Click Next to process
    await bulkUploadPage.clickNext();

    // Step 7 — Verify error screen appears
    await bulkUploadPage.waitForError();
    console.log('✅ Error screen appeared as expected');

    // Step 8 — Verify rows failed and 0 processed
    const failedCount = await bulkUploadPage.getFailedRowCount();
    const successCount = await bulkUploadPage.getSuccessRowCount();
    expect(failedCount).toBeGreaterThan(0);
    expect(successCount).toBe(0);
    console.log(`✅ ${failedCount} rows failed, ${successCount} rows processed`);

    // Step 9 — Verify Re-Upload is disabled before downloading error report
    const reUploadBeforeDownload = await bulkUploadPage.isReUploadEnabled();
    expect(reUploadBeforeDownload).toBe(false);
    console.log('✅ Re-Upload button is disabled before downloading error report');

    // Step 10 — Download error report and read errors
    const errorReportPath = await bulkUploadPage.downloadErrorReport();
    console.log('✅ Error report downloaded');

    // Read and log error messages from report
    const errorMessages = await bulkUploadPage.readErrorReport(errorReportPath);
    expect(errorMessages.length).toBeGreaterThan(0);
    console.log(`✅ Error messages recorded: ${errorMessages.join(' | ')}`);

    // Step 11 — Verify Re-Upload is now enabled
    await page.waitForTimeout(1000);
    const reUploadAfterDownload = await bulkUploadPage.isReUploadEnabled();
    expect(reUploadAfterDownload).toBe(true);
    console.log('✅ Re-Upload button is now enabled');

    // Step 12 — Create fixed template
    const fixedFilePath = createFixedTemplate('Fixed', 'Candidate');

    // Step 13 — Click Re-Upload and upload fixed file
    await bulkUploadPage.clickReUpload();
    await bulkUploadPage.uploadFile(fixedFilePath);

    // Step 14 — Click Next to process fixed file
    await bulkUploadPage.clickNext();

    // Step 15 — Wait for success
    await bulkUploadPage.waitForSuccess();
    const finalSuccessCount = await bulkUploadPage.getSuccessRowCount();
    expect(finalSuccessCount).toBeGreaterThan(0);
    console.log(`✅ Fixed file processed successfully — ${finalSuccessCount} rows`);

    // Step 16 — Click Back to Team
    await bulkUploadPage.clickBackToTeam();
    console.log('✅ Missing fields negative test completed successfully');
  });

  // ── Test 2: Duplicate Candidate ───────────────────────────────────────────
  test('upload duplicate candidate shows error then fix and re-upload', async ({ page }) => {
    const bulkUploadPage = new BulkUploadPage(page, test);

    // Step 1 — Load saved candidate Emirates ID for duplicate trigger
    const { emiratesId } = loadCreatedCandidate();
    console.log(`Using Emirates ID as duplicate: ${emiratesId}`);

    // Step 2 — Navigate to homepage
    await page.goto('/');
    await bulkUploadPage.ensureCorrectProject();

    // Step 3 — Create duplicate template using saved Emirates ID
    const duplicateFilePath = createDuplicateTemplate(
      `+9198${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      emiratesId
    );
    console.log('📄 Created template with duplicate Emirates ID');

    // Step 4 — Click Bulk Upload
    await bulkUploadPage.clickBulkUpload();

    // Step 5 — Skip to upload step
    await bulkUploadPage.clickNext();

    // Step 6 — Upload duplicate file
    await bulkUploadPage.uploadFile(duplicateFilePath);

    // Step 7 — Click Next to process
    await bulkUploadPage.clickNext();

    // Step 8 — Verify error screen
    await bulkUploadPage.waitForError();
    console.log('✅ Duplicate error screen appeared as expected');

    // Step 9 — Verify rows failed
    const failedCount = await bulkUploadPage.getFailedRowCount();
    expect(failedCount).toBeGreaterThan(0);
    console.log(`✅ ${failedCount} duplicate rows rejected correctly`);

    // Step 10 — Verify Re-Upload disabled before download
    const reUploadBeforeDownload = await bulkUploadPage.isReUploadEnabled();
    expect(reUploadBeforeDownload).toBe(false);
    console.log('✅ Re-Upload button is disabled before downloading error report');

    // Step 11 — Download error report and read errors
    const errorReportPath = await bulkUploadPage.downloadErrorReport();
    console.log('✅ Error report downloaded');

    // Read and log error messages from report
    const errorMessages = await bulkUploadPage.readErrorReport(errorReportPath);
    expect(errorMessages.length).toBeGreaterThan(0);
    console.log(`✅ Duplicate error messages recorded: ${errorMessages.join(' | ')}`);

    // Step 12 — Verify Re-Upload enabled after download
    await page.waitForTimeout(1000);
    const reUploadEnabled = await bulkUploadPage.isReUploadEnabled();
    expect(reUploadEnabled).toBe(true);
    console.log('✅ Re-Upload button enabled after downloading error report');

    // Step 13 — Create fixed template with unique Emirates ID
    const fixedFilePath = createFixedTemplate('Unique', 'Candidate');

    // Step 14 — Re-Upload with fixed file
    await bulkUploadPage.clickReUpload();
    await bulkUploadPage.uploadFile(fixedFilePath);

    // Step 15 — Process fixed file
    await bulkUploadPage.clickNext();

    // Step 16 — Verify success
    await bulkUploadPage.waitForSuccess();
    const successCount = await bulkUploadPage.getSuccessRowCount();
    expect(successCount).toBeGreaterThan(0);
    console.log(`✅ Fixed unique candidate uploaded successfully`);

    // Step 17 — Back to Team
    await bulkUploadPage.clickBackToTeam();
    console.log('✅ Duplicate negative test completed successfully');
  });
});