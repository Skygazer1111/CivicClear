# CivicClear — Building Roadmap

**Product:** A civic issue reporting platform. Citizens report problems (potholes, garbage, streetlights, drainage). Officials verify, assign, and resolve them. Valid reports earn points.

**Design north star:** Quiet, trustworthy, and fast. Government-adjacent products should feel like paperwork that works — not a marketing site. Plenty of white space, one accent color, clear type, no glassmorphism, no floating blobs, no heavy motion.

---

## 1. Product principles

1. A citizen should submit a report in under two minutes.
2. Status of a complaint must be obvious without reading a paragraph.
3. Officials should triage by map, type, area, and age — not by scrolling a dump of cards.
4. The UI is the product. If it looks flashy, it is wrong.
5. Ship a thin vertical slice early (register → report → status change), then add rewards, analytics, and export.

---

## 2. Recommended tech stack

The original idea used React + Express + SQLite + Google Maps + Leaflet + Cloudinary + glassmorphism. That stack works, but it is heavier than this product needs and the UI direction fights the “minimal” goal.

| Layer | Choice | Why |
|---|---|---|
| App | **Next.js (App Router) + TypeScript** | One repo, typed pages, simple deployment, good for a public landing page plus two authenticated areas |
| UI | **Tailwind CSS + shadcn/ui** | Unstyled, accessible primitives. You compose a calm layout instead of fighting a theme pack |
| Icons | **Lucide** | Thin line icons only. No illustrated icon kits |
| Maps | **Leaflet + OpenStreetMap** | Enough for pins and filters. Drop Google Maps unless you later need Street View or Places autocomplete |
| API | **Next.js Route Handlers** (same app) | Avoid a second Node/Express process until the product outgrows it |
| Data | **PostgreSQL + Prisma** | Real relational data from day one. Use a local Postgres (Docker or Neon free) — skip SQLite so you do not rewrite later |
| Auth | **Auth.js (NextAuth) with credentials** | Session cookies, not JWT in localStorage. Separate citizen vs official roles |
| Files | **Cloudinary** (or Uploadthing) | Photos of civic issues need CDN + image transforms. Keep uploads server-side with size/type limits |
| Charts | **Recharts** (later) | Simple line/bar only. No 3D or animated dashboards |
| PDF/CSV | **csv-stringify + @react-pdf/renderer or pdf-lib** | Export is a last-phase feature, not a foundation |
| Validation | **Zod** | Shared schemas for forms and API |
| Hosting | **Vercel (app) + Neon/Supabase Postgres + Cloudinary** | Matches a solo build |

**Do not add unless a later phase proves you need it:** Redux, Framer Motion, GSAP, glassmorphism kits, Google Maps, a separate Express server, microservices, Redis, Elasticsearch.

If the app later needs a dedicated API (mobile clients, other departments), extract Route Handlers into Express or a Nest service. Do not start there.

---

## 3. Visual system (lock this before coding screens)

Treat this as a tiny design system, not decoration.

- **Type:** Inter or IBM Plex Sans. Body 16px, line-height 1.5. Headings restrained (no huge hero type).
- **Color:** Near-white background (`#FAFAFA` / white cards). Text near-black. One accent (recommended: deep teal `#0F766E` or navy `#1E3A5F`). Semantic colors only for status: amber pending, blue in progress, green resolved, red rejected.
- **Layout:** Max content width ~1120px. Generous padding. Tables and lists over card grids when density matters (officials). Cards are fine for citizen history.
- **Components:** Buttons, inputs, selects, tables, badges, dialogs, empty states. 4px or 6px radius. 1px borders, light gray. No shadows except a 1px hairline + very slight elevation on dropdowns.
- **Motion:** Instant or 150ms opacity/fade on page load. No stagger, no floating, no hover scale on every card.
- **Tone:** Short copy. “Report an issue” not “Empowering citizens to transform their city.”

Write a one-page `docs/ui.md` in Phase 0 with hex values and do/don’t screenshots of your own sketches. Every later screen is judged against that page.

---

## 4. Domain model (build this once)

Keep the data model small.

