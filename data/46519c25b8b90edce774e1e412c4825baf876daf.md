# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/homepage/13-homepage-navigation.spec.ts >> Homepage — Navigation >> NAV-02: clicking Reports in the sidebar navigates to the Reports page
- Location: tests/e2e/homepage/13-homepage-navigation.spec.ts:8:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Reports' }).or(getByText('Reports').first())
Expected: visible
Error: strict mode violation: getByRole('heading', { name: 'Reports' }).or(getByText('Reports').first()) resolved to 2 elements:
    1) <h4 class="MuiTypography-root MuiTypography-h4 mui-1j51sy">Reports</h4> aka getByLabel('mailbox folders').getByText('Reports')
    2) <h4 class="MuiTypography-root MuiTypography-h4 mui-1j51sy">Reports</h4> aka getByRole('button', { name: 'Reports' })

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('heading', { name: 'Reports' }).or(getByText('Reports').first())

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - alert [ref=e2]
  - main [ref=e3]:
    - generic [ref=e5]:
      - button [ref=e6] [cursor=pointer]:
        - img [ref=e7]
      - link [ref=e9] [cursor=pointer]:
        - /url: /en?project=PRJ1455
        - img [ref=e10]
    - main [ref=e11]:
      - generic [ref=e14]:
        - heading [level=1] [ref=e16]: Reports
        - generic [ref=e18]:
          - generic [ref=e20]:
            - img [ref=e23]
            - textbox [ref=e25]:
              - /placeholder: Search for a report
          - generic [ref=e27] [cursor=pointer]:
            - img [ref=e30]
            - combobox [ref=e32]: Category
            - img [ref=e34]
            - textbox [ref=e36]
          - button [ref=e37] [cursor=pointer]: Clear Filters
        - table [ref=e39]:
          - rowgroup [ref=e40]:
            - row [ref=e41]:
              - columnheader [ref=e42]: Category
              - columnheader [ref=e43]: Name
              - columnheader [ref=e44]: Description
              - columnheader [ref=e45]: Action
          - rowgroup [ref=e46]:
            - row [ref=e47] [cursor=pointer]:
              - cell [ref=e48]: Team
              - cell [ref=e49]: All Profiles
              - cell [ref=e50]: All created profiles, their key information, and statuses
              - cell [ref=e51]:
                - button [ref=e52]:
                  - text: Select
                  - img [ref=e54]
            - row [ref=e56] [cursor=pointer]:
              - cell [ref=e57]: Document
              - cell [ref=e58]: Document Number Summary
              - cell [ref=e59]: Shows you all document numbers e.g national ID number and if its been provided. Please note this does not guarantee that attachments or other details have been uploaded
              - cell [ref=e60]:
                - button [ref=e61]:
                  - text: Select
                  - img [ref=e63]
            - row [ref=e65] [cursor=pointer]:
              - cell [ref=e66]: Document
              - cell [ref=e67]: Expired Documents
              - cell [ref=e68]: Documents that are currently expired
              - cell [ref=e69]:
                - button [ref=e70]:
                  - text: Select
                  - img [ref=e72]
            - row [ref=e74] [cursor=pointer]:
              - cell [ref=e75]: Document
              - cell [ref=e76]: Expiring Soon Documents
              - cell [ref=e77]: Documents expiring soon based on how many days are left till expiry
              - cell [ref=e78]:
                - button [ref=e79]:
                  - text: Select
                  - img [ref=e81]
        - generic [ref=e84]:
          - paragraph [ref=e85]: Rows per page
          - generic [ref=e86]:
            - combobox [ref=e87] [cursor=pointer]: "50"
            - textbox: "50"
            - img
          - paragraph [ref=e88]: 1–4 of 4
          - generic [ref=e89]:
            - button [disabled]:
              - img
            - button [disabled]:
              - img
  - dialog [ref=e91]:
    - generic [ref=e92]:
      - link "Workforce application logo" [ref=e94] [cursor=pointer]:
        - /url: /en?project=PRJ1455
        - img "Workforce application logo" [ref=e95]
      - separator [ref=e96]
      - generic [ref=e97]:
        - list [ref=e98]:
          - listitem [ref=e99]:
            - button "Team" [ref=e100] [cursor=pointer]:
              - img [ref=e102]
              - heading "Team" [level=4] [ref=e106]
          - listitem [ref=e107]:
            - button "Apply Candidates" [ref=e108] [cursor=pointer]:
              - img [ref=e110]
              - heading "Apply Candidates" [level=4] [ref=e113]
          - listitem [ref=e114]:
            - button "Reports" [active] [ref=e115] [cursor=pointer]:
              - img [ref=e117]
              - heading "Reports" [level=4] [ref=e120]
        - list [ref=e121]:
          - listitem [ref=e122]:
            - button "Business Settings" [ref=e123] [cursor=pointer]:
              - img [ref=e125]
              - heading "Business Settings" [level=4] [ref=e132]
          - listitem [ref=e133]:
            - button "Report a bug" [ref=e134] [cursor=pointer]:
              - img [ref=e136]
              - heading "Report a bug" [level=4] [ref=e139]
      - heading "1455 Noon Test AE" [level=5] [ref=e141]: 1N
  - tooltip "Reports" [ref=e142]: Reports
