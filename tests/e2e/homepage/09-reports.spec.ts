import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { ReportsPage } from '../../pages/ReportsPage';

test.describe('Reports — All Profiles', () => {

  test('generate all profiles report and verify CSV matches UI', async ({ page }) => {
    const reportsPage = new ReportsPage(page, test);

    await page.goto('/');
    await reportsPage.ensureCorrectProject();
    await reportsPage.goToReports();
    console.log('✅ Navigated to Reports page');

    await reportsPage.searchReport('All Profiles');
    console.log('✅ Searched for All Profiles');

    await reportsPage.selectReport('All Profiles');
    console.log('✅ Selected All Profiles report');

    const startDate = reportsPage.getStartOfMonth();
    const endDate = reportsPage.getToday();
    console.log(`📅 Date range: ${startDate} to ${endDate}`);

    await reportsPage.setStartDate(startDate);
    await reportsPage.setEndDate(endDate);

    await reportsPage.clickGenerate();
    console.log('✅ Report generated');

    const uiData = await reportsPage.getReportTableData();
    expect(uiData.length).toBeGreaterThan(0);
    console.log(`✅ UI table has ${uiData.length} rows (current page)`);

    const filePath = await reportsPage.downloadReport();
    expect(filePath).not.toBe('');
    console.log('✅ Report downloaded');

    const csvData = reportsPage.readCSVReport(filePath);
    expect(csvData.length).toBeGreaterThan(0);
    console.log(`✅ CSV has ${csvData.length} rows total`);

    console.log(`📊 UI shows ${uiData.length} rows (paginated), CSV has ${csvData.length} rows total`);
    expect(csvData.length).toBeGreaterThanOrEqual(uiData.length);
    console.log(`✅ CSV contains at least as many rows as UI current page`);

    let matchCount = 0;
    for (const uiRow of uiData) {
      const fullName = uiRow['full name']?.trim() || uiRow['Full Name']?.trim();
      if (!fullName || fullName === '-') continue;

      const csvRow = csvData.find(row =>
        Object.values(row).some(val =>
          val?.toString().toLowerCase().includes(fullName.toLowerCase())
        )
      );

      if (csvRow) {
        matchCount++;
        console.log(`✅ Verified: ${fullName}`);

        const uiStatus = uiRow['status']?.trim() || uiRow['Status']?.trim();
        const csvStatus = Object.entries(csvRow)
          .find(([k]) => k.toLowerCase().includes('status'))?.[1]?.toString().trim();
        if (uiStatus && csvStatus) {
          expect(csvStatus.toLowerCase()).toContain(uiStatus.toLowerCase());
        }

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

    await reportsPage.clickBackToAllReports();
    console.log('✅ Navigated back to all Reports');

    await expect(page.getByRole('heading', { name: 'Reports' })).toBeVisible();
    console.log('✅ Reports page verified');
  });
});