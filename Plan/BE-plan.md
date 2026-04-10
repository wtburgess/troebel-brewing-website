# Phase C: PocketBase Backend Setup - Implementation Plan

**Status:** ✅ COMPLETE
**Created:** December 16, 2025
**Last Updated:** December 19, 2025

---

## Progress Summary

| Component | Status | Notes |
|-----------|--------|-------|
| PocketBase Container | ✅ Done | Running at 192.168.1.63:8055 |
| Superuser Account | ✅ Done | admin@troebel.be / TroebelAdmin2024 |
| `beers` Collection | ✅ Done | 6 beers with images, `isFeatured` field added |
| `beer_variants` Collection | ✅ Done | 18 variants re-seeded |
| Frontend API Layer | ✅ Done | src/lib/api/beers.ts, admin.ts |
| Types & Interfaces | ✅ Done | src/types/beer.ts (includes isFeatured) |
| Admin Login Page | ✅ Done | src/app/admin/page.tsx |
| Admin Beer List | ✅ Done | src/app/admin/bieren/page.tsx |
| Admin Components | ✅ Done | BeerEditModal, VariantManager, AddBeerForm, DeleteConfirmModal |
| Featured Beer Toggle | ✅ Done | "In Line-up" button in admin |
| Delete Confirmation | ✅ Done | Nice modal with "I'm sure" checkbox |
| Homepage Dynamic | ✅ Done | Uses isFeatured=true from PocketBase |
| Bestellen Dynamic | ✅ Done | Fetches from PocketBase |
| Image Loading Fix | ✅ Done | unoptimized in dev mode |
| PocketBase Auth Fix | ✅ Done | v0.34+ _superusers collection |
| Auto-Cancel Bug | ✅ Done | Added requestKey: null to all API calls |
| Full Testing | ✅ Done | All tests passed December 19, 2025 |
| Cart UX Redesign | ✅ Done | Phase D - QuickAddModal, toasts, mobile tested |
| Production Deploy | ⏳ Next | Phase E - see NEXT-SESSION-PROMPT.md |
| Service Integration | 📋 Planned | Phase F - Mollie, orders, emails |
| Google Sheets Sync | ❌ Optional | Deferred |

---

## Known Bug: Auto-Cancellation Error

**Error:**
```
[API] PocketBase error: "The request was autocancelled."
```

**Root Cause:** PocketBase JS SDK automatically cancels duplicate in-flight requests to the same endpoint. This happens during:
- React strict mode double renders
- Multiple components fetching same data
- Rapid navigation

**Fix Required in `src/lib/api/beers.ts`:**

Add `$autoCancel: false` to all getFullList/getFirstListItem calls:

```typescript
// getAllBeers()
const records = await pb.collection('beers').getFullList<PocketBaseBeer>({
  expand: 'beer_variants(beer)',
  sort: 'sortOrder,name',
  $autoCancel: false,  // ADD THIS
});

// getFeaturedBeers()
const records = await pb.collection('beers').getFullList<PocketBaseBeer>({
  filter: 'isFeatured=true',
  expand: 'beer_variants(beer)',
  sort: 'sortOrder,name',
  $autoCancel: false,  // ADD THIS
});

// getBeerBySlug()
const record = await pb
  .collection('beers')
  .getFirstListItem<PocketBaseBeer>(`slug="${slug}"`, {
    expand: 'beer_variants(beer)',
    $autoCancel: false,  // ADD THIS
  });

// getBeersByCategory()
const records = await pb.collection('beers').getFullList<PocketBaseBeer>({
  filter: `category="${category}"`,
  expand: 'beer_variants(beer)',
  sort: 'sortOrder,name',
  $autoCancel: false,  // ADD THIS
});

// getAllBeerSlugs()
const records = await pb.collection('beers').getFullList<PocketBaseBeer>({
  fields: 'slug',
  $autoCancel: false,  // ADD THIS
});
```

---

## Collection Schemas

