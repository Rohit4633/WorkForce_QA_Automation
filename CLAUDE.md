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
