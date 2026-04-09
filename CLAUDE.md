# Project: Playwright + ZeroStep E2E Automation
# App URL: https://workforce.noonstg.partners/en?project=PRJ1455

## Project Structure
- Tests: tests/e2e/<domain>/feature-name.spec.ts
- Page Objects: tests/pages/PascalCase.ts
- Fixtures: tests/fixtures/index.ts
- Helpers: tests/helpers/
- Auth Setup: tests/fixtures/auth.setup.ts

## Import Rules — CRITICAL
- ALWAYS import test from: `import { test } from '../../fixtures'`
- ALWAYS import expect from: `import { expect } from '@playwright/test'`
- NEVER import test from '@playwright/test' directly
- Page objects ALWAYS import BasePage from: `import { BasePage } from './BasePage'`
- Spec files ALWAYS import page objects from: `import { XPage } from '../../pages/XPage'`

## Framework Rules
- All page objects extend BasePage from tests/pages/BasePage.ts
- Use traditional Playwright locators for: form inputs, navigation, stable elements
- Use ai() from @zerostep/playwright ONLY for dynamic/contextual interactions
- Each ai() prompt = ONE distinct action only — never combine two actions
- Never hardcode credentials — always use process.env.*
- Never use waitForLoadState('networkidle') — use waitForTimeout() instead

## Auth
- Auth session saved in playwright/.auth/user.json
- All tests reuse saved session automatically via playwright.config.ts
- Auth setup file: tests/fixtures/auth.setup.ts
- Login flow: email → optional "Continue with email OTP" → OTP (123456) → optional passkey dismiss

## App Details
- Base URL: https://workforce.noonstg.partners/en?project=PRJ1455
- Login page redirects from base URL automatically
- Email field placeholder: 'Enter your phone number or email'
- OTP input: input[maxlength="6"]
- After login, app lands on homepage with candidate table

## Test Structure
- Group tests with test.describe()
- Initialize page objects inside each test or in beforeEach
- Each test must be fully independent
- Use randomFirstName(), randomLastName(), randomPhoneNumber(), randomEmiratesId() from helpers/data-helpers.ts for test data

## Existing Page Objects
- BasePage.ts — base class with ai() wrapper and waitForPageLoad()
- LoginPage.ts — email entry, OTP entry, SSO
- CandidatePage.ts — add candidate form, fill fields, create profile, verify in table

## Existing Helpers
- data-helpers.ts — randomFirstName, randomLastName, randomPhoneNumber, randomEmiratesId
- ai-helpers.ts — aiWithRetry, fillForm, aiVerify, aiGetText

## Playwright Config
- testDir: ./tests
- Auth setup project: matches *.setup.ts files
- Main project: chromium, uses storageState from playwright/.auth/user.json
- Traces, screenshots, videos: retained on failure only

## Common Locators in This App
- Add Candidate button: getByRole('button', { name: 'Add Candidate' })
- First name: getByPlaceholder('First name')
- Last name: getByPlaceholder('Last name')
- Country code dropdown: locator('.MuiAutocomplete-wrapper').first()
- Phone number: getByRole('textbox', { name: 'Personal phone number' })
- Nationality: getByRole('combobox', { name: 'Nationality' })
- Emirates ID: getByPlaceholder('123-4567-8901234-5')
- Visa sponsorship: getByRole('radio', { name: 'Yes/No' })
- Create Profile button: getByRole('button', { name: 'Create Profile' })

---

## Monorepo Structure

This project is a **pnpm monorepo** containing three independent test applications:

```
playwright_claude_workforce_automation/
├── pnpm-workspace.yaml          # Declares apps/* as workspace packages
├── package.json                 # Root scripts: test:vendor, test:wfbu, test:checklist, test:all
└── apps/
    ├── vendor/                  # Main vendor-facing app (workforce.noonstg.partners)
    ├── wfbu/                    # WFBU app (same base URL, separate auth + config)
    └── checklist/               # Checklist app (separate app, not yet built out)
```

