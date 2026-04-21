# Handover — Troebel Brewing Co. website

Welcome! This document walks you through everything you need to take ownership of the site. It is written for someone who has never deployed a Next.js app before. If any step is unclear, keep the previous developer's contact details handy — the whole setup takes **about 30 minutes** if you follow along.

**Shortcut for the impatient:** once you've done *§1 Account ownership transfer*, click this button to import the repo into Vercel with env-var placeholders already filled in:

> [Deploy to Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwtburgess%2Ftroebel-brewing-website&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY&envDescription=Get%20these%20three%20from%20Supabase%20Dashboard%20%E2%86%92%20Project%20Settings%20%E2%86%92%20API)

(Still read *§2* for what to paste where.)

---

## What you're getting

A working Next.js 16 website + webshop + admin panel for **Troebel Brewing Co.**, with:

- Public site (`/`, `/bieren`, `/verhaal`, `/horeca`, `/webshop`, `/voorwaarden`)
- Admin panel (`/admin`) — manage beers, view orders, mark them processed
- Automated customer order confirmations + brewery alert emails
- Google Sheets log of every order

**Tech used (all managed services, no servers to maintain):**

| Thing | Service | Who owns it after handover |
|---|---|---|
| Source code | **GitHub** — `wtburgess/troebel-brewing-website` | You |
| Hosting | **Vercel** | You (you'll create this) |
| Database + Auth + Edge Functions | **Supabase** (hosted, project `wkbhgadmkucxjwidzsig`) | You — ownership must be transferred (see below) |
| Order emails (SMTP) | **Gmail** — `wotis.cloud@gmail.com` app password | Transitional (see *Upgrade path* below) |
| Order log spreadsheet | **Google Apps Script** webhook → Google Sheet | You |
| Domain | **troebelbrewing.be** | You (at your domain registrar) |

---

## 1. Account ownership transfer (do this first)

### GitHub
The repo is already at `github.com/wtburgess/troebel-brewing-website`. If this is your account, you're done. If not, the previous developer needs to transfer it to you or invite you as an admin.

### Supabase
1. Previous developer goes to **Supabase → Project Settings → Team** and invites your email with the **Owner** role.
2. You accept the invitation (check your email).
3. Once you're Owner, the previous developer removes themselves from the project. Billing stays with whoever owns the organization — transfer that too if needed (Supabase dashboard → Organization → Billing).

### Gmail sender account (`wotis.cloud@gmail.com`)
Order emails currently send from this Gmail account, owned by the previous developer. There are two options:

- **Short term:** leave it alone. Emails work. Customers see "Troebel Brewing <wotis.cloud@gmail.com>" as the sender. The brewery receives order alerts at `Troebel.brew@gmail.com` regardless.
- **Long term (recommended):** set up Gmail's *"Send mail as"* feature on the brewery's own Google Workspace / Gmail account with a verified `@troebelbrewing.be` address. Then update the `FROM_EMAIL` secret in Supabase (see §5 below). No code changes needed.

See *§7 — Upgrade the email sender* for the exact steps.

### Domain (`troebelbrewing.be`)
You control this at your domain registrar. You'll add DNS records pointing at Vercel in §4 below.

---

## 2. Deploy to Vercel (one-time setup)

You need a Vercel account. It's free for personal use. Sign up at <https://vercel.com/signup> and connect your GitHub account.

### Step 2.1 — Import the repo

1. Go to <https://vercel.com/new>.
2. Click **Import** next to `wtburgess/troebel-brewing-website`.
3. Framework preset: **Next.js** (auto-detected).
4. Root directory: leave as `.`.
5. Build command: leave default (`next build`).
6. Install command: leave default (`npm install`).

### Step 2.2 — Environment variables

Before clicking **Deploy**, expand **Environment Variables** and paste these three:

| Name | Where to get the value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Project Settings → API → *Project URL* |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API → *anon public* key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → Project Settings → API → *service_role* key ⚠️ **Secret** — never commit this |

Optional:

| Name | Purpose |
|---|---|
| `GOOGLE_SHEET_WEBHOOK_URL` | Apps Script URL that logs orders to the Google Sheet. Skip if you don't want the sheet log. |

**Do NOT** set any `SMTP_*`, `FROM_EMAIL`, `BREWERY_EMAIL`, or `RESEND_API_KEY` variables — those live in Supabase, not Vercel.

Click **Deploy**. First deploy takes ~2 minutes.

### Step 2.3 — Test the preview URL

Vercel gives you a URL like `troebel-brewing-website-xxx.vercel.app`. Open it. The homepage should load. Navigate to `/bieren` — beers should appear. Navigate to `/webshop` — the cart page should load.

**If something's broken:** check the Vercel dashboard → your project → Deployments → click the failed deployment → Logs tab. Most issues are missing/wrong env vars.

---

## 3. Connect your custom domain

### Step 3.1 — Add domain in Vercel

1. Vercel dashboard → your project → **Settings** → **Domains**.
2. Add `troebelbrewing.be` and `www.troebelbrewing.be`.
3. Vercel shows DNS records to add (usually an `A` record + a `CNAME`).

### Step 3.2 — Add DNS records at your registrar

Log into wherever `troebelbrewing.be` is registered (Combell, Versio, GoDaddy, etc.) and add the records Vercel showed. Typical pattern:

| Type | Name | Value |
|---|---|---|
| A | @ | 76.76.21.21 (whatever Vercel told you) |
| CNAME | www | cname.vercel-dns.com |

DNS propagation takes 1 minute to a few hours. Vercel will show a green checkmark when it's ready.

Once green, `https://troebelbrewing.be` serves your site with an auto-renewing SSL certificate (free, via Let's Encrypt).

---

## 4. Create the admin user

Before anyone can log in to `/admin`:

1. Supabase dashboard → **Authentication** → **Users** → **Add user**.
2. Enter the brewery owner's email (e.g. `admin@troebelbrewing.be`) and a strong password. Uncheck "Auto-confirm user" only if you want the owner to verify via email — otherwise leave it checked so they can log in immediately.
3. Share the password with the brewery owner through a secure channel (1Password, Bitwarden, etc. — not plain email).

Test: go to `https://troebelbrewing.be/admin`, log in, you should see the admin dashboard.

---

## 5. Understand the moving parts

### 5.1 — Where code lives

- **`src/`** — Next.js site (pages, components, API routes)
- **`supabase/migrations/`** — database schema (already applied to the hosted project)
- **`supabase/functions/send-order-email/`** — the edge function that sends order emails

### 5.2 — How an order flows

```
Customer clicks "Bestellen" on /webshop
  → POST /api/orders (Next.js API route on Vercel)
  → Inserts row into `orders` table (Supabase)
  → Logs to Google Sheet (if GOOGLE_SHEET_WEBHOOK_URL is set)
  → A Postgres trigger fires, calling the `send-order-email` edge function
  → Edge function reads the order + items from the DB
  → Edge function sends two emails via Gmail SMTP:
      1. Confirmation to the customer
      2. Alert to Troebel.brew@gmail.com
```

Every component retries on failure except the Google Sheet log (it's fire-and-forget). If SMTP is down, the order is still saved in Supabase — you can re-send the email later from the DB.

### 5.3 — Email secrets (Supabase Edge Function Secrets)

Stored in **Supabase dashboard → Edge Functions → `send-order-email` → Secrets**:

| Secret | Current value |
|---|---|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | `wotis.cloud@gmail.com` |
| `SMTP_PASS` | *(Gmail app password — encrypted, never displayed)* |
| `FROM_EMAIL` | `Troebel Brewing <wotis.cloud@gmail.com>` |
| `BREWERY_EMAIL` | `Troebel.brew@gmail.com` |

To rotate the Gmail app password: generate a new one at <https://myaccount.google.com/apppasswords> for that Google account, then update `SMTP_PASS` in the Supabase dashboard. No redeploy needed.

### 5.4 — Google Sheet order log

The order log spreadsheet is appended to via a Google Apps Script web-app URL. If you want to own it yourself:

1. Make a copy of the current script + spreadsheet to a Google account you own.
2. Publish the Apps Script as a web app (Deploy → New deployment → Web app → Execute as: me, Access: anyone).
3. Copy the new web-app URL.
4. Update `GOOGLE_SHEET_WEBHOOK_URL` in Vercel (Settings → Environment Variables) and redeploy.

---

## 6. Day-to-day operations

### Adding / editing beers
- Log in at `/admin`.
- "Beheer Bieren" → Add / edit / delete.
- Upload images; they're stored in Supabase Storage and served via CDN.
- Featured toggle controls which beers appear on the homepage.

### Viewing orders
- `/admin/bestellingen` — list of all orders.
- Click a row to see line items.
- Click "Markeer als verwerkt" once the order has been prepared.

### Deploying code changes
Push to `main` on GitHub → Vercel auto-deploys in ~90 seconds. Preview deployments are created for every pull request — use those to preview changes before merging.

### Database changes
Write a SQL migration in `supabase/migrations/YYYYMMDDHHMMSS_description.sql`, then apply with:

```bash
npx supabase link --project-ref wkbhgadmkucxjwidzsig  # first time only, asks for DB password
npx supabase db push
```

Or via the Supabase dashboard → SQL Editor.

### Rolling back a bad deploy
Vercel dashboard → Deployments → find the last good one → click "Promote to Production". Takes ~10 seconds.

---

## 7. Upgrade the email sender (recommended, optional)

Today customers see `Troebel Brewing <wotis.cloud@gmail.com>` as the sender — ugly. To fix:

1. Make sure the brewery has a Gmail or Google Workspace account that can receive mail at `hello@troebelbrewing.be` (or whatever address you want). This requires the MX records on `troebelbrewing.be` to point at Google — set up separately.
2. In that Gmail account: **Settings → Accounts and Import → Send mail as → Add another email address**. Enter `hello@troebelbrewing.be`. Verify.
3. Generate a Google App Password for this new account (same as before — <https://myaccount.google.com/apppasswords>).
4. Update three secrets in **Supabase → Edge Functions → `send-order-email` → Secrets**:
   - `SMTP_USER` = `<the new Gmail account>`
   - `SMTP_PASS` = `<the new app password>`
   - `FROM_EMAIL` = `Troebel Brewing <hello@troebelbrewing.be>`
5. Place a test order to verify. Done — no code change.

If the brewery wants to scale past ~500 emails/day (Gmail's limit), switch to a transactional provider like Resend, Brevo, or Mailgun. Only the SMTP block in `supabase/functions/send-order-email/index.ts` needs to change.

---

## 8. Troubleshooting

| Symptom | Where to look |
|---|---|
| Site down / 500 error | Vercel dashboard → Deployments → latest → Logs |
| Order didn't send emails | Supabase dashboard → Edge Functions → `send-order-email` → Logs |
| Webhook didn't fire | Supabase dashboard → SQL Editor: `select * from net._http_response order by created desc limit 10;` |
| Customer can't complete checkout | Vercel Functions logs for `/api/orders` |
| Admin can't log in | Supabase → Authentication → Users (check the user exists and is confirmed) |
| Google Sheet not updating | That's fire-and-forget; check the Apps Script's own execution log |

For any *"why did the order not save?"* question: the `orders` table in Supabase is the source of truth. Everything else (emails, sheet log) is a downstream side-effect and safe to re-run manually.

---

## 9. AI agent tooling — skills & Supabase MCP (optional but nice)

This repo ships with **pre-configured tooling for AI coding agents** (Claude Code, OpenCode, Cursor, etc.). You don't *need* it to run the site — the site is just Next.js and will deploy fine without any of this. But if your future developer uses an agent, these files save them 30 minutes of setup.

### What's in the repo

| Path | What it is |
|---|---|
| `.mcp.json` | Declares the **Supabase MCP server** for this project. An agent that reads `.mcp.json` gets tools for listing tables, running SQL, deploying edge functions, checking logs, etc. — all scoped to this Supabase project. |
| `.agents/skills/supabase/` | Official **Supabase agent skill** (from [supabase/agent-skills](https://github.com/supabase/agent-skills)). Teaches the agent idiomatic Supabase patterns: queries, migrations, auth, storage, RLS, edge functions. |
| `.agents/skills/supabase-postgres-best-practices/` | Postgres best-practices skill — indexing, RLS performance, schema design. |
| `skills-lock.json` | Pins the above two skills to specific versions (like `package-lock.json` but for skills). |
| `.claude/skills/` | **Not committed** (per-machine symlinks). Your agent recreates these automatically if it uses the skill system. |

### Using with Claude Code

1. Install Claude Code: <https://claude.com/claude-code>.
2. `cd` into this repo, run `claude`.
3. First run: Claude will prompt you to enable the Supabase MCP server declared in `.mcp.json`. Accept. It will ask for a **Supabase personal access token** — generate one at <https://supabase.com/dashboard/account/tokens> and paste it. This stays in Claude Code's local config, never in the repo.
4. Skills load automatically — Claude picks them up from `.agents/skills/` (or re-symlinks into `.claude/skills/`).
5. Now you can just say *"show me the orders table schema"* or *"write a migration that adds a `discount_cents` column"* and Claude uses the MCP + skills to do it correctly.

### Using with OpenCode (or another MCP-compatible agent)

OpenCode reads MCP server configs from its own config file, not from `.mcp.json`. Copy the server block into your OpenCode config:

```jsonc
// ~/.config/opencode/config.json (or wherever OpenCode keeps it)
{
  "mcpServers": {
    "supabase": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp?project_ref=wkbhgadmkucxjwidzsig"
    }
  }
}
```

Skills: OpenCode doesn't have a skill package system identical to Claude Code's, but each skill is just a Markdown file at `.agents/skills/<name>/SKILL.md`. You can reference those files directly in prompts (*"read .agents/skills/supabase/SKILL.md and use that approach"*) or paste the relevant parts into your system prompt.

### Updating skills to the latest version

When Supabase ships updates to their agent skills, bump the hashes in `skills-lock.json`:

```bash
# If you use the skills CLI (npm install -g @agents/skills-cli or similar):
skills update

# Or manually re-fetch from https://github.com/supabase/agent-skills and commit.
```

Low priority — the pinned versions work fine.

### If all of this is Greek to you

Ignore it. Tell your developer "the previous dev committed `.mcp.json` and `.agents/skills/`, check `Handleiding/HANDOVER.md §9` if you use Claude Code or similar." They'll figure it out in 5 minutes.

---

## 10. What you do NOT need to worry about

- **Servers, Docker, nginx, SSH** — there aren't any. The old developer used to self-host on a home server; that's gone.
- **SSL certificates** — Vercel auto-issues and auto-renews via Let's Encrypt.
- **Database backups** — Supabase runs daily backups (check retention on your plan).
- **Next.js / dependency updates** — safe to ignore unless there's a security advisory. When you do update, do it from a branch and check the Vercel preview deployment.

---

## 11. Contact & credentials to receive from the previous developer

Before the previous developer signs off, make sure you have:

- [ ] GitHub admin access to `wtburgess/troebel-brewing-website`
- [ ] Supabase Owner role on project `wkbhgadmkucxjwidzsig`
- [ ] Login for the `wotis.cloud@gmail.com` account (or a plan to migrate off it per §7)
- [ ] Login for the Google Sheet + Apps Script that logs orders
- [ ] Admin user created in Supabase (§4)
- [ ] A local copy of `.env.local` (you'll need it if you ever run the site on your own laptop — see `.env.local.example` for the shape)

---

Welcome to the project. The stack is intentionally simple — once the dust settles, there's nothing running anywhere except Vercel + Supabase, both free-tier-friendly at current traffic. Proost! 🍺
