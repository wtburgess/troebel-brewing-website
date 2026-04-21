# Troebel Brewing Co.

Next.js 16 + Supabase site for Troebel Brewing Co. (brewery + webshop + admin).

## Stack

- **Next.js 16** (App Router, Turbopack, `output: "standalone"`)
- **TypeScript**, **Tailwind v4**
- **Zustand** (cart + modal state)
- **Supabase** (hosted — Postgres + Auth + Storage + Edge Functions)
- **Gmail SMTP** via Supabase Edge Function (order emails)
- **Google Apps Script webhook** (order log spreadsheet)
- **Vercel** (hosting)

## Local development

This repo dev's against the **hosted Supabase project** — no local Supabase CLI stack is used.

```bash
git clone <repo-url>
cd troebel-brewing-website
npm install
cp .env.local.example .env.local   # fill in Supabase keys (see below)
npm run dev                        # http://localhost:3000
```

### Env vars

Required in `.env.local` (and in Vercel project settings for production):

| Var | Used for |
|-----|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser-side client |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side writes (orders, admin CRUD) |
| `GOOGLE_SHEET_WEBHOOK_URL` | Optional — logs orders to a Google Sheet |

Order-email SMTP credentials live as **Supabase Edge Function secrets** (not env vars in this repo). See `CLAUDE.md` → *Order Emails*.

## Routes

| Route | Notes |
|-------|-------|
| `/` | Marketing landing |
| `/bieren`, `/bieren/[slug]` | Beer catalog (ISR, 60s revalidate) |
| `/verhaal`, `/horeca` | About + B2B |
| `/webshop` | Cart + checkout |
| `/admin` | Login screen (Supabase Auth) |
| `/admin/bieren` | Beer + variant CRUD |
| `/admin/bestellingen` | Order list + mark-processed |
| `/api/orders` | POST — create order, log to sheet (email via DB trigger → edge function) |
| `/api/admin/orders/[id]` | PATCH — toggle `is_processed` |

## Supabase schema

Source of truth lives in [`supabase/migrations/`](supabase/migrations). The hosted project already has these applied.

To re-apply on a new hosted project:
```bash
npx supabase link --project-ref <ref>
npx supabase db push
```

## Order emails

Confirmation + brewery alert are sent by the `send-order-email` Supabase Edge Function (`supabase/functions/send-order-email/`), triggered by a Postgres trigger on `public.orders` INSERT. See `CLAUDE.md` for SMTP configuration and upgrade path.

## Scripts

```bash
npm run dev     # dev server
npm run build   # production build (verifies types)
npm run lint    # eslint
```

## Deploy

Target: **Vercel**.

1. Connect the Git repo in Vercel.
2. Add the env vars above.
3. Point custom domain (`troebelbrewing.be`) at the Vercel deployment.

## Known follow-ups

- **RLS policies** — review the `20260421170*.sql` migrations and confirm they match the threat model before heavy public traffic.
- **Order status workflow** — only a `is_processed` toggle today; no pending/paid/shipped states.
- **Custom sender domain** — order emails currently send from a Gmail account. Once `troebelbrewing.be` is set up with Gmail's "Send mail as" (or a dedicated SMTP provider), update the `FROM_EMAIL` edge-function secret.