### Root-level scripts (run from repo root)
```bash
pnpm test:vendor           # Run vendor test suite
pnpm test:wfbu             # Run wfbu test suite
pnpm test:checklist        # Run checklist test suite
pnpm test:all              # Run all three suites sequentially
pnpm test:vendor:headed    # Run vendor tests in headed (visible browser) mode
```

### Per-app scripts (run from apps/<name>/)
```bash
npx playwright test        # Run all tests
npx playwright test <file> # Run specific spec file
npx playwright test --grep "pattern"  # Run tests matching pattern
npx playwright test --workers=1       # Serialize workers (useful for auth debugging)
```

---

## vendor App — Full File Inventory

### playwright.config.ts
- `testDir: ./tests`
- `timeout: 60000` (per-test)
- `fullyParallel: true`, `workers: 4` (local), `workers: 1` (CI)
- `retries: 1` (local), `2` (CI)
- `baseURL: https://workforce.noonstg.partners/en?project=PRJ1455`
- `storageState: playwright/.auth/user.json` (chromium project only)
- `reporter: html + list + allure-playwright`
- Traces, screenshots, videos: retained on failure only
- Auth setup project matches `*.setup.ts` files; chromium project depends on setup

### Page Objects (apps/vendor/tests/pages/)

| File | Purpose |
|------|---------|
| `BasePage.ts` | Base class — `ai()` wrapper, `waitForPageLoad()`, `ensureCorrectProject()` |
| `LoginPage.ts` | Email entry, OTP entry, SSO login |
| `CandidatePage.ts` | Add candidate form: fill all fields, create profile, verify in table |
| `CandidateEditPage.ts` | Open profile, click Edit, fill first name, fill work phone, apply changes, get profile name/status badge, employment tab |
| `DocumentsPage.ts` | Scroll to Documents section, add document, select type, fill number/expiry, save, verify |
| `BulkUploadPage.ts` | Click Bulk Upload, download template, upload file, click Next, verify results |
| `HomePage.ts` | Navigate, search, clear search, status filter (top dropdown + modal), pagination helpers, table row count/column values, Team heading/count, click first row, download CSV, nav drawer (openDrawer, clickNavReports, clickNavBusinessSettings, clickLogo) |
| `ReportsPage.ts` | Navigate to Reports, search report, select report, set date range, generate, get table data, download report, read CSV, get visible report count/names, filter by category, clear filters, clear search, back to all reports, date helpers |
| `BusinessSettingsPage.ts` | Navigate to Business Settings, verify page loaded, add contact, select type, fill title/name/phone/email, apply, cancel, verify contact exists, get contact row data, open contact menu, click edit, click delete, confirm delete, check contact visibility |

### Helpers (apps/vendor/tests/helpers/)

| File | Exports |
|------|---------|
| `data-helpers.ts` | `randomFirstName()`, `randomLastName()`, `randomPhoneNumber()`, `randomEmiratesId()` |
| `ai-helpers.ts` | `aiWithRetry()`, `fillForm()`, `aiVerify()`, `aiGetText()` |
| `test-state.ts` | `saveCreatedCandidate()`, `loadCreatedCandidate()`, `savePassportNumber()`, `loadPassportNumber()` — persists candidate data to `tests/data/last-created-candidate.json` for cross-spec sharing |
| `business-data-helpers.ts` | `randomContactTitle()`, `randomContactName()`, `randomContactPhone()`, `randomContactEmail()` — UAE phone numbers, timestamped suffixes |
| `create-bulk-template.ts` | `createBulkUploadTemplate(candidates)`, `generateBulkCandidates(n)` — generates XLSX files for bulk upload testing |

### Fixtures (apps/vendor/tests/fixtures/)
- `auth.setup.ts` — full login flow: navigate → fill email → submit → optional OTP button → fill OTP `123456` → optional passkey dismiss → `ensureCorrectProject()` → save `playwright/.auth/user.json`
- `index.ts` — re-exports the extended `test` fixture (with storageState applied)

