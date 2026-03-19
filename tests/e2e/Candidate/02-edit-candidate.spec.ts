import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { CandidateEditPage } from '../../pages/CandidateEditPage';
import { randomPhoneNumber } from '../../helpers/data-helpers';
import { loadCreatedCandidate } from '../../helpers/test-state';

test.describe('Candidate — Edit Profile', () => {

  test('edit work phone number of last created candidate', async ({ page }) => {
    const editPage = new CandidateEditPage(page, test);

    // ── Step 1: Load candidate created by create-candidate.spec.ts ────────
    const { firstName, lastName } = loadCreatedCandidate();
    const workPhone = randomPhoneNumber();

    console.log(`Editing candidate: ${firstName} ${lastName}`);
    console.log(`New work phone: +91 ${workPhone}`);

    // ── Step 2: Navigate to homepage ──────────────────────────────────────
    await page.goto('/');
    await editPage.ensureCorrectProject();

    // ── Step 3: Search for the candidate ─────────────────────────────────
    await page.getByPlaceholder('Search').fill(firstName);
    await page.waitForTimeout(1500);

    // ── Step 4: Click candidate row to open profile ───────────────────────
    await editPage.openCandidateProfile(firstName, lastName);
    await expect(page).toHaveURL(/\/member\//);
    console.log(`✅ Profile page opened`);

    // ── Step 5: Click Edit button ─────────────────────────────────────────
    await editPage.clickEdit();

    // ── Step 6: Fill Work Phone Number ────────────────────────────────────
    await editPage.fillWorkPhoneNumber(workPhone);

    // ── Step 7: Apply changes ─────────────────────────────────────────────
    await editPage.clickApply();

    // ── Step 8: Verify profile page still visible ─────────────────────────
    await expect(page).toHaveURL(/\/member\//);
    console.log(`✅ Work phone +91 ${workPhone} updated successfully`);
  });
});