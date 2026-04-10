# Troebel Brewing Co. - Website & Webshop Plan

**Project:** Brewery showcase website + simple webshop for Troebel Brewing Co.
**Status:** Phase C - Ready for Backend Setup
**Created:** December 15, 2025
**Last Updated:** December 16, 2025

---

## PROGRESS SUMMARY

### Phase A: HTML Wireframes - COMPLETED ✅

**What was built:**
- `01-landing.html` - Hero, featured beers, story section, professionals CTA
- `02-beers.html` - Beer catalog grid with filters
- `03-beer-detail.html` - Individual beer page
- `04-about.html` - Timeline, team, philosophy, gallery
- `05-order.html` - Cart/checkout mockup
- `assets/css/styles.css` - Complete design system

**Design decisions locked in:**
| Element | Decision |
|---------|----------|
| Color palette | Gold primary (#D4A017), Dark (#1C1C1C), Cream (#FFFDF7) |
| Typography | Playfair Display (headings) + Inter (body) |
| "Ons Verhaal" section | B&W image with gold accent bar on left |
| "Voor Professionals" | Dark section with checkmark list |
| Header | Transparent on hero, social icons (Instagram, Untappd) |
| Beer cards | White cards, hover lift effect, ABV badge |
| Animations | Simple CSS reveals (GSAP removed - caused blank page bugs) |

**Known issues fixed:**
- GSAP `gsap.from()` was overriding CSS visibility → removed GSAP dependency
- Pages now use simple IntersectionObserver for scroll reveals

### Phase B: Next.js Development - COMPLETED ✅

**What was built:**
- Full Next.js 15 website with App Router
- Neo-brutalist "garage punk" design system
- All pages: Landing, Bieren, Beer Detail, Verhaal, Horeca, Bestellen
- Zustand cart with persistence
- Beer detail modal in checkout
- Mobile-responsive with beer bubble animations

**Design system:**
- Colors: Yellow (#FFC000), Dark (#1C1C1C), Cream (#FFFDF7)
- Fonts: Anton (headings), Roboto Condensed (body), Permanent Marker (handwritten)
- Style: Thick borders, hard shadows, tilted elements, polaroid photos

### Next Phase: C - Backend Setup (PocketBase)

---

## Executive Summary

Build a visually striking, mobile-first brewery website with a simple order system for a small Antwerp-based nano-brewery. The site will showcase their 6 beers, tell their story, and allow customers to place orders (starting with local pickup).

**Key Principles:**
- **Mobile-first design** - Most visitors will be on phones
- **Lightweight backend** - PocketBase instead of Supabase (simpler!)
- Self-hosted on existing infrastructure (free hosting)
- Simple admin for non-technical brewery owners
- Beautiful scroll animations without complexity
- Start simple (email orders) → evolve to full webshop

---

## Phase 0: HTML/CSS Prototypes (UX/UI Design)

Before building, create static HTML prototypes to validate design direction.

### Prototype Files to Create:
```
Troebel-brewing/
├── prototypes/
│   ├── 01-landing.html        # Hero, featured beers, story teaser
│   ├── 02-beers.html          # Beer catalog grid
│   ├── 03-beer-detail.html    # Single beer page with purchase
│   ├── 04-about.html          # Brewery story, team
│   ├── 05-order.html          # Order form / cart
│   ├── 06-age-gate.html       # Age verification modal
│   └── assets/
│       ├── css/
│       │   ├── styles.css     # Main styles
│       │   └── animations.css # Scroll & pour effects
│       ├── js/
│       │   └── animations.js  # GSAP scroll triggers
│       └── images/            # Beer photos, logo, brewery pics
```

### Design Inspiration from Tout Bien Pils:
| Element | Take | Adapt |
|---------|------|-------|
| Scroll animations | Fade-in sections, parallax | Use GSAP ScrollTrigger |
| Irreverent copy | Playful brand voice | Match Troebel's pun-style names |
| Community feel | User photos, ratings | Untappd integration |
| Product carousel | Swipeable beer cards | Simpler grid + hover effects |
| Age gate | Full-screen modal | Keep but make it fun/branded |

### What to Skip (Too Busy):
- Mega-menus
- Multiple announcement bars
- Complex reward tiers
- Sticky everything

### Animation Plan (Clean + Impressive):
1. **Hero Section:** Subtle beer pour/foam animation (CSS or Lottie)
2. **Scroll Reveals:** Sections fade up as you scroll (GSAP ScrollTrigger)
3. **Beer Cards:** Tilt on hover, subtle glow effect
4. **Page Transitions:** Smooth fade between pages (optional)
5. **Mobile:** Reduce animations for performance

---

## Phase 1: Tech Stack

### Frontend
| Component | Choice | Reason |
|-----------|--------|--------|
| Framework | **Next.js 16** | Latest version, SSR for SEO |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS | Mobile-first utilities, rapid dev |
| Animations | GSAP + ScrollTrigger | Performant scroll effects |
| Icons | Lucide React | Lightweight |

### Backend: PocketBase (All-in-One)

**Why PocketBase over Supabase:**
- Single 15MB binary (vs Supabase's 10+ containers)
- ~30MB RAM usage (vs 2GB+ for Supabase stack)
- Built-in Admin UI for brewery owners (no Directus needed!)
- SQLite database (perfect for small catalog)
- REST API auto-generated
- File storage included
- Simple auth for admin

| Feature | PocketBase Provides |
|---------|---------------------|
| Database | SQLite (embedded) |
| API | Auto-generated REST + Realtime |
| Admin UI | Built-in dashboard |
| Auth | Built-in (admin only needed) |
| Storage | Built-in file uploads |

**PocketBase Admin UI Features:**
- Brewery owners can add/edit beers directly
- Upload beer images with drag & drop
- View orders in a table
- No technical knowledge needed
- Mobile-friendly admin

**Port:** 8090 (Scrutiny uses 8090, so we'll use **8055**)

### Payments
| Provider | Method |
|----------|--------|
| **Mollie** | Bancontact, Payconiq, iDEAL, Cards |

Mollie is the clear choice for Belgian breweries - native Bancontact support essential.

### Deployment
| Component | Platform |
|-----------|----------|
| App | Coolify → Docker |
| Domain | troebel.wotis-cloud.com (Cloudflare Tunnel) |
| Future | troebelbrewing.be (optional custom domain) |

---

## Phase 2: PocketBase Collections

PocketBase uses "collections" instead of SQL tables. Configure via the built-in Admin UI at `http://localhost:8055/_/`.

### Collection: `beers`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | Text | Yes | "Brews Almighty" |
| slug | Text | Yes | Unique, URL-friendly |
| tagline | Text | No | "Onze goddelijke pale ale" |
| description | Editor | No | Rich text description |
| style | Text | Yes | "Belgian Pale Ale" |
| abv | Number | Yes | 6.5 |
| ibu | Number | No | Bitterness units |
| tasting_notes | JSON | No | ["hoppy", "citrus"] |
| food_pairings | JSON | No | ["cheese", "bbq"] |
| untappd_rating | Number | No | 3.41 |
| untappd_count | Number | No | 98 |
| untappd_url | URL | No | Link to Untappd page |
| price_bottle | Number | Yes | 3.50 |
| price_case | Number | No | 72.00 (24-pack) |
| bottle_size_ml | Number | No | Default: 330 |
| image | File | No | Beer product photo |
| label | File | No | Label artwork |
| is_active | Bool | Yes | Show on website |
| is_seasonal | Bool | No | Seasonal badge |
| stock_status | Select | Yes | in_stock / low / out |
| display_order | Number | No | Sort order |

### Collection: `orders`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| order_number | Text | Yes | Auto: TB-2025-0001 |
| customer_name | Text | Yes | |
| customer_email | Email | Yes | |
| customer_phone | Text | No | |
| date_of_birth | Date | Yes | Age verification |
| items | JSON | Yes | [{beer_id, name, qty, price}] |
| fulfillment_type | Select | Yes | pickup / shipping |
| pickup_date | Date | No | |
| pickup_notes | Text | No | |
| subtotal | Number | Yes | |
| vat_amount | Number | Yes | 21% BTW |
| total | Number | Yes | |
| payment_id | Text | No | Mollie payment ID |
| payment_status | Select | Yes | pending / paid / failed |
| status | Select | Yes | pending / paid / preparing / ready / completed |
| customer_notes | Text | No | |
| internal_notes | Text | No | Staff only |

### Collection: `content`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| section | Text | Yes | Unique: hero, about, philosophy |
| title | Text | No | |
| content | Editor | No | Rich text |
| image | File | No | |
| is_published | Bool | Yes | |

### Collection: `team`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | Text | Yes | |
| role | Text | No | "Brouwer", "Oprichter" |
| bio | Editor | No | |
| image | File | No | |
| favorite_beer | Relation | No | → beers |
| display_order | Number | No | |

### Collection: `b2b_inquiries`
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| company_name | Text | Yes | |
| contact_name | Text | Yes | |
| email | Email | Yes | |
| phone | Text | No | |
| business_type | Select | Yes | cafe / restaurant / event / other |
| message | Text | No | |
| status | Select | Yes | new / contacted / declined |

### API Rules (PocketBase)
- **beers**: List/View = public, Create/Update/Delete = admin only
- **orders**: Create = public (checkout), List/View/Update = admin only
- **content**: List/View = public, Create/Update/Delete = admin only
- **team**: List/View = public, Create/Update/Delete = admin only
- **b2b_inquiries**: Create = public, List/View/Update = admin only

---

## Phase 3: Site Structure

### Pages
```
/ (landing)
├── /bieren              # All beers grid
│   └── /bieren/[slug]   # Individual beer page
├── /bestellen           # Order page (cart + checkout)
├── /over-ons            # About/story page
├── /horeca              # B2B inquiry page
├── /contact             # Contact form + location
└── /admin               # Protected admin dashboard
```

### Navigation (Clean, Not Busy)
```
Desktop:
┌──────────────────────────────────────────────────────────────┐
│  [Logo]        Bieren   Over Ons   Horeca   Bestellen  [Cart]│
└──────────────────────────────────────────────────────────────┘

Mobile:
┌────────────────────────────┐
│  [≡]    [Logo]     [Cart]  │
└────────────────────────────┘
```

---

## Phase 4: Order Flow (Simple MVP)

### Option A: Email Orders (Simplest Start)
1. Customer fills order form (name, email, phone, DOB, beer selection)
2. Click "Bestellen" → confirmation page
3. Email sent to:
   - Customer: Order confirmation + pickup instructions
   - Brewery: New order notification with details
4. Brewery replies with payment link (Mollie) or pickup time
5. Manual process, but gets you started

### Option B: Integrated Webshop (Recommended MVP)
1. Customer browses beers, adds to cart
2. Checkout: age verification + contact info
3. Mollie payment (Bancontact/Payconiq)
4. On successful payment:
   - Email confirmation to customer
   - Email notification to brewery
   - Order appears in admin dashboard
5. Brewery marks order as "ready for pickup"
6. Customer receives email with pickup details

### Order Status Flow
```
[pending] → [paid] → [preparing] → [ready] → [picked up]
                          ↓
              Email notification to customer
```

### Admin Dashboard (Simple)
```
┌─────────────────────────────────────────────────────┐
│  ORDERS TODAY: 3    PENDING: 2    READY: 1         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Order TB-2025-0042           [Mark Ready] [View]  │
│  Jan Janssen - 2x Brews Almighty, 1x Moeskop      │
│  Pickup: Dec 16, 14:00-16:00                       │
│  Status: PAID                                       │
│                                                     │
│  Order TB-2025-0041           [Mark Ready] [View]  │
│  Marie Peeters - 1x Mixed Pack (6)                 │
│  Pickup: Dec 15, 18:00                             │
│  Status: READY                                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Phase 5: Visual Effects Implementation

### 1. Scroll Animations (GSAP ScrollTrigger)
```javascript
// Simple scroll reveal for sections
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray('.reveal-section').forEach(section => {
  gsap.from(section, {
    opacity: 0,
    y: 50,
    duration: 0.8,
    scrollTrigger: {
      trigger: section,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  });
});
```

### 2. Beer Pour Effect (Hero Section)
Options:
- **Lottie Animation:** Pre-made liquid animation (easy, performant)
- **CSS Animation:** Gradient/wave effect (simplest)
- **Video Loop:** 3-5 second pour loop (most realistic)

**Recommendation:** Start with CSS gradient wave animation, upgrade to Lottie if needed.

### 3. Beer Card Hover Effects
```css
.beer-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.beer-card:hover {
  transform: translateY(-8px) rotateX(2deg);
  box-shadow: 0 20px 40px rgba(212, 160, 23, 0.2);
}
```

### 4. Performance Rules
- Use `will-change` sparingly
- Reduce animations on mobile (prefers-reduced-motion)
- Lazy load images
- Keep hero animation under 500KB

---

## Phase 6: PocketBase Setup

### Docker Compose
```yaml
# ~/troebel/docker-compose.yml
version: '3.8'
services:
  pocketbase:
    image: ghcr.io/muchobien/pocketbase:latest
    container_name: troebel-pocketbase
    restart: unless-stopped
    ports:
      - '8055:8080'
    volumes:
      - ./pb_data:/pb_data
      - ./pb_public:/pb_public
    command: serve --http=0.0.0.0:8080

  # Next.js app (or via Coolify)
  web:
    build: .
    container_name: troebel-web
    restart: unless-stopped
    ports:
      - '3002:3000'
    environment:
      - POCKETBASE_URL=http://pocketbase:8080
      - MOLLIE_API_KEY=${MOLLIE_API_KEY}
    depends_on:
      - pocketbase
```

### PocketBase Admin UI
Access at: `http://192.168.1.63:8055/_/`

**What brewery owners can do:**
- Add/edit beers with drag & drop image upload
- See all orders in a sortable table
- Update order status (pending → ready)
- Edit "About" page content
- Manage team members
- View B2B inquiries
- Export data to JSON/CSV

**First-time setup:**
1. Go to `http://192.168.1.63:8055/_/`
2. Create admin account
3. Import collection schema (we'll provide a JSON)
4. Add initial beer data

---

## Phase 7: Deployment Plan

### Port Allocation
| Service | Port | Status |
|---------|------|--------|
| Troebel App | 3002 | New (3000=Kookboek, 3001=Uptime Kuma) |
| PocketBase | 8055 | New (lightweight backend + admin) |

### Domain Strategy
| Phase | Domain | Purpose |
|-------|--------|---------|
| Development | troebel.wotis-cloud.com | Free, immediate testing |
| Launch | troebelbrewing.be | Professional public URL (~€10/year) |

### Cloudflare Tunnel Addition
```yaml
# Add to /etc/cloudflared/config.yml
- hostname: troebel.wotis-cloud.com
  service: http://localhost:3002
- hostname: admin.troebel.wotis-cloud.com
  service: http://localhost:8055  # PocketBase admin

# Later: Add custom domain via Cloudflare DNS
- hostname: troebelbrewing.be
  service: http://localhost:3002
```

### Deployment Steps
1. SSH to server, create `~/troebel/` directory
2. Deploy PocketBase container
3. Configure collections via PocketBase Admin
4. Seed initial beer data
5. Build & deploy Next.js app (via Coolify or Docker)
6. Add Cloudflare Tunnel routes
7. Test end-to-end on mobile

---

## Phase 8: Future Expansion (Shipping)

When ready to add shipping:

### Simple Shipping Add-on
1. Add shipping address fields to order form
2. Calculate shipping cost (flat rate €5.95 for Belgium)
3. After payment, generate shipping label
4. Options:
   - **bPost integration** (API available)
   - **Sendcloud** (aggregator, easier)
   - **Manual:** Print labels from bPost website

### Shipping Status Flow
```
[paid] → [preparing] → [shipped] → [delivered]
              ↓              ↓
        Pack order    Add tracking #
                      Email to customer
```

---

## Implementation Order

### Phase A: HTML Wireframes - COMPLETED ✅
- [x] Create `prototypes/` folder structure
- [x] Build `01-landing.html` with hero, scroll sections
- [x] Build `02-beers.html` grid layout
- [x] Build `03-beer-detail.html` product page
- [x] Build `04-about.html` story layout
- [x] Build `05-order.html` cart/checkout mockup
- [x] Design system in `styles.css` (colors, typography, components)
- [x] Iterate based on owner feedback (B&W images, gold accents, dark sections)
- [ ] ~~GSAP scroll animations~~ → Replaced with CSS/IntersectionObserver

### Phase B: Next.js Development - COMPLETED ✅
- [x] Initialize Next.js 15 project with App Router
- [x] Set up Tailwind CSS with design tokens from prototypes
- [x] Create reusable components:
  - [x] `Header.tsx` (transparent/solid states, mobile menu with beer bubbles)
  - [x] `Footer.tsx`
  - [x] `BeerCard.tsx`
  - [x] `StorySection.tsx` (polaroid style)
  - [x] `ProfessionalsSection.tsx` (dark with checkmarks)
  - [x] `Hero.tsx`
  - [x] `Marquee.tsx` (scrolling banner)
  - [x] `ShopCta.tsx`
- [x] Build pages from prototypes:
  - [x] `/` (landing - neo-brutalist style)
  - [x] `/bieren` (catalog with filtering)
  - [x] `/bieren/[slug]` (detail with tabs)
  - [x] `/verhaal` (about/story with timeline)
  - [x] `/horeca` (B2B page with form & FAQ)
  - [x] `/bestellen` (order with beer modal, cart, checkout)
- [x] Cart state management (Zustand)
- [x] Design system: Neo-brutalist "garage punk" style
  - Yellow (#FFC000), Dark (#1C1C1C), Cream backgrounds
  - Anton (headings), Roboto Condensed (body), Permanent Marker (handwritten)
  - Thick borders, hard shadows, tilted elements
- [x] Age gate modal (DOB verification + quick confirm)

### Phase C: Backend Setup
- [ ] Deploy PocketBase container on server (port 8055)
- [ ] Create collections via Admin UI
- [ ] Seed initial beer data (6 beers)
- [ ] Connect Next.js to PocketBase API
- [ ] Test API endpoints

### Phase D: Payments & Orders
- [ ] Mollie integration (Bancontact, Payconiq)
- [ ] Order flow implementation
- [ ] Email notifications (Resend or Nodemailer)
- [ ] Admin order management

### Phase E: Deploy & Launch
- [ ] Deploy via Coolify
- [ ] Configure Cloudflare Tunnel
- [ ] Mobile testing
- [ ] Train brewery owners on PocketBase Admin
- [ ] Go live!

---

## File Structure

```
Troebel-brewing/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Landing
│   │   ├── bieren/
│   │   │   ├── page.tsx             # Beer catalog
│   │   │   └── [slug]/page.tsx      # Beer detail
│   │   ├── bestellen/page.tsx       # Order/Cart
│   │   ├── over-ons/page.tsx        # About
│   │   ├── horeca/page.tsx          # B2B
│   │   ├── contact/page.tsx
│   │   └── admin/                   # Protected admin
│   │       ├── page.tsx             # Dashboard
│   │       └── orders/page.tsx      # Order management
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MobileNav.tsx
│   │   ├── beer/
│   │   │   ├── BeerCard.tsx
│   │   │   ├── BeerGrid.tsx
│   │   │   └── BeerDetail.tsx
│   │   ├── shop/
│   │   │   ├── Cart.tsx
│   │   │   ├── CartItem.tsx
│   │   │   └── CheckoutForm.tsx
│   │   ├── ui/                      # shadcn components
│   │   └── animations/
│   │       ├── ScrollReveal.tsx
│   │       └── PourEffect.tsx
│   │
│   ├── lib/
│   │   ├── pocketbase.ts       # PocketBase client
│   │   ├── mollie.ts
│   │   └── email.ts
│   │
│   └── hooks/
│       ├── useCart.ts
│       └── useAgeVerification.ts
│
├── prototypes/                      # HTML/CSS prototypes
├── public/
│   └── images/
├── docker-compose.yml
├── Dockerfile
└── README.md
```

---

## Cost Summary

| Item | Monthly Cost |
|------|-------------|
| Hosting (existing server) | €0 |
| PocketBase (self-hosted) | €0 |
| Cloudflare Tunnel | €0 |
| Mollie | Per transaction only |
| **Total Fixed** | **€0** |

| Mollie Fees | Amount |
|-------------|--------|
| Per transaction | €0.25 + 1.8% |
| Example: €30 order | €0.79 fee |

### Resource Usage (Lightweight!)
| Service | RAM | Storage |
|---------|-----|---------|
| PocketBase | ~30MB | SQLite in pb_data |
| Next.js App | ~100MB | Docker image |
| **Total** | **~130MB** | Minimal |

---

## Questions Resolved

1. **Backend:** PocketBase (lightweight all-in-one: DB + API + Admin + Storage)
2. **Admin for owners:** PocketBase built-in UI (no extra CMS needed!)
3. **Animations:** GSAP ScrollTrigger + CSS effects (clean, performant)
4. **Fulfillment:** Start with pickup, expansion plan for shipping ready
5. **Payments:** Mollie with Bancontact/Payconiq priority
6. **Mobile:** Mobile-first responsive design (no PWA complexity)
7. **Domain:** Start with troebel.wotis-cloud.com, add troebelbrewing.be later

---

## Next Steps

**Phase A is DONE.** Ready for Next.js development.


