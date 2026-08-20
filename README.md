# CivicClear

Next.js app for civic issue reporting. Visual rules: [`docs/ui.md`](../docs/ui.md). Deploy guide: [`docs/deploy.md`](../docs/deploy.md).

## Architecture

```
app/                 # Routes only (thin pages + layouts)
features/
  auth/              # OTP citizen login, official password, admin create-official
  complaints/        # Citizen filing, photos, labels
  official/          # Queue, map, analytics, export
  profile/           # Citizen profile
  rewards/           # Points ledger
shared/
  ui/ layout/ db/ lib/
prisma/              # Schema + seed
```

## Auth

| Portal | How it works |
|---|---|
| Citizen | Email a 6-digit OTP (Brevo). No password. |
| Official | Email + password. Accounts created by an **admin** at `/admin`. |
| Admin | Same Official portal login; extra **Admin** nav to create officials. |

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
| Admin | `admin@civicclear.local` | Password `admin123` → Official sign in → `/admin` |
| Official | `official@civicclear.local` | Password `official123` |
| Citizen | `citizen@civicclear.local` | Password `citizen123` (email code still available) |

## Deploy

See [`docs/deploy.md`](../docs/deploy.md) for Vercel + Neon + Brevo + Cloudinary.
