# Troebel Brewing Co. - Agent Instructions

**For AI assistants working on this project.**

---

## Project Overview

Building a brewery website + webshop for **Troebel Brewing Co.**, an Antwerp nano-brewery.

**Goal:** Visually striking, mobile-first website with a simple order system.

**Brand Voice:** Playful, irreverent, pun-heavy (beer names like "Brews Almighty", "Moeskop", "A Brew Good Men")

---

## Current Status

| Phase | Status |
|-------|--------|
| A: HTML Wireframes | ✅ Complete |
| B: Next.js Frontend | ✅ Complete |
| C: PocketBase Backend | 📋 Planned (see `Plan/BE-plan.md`) |
| D: Payments (Mollie) | ⏳ Pending |
| E: Deployment | 🔄 Partial (frontend live) |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 (App Router), TypeScript |
| Styling | Tailwind CSS v4 |
| State | Zustand (cart) |
| Backend | PocketBase (SQLite, REST API, Admin UI) |
| Payments | Mollie (Bancontact, Payconiq, iDEAL) |
| Hosting | Self-hosted via Coolify + Cloudflare Tunnel |

---

## Design Rules (DO NOT CHANGE)

### Colors
```
Primary Gold:  #D4A017
Dark:          #1C1C1C
Cream:         #FFFDF7
```

### Fonts
- **Headings:** Playfair Display
- **Body:** Inter

### Section Backgrounds
Alternate between cream and dark for visual rhythm:
```
Hero (dark) → Beers (cream) → Story (dark) → CTA (dark) → Professionals (cream) → Footer (dark)
```

### Images
- Story/About sections: **Grayscale** with gold accent bar
- Professionals section: **Grayscale**
- Beer cards: **Full color**

---

## Component Patterns

### Client vs Server Components
- Components with `onClick`, `useState`, `useEffect` → `"use client"`
- Static display components → Server Component (default)

### Tailwind Classes
Use the design tokens defined in `globals.css`:
```tsx
// Colors
className="bg-primary text-dark"
className="bg-dark text-white"
className="bg-cream text-gray-600"

// Typography
className="font-heading"  // Playfair Display
className="font-body"     // Inter (default)
```

---

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `BeerCard.tsx` |
| Pages | lowercase | `page.tsx` |
| Utilities | camelCase | `formatPrice.ts` |
| Hooks | camelCase with `use` prefix | `useCart.ts` |

---

## Working Guidelines

### DO
- Read existing components before creating new ones
- Follow the established design system
- Use TypeScript interfaces for props
- Keep components focused and reusable
- Test builds before committing (`npm run build`)

### DON'T
- Add new colors without checking the design system
- Use GSAP (removed due to bugs - use CSS animations)
- Create documentation files unless requested
- Over-engineer simple solutions
- Change locked design decisions

### ASK FIRST
- Adding new dependencies
- Changing the section background pattern
- Modifying the header/footer structure
- Adding new fonts or colors

---

## Common Tasks

### Adding a new page
1. Create folder in `src/app/` (e.g., `src/app/contact/`)
2. Add `page.tsx` with Header + Footer
3. Use existing section components where possible

### Adding a new section component
1. Create in `src/components/sections/`
2. Follow existing prop patterns
3. Use design system colors
4. Export from component file

### Styling tips
```tsx
// Responsive text
className="text-[clamp(2rem,5vw,3rem)]"

// Section padding
className="py-16 md:py-24"

// Container
className="max-w-[1200px] mx-auto px-6"

// Gold accent bar
<div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
```

---

## Reference Documents

| Document | Location | Purpose |
|----------|----------|---------|
| Full Plan | `Plan/Original.md` | Complete project specification |
| Backend Plan | `Plan/BE-plan.md` | Phase C implementation details |
| HTML Prototypes | `prototypes/*.html` | Visual reference |
| CSS Design System | `prototypes/assets/css/styles.css` | Original styles |
| Project Context | `CLAUDE.md` | Quick reference for this project |

---

## Deployment Info

### Current Setup (Frontend Only)

| Service | Port | URL | Notes |
|---------|------|-----|-------|
| **Production** | 8056 | troebel.wotis-cloud.com | Static frontend, NO backend |
| **Test Instance** | 8057 | TBD | For backend testing |
| **PocketBase** | 8055 | http://192.168.1.63:8055/_/ | Backend admin |

### Deployment Strategy

**IMPORTANT:** Current production stays running WITHOUT backend during Phase C development.

1. `troebel.wotis-cloud.com` (port 8056) = static frontend for feedback
2. Test instance (port 8057) = backend integration testing
3. Only merge backend when fully tested

### Phase C Backend Details

See `Plan/BE-plan.md` for full plan. Key points:
- PocketBase for database + admin
- Google Sheets for stock management (single source of truth)
- Custom admin page ("Beheer Bieren") for brewery owners
- Variants: bottles (flesjes), crates (bakken), kegs (vaten)
