# Troebel Brewing Co. - Project Context

**Project:** Brewery website + webshop for Troebel Brewing Co.
**Type:** Next.js 15 App Router + PocketBase backend
**Status:** Phase C & D Complete - Production Rollout Next

---

## Hosting & Deployment

| Environment | URL | Port | Notes |
|-------------|-----|------|-------|
| **Production (FE only)** | troebel.wotis-cloud.com | 8056 | Static frontend, NO backend |
| **Test Instance** | TBD | 8057 | For backend integration testing |
| **PocketBase Admin** | http://192.168.1.63:8055/_/ | 8055 | Backend admin UI |
| **Git Repository** | `ssh://git@192.168.1.63:2222/wouter/Troebel-brewing.git` | - | Gitea |
| **Local Dev** | http://localhost:3000 | 3000 | `npm run dev` |

### Deployment Strategy

**Phase E: Ready to deploy backend to production**

Current state:
- `troebel.wotis-cloud.com` (port 8056) = static frontend (to be replaced)
- PocketBase running at port 8055 (backend ready)

Production rollout requires:
1. Switch Dockerfile from static export to SSR (Node.js runtime)
2. Configure environment variables for PocketBase URL
3. Deploy new container to replace static site
4. Set up admin access security (IP restriction or Cloudflare Access)

### Docker Deployment (Current - Static)

The site runs as a static export served by nginx in Docker.

**Location on server:** `~/troebel-brewing/`

**Redeploy commands:**
```bash
# From Windows - copy files and rebuild
scp -r package.json package-lock.json Dockerfile docker-compose.yml nginx.conf next.config.ts tsconfig.json postcss.config.mjs eslint.config.mjs .dockerignore src public wouter@192.168.1.63:~/troebel-brewing/

# On server - rebuild container
ssh wouter@192.168.1.63 "cd ~/troebel-brewing && docker-compose down && docker-compose build --no-cache && docker-compose up -d"
```

**Quick status check:**
```bash
ssh wouter@192.168.1.63 "docker ps | grep troebel"
```

---

## Quick Reference

| Item | Value |
|------|-------|
| **Dev Server** | `npm run dev` → http://localhost:3000 |
| **Build** | `npm run build` |
| **Tech Stack** | Next.js 15, TypeScript, Tailwind v4, Zustand, Vanta.js |
| **Backend** | PocketBase at http://192.168.1.63:8055 |
| **Admin Panel** | http://localhost:3000/admin (password: TroebelAdmin2024) |
| **Payments** | Mollie (Bancontact, Payconiq) - Phase F |

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

---

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Design tokens + base styles
│   ├── layout.tsx           # Root layout with fonts
│   ├── page.tsx             # Landing page
│   ├── bieren/              # Beer catalog (TODO)
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── verhaal/page.tsx     # About page (TODO)
│   ├── horeca/page.tsx      # B2B page (TODO)
│   └── bestellen/page.tsx   # Cart/checkout (TODO)
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx       # Transparent/scrolled states
│   │   └── Footer.tsx       # 4-column footer
│   ├── beer/
│   │   └── BeerCard.tsx     # Beer card component
│   ├── sections/
│   │   ├── Hero.tsx         # Uses VantaBackground
│   │   ├── FeaturedBeers.tsx
│   │   ├── StorySection.tsx
│   │   ├── ProfessionalsSection.tsx
│   │   └── UntappdCta.tsx
│   └── ui/
│       └── VantaBackground.tsx  # WebGL fog/clouds effect
│
├── lib/                     # Utilities (TODO)
│   ├── pocketbase.ts
│   └── cart.ts
│
└── hooks/                   # Custom hooks (TODO)
    └── useCart.ts
```

---

## Key Design Decisions (Locked)

1. **B&W Images with Gold Accent:** Story section uses grayscale images with gold bar on left
2. **Header:** Transparent on hero pages, solid cream when scrolled
3. **Hero Background:** Vanta.js WebGL fog/clouds effect with brand colors (gold highlights)
4. **Mobile Menu:** Full-screen dark overlay
5. **Beer Cards:** White cards on cream bg, ABV badge top-right

---

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

---

## Phase B - COMPLETED
- [x] `/bieren` - Beer catalog page
- [x] `/bieren/[slug]` - Beer detail page
- [x] `/verhaal` - About/story page
- [x] `/horeca` - B2B page
- [x] `/bestellen` - Cart + checkout
- [x] Zustand cart state with persistence
- [x] Age gate modal
- [x] Neo-brutalist design system

## Phase C - Backend - COMPLETED
- [x] PocketBase backend at port 8055
- [x] Custom admin page ("Beheer Bieren") for brewery owners
- [x] Variants: bottles (flesjes), crates (bakken), kegs (vaten)
- [x] Featured beers toggle (homepage line-up)
- [x] Full CRUD for beers and variants

## Phase D - Cart UX Redesign - COMPLETED
- [x] QuickAddModal (desktop centered, mobile bottom sheet)
- [x] Toast notifications with "Bekijk mand" action
- [x] "Ook verkrijgbaar" variant pills in cart
- [x] Mobile tested

## Phase E - Production Rollout (NEXT)
See `Plan/NEXT-SESSION-PROMPT.md` for details:
- [ ] Final bug fixes
- [ ] Switch from static export to SSR mode
- [ ] Deploy to production (replace static site)
- [ ] Admin access security

## Phase F - Service Integration (FUTURE)
- [ ] Mollie payment integration (Bancontact, Payconiq)
- [ ] Order management (orders collection, status tracking)
- [ ] Confirmation emails (SMTP/Resend/SendGrid)

---

## Reference Files

| File | Purpose |
|------|---------|
| `Plan/Original.md` | Full project plan |
| `Plan/BE-plan.md` | Phase C backend implementation plan |
| `prototypes/*.html` | HTML wireframes |
| `prototypes/assets/css/styles.css` | Original CSS design system |
