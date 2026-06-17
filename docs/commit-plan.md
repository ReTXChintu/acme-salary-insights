# ACME Salary Insights Commit Plan

## Commit Philosophy

ACME Salary Insights should be built as a clear sequence of small, reviewable commits. Each commit should have one purpose and should leave the repository in an understandable state.

The commit history should show how the system was developed:

- Documentation before implementation.
- Scaffolding before domain behavior.
- Tests before backend features.
- Minimal implementation before refactoring.
- UI primitives before composed pages.

## Commit Message Style

Use conventional commit messages:

```text
type(scope): summary
```

Examples:

- `docs: add assessment requirements and scope`
- `chore: initialize monorepo structure`
- `test(employee): add employee creation tests`
- `feat(employee): implement employee creation`
- `refactor(employee): extract validation helpers`

Use the scope when it clarifies the affected area. Keep summaries short, imperative, and specific.

## One Concern Per Commit

Each commit should do one thing:

- A documentation commit should only change documentation.
- A scaffold commit should avoid business behavior.
- A RED commit should only add or adjust tests.
- A GREEN commit should implement only enough behavior to pass the tests.
- A REFACTOR commit should not change behavior.

Avoid mixing unrelated changes such as formatting, dependency upgrades, feature implementation, and refactoring in the same commit.

## RED -> GREEN -> REFACTOR Sequence

Backend development must follow strict TDD.

### RED Commit

Purpose: describe missing behavior with tests.

Rules:

- Add failing tests.
- Do not implement production behavior.
- Run the targeted test command.
- Confirm the failure is expected.

### GREEN Commit

Purpose: make the previous RED tests pass.

Rules:

- Implement the smallest useful behavior.
- Avoid unrelated abstractions.
- Run the targeted tests.
- Confirm the tests pass.

### REFACTOR Commit

Purpose: improve structure after behavior is protected by tests.

Rules:

- Start from green tests.
- Change structure without changing behavior.
- Run affected tests after refactoring.
- Keep API contracts stable.

## Planned Commit Flow

The first part of the project is organized into these phases:

### Phase 0: Documentation

- Requirements and scope.
- Architecture and domain design.
- Testing strategy and commit plan.

### Phase 1: Scaffolding

- Monorepo structure.
- React frontend setup.
- Express backend setup.
- Prisma and SQLite setup.
- Linting, formatting, and test tooling.

### Phase 2: Database And Seed

- RED schema validation tests.
- GREEN Prisma schema and migration.
- RED seed generation tests.
- GREEN seed implementation.
- REFACTOR seed factories and constants.

### Phase 3: Employee Domain Services

- RED employee creation tests.
- GREEN employee creation implementation.
- REFACTOR employee validation helpers.
- RED/GREEN cycles for get, search, list, update, and soft delete.
- REFACTOR repository extraction.

### Phase 4: Employee API And UI

- RED employee API tests.
- GREEN employee CRUD endpoints.
- RED/GREEN frontend layout.
- RED/GREEN employee table, filters, create modal, update modal, and delete workflow.
- RED/GREEN composed employees page.

## Verification Expectations

Each commit should include a clear verification step:

- Documentation: readback or lint check if available.
- Tooling: install/build/test smoke checks.
- RED backend commit: failing targeted test output.
- GREEN backend commit: passing targeted test output.
- REFACTOR backend commit: passing affected test suite.
- Frontend UI commit: relevant component/page tests.

The project should not advance to the next commit until the current commit has been reviewed and recorded.

## Scope Discipline

Do not add features outside the assessment scope:

- No authentication.
- No authorization.
- No RBAC.
- No payroll processing.
- No currency conversion.
- No multi-tenancy.
- No email notifications.
- No user management.

If a future requirement appears to need one of these capabilities, document the decision instead of implementing it.
