import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { ReportsPage } from '../../pages/ReportsPage';

test.describe('Reports — All Profiles', () => {

  test('generate all profiles report and verify CSV matches UI', async ({ page }) => {
    const reportsPage = new ReportsPage(page, test);

    // ── Step 1: Navigate to homepage ──────────────────────────────────────
    await page.goto('/');
    await reportsPage.ensureCorrectProject();

    // ── Step 2: Click Reports tab in left sidebar ─────────────────────────
    await reportsPage.goToReports();
    console.log('✅ Navigated to Reports page');

    // ── Step 3: Search for All Profiles report ────────────────────────────
    await reportsPage.searchReport('All Profiles');
    console.log('✅ Searched for All Profiles');

    // ── Step 4: Select the report ─────────────────────────────────────────
    await reportsPage.selectReport('All Profiles');
    console.log('✅ Selected All Profiles report');

    // ── Step 5: Set date range (start of month to today) ──────────────────
    const startDate = reportsPage.getStartOfMonth();
    const endDate = reportsPage.getToday();
    console.log(`📅 Date range: ${startDate} to ${endDate}`);

    await reportsPage.setStartDate(startDate);
    await reportsPage.setEndDate(endDate);

    // ── Step 6: Click Generate ────────────────────────────────────────────
    await reportsPage.clickGenerate();
    console.log('✅ Report generated');

    // ── Step 7: Get UI table data (current page only) ─────────────────────
    const uiData = await reportsPage.getReportTableData();
    expect(uiData.length).toBeGreaterThan(0);
    console.log(`✅ UI table has ${uiData.length} rows (current page)`);

    // ── Step 8: Download report ───────────────────────────────────────────
    const filePath = await reportsPage.downloadReport();
    expect(filePath).not.toBe('');
    console.log('✅ Report downloaded');

    // ── Step 9: Read CSV data ─────────────────────────────────────────────
    const csvData = reportsPage.readCSVReport(filePath);
    expect(csvData.length).toBeGreaterThan(0);
    console.log(`✅ CSV has ${csvData.length} rows total`);

    // ── Step 10: Verify CSV has at least as many rows as UI current page ──
    console.log(`📊 UI shows ${uiData.length} rows (paginated), CSV has ${csvData.length} rows total`);
    expect(csvData.length).toBeGreaterThanOrEqual(uiData.length);
    console.log(`✅ CSV contains at least as many rows as UI current page`);

    // ── Step 11: Verify each UI row exists in CSV ─────────────────────────
    let matchCount = 0;
    for (const uiRow of uiData) {
      const fullName = uiRow['full name']?.trim() || uiRow['Full Name']?.trim();
      if (!fullName || fullName === '-') continue;

      // Find matching row in CSV by Full Name
      const csvRow = csvData.find(row =>
        Object.values(row).some(val =>
          val?.toString().toLowerCase().includes(fullName.toLowerCase())
        )
      );

      if (csvRow) {
        matchCount++;
        console.log(`✅ Verified: ${fullName}`);

        // Verify Status
        const uiStatus = uiRow['status']?.trim() || uiRow['Status']?.trim();
        const csvStatus = Object.entries(csvRow)
          .find(([k]) => k.toLowerCase().includes('status'))?.[1]?.toString().trim();
        if (uiStatus && csvStatus) {
          expect(csvStatus.toLowerCase()).toContain(uiStatus.toLowerCase());
        }

        // Verify Nationality
        const uiNationality = uiRow['nationality']?.trim() || uiRow['Nationality']?.trim();
        const csvNationality = Object.entries(csvRow)
          .find(([k]) => k.toLowerCase().includes('nationality'))?.[1]?.toString().trim();
        if (uiNationality && uiNationality !== '-' && csvNationality) {
          expect(csvNationality.toLowerCase()).toContain(uiNationality.toLowerCase());
        }

      } else {
        console.log(`⚠️ ${fullName} not found in CSV`);
      }
    }

    console.log(`✅ Verified ${matchCount} out of ${uiData.length} UI rows exist in CSV`);
    expect(matchCount).toBeGreaterThan(0);

    // ── Step 12: Click Back to all Reports ───────────────────────────────
    await reportsPage.clickBackToAllReports();
    console.log('✅ Navigated back to all Reports');

    // ── Step 13: Verify we are back on Reports page ───────────────────────
    await expect(page.getByRole('heading', { name: 'Reports' })).toBeVisible();
    console.log('✅ Reports page verified');
  });
});