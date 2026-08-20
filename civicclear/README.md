# CivicClear

Next.js app for civic issue reporting. Visual rules: `docs/ui.md` in the repo root.

## Architecture

```
app/                 # Routes only (thin pages + layouts)
features/
  auth/              # Login, register, NextAuth, session
  complaints/        # Citizen filing, photos, labels, shared complaint UI
  official/          # Queue, map, status workflow
  profile/           # Citizen profile updates
shared/
  ui/                # Button, input, label
  layout/            # Shell, header, ambient background
  db/                # Prisma client
  lib/               # Small cross-cutting helpers (cn)
prisma/              # Schema + seed
```

Feature modules own their `actions`, `schemas`, `components`, and domain logic. `app/` only wires routes.

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