---

## vendor App — Test Spec Inventory

### Candidate domain (apps/vendor/tests/e2e/Candidate/)

#### `01-create-candidate.spec.ts` — Candidate Management
- `create a new candidate profile successfully` — randomised firstName/lastName/phone/emiratesId, creates profile, verifies row visible in table, saves candidate to `test-state` for downstream tests

#### `02-edit-candidate.spec.ts` — Candidate Profile & Edit
| Test ID | Test name |
|---------|-----------|
| PROF-01 | profile page shows correct candidate name and status badge |
| PROF-06 | editing candidate first name updates the profile heading (case-insensitive comparison; try/finally restores original name) |
| PROF-08 | employment tab shows empty state for candidate with no employment history |
| _(no ID)_ | edit work phone number of last created candidate (India +91, via `fillWorkPhoneNumber`) |

#### `03-documents.spec.ts` — Candidate Documents Section (`test.describe.configure({ mode: 'serial' })`)
- Test 1: passport document added, number verified in table
- Test 2: upload file for existing passport, verify file name persisted
- Test 3: add second document type (Emirates ID), verify both documents in section

#### `07-bulk-upload.spec.ts` — Bulk Upload
- `bulk upload 5 candidates and verify in table` — generates XLSX via `createBulkUploadTemplate`, uploads through wizard, verifies all 5 candidates appear in table

#### `08-bulk-upload-negative.spec.ts` — Bulk Upload Negative Scenarios
- Missing required fields template
- Duplicate entries template
- Verifies error messages for invalid uploads

#### `11-create-candidate-negative.spec.ts` — Create Profile Negative Scenarios
| # | Test name |
|---|-----------|
| 1 | submit with all fields empty shows validation errors (first name, last name, phone, nationality) |
| 2 | submit with invalid phone format shows phone error |
| 3 | submit with invalid emirates id format shows format error |
| 4 | first name with single letter is accepted but single number is rejected |

---

### Homepage domain (apps/vendor/tests/e2e/homepage/)

#### `04-homepage-search.spec.ts` — Homepage General & Search
| Test ID | Test name |
|---------|-----------|
| HOME-01 | homepage shows Team heading and a non-zero candidate count |
| HOME-07 | clicking a candidate row navigates to the candidate profile (`/en/member/`) |
| _(search)_ | search by candidate name shows matching results |
| _(search)_ | search with no matching results shows empty table |
| _(search)_ | clearing search restores full candidate list |
| _(search)_ | search by phone number shows matching candidate (uses `loadCreatedCandidate`) |

#### `05-homepage-filters.spec.ts` — Homepage Filters
- `select multiple statuses shows candidates matching any selected status` — `selectMultipleStatuses(['Active', 'Accepted'])`, verifies each row's status
- `reset button clears all filters` — filter modal → Active → apply
- `combine top status dropdown + filter modal filters` — Active + Business Unit

#### `06-homepage-download.spec.ts` — Homepage Download CSV
- `download button downloads a file` — verifies file exists on disk
- `download file with combined filters` — filter by Business Unit then download

#### `09-reports.spec.ts` — Reports
| Test ID | Test name |
|---------|-----------|
| REP-01 | _(existing)_ generate all profiles report and verify CSV matches UI (date range, generate, download, compare UI rows to CSV) |
| REP-02 | searching "Document" shows only Document reports (3 rows, "All Profiles" not visible) |
| REP-03 | filtering by category "Team" shows only "All Profiles" report (1 row) |
| REP-04 | clearing filters after search restores all reports (total count restored) |

#### `10-homepage-pagination.spec.ts` — Homepage Pagination
- `click next page shows different candidates` — verifies page 2 ≠ page 1, previous page returns to page 1

