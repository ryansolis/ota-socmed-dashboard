# Cypress E2E Testing Guide

## Overview

This project uses Cypress for end-to-end testing. Tests are located in `cypress/e2e/` and verify critical user flows including authentication, dashboard functionality, and user interactions.

## Setup

### 1. Install Dependencies

Dependencies are already installed via `npm install`. Cypress is included in `devDependencies`.

### 2. Configure Test Credentials

For tests that require authentication, you need to set up test user credentials.

**Option 1: Environment Variables**
```bash
# In .env.local or system environment
CYPRESS_TEST_EMAIL=your-test-user@example.com
CYPRESS_TEST_PASSWORD=your-test-password
```

**Option 2: Cypress Environment**
```bash
# When running Cypress
CYPRESS_TEST_EMAIL=test@example.com CYPRESS_TEST_PASSWORD=password npm run cypress:run
```

### 3. Create Test User in Supabase

1. Go to your Supabase project → Authentication → Users
2. Click "Add user" → "Create new user"
3. Enter email and password
4. **Important**: Make sure email confirmation is disabled for test users, or confirm the email manually
5. Use these credentials in your environment variables

**Alternative**: Use existing seeded users from `supabase/seed.sql`:
- `admin@ota-socmed.com`
- `solis.rayanthony@gmail.com`

## Running Tests

### Interactive Mode (Recommended for Development)

```bash
npm run cypress:open
```

This opens the Cypress Test Runner where you can:
- Select which tests to run
- Watch tests execute in real-time
- Debug failing tests
- See screenshots and videos

### Headless Mode (CI/CD)

```bash
npm run cypress:run
```

Runs all tests headlessly and generates reports.

### Running Specific Test Files

```bash
# Run only auth tests
npx cypress run --spec "cypress/e2e/auth.cy.ts"

# Run only dashboard tests
npx cypress run --spec "cypress/e2e/dashboard.cy.ts"
```

## Test Structure

### Authentication Tests (`auth.cy.ts`)

- ✅ Redirect unauthenticated users to login
- ✅ Show login page with form fields
- ✅ Display validation errors
- ✅ Navigate to signup page
- ✅ **Login with valid credentials** (requires `TEST_EMAIL` and `TEST_PASSWORD`)
- ✅ Display error for invalid credentials
- ✅ Logout successfully

### Dashboard Tests (`dashboard.cy.ts`)

These tests require authentication. They will:
- ✅ **Skip gracefully** if credentials are not provided
- ✅ **Run fully** if `TEST_EMAIL` and `TEST_PASSWORD` are set

Tests include:
- Display dashboard title
- Show summary cards
- Display engagement chart
- Toggle chart view (line/area)
- Display posts table
- Filter posts by platform
- Handle empty states

## Custom Commands

### `cy.login(email, password)`

Login helper that:
1. Visits the login page
2. Fills in email and password
3. Submits the form
4. Waits for redirect to dashboard
5. Verifies dashboard content is visible

**Usage:**
```typescript
cy.login('test@example.com', 'password123')
```

### `cy.logout()`

Logout helper that:
1. Visits the dashboard
2. Clicks the "Sign Out" button
3. Verifies redirect to login page

**Usage:**
```typescript
cy.logout()
```

### `cy.createTestUser(email, password)`

Helper to create a new test user via signup:
1. Visits the signup page
2. Fills in email and password
3. Submits the form
4. Waits for redirect to dashboard

**Usage:**
```typescript
cy.createTestUser('newuser@example.com', 'password123')
```

### `cy.waitForApi()`

Waits for API requests to complete (useful for waiting on data loads).

**Usage:**
```typescript
cy.waitForApi()
```

## Best Practices

1. **Always clear state between tests**: Tests use `beforeEach` to clear cookies and localStorage
2. **Use proper timeouts**: Tests include appropriate timeouts for async operations
3. **Verify actual behavior**: Don't just check URLs - verify actual content is visible
4. **Handle authentication gracefully**: Tests skip when credentials aren't available
5. **Test error cases**: Include tests for invalid credentials, empty forms, etc.

## Troubleshooting

### Tests Fail with "Timed out"

**Cause**: Server might be slow or not responding

**Solution**: 
- Increase timeout values
- Check that Next.js dev server is running
- Verify Supabase connection

### Login Tests Fail

**Cause**: Invalid credentials or Supabase connection issue

**Solution**:
- Verify `CYPRESS_TEST_EMAIL` and `CYPRESS_TEST_PASSWORD` are set correctly
- Check that test user exists in Supabase
- Ensure email confirmation is disabled for test users
- Check Supabase project URL and keys are correct

### Dashboard Tests Show Redirect Instead of Content

**Cause**: Authentication not working or user not logged in

**Solution**:
- Verify login command is working
- Check that credentials are correct
- Ensure session is being preserved between requests

## CI/CD Integration

Tests are integrated into GitHub Actions CI/CD pipeline. They will:
- ✅ Run automatically on push/PR
- ✅ Skip gracefully if credentials aren't provided
- ✅ Fail if credentials are provided but login fails
- ✅ Generate screenshots on failure

To enable full test suite in CI/CD, add these GitHub Secrets:
- `CYPRESS_TEST_EMAIL`
- `CYPRESS_TEST_PASSWORD`

