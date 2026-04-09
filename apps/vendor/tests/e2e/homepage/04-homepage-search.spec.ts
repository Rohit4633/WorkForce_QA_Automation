import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { HomePage } from '../../pages/HomePage';
import { loadCreatedCandidate } from '../../helpers/test-state';

test.describe('Homepage — General', () => {

  test('homepage shows Team heading and a non-zero candidate count', async ({ page }) => {
    const homePage = new HomePage(page, test);
    await homePage.goto();

    const headingText = await homePage.getTeamHeadingText();
    expect(headingText).toBe('Team');
    console.log(`✅ "Team" heading visible`);

    const count = await homePage.getTeamCount();
    expect(count).toBeGreaterThan(0);
    console.log(`✅ Team count is ${count}`);
  });

  test('clicking a candidate row navigates to the candidate profile', async ({ page }) => {
    const homePage = new HomePage(page, test);
    await homePage.goto();

    await homePage.clickFirstCandidateRow();
    await page.waitForURL(/\/en\/member\//, { timeout: 15000 });

    expect(page.url()).toMatch(/\/en\/member\//);
    console.log(`✅ Profile URL: ${page.url()}`);
  });

});

test.describe('Homepage — Search', () => {

  test('search by candidate name shows matching results', async ({ page }) => {
    const homePage = new HomePage(page, test);
    await homePage.goto();

    await homePage.searchCandidate('Tanya');
    await page.waitForTimeout(1500);
    const results = await homePage.getSearchResults();

    expect(results.length).toBeGreaterThan(0);
    results.forEach(name => {
      expect(name.toLowerCase()).toContain('tanya');
    });
  });

  test('search with no matching results shows empty table', async ({ page }) => {
    const homePage = new HomePage(page, test);
    await homePage.goto();

    await homePage.searchCandidate('XYZNONEXISTENTCANDIDATE123');
    await page.waitForTimeout(2000);

    const count = await homePage.getTableRowCount();
    expect(count).toBe(0);
  });

  test('clearing search restores full candidate list', async ({ page }) => {
    const homePage = new HomePage(page, test);
    await homePage.goto();

    const initialCount = await homePage.getTableRowCount();

    await homePage.searchCandidate('Tanya');
    const filteredCount = await homePage.getTableRowCount();

    await homePage.clearSearch();
    const restoredCount = await homePage.getTableRowCount();

    expect(restoredCount).toBe(initialCount);
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test('search by phone number shows matching candidate', async ({ page }) => {
    const homePage = new HomePage(page, test);

    // Load the candidate created in 01-create-candidate spec
    const { firstName, lastName, phone } = loadCreatedCandidate();

    // Use last 8 digits of phone for search (without country code)
    const phoneSearchTerm = phone?.replace('+91', '').slice(0, 8) || '';

    console.log(`Searching for candidate: ${firstName} ${lastName}`);
    console.log(`Using phone search term: ${phoneSearchTerm}`);

    await homePage.goto();

    // Search by phone number
    await homePage.searchCandidate(phoneSearchTerm);
    await page.waitForTimeout(1500);

    const results = await homePage.getSearchResults();
    expect(results.length).toBeGreaterThan(0);

    // Verify the created candidate appears in results
    const candidateFound = results.some(name =>
      name.toLowerCase().includes(firstName.toLowerCase()) ||
      name.toLowerCase().includes(lastName.toLowerCase())
    );

    expect(candidateFound).toBe(true);
    console.log(`✅ Candidate ${firstName} ${lastName} found via phone search`);
  });
});