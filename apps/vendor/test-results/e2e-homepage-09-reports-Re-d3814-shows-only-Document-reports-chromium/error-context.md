# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\homepage\09-reports.spec.ts >> Reports — Search and Filter >> REP-02: searching "Document" shows only Document reports
- Location: tests\e2e\homepage\09-reports.spec.ts:7:7

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.fill: Test timeout of 60000ms exceeded.
Call log:
  - waiting for getByPlaceholder('Search for a report')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e9]:
      - generic [ref=e10]:
        - generic [ref=e11]:
          - generic [ref=e13]:
            - generic [ref=e14]:
              - img [ref=e15]
              - img [ref=e21]
              - img [ref=e27]
            - generic [ref=e36]:
              - heading "Welcome Back" [level=4] [ref=e37]
              - paragraph [ref=e38]: Log in to continue
          - generic [ref=e40]:
            - generic [ref=e42]:
              - textbox "Enter your phone number or email" [active] [ref=e44]
              - generic [ref=e45]:
                - button "Continue" [disabled]:
                  - generic: Continue
                  - img
            - generic [ref=e47]: or
            - button "Log in Using QR" [ref=e49] [cursor=pointer]
        - generic [ref=e54] [cursor=pointer]:
          - text: Don't have an account?
          - generic [ref=e55]: Register Now!
      - generic [ref=e57]:
        - button "English" [ref=e59] [cursor=pointer]:
          - text: English
          - img [ref=e60]
        - link "Help" [ref=e65] [cursor=pointer]:
          - /url: https://support.noon.partners/portal/en/kb/seller-help-center/
  - alert [ref=e66]
