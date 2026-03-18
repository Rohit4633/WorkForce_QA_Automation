 # Review Test File
# Usage: /review-tests <filepath>

Review the test file $ARGUMENTS and check:
1. Imports come from correct paths as per CLAUDE.md
2. No hardcoded credentials or URLs
3. No waitForLoadState('networkidle') usage
4. Each ai() prompt has only ONE action
5. Page objects extend BasePage
6. Suggest any missing edge case tests