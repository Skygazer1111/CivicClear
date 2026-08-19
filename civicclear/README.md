# CivicClear

Next.js app for civic issue reporting. Visual rules: `docs/ui.md` in the repo root.

## Run locally

1. Copy `civicclear/.env.example` to `civicclear/.env`.
2. Set `DATABASE_URL` to your Postgres connection string (Neon, Supabase, or local Docker).
3. Generate `AUTH_SECRET` if it is empty.
4. Push the schema and seed:

```bash
cd civicclear
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

Or from the repo root: `npm run db:setup` then `npm run dev`.

Open [http://localhost:3000](http://localhost:3000).

### Local Postgres with Docker

```bash
docker compose up -d
```

Then in `civicclear/.env`:

```
DATABASE_URL="postgresql://civicclear:civicclear@localhost:5432/civicclear"
```

### Seed accounts

| Portal | Email | Password |
|---|---|---|
| Citizen | citizen@civicclear.local | citizen123 |
| Official | official@civicclear.local | official123 |
