import { expect, Page } from '@playwright/test';
import { test } from '../../fixtures';
import { DocumentsPage } from '../../pages/DocumentsPage';
import {
  loadCreatedCandidate,
  savePassportNumber
} from '../../helpers/test-state';

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

test.describe.configure({ mode: 'serial' });

test.describe('Candidate — Documents Section', () => {

  // ── Helper: navigate to candidate profile ────────────────────────────────
  async function goToProfile(page: Page, documentsPage: DocumentsPage) {
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
    return { firstName, lastName };
  }

  // ── Helper: ensure passport exists, add if missing ───────────────────────
  async function ensurePassportExists(page: Page, documentsPage: DocumentsPage): Promise<string> {
    await documentsPage.scrollToDocuments();
    await page.waitForTimeout(500);

    const passportRow = page.getByRole('row').filter({ hasText: 'Passport' });
    const exists = await passportRow.isVisible();

    if (exists) {
      // Read actual passport number directly from the table cell
      const docNumber = await passportRow.first().locator('td').nth(1).textContent();
      const pn = docNumber?.trim() || '';
      console.log(`✅ Passport already exists in table: ${pn}`);
      savePassportNumber(pn);
      return pn;
    }

    // Passport not in table — try to add it
    const pn = randomPassportNumber();
    console.log(`➕ Passport not found — adding: ${pn}`);

    const result = await documentsPage.tryAddPassport(pn);

    if (result === 'already_exists') {
      // App says it exists but table didn't show it — scroll and re-read
      await documentsPage.scrollToDocuments();
      await page.waitForTimeout(1500);
      const docNumber = await page.getByRole('row')
        .filter({ hasText: 'Passport' }).first()
        .locator('td').nth(1).textContent();
      const existingPn = docNumber?.trim() || pn;
      console.log(`✅ Passport found after retry: ${existingPn}`);
      savePassportNumber(existingPn);
      return existingPn;
    }

    // Successfully added
    savePassportNumber(pn);
    await documentsPage.scrollToDocuments();
    await page.waitForTimeout(1000);
    await expect(page.getByRole('row').filter({ hasText: 'Passport' }).first())
      .toBeVisible({ timeout: 10000 });
    console.log(`✅ Passport added: ${pn}`);
    return pn;
  }

  // ── Test 1: Emirates ID appears and delete is disabled ───────────────────
  test('emirates ID appears in documents and delete is disabled', async ({ page }) => {
    const documentsPage = new DocumentsPage(page, test);
    const { emiratesId } = loadCreatedCandidate();

    const { firstName, lastName } = await goToProfile(page, documentsPage);
    console.log(`Opening profile: ${firstName} ${lastName}`);
    console.log(`Verifying Emirates ID: ${emiratesId}`);

    await documentsPage.scrollToDocuments();

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

  // ── Test 2: Add a new Passport document ──────────────────────────────────
  test('add a new passport document to candidate profile', async ({ page }) => {
    const documentsPage = new DocumentsPage(page, test);

    await goToProfile(page, documentsPage);

    const passportNumber = randomPassportNumber();
    savePassportNumber(passportNumber);
    console.log(`Using passport number: ${passportNumber}`);

    await documentsPage.scrollToDocuments();
    await documentsPage.clickAddDocument();
    console.log(`✅ Add document modal opened`);

    await documentsPage.selectDocumentType('Passport');
    await documentsPage.fillPassportNumber(passportNumber);
    await documentsPage.fillIssueDate('2020-01-15');
    await documentsPage.fillExpiryDate('2030-01-15');
    await documentsPage.selectCountry('India');
    await documentsPage.clickSave();

    await documentsPage.scrollToDocuments();
    await page.waitForTimeout(1000);

    const passportExists = await documentsPage.verifyDocumentExists('Passport');
    expect(passportExists).toBe(true);
    console.log(`✅ Passport document verified in Documents section`);
  });

  // ── Test 3: View document details ────────────────────────────────────────
  test('view document details shows correct information', async ({ page }) => {
    const documentsPage = new DocumentsPage(page, test);

    await goToProfile(page, documentsPage);

    // Ensure passport exists — adds it if Test 2 ran in a different context
    const passportNumber = await ensurePassportExists(page, documentsPage);
    console.log(`Using passport number: ${passportNumber}`);

    await documentsPage.openDocumentMenu('Passport');
    console.log(`✅ Three dots menu opened for Passport`);

    await documentsPage.clickView();
    console.log(`✅ View option clicked`);

    const viewModalOpen = await documentsPage.verifyViewModalOpen();
    expect(viewModalOpen).toBe(true);
    console.log(`✅ View document modal opened`);

    const dialog = page.getByRole('dialog');
    const documentTypeValue = await dialog
      .getByRole('combobox', { name: 'Document type' })
      .textContent();
    expect(documentTypeValue?.trim().toLowerCase()).toContain('passport');
    console.log(`✅ Passport document type verified in view modal`);

    const passportNumberValue = await dialog
      .getByRole('textbox', { name: 'Passport Number' })
      .inputValue();
    expect(passportNumberValue).toBe(passportNumber);
    console.log(`✅ Passport number ${passportNumber} verified in view modal`);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    console.log(`✅ View modal closed`);
  });

  // ── Test 4: Edit document details ────────────────────────────────────────
  test('edit passport document updates details successfully', async ({ page }) => {
    const documentsPage = new DocumentsPage(page, test);

    await goToProfile(page, documentsPage);
    await ensurePassportExists(page, documentsPage);

    await documentsPage.openDocumentMenu('Passport');
    console.log(`✅ Three dots menu opened for Passport`);

    await documentsPage.clickEdit();
    console.log(`✅ Edit option clicked`);

    const editModalOpen = await documentsPage.verifyEditModalOpen();
    expect(editModalOpen).toBe(true);
    console.log(`✅ Edit document modal opened`);

    await documentsPage.fillExpiryDate('2032-06-30');
    console.log(`✅ Expiry date updated to 2032-06-30`);

    await documentsPage.fillDateOfBirth('1990-05-15');
    console.log(`✅ Date of birth filled`);

    await documentsPage.clickSave();
    console.log(`✅ Changes saved`);

    await documentsPage.scrollToDocuments();
    await page.waitForTimeout(1000);

    const passportExists = await documentsPage.verifyDocumentExists('Passport');
    expect(passportExists).toBe(true);
    console.log(`✅ Passport document still exists after edit`);
  });

  // ── Test 5: Delete passport document ────────────────────────────────────
  test('delete passport document removes it from documents section', async ({ page }) => {
    const documentsPage = new DocumentsPage(page, test);

    await goToProfile(page, documentsPage);
    await ensurePassportExists(page, documentsPage);

    await documentsPage.openDocumentMenu('Passport');
    console.log(`✅ Three dots menu opened for Passport`);

    await documentsPage.clickDelete();
    console.log(`✅ Delete option clicked`);

    const confirmBtn = page.getByRole('button', { name: /confirm|yes|delete/i });
    if (await confirmBtn.isVisible({ timeout: 3000 })) {
      await confirmBtn.click();
      await page.waitForTimeout(1000);
      console.log(`✅ Delete confirmed`);
    }

    await page.waitForTimeout(2000);
    const passportExists = await documentsPage.verifyDocumentExists('Passport');
    expect(passportExists).toBe(false);
    console.log(`✅ Passport document successfully deleted`);
  });
});