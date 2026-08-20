# Deploying CivicClear

Recommended stack (matches the roadmap): **Vercel** (Next.js app) + **Neon** (Postgres) + **Cloudinary** (photos) + **Brevo** (citizen OTP email).

## 1. Prepare accounts

1. **Neon** — create a project, copy the Postgres connection string.
2. **Brevo** — create an account → SMTP & API → API key. Verify a sender email (`BREVO_FROM_EMAIL`).
3. **Cloudinary** — optional for production photos; without it, uploads use local disk (not durable on Vercel).
4. **Vercel** — sign in with GitHub and import this repo.

## 2. Environment variables on Vercel

Set these in Project → Settings → Environment Variables (Production + Preview):

| Variable | Notes |
|---|---|
| `DATABASE_URL` | Neon URI (`?sslmode=require`) |
| `AUTH_SECRET` | Long random string |
| `AUTH_TRUST_HOST` | `true` |
| `AUTH_URL` | Your production URL, e.g. `https://civicclear.vercel.app` |
| `BREVO_API_KEY` | Brevo API key |
| `BREVO_FROM_EMAIL` | Verified sender |
| `BREVO_FROM_NAME` | `CivicClear` |
| `CLOUDINARY_CLOUD_NAME` | Optional but recommended |
| `CLOUDINARY_API_KEY` | Optional |
| `CLOUDINARY_API_SECRET` | Optional |

**Root Directory:** set to `civicclear` if the Git repo root is the parent folder.

## 3. Database on first deploy

From your machine (or a one-off Vercel build step):

```bash
cd civicclear
npx prisma db push
npx prisma db seed
```

Seed creates:

| Role | Email | How to sign in |
|---|---|---|
| Admin | `admin@civicclear.local` | Password `admin123` on Official portal |
| Official | `official@civicclear.local` | Password `official123` |
| Citizen | `citizen@civicclear.local` | Email OTP (no password) |

Change admin/official passwords after first login in production, or create new users and deactivate seeds.

## 4. Auth model in production

- **Citizens:** email → Brevo OTP → session. Register collects name + phone, then OTP.
- **Officials:** created only by an **admin** at `/admin`. They sign in with email + password.
- **Admins:** seed one admin (or promote a user in the DB). Only admins see `/admin`.

## 5. Custom domain (optional)

In Vercel → Domains, add your domain and point DNS as instructed. Update `AUTH_URL` to that domain.

## 6. Checklist before launch

- [ ] Brevo sender verified; test citizen OTP on a real inbox
- [ ] Cloudinary uploads work (not falling back to ephemeral disk)
- [ ] `AUTH_URL` matches the live site
- [ ] Admin password rotated
- [ ] Privacy / Terms reviewed for your municipality
