import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { CandidatePage } from '../../pages/CandidatePage';
import {
  randomFirstName,
  randomLastName,
  randomPhoneNumber,
  randomEmiratesId
} from '../../helpers/data-helpers';
import { saveCreatedCandidate } from '../../helpers/test-state';

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

    await candidatePage.goto();
    await candidatePage.clickAddCandidate();
    await candidatePage.fillFirstName(firstName);
    await candidatePage.fillLastName(lastName);
    await candidatePage.selectCountryCode();
    await candidatePage.fillPhoneNumber(phone);
    await candidatePage.selectNationality();
    await candidatePage.fillEmiratesId(emiratesId);
    await candidatePage.selectVisaSponsorship('No');
    await candidatePage.clickCreateProfile();

    const row = candidatePage.page.getByRole('row').filter({ hasText: firstName });
    await expect(row.first()).toBeVisible({ timeout: 10000 });

    // Save candidate details for subsequent tests
    saveCreatedCandidate(firstName, lastName, emiratesId, `+91${phone}`);

    console.log(`✅ Candidate ${firstName} ${lastName} created successfully`);
  });
});