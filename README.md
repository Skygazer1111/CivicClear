# CampusClean

Campus issue reporting for students and coordinators. Visual rules: [`docs/ui.md`](../docs/ui.md). Deploy guide: [`docs/deploy.md`](../docs/deploy.md).

## Architecture

```
app/                 # Routes only (thin pages + layouts)
features/
  auth/              # Student + staff login; admin invites coordinators by email
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
| Coordinator | Admin invites an email at `/admin`. First login: OTP, then name, mobile, password. |
| Admin | Only `ADMIN_EMAIL` in env. First login: OTP, then name, mobile, password. Opens `/admin`. |

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
| Admin | Set `ADMIN_EMAIL` in `civicclear/.env` | First `/login` sets name, mobile, password → `/admin` |
| Student | `citizen@civicclear.local` | Password `citizen123` (email code still available) |

## Deploy

See [`docs/deploy.md`](../docs/deploy.md) for Vercel + Neon + Brevo + Cloudinary.