```
User
  id, role (citizen | official | admin)
  name, email, phone, passwordHash
  aadhaarHash? (optional, never store raw Aadhaar)
  points, createdAt

Complaint
  id, publicRef (e.g. CC-2026-00412)
  citizenId
  type (pothole | garbage | streetlight | drainage | other)
  title, description
  lat, lng, addressText
  status (submitted | verified | in_progress | resolved | rejected)
  priority (low | medium | high)
  assignedOfficialId?
  createdAt, updatedAt, resolvedAt?

ComplaintPhoto
  id, complaintId, url, width, height

ComplaintEvent
  id, complaintId, actorId, fromStatus, toStatus, note, createdAt

RewardLedger (phase 4)
  id, userId, complaintId?, delta, reason, createdAt
```

**Status machine (do not skip):**

`submitted → verified → in_progress → resolved`  
`submitted → rejected` (invalid / duplicate)  
Only officials (and later admins) may change status. Every change writes a `ComplaintEvent`.

---

## 5. Phased roadmap

Each phase ends with something you can click. Do not start the next phase until the previous one is usable on a phone.

### Phase 0 — Foundations ✅ Done

**Goal:** Empty app that looks like CivicClear, not a Tailwind demo.

- [x] Create Next.js + TypeScript + Tailwind + shadcn-style primitives.
- [x] Set up Prisma with `User` and `Complaint` stubs (PostgreSQL).
- [x] Configure Auth.js with two roles. Seed one citizen and one official.
- [x] Implement a **layout shell**: top bar with product name, role, and log out. No mega-nav.
- [x] Landing page: title, one-line tagline, two actions — “Citizen sign in” and “Official sign in”. Footer with a short privacy note.
- [x] Auth pages: email + password. Registration for citizens only. Officials are seeded or created by an admin later.
- [x] Global styles matching the visual system (`docs/ui.md`).

**Exit check:** You can log in as citizen or official and land on an empty dashboard that already feels finished.

**How to run:** Put a Postgres `DATABASE_URL` in `civicclear/.env`, then `npm run db:setup` and `npm run dev` from the repo root. Seed logins are in `civicclear/README.md`.

---

### Phase 1 — Citizen report flow ✅ Done

**Goal:** The core loop exists without rewards or analytics.

- [x] Citizen dashboard: counts (open / in progress / resolved) and a table of *their* complaints. Empty state: “No reports yet” + button.
- [x] New report form:
  - Type (select)
  - Short title
  - Description
  - Photo (1–3 images, compressed, 5MB cap)
  - Location: map click + reverse-geocode to a readable address; fallback to typed address if GPS fails
- [x] After submit: success screen with public reference number (`CC-2026-xxxxx`).
- [x] Complaint detail: status badge, timeline of events, photos, map pin.
- [x] Profile: name, phone, password change. Optional Aadhaar as a hashed field — never display full number.

**Exit check:** A citizen files a geotagged, photographed complaint and sees it as `Submitted`.

**How to try it:** Sign in as citizen → **Report an issue** → photo + map pin → submit → see `CC-YYYY-xxxxx` and status **Submitted**. Photos use Cloudinary when configured; otherwise they save under `public/uploads`.

---

### Phase 2 — Official workbench ✅ Done

**Goal:** Officials can actually work a queue.

- [x] Official home: filterable table (type, status, priority, date range, search by ref). Default sort: oldest unverified first.
- [x] Map view: all filtered complaints as pins, color by status. Click pin → side panel with summary, not a modal circus.
- [x] Complaint detail (official): same facts as citizen, plus:
  - Change status (restricted transitions)
  - Required note on reject / resolve
  - Set priority
- [x] Audit timeline visible to both sides (notes may be official-only if you add a `visibility` flag later; start with all notes visible for trust).

**Exit check:** Official verifies a report, marks in progress, then resolved. Citizen sees the same timeline without refresh tricks (polling every 15–30s is enough; skip websockets).

**How to try it:** Official login → `/queue` → open a complaint → Verified → In progress → Resolved (note required). Citizen detail page auto-refreshes every 20s. Map: `/map`.

---

### Phase 3 — Polish the product surface ✅ Done

**Goal:** It feels complete even if features are still missing.

- [x] Responsive layouts: citizen form and detail work on a phone; official table becomes a stacked list under 768px, map full-width.
- [x] Accessible forms: labels, errors under fields, keyboard-only submit.
- [x] Loading and empty states for every list.
- [x] Error pages (404, 500) in the same visual language.
- [x] Rate-limit report creation (e.g. 5 per hour per user).
- [x] Helmet-equivalent headers, CORS not needed if same origin, Zod on every mutation.
- [x] Image malware-ish hygiene: type check, size check, strip EXIF if you can.

