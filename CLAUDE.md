# Troebel Brewing Co. - Project Context

**Project:** Brewery website + webshop for Troebel Brewing Co.
**Stack:** Next.js 15 (App Router) + Supabase (hosted) + Vercel
**Status:** Phase C & D complete — ready for handover

---

## Architecture at a glance

| Layer | Service | Notes |
|---|---|---|
| **Frontend + API routes** | Next.js 15 on **Vercel** | App Router, SSR |
| **Database + Auth + Storage** | **Supabase** (hosted, project ref `wkbhgadmkucxjwidzsig`) | Postgres, Row-Level Security enforced |
| **Order emails** | Supabase Edge Function `send-order-email` | Gmail SMTP, triggered by DB webhook on `orders` INSERT |
| **Order log** | Google Sheets via Apps Script webhook | Best-effort, non-blocking |

There is no self-hosted backend. Everything runs on managed services.

---

## Database Migrations

Migrations live in `supabase/migrations/*.sql`. Write them AND apply them — don't leave SQL for the user to paste.

Apply via one of:
1. `npx supabase db push` (requires `supabase link` first; needs the DB password once).
2. Supabase Management API — needs a Personal Access Token in `SUPABASE_ACCESS_TOKEN`:
   ```bash
   curl -X POST https://api.supabase.com/v1/projects/wkbhgadmkucxjwidzsig/database/query \
     -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"query":"<sql>"}'
   ```

If neither is available, stop and ask for a PAT rather than dumping SQL on the user.

---

## Admin Auth

Admin login uses Supabase Auth (email + password). Create the admin user once in the Supabase dashboard:

> Authentication → Users → Add user → Email: `admin@troebel.be` → set a strong password

The middleware at `src/middleware.ts` guards `/admin/:path+` and `/api/admin/:path*`. The login page itself (`/admin` root) is public.

---

## Order Emails

Order confirmation + brewery alert emails are sent by the `send-order-email` Supabase Edge Function (`supabase/functions/send-order-email/`), triggered by a Postgres trigger (`tr_order_created_send_email`) on `public.orders` INSERT that calls the function via `pg_net.http_post`.

SMTP delivery goes through **Gmail** using an app password. Customer-visible "From" is `Troebel Brewing <wotis.cloud@gmail.com>`; brewery alerts land in `info@troebelbrewing.be`.

**Secrets** (stored as Supabase Edge Function Secrets — encrypted at rest, set via the Supabase dashboard or Management API, never checked in):
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `FROM_EMAIL`, `BREWERY_EMAIL`

The Next.js API route (`src/app/api/orders/route.ts`) no longer sends email — only the Google Sheets log remains there.

**Upgrade path:** once the brewery sets up "Send mail as" in Gmail for a verified `@troebelbrewing.be` address, just update `FROM_EMAIL` — no code change.

---

## Hosting & Deployment

| Environment | URL | Notes |
|---|---|---|
| **Production** | Vercel (connect the Git repo) | Next.js SSR |
| **Local dev** | http://localhost:3000 | `npm run dev` |

Vercel env vars required (Settings → Environment Variables):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_SHEET_WEBHOOK_URL` (optional — order log)

No `RESEND_API_KEY` / no SMTP vars here — email lives entirely in the Supabase Edge Function.

---

## Quick Reference

| Item | Value |
|---|---|
| **Dev server** | `npm run dev` → http://localhost:3000 |
| **Build** | `npm run build` |
| **Lint** | `npm run lint` |
| **Tech stack** | Next.js 15, TypeScript, Tailwind v4, Zustand, Vanta.js |
| **Backend** | Supabase (hosted) — project ref `wkbhgadmkucxjwidzsig` |
| **Admin panel** | `/admin` (Supabase Auth) |
| **Payments** | None — order flow ends at email + sheet log |

---

## Design System

### Colors
| Name | Hex | Tailwind Class | Usage |
|------|-----|----------------|-------|
| Primary (Gold) | `#D4A017` | `bg-primary`, `text-primary` | CTAs, accents, highlights |
| Primary Dark | `#B8860B` | `bg-primary-dark`, `text-primary-dark` | Labels, hover states |
| Dark | `#1C1C1C` | `bg-dark`, `text-dark` | Dark sections, text |
| Darker | `#0D0D0D` | `bg-darker` | Footer, hover states |
| Cream | `#FFFDF7` | `bg-cream` | Light section backgrounds |

### Typography
- **Headings:** Playfair Display (font-heading)
- **Body:** Inter (font-body)
- Font variables set in `layout.tsx`, applied via CSS in `globals.css`

### Section Background Pattern
```
Hero (dark) → Beers (cream) → Story (dark) → Untappd (dark) → Professionals (cream) → Footer (dark)
```

### Locked design decisions
1. **B&W images with gold accent:** Story section uses grayscale images with gold bar on left
2. **Header:** Transparent on hero pages, solid cream when scrolled
3. **Hero background:** Vanta.js WebGL fog/clouds effect with brand colors (gold highlights)
4. **Mobile menu:** Full-screen dark overlay
5. **Beer cards:** White cards on cream bg, ABV badge top-right

---

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Design tokens + base styles
│   ├── layout.tsx           # Root layout with fonts
│   ├── page.tsx             # Landing page
│   ├── bieren/              # Beer catalog
│   ├── verhaal/             # About page
│   ├── horeca/              # B2B page
│   ├── webshop/             # Cart + checkout
│   ├── admin/               # Admin UI (guarded by middleware)
│   └── api/
│       ├── orders/          # Order submission
│       └── track/           # Page-view tracking
│
├── components/
│   ├── layout/              # Header, Footer
│   ├── beer/                # BeerCard, QuickAddModal, etc.
│   ├── sections/            # Hero, FeaturedBeers, Story, etc.
│   ├── admin/               # Admin CRUD components
│   └── ui/                  # VantaBackground, misc
│
├── lib/
│   ├── supabase/            # SSR + server clients
│   ├── api/                 # Typed data access
│   └── sheets.ts            # Google Sheets logger
│
├── middleware.ts            # Admin route guard
└── types/                   # Shared TS types

supabase/
├── functions/
│   └── send-order-email/    # Edge function: order emails via Gmail SMTP
└── migrations/              # SQL migrations
```

---

## Phases

### Completed
- **Phase B** — Public site: `/bieren`, `/bieren/[slug]`, `/verhaal`, `/horeca`, `/webshop`; Zustand cart with persistence; age gate; neo-brutalist design system
- **Phase C** — Backend migrated to Supabase; admin page ("Beheer Bieren"); variants (flesjes, bakken, vaten); featured beers; full CRUD
- **Phase D** — Cart UX: QuickAddModal (desktop centered / mobile bottom sheet), toast notifications, "Ook verkrijgbaar" variant pills
- **Phase E** — Order emails via Supabase Edge Function + Gmail SMTP

### Future (optional)
- Payment integration (no Mollie — decided against online payments)
- Order status workflow beyond `pending` / `processed`
- "Send mail as" on Gmail for a branded `@troebelbrewing.be` sender

---

## Reference Files

| File | Purpose |
|------|---------|
| `Plan/Original.md` | Full project plan |
| `Plan/BE-plan.md` | Backend implementation plan |
| `prototypes/*.html` | HTML wireframes |
