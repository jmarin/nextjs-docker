# Playwright E2E Tests for /admin UI

This directory contains Playwright end-to-end tests for the Next.js admin UI.

## How to Run

1. **Start the app and database:**
   - Make sure your database is running (see `README.md` for Docker Compose instructions).
   - Start your Next.js app (usually `npm run dev` or `npm run start`).

2. **Install Playwright (if not already):**
   npm install --save-dev @playwright/test
   npx playwright install

3. **Run the tests:**
   npx playwright test

## Test Coverage
- Loads the `/admin` page and checks for UI elements
- Adds and deletes users and roles via the UI

See `admin.spec.ts` for details.
