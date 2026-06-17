# ACME Salary Insights

ACME Salary Insights is a web-based salary management and analytics platform for HR managers.

The project is built as a TypeScript monorepo with:

- `frontend/`: React, Vite, Chakra UI, React Router, and TanStack Query.
- `backend/`: Node.js, Express, Prisma, and SQLite.
- `docs/`: product, architecture, domain, testing, and commit planning documentation.

Development follows the commit-by-commit plan in `docs/commit-plan.md`, with strict backend TDD using RED -> GREEN -> REFACTOR.

## Database setup

```bash
cd backend
cp .env.example .env
npm install          # rebuilds better-sqlite3 via postinstall
npx prisma migrate deploy
npm run db:seed      # loads 10k employees (~30–60s)
npm run dev
```
