import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { CandidatePage } from '../../pages/CandidatePage';

test.describe('Candidate — Create Profile Negative Scenarios', () => {

  // ── Test 1: Submit with all fields empty ──────────────────────────────
  test('submit with all fields empty shows validation errors', async ({ page }) => {
    const candidatePage = new CandidatePage(page, test);
    await candidatePage.goto();

    await candidatePage.clickAddCandidate();
    await candidatePage.clickCreateProfile();
    await page.waitForTimeout(1000);

    await expect(page.getByText('First name is a required field')).toBeVisible();
    console.log('✅ First name validation error shown');

    await expect(page.getByText('Last name is a required field')).toBeVisible();
    console.log('✅ Last name validation error shown');

    await expect(page.getByText('Phone number is required')).toBeVisible();
    console.log('✅ Phone number validation error shown');

    await expect(page.getByText('Nationality is a required field')).toBeVisible();
    console.log('✅ Nationality validation error shown');

    console.log('✅ All validation errors displayed correctly for empty form');
  });

  // ── Test 2: Submit with invalid phone format ──────────────────────────
  test('submit with invalid phone format shows phone error', async ({ page }) => {
    const candidatePage = new CandidatePage(page, test);
    await candidatePage.goto();

    await candidatePage.clickAddCandidate();
    await candidatePage.fillFirstName('Rohit');
    await candidatePage.fillLastName('Test');

    // Select country code first — phone input becomes active after this
    await candidatePage.selectCountryCode();

    // Enter invalid phone number (too short) using role textbox
    await page.getByRole('textbox', { name: 'Personal phone number' }).fill('6767');
    await page.waitForTimeout(500);

    await candidatePage.selectNationality();
    await candidatePage.clickCreateProfile();
    await page.waitForTimeout(1000);

    await expect(page.getByText('Phone number is not valid')).toBeVisible();
    console.log('✅ Invalid phone format error shown correctly');
  });

  // ── Test 3: Submit with invalid Emirates ID format ────────────────────
  test('submit with invalid emirates id format shows format error', async ({ page }) => {
    const candidatePage = new CandidatePage(page, test);
    await candidatePage.goto();

    await candidatePage.clickAddCandidate();
    await candidatePage.fillFirstName('Rohit');
    await candidatePage.fillLastName('Test');
    await candidatePage.selectCountryCode();
    await candidatePage.fillPhoneNumber('9812345678');
    await candidatePage.selectNationality();

    // Use getByRole textbox with label name instead of placeholder
    await page.getByRole('textbox', { name: 'Emirates ID' }).fill('232-32');
    await page.waitForTimeout(500);

    await candidatePage.clickCreateProfile();
    await page.waitForTimeout(1000);

    await expect(page.getByText('Invalid input format for the given document type')).toBeVisible();
    console.log('✅ Invalid Emirates ID format error shown correctly');
  });

  // ── Test 4: First name with exactly 1 character ───────────────────────
  test('first name with single letter is accepted but single number is rejected', async ({ page }) => {
    const candidatePage = new CandidatePage(page, test);
    await candidatePage.goto();

    // ── Scenario A: Single number as first name — should fail ─────────────
    await candidatePage.clickAddCandidate();
    await candidatePage.fillFirstName('1');
    await candidatePage.fillLastName('Test');
    await candidatePage.selectCountryCode();
    await candidatePage.fillPhoneNumber('9812345678');
    await candidatePage.selectNationality();
    await candidatePage.selectVisaSponsorship('No');
    await candidatePage.clickCreateProfile();
    await page.waitForTimeout(1000);

    await expect(page.getByText('A valid first name is required')).toBeVisible();
    console.log('✅ Single number as first name rejected with correct error');

    // Close form
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // ── Scenario B: Single letter as first name — should pass ─────────────
    await candidatePage.clickAddCandidate();
    await candidatePage.fillFirstName('A');
    await candidatePage.fillLastName('Test');
    await candidatePage.selectCountryCode();
    await candidatePage.fillPhoneNumber('9812345678');
    await candidatePage.selectNationality();
    await candidatePage.selectVisaSponsorship('No');
    await candidatePage.clickCreateProfile();
    await page.waitForTimeout(1000);

    await expect(page.getByText('A valid first name is required')).not.toBeVisible();
    await expect(page.getByText('First name is a required field')).not.toBeVisible();
    console.log('✅ Single letter first name accepted successfully');
  });
});