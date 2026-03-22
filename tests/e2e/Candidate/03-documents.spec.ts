import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { DocumentsPage } from '../../pages/DocumentsPage';
import { loadCreatedCandidate } from '../../helpers/test-state';

// ── Generate random passport number ──────────────────────────────────────────
function randomPassportNumber(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const prefix = letters[Math.floor(Math.random() * letters.length)] +
                 letters[Math.floor(Math.random() * letters.length)];
  const suffix = Array.from({ length: 7 }, () =>
    digits[Math.floor(Math.random() * digits.length)]
  ).join('');
  return `${prefix}${suffix}`;
}

// ── Shared passport number across all tests in this file ─────────────────────
const passportNumber = randomPassportNumber();

test.describe('Candidate — Documents Section', () => {

  // ── Test 1: Emirates ID appears in documents and delete is disabled ────────
  test('emirates ID appears in documents and delete is disabled', async ({ page }) => {
    const documentsPage = new DocumentsPage(page, test);

    const { firstName, lastName, emiratesId } = loadCreatedCandidate();
    console.log(`Opening profile: ${firstName} ${lastName}`);
    console.log(`Verifying Emirates ID: ${emiratesId}`);

    await page.goto('/');
    await documentsPage.ensureCorrectProject();

    await page.getByPlaceholder('Search').fill(firstName);
    await page.waitForTimeout(1500);

    const row = page.getByRole('row').filter({ hasText: `${firstName} ${lastName}` }).first();
    await expect(row).toBeVisible({ timeout: 10000 });
    await row.click();
    await page.waitForURL(/\/member\//, { timeout: 15000 });
    await page.waitForTimeout(2000);
    console.log(`✅ Profile page opened`);

    await documentsPage.scrollToDocuments();
    console.log(`✅ Scrolled to Documents section`);

    const idExists = await documentsPage.verifyEmiratesIdExists(emiratesId);
    expect(idExists).toBe(true);
    console.log(`✅ Emirates ID ${emiratesId} found in Documents`);

    const typeExists = await documentsPage.verifyEmiratesIdType();
    expect(typeExists).toBe(true);
    console.log(`✅ Document type "Emirates ID" verified`);

    await documentsPage.openEmiratesIdMenu();
    console.log(`✅ Three dots menu opened`);

    const deleteDisabled = await documentsPage.isDeleteDisabled();
    expect(deleteDisabled).toBe(true);
    console.log(`✅ Delete button is disabled for Emirates ID`);
  });

  // ── Test 2: Add a new Passport document ───────────────────────────────────
  test('add a new passport document to candidate profile', async ({ page }) => {
    const documentsPage = new DocumentsPage(page, test);

    const { firstName, lastName } = loadCreatedCandidate();
    console.log(`Opening profile: ${firstName} ${lastName}`);
    console.log(`Using passport number: ${passportNumber}`);

    await page.goto('/');
    await documentsPage.ensureCorrectProject();

    await page.getByPlaceholder('Search').fill(firstName);
    await page.waitForTimeout(1500);
    const row = page.getByRole('row').filter({ hasText: `${firstName} ${lastName}` }).first();
    await expect(row).toBeVisible({ timeout: 10000 });
    await row.click();
    await page.waitForURL(/\/member\//, { timeout: 15000 });
    await page.waitForTimeout(2000);
    console.log(`✅ Profile page opened`);

    await documentsPage.scrollToDocuments();
    await documentsPage.clickAddDocument();
    console.log(`✅ Add document modal opened`);

    await documentsPage.selectDocumentType('Passport');
    console.log(`✅ Passport selected as document type`);

    await documentsPage.fillPassportNumber(passportNumber);
    console.log(`✅ Passport number ${passportNumber} filled`);

    await documentsPage.fillIssueDate('2020-01-15');
    console.log(`✅ Issue date filled`);

    await documentsPage.fillExpiryDate('2030-01-15');
    console.log(`✅ Expiry date filled`);

    await documentsPage.selectCountry('India');
    console.log(`✅ Country selected`);

    await documentsPage.clickSave();
    console.log(`✅ Document saved`);

    const passportExists = await documentsPage.verifyDocumentExists('Passport');
    expect(passportExists).toBe(true);
    console.log(`✅ Passport document verified in Documents section`);
  });

  // ── Test 3: View document details ─────────────────────────────────────────
  test('view document details shows correct information', async ({ page }) => {
    const documentsPage = new DocumentsPage(page, test);

    const { firstName, lastName } = loadCreatedCandidate();
    console.log(`Using passport number: ${passportNumber}`);

    await page.goto('/');
    await documentsPage.ensureCorrectProject();
    await page.getByPlaceholder('Search').fill(firstName);
    await page.waitForTimeout(1500);
    const row = page.getByRole('row').filter({ hasText: `${firstName} ${lastName}` }).first();
    await expect(row).toBeVisible({ timeout: 10000 });
    await row.click();
    await page.waitForURL(/\/member\//, { timeout: 15000 });
    await page.waitForTimeout(2000);

    await documentsPage.scrollToDocuments();
    await documentsPage.openDocumentMenu('Passport');
    console.log(`✅ Three dots menu opened for Passport`);

    await documentsPage.clickView();
    console.log(`✅ View option clicked`);

    const viewModalOpen = await documentsPage.verifyViewModalOpen();
    expect(viewModalOpen).toBe(true);
    console.log(`✅ View document modal opened`);

    // Verify document type inside dialog combobox shows Passport
    const dialog = page.getByRole('dialog');
    const documentTypeValue = await dialog
      .getByRole('combobox', { name: 'Document type' })
      .textContent();
    expect(documentTypeValue?.trim().toLowerCase()).toContain('passport');
    console.log(`✅ Passport document type verified in view modal`);

    // Verify passport number shown inside dialog
    const passportNumberValue = await dialog
      .getByRole('textbox', { name: 'Passport Number' })
      .inputValue();
    expect(passportNumberValue).toBe(passportNumber);
    console.log(`✅ Passport number ${passportNumber} verified in view modal`);

    // Close modal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    console.log(`✅ View modal closed`);
  });

  // ── Test 4: Edit document details ─────────────────────────────────────────
  test('edit passport document updates details successfully', async ({ page }) => {
    const documentsPage = new DocumentsPage(page, test);

    const { firstName, lastName } = loadCreatedCandidate();

    await page.goto('/');
    await documentsPage.ensureCorrectProject();
    await page.getByPlaceholder('Search').fill(firstName);
    await page.waitForTimeout(1500);
    const row = page.getByRole('row').filter({ hasText: `${firstName} ${lastName}` }).first();
    await expect(row).toBeVisible({ timeout: 10000 });
    await row.click();
    await page.waitForURL(/\/member\//, { timeout: 15000 });
    await page.waitForTimeout(2000);

    await documentsPage.scrollToDocuments();
    await documentsPage.openDocumentMenu('Passport');
    console.log(`✅ Three dots menu opened for Passport`);

    await documentsPage.clickEdit();
    console.log(`✅ Edit option clicked`);

    const editModalOpen = await documentsPage.verifyEditModalOpen();
    expect(editModalOpen).toBe(true);
    console.log(`✅ Edit document modal opened`);

    // Update Expiry Date — only editable field we update for Passport
    await documentsPage.fillExpiryDate('2032-06-30');
    console.log(`✅ Expiry date updated to 2032-06-30`);

    // Update Date of Birth
    await documentsPage.fillDateOfBirth('1990-05-15');
    console.log(`✅ Date of birth filled`);

    await documentsPage.clickSave();
    console.log(`✅ Changes saved`);

    const passportExists = await documentsPage.verifyDocumentExists('Passport');
    expect(passportExists).toBe(true);
    console.log(`✅ Passport document still exists after edit`);
  });

  // ── Test 5: Delete a non-Emirates ID document ─────────────────────────────
  test('delete passport document removes it from documents section', async ({ page }) => {
    const documentsPage = new DocumentsPage(page, test);

    const { firstName, lastName } = loadCreatedCandidate();

    await page.goto('/');
    await documentsPage.ensureCorrectProject();
    await page.getByPlaceholder('Search').fill(firstName);
    await page.waitForTimeout(1500);
    const row = page.getByRole('row').filter({ hasText: `${firstName} ${lastName}` }).first();
    await expect(row).toBeVisible({ timeout: 10000 });
    await row.click();
    await page.waitForURL(/\/member\//, { timeout: 15000 });
    await page.waitForTimeout(2000);

    await documentsPage.scrollToDocuments();
    await documentsPage.openDocumentMenu('Passport');
    console.log(`✅ Three dots menu opened for Passport`);

    await documentsPage.clickDelete();
    console.log(`✅ Delete option clicked`);

    // Handle confirmation if appears
    const confirmBtn = page.getByRole('button', { name: /confirm|yes|delete/i });
    if (await confirmBtn.isVisible({ timeout: 3000 })) {
      await confirmBtn.click();
      await page.waitForTimeout(1000);
      console.log(`✅ Delete confirmed`);
    }

    // Verify Passport no longer exists in table
    await page.waitForTimeout(2000);
    const passportExists = await documentsPage.verifyDocumentExists('Passport');
    expect(passportExists).toBe(false);
    console.log(`✅ Passport document successfully deleted`);
  });
});