### Collection: `beers` (id: pbc_2021087443)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| slug | text | Yes | Unique URL slug |
| name | text | Yes | Beer name |
| style | text | Yes | e.g., "Winter Ale" |
| category | select | Yes | pale-ale, ipa, saison, seasonal, tripel, session, blond |
| description | text | Yes | Short tagline |
| longDescription | text | No | Extended description |
| abv | number | Yes | Alcohol % |
| ibu | number | No | Bitterness |
| rating | number | No | Untappd rating |
| ratingCount | number | No | Rating count |
| image | file | Yes | Beer image |
| tastingNotes | text | No | Comma-separated |
| foodPairings | text | No | Comma-separated |
| isNew | bool | No | "New" badge |
| isLimited | bool | No | "Seasonal" ribbon |
| **isFeatured** | **bool** | **No** | **Show on homepage line-up** |
| sortOrder | number | No | Display order |

**API Rules:** List/View = public, Create/Update/Delete = admin only

### Collection: `beer_variants` (id: pbc_2423284238)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| beer | relation | Yes | → beers (cascadeDelete) |
| type | select | Yes | bottle, crate, keg |
| size | text | Yes | "33cl", "24x33cl", "20L" |
| label | text | Yes | "Flesje 33cl", "Bak 24 stuks", "Vat 20L" |
| price | number | Yes | Price in EUR |
| stock | number | Yes | Current quantity |
| isAvailable | bool | **No** | Manual toggle (NOT required to allow false) |
| sortOrder | number | No | Display order |

**API Rules:** List/View = public, Create/Update/Delete = admin only

---

## Current Data in PocketBase

### Beers (6 total)
| Beer | Slug | isFeatured | Image |
|------|------|------------|-------|
| Rendier | Renbier | ✅ Yes | Rendier (winter ale).png |
| Moeskop | moeskop | ✅ Yes | Moeskopje bier.png |
| Brews Almighty | brews-almighty | ✅ Yes | Brews almighty bottle.png |
| Marwals | marwals | No | MARWALS.jpg |
| Bi'tje | bitje | No | BI'TJE.jpg |
| A Brew Good Men | a-brew-good-men | No | a-brew-good-men.png |

### Variants (18 total - 3 per beer)
| Beer | Flesje 33cl | Bak 24 stuks | Vat 20L |
|------|-------------|--------------|---------|
| Rendier | €3.50 / 100 stock | €75.00 / 5 stock | €130.00 / 2 stock |
| Moeskop | €3.00 / 200 stock | €65.00 / 10 stock | €110.00 / 3 stock |
| Brews Almighty | €3.20 / 150 stock | €70.00 / 8 stock | €120.00 / 2 stock |
| Marwals | €3.80 / 100 stock | €85.00 / 5 stock | €140.00 / 1 stock |
| Bi'tje | €3.00 / 200 stock | €65.00 / 10 stock | €110.00 / 3 stock |
| A Brew Good Men | €3.50 / 120 stock | €75.00 / 6 stock | €130.00 / 2 stock |

---

## File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── page.tsx              ✅ Login
│   │   └── bieren/
│   │       └── page.tsx          ✅ Beer management + featured toggle + delete modal
│   ├── api/
│   │   └── admin/
│   │       └── auth/route.ts     ✅ Password auth
│   ├── bieren/
│   │   ├── page.tsx              ✅ Catalog
│   │   └── [slug]/page.tsx       ✅ Detail
│   ├── bestellen/page.tsx        ✅ Cart/checkout (fetches from PocketBase)
│   └── page.tsx                  ✅ Homepage (dynamic featured beers)
├── components/
│   ├── admin/
│   │   ├── BeerEditModal.tsx     ✅ Edit beer form
│   │   ├── VariantManager.tsx    ✅ Inline variant editing
│   │   ├── AddBeerForm.tsx       ✅ Add new beer + isFeatured checkbox
│   │   └── DeleteConfirmModal.tsx ✅ Nice delete modal with checkbox
│   ├── layout/
│   │   └── Footer.tsx            ✅ Added "Beheer" admin link
│   └── beer/
│       ├── BeerCard.tsx          ✅ Card component
│       ├── BeerCatalog.tsx       ✅ Client filter
│       └── BeerDetailClient.tsx  ✅ Detail with variants
├── lib/
│   ├── pocketbase.ts             ✅ Client singleton + v0.34+ auth
│   └── api/
│       ├── beers.ts              ✅ Beer API + isFeatured + logging
│       └── admin.ts              ✅ Admin CRUD + toggleFeatured()
├── store/
│   └── cart.ts                   ✅ Zustand cart with variants
├── types/
│   └── beer.ts                   ✅ All interfaces + isFeatured
└── data/
    └── beers.ts                  ✅ Static fallback data
