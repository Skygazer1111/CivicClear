# Deploying CampusClean

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
| `AUTH_URL` | Your production URL, e.g. `https://campusclean.vercel.app` |
| `ADMIN_EMAIL` | Admin invite email (they set a password on first login) |
| `BREVO_API_KEY` | Brevo API key |
| `BREVO_FROM_EMAIL` | Verified sender |
| `BREVO_FROM_NAME` | `CampusClean` |
| `CLOUDINARY_CLOUD_NAME` | Recommended for photos |
| `CLOUDINARY_API_KEY` | Must allow uploads |
| `CLOUDINARY_API_SECRET` | |
| `BLOB_READ_WRITE_TOKEN` | Optional Vercel Blob fallback (Storage → Blob) |

**Root Directory:** set to `CampusClean` if the Git repo root is the parent folder.

## 3. Database on first deploy

From your machine (or a one-off Vercel build step):

```bash
cd civicclear
npx prisma db push
npx prisma db seed
```

The admin invite is created from `ADMIN_EMAIL` (set that on Vercel, then sign in once or run seed). They set name, mobile, and password on first login. Optional demo seed account:

| Role | Email | How to sign in |
|---|---|---|
| Student | `citizen@civicclear.local` | Password `citizen123` (email code still available) |

## 4. Auth model in production

- **Students:** register with email + password, verify email once with OTP, then sign in with password (OTP remains as backup).
- **Coordinators:** invited by email only by an **admin** at `/admin`. First login verifies the inbox, then they set name, mobile, and password.
- **Admins:** one account from `ADMIN_EMAIL`. First login is the same setup flow. Only that admin sees `/admin`.

## 5. Custom domain (optional)

In Vercel → Domains, add your domain and point DNS as instructed. Update `AUTH_URL` to that domain.

## 6. Checklist before launch

- [ ] Cloudinary env vars set on Vercel (`CLOUDINARY_*`) so report photos upload
- [ ] Brevo sender verified; test citizen OTP on a real inbox
- [ ] `AUTH_URL` matches the live site
- [ ] Admin first-login setup completed (password is not stored in env)
- [ ] Privacy / Terms reviewed for your municipality
