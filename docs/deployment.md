# Deployment Guide

Deploy the ACME Salary Insights frontend to **Netlify** and the backend to **Render**.

## Architecture

```text
Browser → Netlify (static React app) → Render (Express API) → SQLite (Prisma)
```

## Backend — Render

1. Create a new **Web Service** on [Render](https://render.com) connected to this repository.
2. Set **Root Directory** to `backend`.
3. Use the settings from `backend/render.yaml`:
   - **Build:** `npm install && npm run build && npx prisma migrate deploy`
   - **Start:** `npm start`
4. Add environment variables:
   - `NODE_ENV=production`
   - `DATABASE_URL=file:./prod.db` (or a path on a persistent disk)
5. Note the service URL, e.g. `https://acme-salary-insights-api.onrender.com`.

### SQLite on Render

Render's free tier filesystem is **ephemeral** unless you attach a persistent disk. For demos:

- Schema is applied on each deploy via `prisma migrate deploy`.
- Re-run `npm run db:seed` manually after deploy if you need seed data in production.

For a persistent demo database, attach a Render disk and point `DATABASE_URL` to that path.

### CORS

The backend enables CORS for all origins via `cors()` in `backend/src/app.ts`. Restrict origins in production if needed:

```typescript
app.use(cors({ origin: "https://your-app.netlify.app" }));
```

## Frontend — Netlify

1. Create a new site on [Netlify](https://netlify.com) connected to this repository.
2. Set **Base directory** to `frontend`.
3. Netlify reads `frontend/netlify.toml`:
   - **Build:** `npm run build`
   - **Publish:** `dist`
4. Add environment variable:
   - `VITE_API_URL=https://your-api.onrender.com`
5. Deploy and note the site URL, e.g. `https://acme-salary-insights.netlify.app`.

Update `README.md` Live Demo links with your actual URLs after the first deploy.

## Environment Variables

| Variable | Where | Example |
|----------|-------|---------|
| `DATABASE_URL` | Render | `file:./prod.db` |
| `NODE_ENV` | Render | `production` |
| `VITE_API_URL` | Netlify | `https://acme-salary-insights-api.onrender.com` |

## Cold Start Behavior

Render free-tier services spin down after ~15 minutes of inactivity. The first request after sleep can take **30–60 seconds**. The frontend warmup loader calls `/health` and explains this to users.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Frontend shows network errors | Verify `VITE_API_URL` on Netlify matches Render URL |
| API 404 on refresh | Ensure Netlify SPA redirect is configured (`netlify.toml`) |
| Empty analytics | Seed the production database or create employees via UI |
| `better-sqlite3` build failure on Render | Ensure Node version matches local; rebuild native modules |
| Slow first load | Expected on Render free tier — wait for warmup screen |

## Release

Tag a release after deployment verification:

```bash
git tag v1.0.0
git push origin v1.0.0
```
