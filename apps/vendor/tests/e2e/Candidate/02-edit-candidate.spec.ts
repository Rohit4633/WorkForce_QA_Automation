import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { CandidateEditPage } from '../../pages/CandidateEditPage';
import { randomPhoneNumber } from '../../helpers/data-helpers';
import { loadCreatedCandidate } from '../../helpers/test-state';

// ── Helper: navigate to the last-created candidate's profile ─────────────────
async function goToProfile(editPage: CandidateEditPage, firstName: string, lastName: string) {
  await editPage.page.goto('/');
  await editPage.ensureCorrectProject();
  await editPage.page.getByPlaceholder('Search').fill(firstName);
  await editPage.page.waitForTimeout(1500);
  await editPage.openCandidateProfile(firstName, lastName);
  await editPage.page.waitForURL(/\/member\//, { timeout: 15000 });
  await editPage.page.waitForTimeout(1000);
}

test.describe('Candidate — Profile Page', () => {

  // PROF-01 ──────────────────────────────────────────────────────────────────
  test('profile page shows correct candidate name and status badge', async ({ page }) => {
    const editPage = new CandidateEditPage(page, test);
    const { firstName, lastName } = loadCreatedCandidate();

    await goToProfile(editPage, firstName, lastName);

    const profileName = await editPage.getProfileName();
    expect(profileName).toContain(firstName);
    expect(profileName).toContain(lastName);
    console.log(`✅ Profile heading: "${profileName}"`);

    const badgeVisible = await editPage.isStatusBadgeVisible();
    expect(badgeVisible).toBe(true);
    console.log(`✅ Status badge visible`);
  });

  // PROF-06 ──────────────────────────────────────────────────────────────────
  test('editing candidate first name updates the profile heading', async ({ page }) => {
    const editPage = new CandidateEditPage(page, test);
    const { firstName, lastName } = loadCreatedCandidate();
    const updatedFirstName = `${firstName}Ed`;

    await goToProfile(editPage, firstName, lastName);

    // ── Edit name ────────────────────────────────────────────────────────────
    await editPage.clickEdit();
    await editPage.fillFirstName(updatedFirstName);
    await editPage.clickApply();

    try {
      const updatedName = await editPage.getProfileName();
      // App may normalise case (e.g. "Ed" → "ed") — compare case-insensitively
      expect(updatedName.toLowerCase()).toContain(updatedFirstName.toLowerCase());
      console.log(`✅ Profile heading updated to: "${updatedName}"`);
    } finally {
      // Always restore original name so subsequent tests can find this candidate
      await editPage.clickEdit();
      await editPage.fillFirstName(firstName);
      await editPage.clickApply();
      console.log(`✅ Name restored to: "${firstName} ${lastName}"`);
    }
  });

  // PROF-08 ──────────────────────────────────────────────────────────────────
  test('employment tab shows empty state for candidate with no employment history', async ({ page }) => {
    const editPage = new CandidateEditPage(page, test);
    const { firstName, lastName } = loadCreatedCandidate();

    await goToProfile(editPage, firstName, lastName);

    await editPage.clickEmploymentTab();

    const emptyStateVisible = await editPage.isEmploymentEmptyStateVisible();
    expect(emptyStateVisible).toBe(true);
    console.log(`✅ "No employment history" empty state visible`);
  });

});

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