#### `12-business-settings.spec.ts` — Business Settings
| Test ID | Test name |
|---------|-----------|
| BIZ-01 | business settings page shows company name and country ("1455 Noon Test AE", "United Arab Emirates") |
| _(existing)_ | business settings page loads with company info and contacts table |
| _(existing)_ | add finance contact with all fields and verify in contacts table |
| _(existing)_ | verify newly added contact shows correct details in table |
| _(existing)_ | edit existing contact and verify all changes reflect in table |
| _(existing)_ | submit add contact with empty fields shows all validation errors |

#### `13-homepage-navigation.spec.ts` — Homepage Navigation _(new — pending auth fix)_
| Test ID | Test name |
|---------|-----------|
| NAV-02 | clicking Reports in the sidebar navigates to the Reports page (URL `/reports`, heading visible) |
| NAV-03 | clicking Business Settings in the sidebar navigates to Business Settings page (URL `/business-settings`, content visible) |
| NAV-04 | clicking the app logo from a sub-page navigates back to the homepage (URL `/en`, "Team" heading visible) |

> **Note:** NAV-02/03/04 require a valid auth session. The nav drawer must be opened first (`openDrawer()`) before sidebar buttons become clickable. Tests are blocked if `playwright/.auth/user.json` lacks a valid session token.

---

## Key Locator Patterns Added During Development

### Nav drawer (MUI Drawer — mini-variant, collapsed by default)
```typescript
// Open the drawer first — buttons are not visible until expanded
page.getByRole('button', { name: 'open drawer' })  // toggles drawer
page.getByRole('button', { name: 'Reports' })       // inside drawer (after open)
page.getByRole('button', { name: 'Business Settings' })
page.getByRole('link', { name: /workforce application logo/i })  // logo → home
```

### Candidate profile page (avoids strict-mode 2x `<main>` issue)
```typescript
// WRONG — matches "← All candidates" nav heading:
page.getByRole('heading').first()

// CORRECT — skip the back-link heading:
page.locator('main').getByRole('heading').filter({ hasNotText: 'All candidates' }).first()

// CORRECT — status badge (evaluates against document.body.innerText):
page.evaluate((list) => {
  const text = document.body.innerText;
  return list.some((s: string) => text.includes(s));
}, ['New', 'Active', 'Accepted', ...])
```

### Reports page
```typescript
page.getByPlaceholder('Search for a report')
page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') })  // data rows only
page.getByRole('combobox').filter({ hasText: /category/i })               // category filter
page.getByRole('button', { name: 'Clear Filters' })
page.getByRole('button', { name: 'Generate' })
page.getByRole('button', { name: 'Download' })
```

### Business settings contacts table
```typescript
page.getByRole('row').filter({ hasText: name }).first()   // find contact row
row.getByRole('button').last()                            // open 3-dot menu (Edit only; no Delete)
page.getByRole('menuitem', { name: 'Edit' })              // Edit in menu
```

---

## Cross-Test State Sharing

The vendor app shares state between sequential spec files using a JSON file:

```
tests/data/last-created-candidate.json
{
  "firstName": "...",
  "lastName": "...",
  "emiratesId": "...",
  "phone": "...",
  "passportNumber": "..."   // added by 03-documents.spec.ts Test 2
}
```

- `saveCreatedCandidate()` — called at end of `01-create-candidate.spec.ts`
- `loadCreatedCandidate()` — called in `02-edit-candidate.spec.ts`, `03-documents.spec.ts`, `04-homepage-search.spec.ts`
- `savePassportNumber()` / `loadPassportNumber()` — used within `03-documents.spec.ts` serial describe

---

## Known Issues & Notes

### Auth session expiry
- `playwright/.auth/user.json` may only capture 3 tracking cookies (no session token) if the OTP flow doesn't complete correctly
- All tests that call `homePage.goto()` (which waits for `table` selector) will fail with the login page if auth has expired
- Tests that navigate directly to specific URLs (Reports, Business Settings) are more resilient but also require valid auth
- **Fix:** Manually log in to the staging app and run the auth setup, or verify `TEST_OTP=123456` in `.env` is still valid for `rmangla@noon.com`