**Exit check:** You can demo the full loop on a phone without apologizing for the UI.

**What shipped:** mobile nav + stacked lists, `loading.tsx` / `EmptyState`, `not-found` + `error` pages, 5/hour complaint rate limit, security headers, magic-byte image checks + JPEG/PNG metadata stripping.

---

### Phase 4 — Rewards (4–6 days)

**Goal:** Points that mean something, without turning the app into a game.

- Award points only when an official marks a complaint **verified** (not on submit — kills spam).
- Deduct or award nothing on reject. Optional small bonus on resolve if the original report was accurate.
- Citizen profile: current points, simple history list (“+10 — complaint CC-2026-00412 verified”).
- No leaderboards, badges, confetti, or progress rings in v1.

**Exit check:** Points appear only after verification and match the ledger.

---

### Phase 5 — Official analytics and export (1 week)

**Goal:** Department-level usefulness.

- Analytics page with 3 charts max:
  - Complaints over time (line)
  - By type (bar)
  - Resolution time average (single stat + by type)
- Area view: reuse the map; optional simple heatmap only if Leaflet.heat stays unobtrusive. Prefer clustered pins first.
- CSV export of the current filter.
- PDF export of a single complaint (ref, photos, timeline) — useful for files. Skip fancy branded PDFs.

**Exit check:** An official filters last 30 days, downloads CSV, and understands volume without a slide deck.

---

### Phase 6 — Hardening and launch (ongoing)

- Admin role: create official accounts, deactivate users, merge duplicate complaints (nice-to-have).
- Duplicate detection: same type + ~50m + 7 days → “possible duplicate” flag. Do not auto-merge in v1.
- Privacy: public landing does not list personal data. Maps for officials; citizens see only their pins.
- Legal copy: terms, what you do with photos and location.
- Backups, env secrets, production Cloudinary presets.
- Basic e2e tests (Playwright): citizen report, official status change.
- Load test image uploads once.

---

## 6. Screen inventory (build in this order)

1. Landing  
2. Citizen login / register  
3. Official login  
4. Citizen dashboard  
5. New complaint  
6. Complaint detail (citizen)  
7. Citizen profile  
8. Official queue (table)  
9. Official map  
10. Complaint detail (official)  
11. Analytics (later)  
12. Export actions (later)

If a screen is not in this list, it is out of scope for v1.

---

## 7. Folder sketch

```
app/
  page.tsx                 # landing
  (auth)/login, register
  (citizen)/dashboard, complaints/new, complaints/[id], profile
  (official)/queue, map, complaints/[id], analytics
  api/                     # route handlers
components/                # ui primitives + layout
lib/                       # auth, prisma, maps, validators
prisma/schema.prisma
```

Citizen and official route groups get their own layouts so navigation never mixes.

---

## 8. What we are explicitly not building (v1)

- Glassmorphism, gradient meshes, particle backgrounds, staggered hero animations  
- Dual map providers (Leaflet only)  
- Social login, Aadhaar OTP eKYC, DigiLocker  
- Chat between citizen and official  
- Native mobile apps (responsive web first)  
- Multi-department routing, SLA engines, GIS layers beyond pins  
- Public city-wide live map of all complaints (privacy + abuse)

---

## 9. Suggested calendar (solo, part-time ~10–12 hrs/week)

| Week | Focus |
|---|---|
| 1 | Phase 0 + start Phase 1 form |
| 2 | Finish Phase 1 (photos + map + detail) |
| 3 | Phase 2 official queue + status machine |
| 4 | Official map + Phase 3 responsive/a11y |
| 5 | Phase 4 rewards |
| 6 | Phase 5 analytics + CSV |
| 7 | Phase 6 hardening, copy, deploy |

Full-time, compress to about 3–4 weeks. Do not parallelize UI “wow” work with backend — the visual system is decided in week 1 and then only reused.

---

## 10. Definition of done for v1

- Citizen can register, report with photo + pin, and track `Submitted → Verified → In progress → Resolved`.
- Official can filter, inspect on a map, and update status with notes.
- Points accrue on verification.
- UI is quiet, high-contrast, and usable on a phone.
- Deployed with Postgres, auth cookies, and image hosting.
- No animation library in `package.json`.

When that list is true, the product exists. Everything else is version 2.
