# ACME Salary Insights Testing Strategy

## Purpose

Testing is the primary development control for ACME Salary Insights. The backend should follow strict TDD, while the frontend should use lightweight TDD for user-visible behavior and integration points.

The goal is to build confidence in salary and employee workflows without slowing development with brittle or low-value tests.

## TDD Workflow

Backend features must be developed with RED -> GREEN -> REFACTOR:

1. Write a failing test that describes the next behavior.
2. Run the test and confirm it fails for the expected reason.
3. Implement the smallest useful code change to pass the test.
4. Run the relevant tests and confirm they pass.
5. Refactor only after tests are green.
6. Re-run tests after refactoring.

No backend feature should be implemented before a failing test exists for that behavior.

## RED, GREEN, REFACTOR

### RED

The RED phase introduces a test for missing behavior.

Expected outcome:

- The test fails.
- The failure demonstrates the intended missing capability.
- No production implementation is added in the same commit.

Examples:

- Schema validation tests that fail before Prisma models exist.
- Service tests that fail before an Employee service method exists.
- API tests that fail before an endpoint is registered.

### GREEN

The GREEN phase implements enough behavior to satisfy the failing tests.

Expected outcome:

- Relevant tests pass.
- Implementation is intentionally minimal.
- No unrelated behavior is introduced.

### REFACTOR

The REFACTOR phase improves structure without changing behavior.

Expected outcome:

- Tests are green before refactoring starts.
- Tests remain green after refactoring.
- Public behavior and API contracts stay unchanged.

Examples:

- Extracting validation helpers.
- Extracting repositories from services.
- Reducing duplication in test setup.

## Testing Pyramid

The test suite should favor fast, focused tests and reserve broader integration tests for API and user workflows.

```text
Many:  unit and service tests
Some:  repository and API integration tests
Fewer: frontend page/component integration tests
```

Backend service tests should cover most business behavior. API tests should verify HTTP contracts, validation, status codes, and serialization. Frontend tests should verify user-visible behavior rather than component internals.

## Backend Testing Strategy

Backend tests use Vitest and Supertest.

Primary backend coverage:

- Prisma schema and relationship expectations.
- Seed data counts, uniqueness, and required salary records.
- Employee service create, get, search, filter, update, and soft delete behavior.
- Salary service history and current salary behavior.
- Analytics calculations from current salary records.
- API endpoint behavior through Supertest.

Backend test principles:

- Write failing tests before implementation.
- Prefer service tests for business rules.
- Use API tests for route wiring and HTTP behavior.
- Keep test data explicit and readable.
- Avoid testing implementation details that do not affect behavior.
- Verify soft-deleted employees are excluded from default lists.
- Verify salary updates create new records instead of changing old records.

## Frontend Testing Strategy

Frontend tests use Vitest and React Testing Library.

Primary frontend coverage:

- Application shell renders navigation and greeting.
- Employee table renders data, loading, empty, and error states.
- Search, filters, and pagination trigger the expected UI state or query inputs.
- Create and update modals validate input and submit expected payloads.
- Delete workflow requires confirmation before mutation.
- Employee details page renders salary history.
- Analytics dashboard renders key metrics and chart containers from API data.

Frontend test principles:

- Test from the user's perspective.
- Prefer accessible queries.
- Mock API boundaries where appropriate.
- Keep form tests focused on validation and submission behavior.
- Avoid snapshot-heavy tests.

## Test Data Strategy

Seed data should support realistic local development and analytics testing:

- 10,000 employees.
- 5 departments.
- 5 countries.
- Unique employee emails.
- Unique employee codes.
- At least one salary record per employee.

Automated tests should use smaller, deterministic fixtures unless the test specifically verifies seed generation or scale-sensitive behavior.

## Continuous Verification

Each commit should run the smallest relevant verification:

- Documentation-only commits: readback or lint checks where available.
- Scaffold commits: install/build commands and smoke tests.
- RED commits: run the target test and confirm failure.
- GREEN commits: run the target test and confirm success.
- REFACTOR commits: run the affected test suite and confirm success.

When a test fails unexpectedly, fix the issue before moving forward unless the commit is intentionally a RED commit.