### Two `<main>` elements (SPA architecture)
- The app renders two nested `<main>` elements (outer nav shell + inner content)
- `page.locator('main')` throws a strict-mode violation — always use `.first()` or `page.evaluate()`

### MUI Chip status badge
- Status chips split text across child `<span>` elements
- `getByText('New', { exact: true })` may fail — use `document.body.innerText` via `evaluate()`

### App auto-lowercases appended text
- Editing a name from `"Ava"` to `"AvaEd"` → app saves as `"AvaEd"` but may display as `"Avaed"`
- All string comparisons after UI mutations must use `.toLowerCase()`

### `try/finally` for mutable state (PROF-06)
- PROF-06 edits the candidate's first name; restores the original in `finally` so downstream tests can still find the candidate by name

### Contacts menu — Edit only (no Delete)
- The contacts table 3-dot menu shows **only "Edit"** — there is no Delete option in the current app version
- The `clickDelete()` and `confirmDelete()` methods in `BusinessSettingsPage.ts` remain as stubs for future use

---

## wfbu App — Structure

Located at `apps/wfbu/`. Mirrors the vendor app structure; contains its own auth, config, and page objects.

### Files
- `playwright.config.ts` — same base URL (`workforce.noonstg.partners`) and auth pattern as vendor
- `tests/fixtures/auth.setup.ts` — same login flow as vendor
- `tests/fixtures/index.ts` — extended test fixture
- `tests/helpers/data-helpers.ts` — same `randomFirstName`, `randomLastName`, `randomPhoneNumber`, `randomEmiratesId` as vendor
- `tests/helpers/test-state.ts` — candidate state persistence (same pattern as vendor)
- `tests/pages/BasePage.ts` — same base class pattern
- `tests/pages/CandidatePage.ts` — add candidate, fill fields, navigate

> No e2e spec files are present yet — wfbu app is scaffolded and ready for tests.

---

## checklist App — Structure

Located at `apps/checklist/`. Registered as a workspace package. No source files present yet — scaffolding pending.

---

## Development History & Milestones

| Milestone | Description |
|-----------|-------------|
| Initial commit | Monorepo scaffolded with vendor, wfbu, checklist apps; pnpm workspace configured |
| Candidate CRUD | `01-create-candidate`, `02-edit-candidate`, `03-documents` specs built; page objects CandidatePage, CandidateEditPage, DocumentsPage created |
| Homepage coverage | `04-homepage-search`, `05-homepage-filters`, `06-homepage-download`, `10-homepage-pagination` specs added; HomePage page object extended |
| Bulk upload | `07-bulk-upload`, `08-bulk-upload-negative` specs and BulkUploadPage + create-bulk-template helper added |
| Negative tests | `11-create-candidate-negative` spec added (4 validation scenarios) |
| Reports | `09-reports.spec.ts` created with REP-01 (CSV match), then REP-02/03/04 (search + filter + clear) added; ReportsPage page object built |
| Business settings | `12-business-settings.spec.ts` built with 5 tests (load, add, verify, edit, validation); BusinessSettingsPage and business-data-helpers created; BIZ-01 added |
| Homepage general | HOME-01 (Team heading + count) and HOME-07 (row click → profile) added to `04-homepage-search.spec.ts`; `getTeamHeadingText`, `getTeamCount`, `clickFirstCandidateRow` added to HomePage |
| Profile page tests | PROF-01, PROF-06, PROF-08 added to `02-edit-candidate.spec.ts`; `getProfileName`, `isStatusBadgeVisible`, `fillFirstName`, `clickEmploymentTab`, `isEmploymentEmptyStateVisible` added to CandidateEditPage |
| Navigation tests | `13-homepage-navigation.spec.ts` created with NAV-02/03/04; `openDrawer`, `clickNavReports`, `clickNavBusinessSettings`, `clickLogo` added to HomePage; blocked by auth session expiry |