```

# Test source

```ts
  1   | import { Page } from '@playwright/test';
  2   | import * as XLSX from 'xlsx';
  3   | import { BasePage } from './BasePage';
  4   | 
  5   | export class ReportsPage extends BasePage {
  6   | 
  7   |   constructor(page: Page, test: any) {
  8   |     super(page, test);
  9   |   }
  10  | 
  11  |   // ── Navigate to Reports tab ───────────────────────────────────────────────
  12  |   async goToReports() {
  13  |     const reportsBtn = this.page.getByRole('button', { name: 'Reports' });
  14  |     const reportsBtnAlt = this.page.locator('button').filter({ hasText: 'Reports' });
  15  |     const reportsBtnNav = this.page.locator('nav button').filter({ hasText: 'Reports' });
  16  | 
  17  |     if (await reportsBtn.isVisible()) {
  18  |       await reportsBtn.click();
  19  |     } else if (await reportsBtnAlt.isVisible()) {
  20  |       await reportsBtnAlt.click();
  21  |     } else if (await reportsBtnNav.isVisible()) {
  22  |       await reportsBtnNav.click();
  23  |     } else {
  24  |       await this.page.goto(
  25  |         'https://workforce.noonstg.partners/en/reports?project=PRJ1455'
  26  |       );
  27  |     }
  28  |     await this.page.waitForTimeout(2000);
  29  |   }
  30  | 
  31  |   // ── Search for a report ───────────────────────────────────────────────────
  32  |   async searchReport(name: string) {
> 33  |     await this.page.getByPlaceholder('Search for a report').fill(name);
      |                                                             ^ Error: locator.fill: Test timeout of 60000ms exceeded.
  34  |     await this.page.waitForTimeout(1000);
  35  |   }
  36  | 
  37  |   // ── Select a report ───────────────────────────────────────────────────────
  38  |   async selectReport(name: string) {
  39  |     const row = this.page.getByRole('row').filter({ hasText: name });
  40  |     await row.getByRole('button', { name: 'Select' }).click();
  41  |     await this.page.waitForTimeout(2000);
  42  |   }
  43  | 
  44  |   // ── Set date range ────────────────────────────────────────────────────────
  45  |   async setStartDate(date: string) {
  46  |     await this.page.getByPlaceholder('YYYY-MM-DD').first().fill(date);
  47  |     await this.page.keyboard.press('Enter');
  48  |     await this.page.waitForTimeout(500);
  49  |   }
  50  | 
  51  |   async setEndDate(date: string) {
  52  |     await this.page.getByPlaceholder('YYYY-MM-DD').last().fill(date);
  53  |     await this.page.keyboard.press('Enter');
  54  |     await this.page.waitForTimeout(500);
  55  |   }
  56  | 
  57  |   // ── Click Generate ────────────────────────────────────────────────────────
  58  |   async clickGenerate() {
  59  |     await this.page.getByRole('button', { name: 'Generate' }).click();
  60  |     await this.page.waitForTimeout(3000);
  61  |   }
  62  | 
  63  |   // ── Get all rows from report table (current page only) ────────────────────
  64  |   async getReportTableData(): Promise<Record<string, string>[]> {
  65  |     const rows = this.page.getByRole('row').filter({
  66  |       hasNot: this.page.getByRole('columnheader')
  67  |     });
  68  |     const count = await rows.count();
  69  |     const data: Record<string, string>[] = [];
  70  | 
  71  |     const headerRow = this.page.getByRole('columnheader');
  72  |     const headerCount = await headerRow.count();
  73  |     const headers: string[] = [];
  74  |     for (let i = 0; i < headerCount; i++) {
  75  |       const text = await headerRow.nth(i).textContent();
  76  |       headers.push(text?.trim().toLowerCase() || `col${i}`);
  77  |     }
  78  | 
  79  |     for (let i = 0; i < count; i++) {
  80  |       const cells = rows.nth(i).getByRole('cell');
  81  |       const cellCount = await cells.count();
  82  |       const row: Record<string, string> = {};
  83  |       for (let j = 0; j < cellCount; j++) {
  84  |         const cellText = await cells.nth(j).textContent();
  85  |         row[headers[j]] = cellText?.trim() || '';
  86  |       }
  87  |       data.push(row);
  88  |     }
  89  | 
  90  |     console.log(`📊 Found ${data.length} rows in report table`);
  91  |     return data;
  92  |   }
  93  | 
  94  |   // ── Download report ───────────────────────────────────────────────────────
  95  |   async downloadReport(): Promise<string> {
  96  |     const downloadPromise = this.page.waitForEvent('download', { timeout: 30000 });
  97  |     await this.page.getByRole('button', { name: 'Download' }).click();
  98  |     const download = await downloadPromise;
  99  |     const filePath = await download.path();
  100 |     console.log(`📥 Report downloaded: ${download.suggestedFilename()}`);
  101 |     await this.page.waitForTimeout(1000);
  102 |     return filePath || '';
  103 |   }
  104 | 
  105 |   // ── Read CSV report ───────────────────────────────────────────────────────
  106 |   readCSVReport(filePath: string): Record<string, string>[] {
  107 |     const workbook = XLSX.readFile(filePath);
  108 |     const sheetName = workbook.SheetNames[0];
  109 |     const sheet = workbook.Sheets[sheetName];
  110 |     const rows: Record<string, string>[] = XLSX.utils.sheet_to_json(sheet);
  111 |     console.log(`📄 CSV has ${rows.length} data rows`);
  112 |     return rows;
  113 |   }
  114 | 
  115 |   // ── Get count of visible report rows ─────────────────────────────────────
  116 |   async getVisibleReportCount(): Promise<number> {
  117 |     await this.page.waitForTimeout(500);
  118 |     const rows = this.page.getByRole('row').filter({
  119 |       hasNot: this.page.getByRole('columnheader')
  120 |     });
  121 |     return rows.count();
  122 |   }
  123 | 
  124 |   // ── Get names of visible reports (column index 1 = Name) ─────────────────
  125 |   async getVisibleReportNames(): Promise<string[]> {
  126 |     await this.page.waitForTimeout(500);
  127 |     const rows = this.page.getByRole('row').filter({
  128 |       hasNot: this.page.getByRole('columnheader')
  129 |     });
  130 |     const count = await rows.count();
  131 |     const names: string[] = [];
  132 |     for (let i = 0; i < count; i++) {
  133 |       const cell = await rows.nth(i).locator('td').nth(1).textContent();
```