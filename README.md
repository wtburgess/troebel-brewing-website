# Troebel Brewing Co.

Next.js 16 + Supabase site for Troebel Brewing Co. (brewery + webshop + admin).

## Stack

- Next.js 16 (App Router, Turbopack, `output: "standalone"`)
- TypeScript, Tailwind v4
- Zustand (cart + modal state)
- Supabase (hosted; Postgres + Auth + Storage)
- Resend (order emails) + Google Apps Script webhook (order-log sheet)

## Local development

This repo dev's against the **hosted Supabase project** — no local Supabase CLI stack is used.

```bash
git clone git@github.com:wtburgess/troebel-brewing-website.git
cd troebel-brewing-website
npm install
cp .env.local.example .env.local   # fill in Supabase keys (see below)
npm run dev                        # http://localhost:3000
```

### Env vars

Required in `.env.local`:

| Var | Used for |
|-----|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser-side client |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side writes (orders, admin CRUD) |
| `ADMIN_PASSWORD` | Gate for `/admin` pages (default `TroebelAdmin2024`) |
| `RESEND_API_KEY` | Optional — order confirmation emails |
| `GOOGLE_SHEET_WEBHOOK_URL` | Optional — logs orders to a Google Sheet |

## Routes

| Route | Notes |
|-------|-------|
| `/` | Marketing landing |
| `/bieren`, `/bieren/[slug]` | Beer catalog (ISR, 60s revalidate) |
| `/verhaal`, `/horeca` | About + B2B |
| `/webshop` | Cart + checkout (was `/bestellen` — permanent redirect in `next.config.ts`) |
| `/admin` | Login screen (password from `ADMIN_PASSWORD`) |
| `/admin/bieren` | Beer + variant CRUD |
| `/admin/bestellingen` | Order list + mark-processed |
| `/api/orders` | POST — create order, email customer, log to sheet |
| `/api/admin/orders/[id]` | PATCH — toggle `is_processed` |
| `/api/admin/auth` | Password check |

## Supabase schema

Source of truth lives in [`supabase/migrations/`](supabase/migrations) and [`supabase/seed.sql`](supabase/seed.sql). The hosted project already has these applied.

To re-apply on a new hosted project:
```bash
npx supabase link --project-ref <ref>
npx supabase db push
# then run supabase/seed.sql via the SQL editor or CLI
```

## Scripts

```bash
npm run dev     # dev server
npm run build   # production build (verifies types)
npm run lint    # eslint
```

## Deploy

Target: **Vercel** (not yet configured). Current `troebel.wotis-cloud.com` is a static nginx container and will be replaced. When setting up Vercel:

1. Connect GitHub repo (`github.com/wtburgess/troebel-brewing-website`).
2. Add the env vars above (hosted Supabase project).
3. Point custom domain at the Vercel deployment.

## Known follow-ups

- **Admin auth** is a single shared password — consider Supabase Auth before prod traffic.
- **RLS policies** are permissive (anon can insert/update) — tighten once all writes confirmed routing through `service_role`.
- **Mollie payments** — the checkout form collects a method but no processing yet.
- **Order status workflow** — only `is_processed` toggle; no pending/paid/shipped states.