```

# Test source

```ts
  1  | import { expect } from '@playwright/test';
  2  | import { test } from '../../fixtures';
  3  | import { HomePage } from '../../pages/HomePage';
  4  | 
  5  | test.describe('Homepage — Navigation', () => {
  6  | 
  7  |   // NAV-02 ───────────────────────────────────────────────────────────────────
  8  |   test('NAV-02: clicking Reports in the sidebar navigates to the Reports page', async ({ page }) => {
  9  |     const homePage = new HomePage(page, test);
  10 |     await homePage.goto();
  11 | 
  12 |     await homePage.clickNavReports();
  13 | 
  14 |     await expect(page).toHaveURL(/\/reports/, { timeout: 10000 });
  15 |     console.log(`✅ Reports URL: ${page.url()}`);
  16 | 
  17 |     await expect(
  18 |       page.getByRole('heading', { name: 'Reports' })
  19 |         .or(page.getByText('Reports').first())
> 20 |     ).toBeVisible({ timeout: 10000 });
     |       ^ Error: expect(locator).toBeVisible() failed
  21 |     console.log('✅ Reports page heading visible');
  22 |   });
  23 | 
  24 |   // NAV-03 ───────────────────────────────────────────────────────────────────
  25 |   test('NAV-03: clicking Business Settings in the sidebar navigates to Business Settings page', async ({ page }) => {
  26 |     const homePage = new HomePage(page, test);
  27 |     await homePage.goto();
  28 | 
  29 |     await homePage.clickNavBusinessSettings();
  30 | 
  31 |     await expect(page).toHaveURL(/\/business-settings/, { timeout: 10000 });
  32 |     console.log(`✅ Business Settings URL: ${page.url()}`);
  33 | 
  34 |     await expect(
  35 |       page.getByRole('heading', { name: 'Contacts' })
  36 |         .or(page.getByText('1455 Noon Test AE').first())
  37 |     ).toBeVisible({ timeout: 10000 });
  38 |     console.log('✅ Business Settings page content visible');
  39 |   });
  40 | 
  41 |   // NAV-04 ───────────────────────────────────────────────────────────────────
  42 |   test('NAV-04: clicking the app logo from a sub-page navigates back to the homepage', async ({ page }) => {
  43 |     const homePage = new HomePage(page, test);
  44 |     await homePage.goto();
  45 | 
  46 |     // Navigate away to Reports first
  47 |     await homePage.clickNavReports();
  48 |     await expect(page).toHaveURL(/\/reports/, { timeout: 10000 });
  49 |     console.log('✅ On Reports page');
  50 | 
  51 |     // Click logo to go home
  52 |     await homePage.clickLogo();
  53 | 
  54 |     await expect(page).toHaveURL(/\/en(\?|$|\/(?!reports|business))/, { timeout: 10000 });
  55 |     console.log(`✅ Back on homepage: ${page.url()}`);
  56 | 
  57 |     await expect(page.getByRole('heading', { name: 'Team' })).toBeVisible({ timeout: 10000 });
  58 |     console.log('✅ "Team" heading visible on homepage');
  59 |   });
  60 | 
  61 | });
  62 | 
```