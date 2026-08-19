# CivicClear

Next.js app for civic issue reporting. Visual rules: `docs/ui.md` in the repo root.

## Run locally

```bash
cd civicclear
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Seed accounts

| Portal | Email | Password |
|---|---|---|
| Citizen | citizen@civicclear.local | citizen123 |
| Official | official@civicclear.local | official123 |

Phase 0 uses a local SQLite file (`prisma/dev.db`) so the app runs without Docker. The Prisma schema is ready to point at PostgreSQL when you have a database.

Copy `.env.example` to `.env` if you do not already have one. `AUTH_SECRET` must be set.
