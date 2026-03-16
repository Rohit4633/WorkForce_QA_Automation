import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { CandidatePage } from '../../pages/CandidatePage';
import {
  randomFirstName,
  randomLastName,
  randomPhoneNumber,
  randomEmiratesId
} from '../../helpers/data-helpers';

test.describe('Candidate Management', () => {

  test('create a new candidate profile successfully', async ({ page }) => {
    const candidatePage = new CandidatePage(page, test);

    const firstName = randomFirstName();
    const lastName = randomLastName();
    const phone = randomPhoneNumber();
    const emiratesId = randomEmiratesId();

    console.log(`Creating candidate: ${firstName} ${lastName}`);
    console.log(`Phone: +91 ${phone}`);
    console.log(`Emirates ID: ${emiratesId}`);

    // Step 1 — Navigate to homepage
    await page.goto(process.env.BASE_URL || 'https://workforce.noonstg.partners/en?project=PRJ1455');
    await page.waitForLoadState('networkidle');

    // Step 2 — Click Add Candidate
    await candidatePage.clickAddCandidate();

    // Step 3 — Fill name
    await candidatePage.fillFirstName(firstName);
    await candidatePage.fillLastName(lastName);

    // Step 4 — Phone number
    await candidatePage.selectCountryCode();
    await candidatePage.fillPhoneNumber(phone);

    // Step 5 — Nationality
    await candidatePage.selectNationality();

    // Step 6 — Emirates ID
    await candidatePage.fillEmiratesId(emiratesId);

    // Step 7 — Visa sponsorship
    await candidatePage.selectVisaSponsorship('No');

    // Step 8 — Create profile
    await candidatePage.clickCreateProfile();

    // Step 9 — Verify in table
    const row = candidatePage.page.getByRole('row').filter({ hasText: firstName });
    await expect(row).toBeVisible({ timeout: 10000 });

    console.log(`✅ Candidate ${firstName} ${lastName} created successfully`);
  });
});