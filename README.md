# ACME Salary Insights

Web-based salary management and analytics for HR managers — employee CRUD, salary history, payroll analytics, and a production-ready dashboard.

## Live Demo

| App | URL |
|-----|-----|
| **Frontend (Netlify)** | https://acme-salary-insights.netlify.app |
| **Backend health (Render)** | https://acme-salary-insights-api.onrender.com/health |

The backend runs on **Render's free tier**. It sleeps after inactivity, so the **first request can take up to ~50 seconds**. The app shows a warmup screen — please be patient on first load.

## Quick Start — Run Locally

**Prerequisites:** Node.js 20+, npm

### Terminal 1 — Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate deploy
npm run db:seed    # ~30–60s, seeds 10k employees
npm run dev        # http://localhost:3000
```

### Terminal 2 — Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev        # http://localhost:5173
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3000 |
| Health | http://localhost:3000/health |

## Run Tests

```bash
cd backend && npm test
cd frontend && npm test
```

## Project Structure

| Folder | Purpose |
|--------|---------|
| `frontend/` | React + Vite + Chakra UI |
| `backend/` | Express + Prisma + SQLite |
| `docs/` | Requirements, architecture, deployment |

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Chakra UI, React Router, TanStack Query
- **Backend:** Node.js, Express, Prisma, SQLite, Zod
- **Testing:** Vitest, React Testing Library, Supertest

## Documentation

- [Requirements](docs/requirements.md)
- [Architecture](docs/architecture.md)
- [Deployment guide](docs/deployment.md)
- [Commit plan](docs/commit-plan.md)

## Development Approach

This project was built commit-by-commit using strict backend TDD (RED → GREEN → REFACTOR) and lightweight frontend tests for user-visible behavior. See [docs/commit-plan.md](docs/commit-plan.md) for the workflow.
