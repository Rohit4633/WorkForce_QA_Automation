import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { HomePage } from '../../pages/HomePage';
import * as path from 'path';
import * as fs from 'fs';

test.describe('Homepage — Download CSV', () => {

  test('download button downloads a file', async ({ page }) => {
    const homePage = new HomePage(page, test);
    await homePage.goto();

    const filePath = await homePage.clickDownload();

    expect(filePath).not.toBe('');
    expect(fs.existsSync(filePath)).toBe(true);
    console.log(`✅ File exists at: ${filePath}`);
  });


  test('download file with combined filters', async ({ page }) => {
    const homePage = new HomePage(page, test);
    await homePage.goto();

    await homePage.openFilterModal();
    await homePage.filterByBusinessUnit('Core Logistics AE');
    await homePage.applyFilters();

    const filePath = await homePage.clickDownload();

    expect(filePath).not.toBe('');
    expect(fs.existsSync(filePath)).toBe(true);
    console.log(`✅ Combined filter file exists at: ${filePath}`);
  });
});