```

---

## Testing Checklist ✅ COMPLETE

See `NEXT-SESSION-PROMPT.md` for full testing checklist.

All tests passed (December 19, 2025):
- [x] Auto-cancellation bug fixed
- [x] Homepage featured beers working
- [x] Catalog and detail pages working
- [x] Cart/checkout flow working
- [x] All admin functions working
- [x] Error handling/fallbacks working
- [x] Cart UX redesign (Phase D) complete
- [x] Mobile testing complete

---

## Deployment Strategy

**Status:** Ready for production rollout (Phase E)

| Environment | URL | Port | Purpose |
|-------------|-----|------|---------|
| **Production (target)** | troebel.wotis-cloud.com | 8056 | SSR Next.js + PocketBase |
| **PocketBase Backend** | 192.168.1.63:8055 | 8055 | Backend API + Admin UI |
| **Local Dev** | localhost:3000 | 3000 | Development testing |

### Production Rollout Plan

**Step 1: Update Dockerfile for SSR**
- Remove `output: 'export'` from next.config.ts
- Use Node.js runtime instead of nginx static serving
- Expose port 3000 internally

**Step 2: Update docker-compose.yml**
- Switch from nginx to Node.js container
- Add environment variables for PocketBase URL
- Configure proper networking

**Step 3: Configure reverse proxy**
- nginx or Traefik to route traffic
- troebel.wotis-cloud.com → Next.js container (port 8056)
- PocketBase accessible at 8055 (internal network only, or via admin subdomain)

**Step 4: Admin access security**
Option A: IP restriction (local network only)
Option B: Cloudflare Access (recommended for remote access)
Option C: Basic auth layer in nginx

**Current Deployment Commands (static):**
```bash
# Copy files
scp -r package.json package-lock.json Dockerfile docker-compose.yml next.config.ts tsconfig.json postcss.config.mjs eslint.config.mjs .dockerignore src public wouter@192.168.1.63:~/troebel-brewing/

# Deploy
ssh wouter@192.168.1.63 "cd ~/troebel-brewing && docker-compose down && docker-compose build --no-cache && docker-compose up -d"
```

---

## Lessons Learned

1. **PocketBase v0.34+ uses `_superusers` collection** - Not the old `/api/admins/` endpoint
2. **PocketBase schema PATCH replaces ALL fields** - Include all fields or data gets wiped
3. **Boolean required=true causes issues** - `false` value rejected as "blank"
4. **Private IP images blocked by Next.js** - Use `unoptimized: true` for development
5. **PocketBase auto-cancels duplicate requests** - Use `$autoCancel: false` option
6. **Always backup before schema changes** - PocketBase data can be lost easily

---

## Next Steps

### Phase E: Production Rollout (CURRENT)
1. **Final bug fixes** - In progress
2. **Update deployment config** - Switch from static export to SSR mode
3. **Configure reverse proxy** - nginx config for Next.js + PocketBase
4. **Deploy to production** - Replace static site at port 8056
5. **Verify admin access** - Test admin panel from production
6. **Security** - IP restriction or additional auth layer for /admin

### Phase F: Service Integration (FUTURE)
1. **Mollie Payment Integration**
   - Bancontact, Payconiq support
   - Webhook for payment confirmation
   - Order status updates

2. **Order Management**
   - `orders` collection in PocketBase
   - Order status workflow (pending → paid → fulfilled)
   - Customer contact info storage
   - Pickup scheduling / delivery coordination
   - Order history

3. **Email Notifications**
   - Email service (SMTP/Resend/SendGrid)
   - Order confirmation to customer
   - New order notification to admin
   - Status update notifications

4. **(Optional)** Google Sheets integration for stock management
