# Next.js Dockerized REST API

This project provides a Next.js REST API for CRUD operations on users and roles, backed by a PostgreSQL database running in Docker. It includes robust integration tests using Jest, with automatic startup and teardown of test dependencies.

## Prerequisites
- Docker and Docker Compose (v2+)
- Node.js (v18+ recommended)
- npm

## Getting Started

### 1. Start the Database
Start the PostgreSQL and Flyway migration containers:

```bash
docker compose -f docker/database/docker-compose.yml up -d
```

This will:
- Start a PostgreSQL database on port 5432
- Run Flyway migrations to set up the schema and seed data

### 2. Run the Next.js App

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The app will be available at http://localhost:3000

### 3. Admin UI

A modern admin UI for managing users and roles is available at:

```
http://localhost:3000/admin
```

- Add, view, and delete users and roles with a beautiful React interface.
- All changes are reflected live using the REST API.

### 4. API Endpoints

- `GET    /api/users`         — List all users
- `POST   /api/users`         — Create a new user
- `GET    /api/users/[id]`    — Get user by ID
- `PUT    /api/users/[id]`    — Update user by ID
- `DELETE /api/users/[id]`    — Delete user by ID
- `GET    /api/roles`         — List all roles
- `POST   /api/roles`         — Create a new role
- `GET    /api/roles/[id]`    — Get role by ID
- `PUT    /api/roles/[id]`    — Update role by ID
- `DELETE /api/roles/[id]`    — Delete role by ID
- `GET    /api/health`        — Health check

### 5. Running Tests

Tests are run with Jest and automatically manage test database dependencies using Docker Compose.

To run all tests:

```bash
npm test
```

or

```bash
npx jest --runInBand --detectOpenHandles --forceExit
```

This will:
- Start the test database in Docker
- Wait for migrations to complete
- Run all Jest tests in `__tests__/`
- Cleanly shut down and remove the test containers

### 6. Running E2E Tests (Playwright)

End-to-end (E2E) tests are written with Playwright and cover the admin UI and API integration.

To run all E2E tests:

```bash
npx playwright install  # Only needed once to install browsers
npx playwright test
```

- Make sure the app and database are running (see steps 1 and 2 above).
- E2E tests are located in the `e2e/` directory.
- See `e2e/README.md` for more details and advanced usage.

### 7. Stopping the Database

To stop and remove the database containers:

```bash
docker compose -f docker/database/docker-compose.yml down -v
```

## Notes
- The test setup/teardown scripts ensure a clean environment for every test run.
- All database tables are created in the `nextjs` schema.
- The API uses the `pg` library and sets the search path to `nextjs` automatically.

---

For more details, see the code in `src/pages/api/`, the admin UI in `src/pages/admin.js`, and the test files in `__tests__/`.
