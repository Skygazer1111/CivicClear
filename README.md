# CivicClear

Campus issue reporting for students and coordinators. Visual rules: [`docs/ui.md`](../docs/ui.md). Deploy guide: [`docs/deploy.md`](../docs/deploy.md).

## Architecture

```
app/                 # Routes only (thin pages + layouts)
features/
  auth/              # Student password/OTP, coordinator password, admin creates coordinators
  complaints/        # Student filing, campus locations, photos, labels
  official/          # Queue, analytics, export (coordinator tools)
  profile/           # Student profile
  rewards/           # Points ledger
shared/
  ui/ layout/ db/ lib/
prisma/              # Schema + seed
```

## Auth

| Portal | How it works |
|---|---|
| Student | Email + password (OTP email verify on register; OTP also as backup sign-in). |
| Coordinator | Email + password. Accounts created by an **admin** at `/admin`. |
| Admin | Same Coordinator portal login; extra **Admin** nav to create coordinators. |

Without `BREVO_API_KEY`, OTP codes are printed in the server console and shown in the UI (development only).

## Run locally

1. Copy `civicclear/.env.example` to `civicclear/.env`.
2. Set `DATABASE_URL` and `AUTH_SECRET`.
3. Optionally set Brevo keys for real email.
4. Push schema and seed:

```bash
cd civicclear
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Seed accounts

| Role | Email | Access |
|---|---|---|
| Admin | `admin@civicclear.local` | Password `admin123` → Coordinator sign in → `/admin` |
| Coordinator | `official@civicclear.local` | Password `official123` |
| Student | `citizen@civicclear.local` | Password `citizen123` (email code still available) |

## Deploy

See [`docs/deploy.md`](../docs/deploy.md) for Vercel + Neon + Brevo + Cloudinary.
