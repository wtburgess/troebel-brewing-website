# Troebel Brewing - Phase E: Production Rollout Plan

**Date:** December 19, 2025
**Status:** Ready to Execute

---

## Overview

Switch from static nginx deployment to SSR (Node.js) deployment with PocketBase backend connectivity via Cloudflare tunnel.

---

## Critical Issue: PocketBase Must Be Public

**Problem:** `NEXT_PUBLIC_POCKETBASE_URL=http://192.168.1.63:8055` is a local IP.

| Request Type | Can Reach 192.168.1.63? | Result |
|--------------|-------------------------|--------|
| SSR (server-side) | YES - container is on local network | Works |
| Client-side JS | NO - browser is on internet | FAILS |
| Beer images | NO - browser requests images | FAILS |

**Client-side components that need PocketBase:**
- `/bestellen` - fetches beer prices from PocketBase
- `/admin/*` - all admin CRUD operations
- Beer images - `getFileUrl()` returns PocketBase URLs
- `/bieren` catalog - loads dynamically

**Solution:** Expose PocketBase via Cloudflare tunnel at `pb.troebel.wotis-cloud.com`

---

## Current State

| Component | Current | Target |
|-----------|---------|--------|
| Frontend Container | nginx static (8056:80) | Node.js SSR (8056:3000) |
| PocketBase | localhost:8055 only | pb.troebel.wotis-cloud.com |
| Cloudflare | troebel.wotis-cloud.com | + pb.troebel.wotis-cloud.com |

---

## Pre-Deployment Checklist

- [ ] Verify PocketBase is running: `ssh wouter@192.168.1.63 "docker ps | grep pocketbase-troebel"`
- [ ] Verify local build works: `npm run build`

---

## Step 0: Add PocketBase to Cloudflare Tunnel

Since you configure tunnels via Cloudflare Dashboard API:

1. Go to **Cloudflare Zero Trust → Access → Tunnels**
2. Select the tunnel that routes `troebel.wotis-cloud.com`
3. Add new public hostname:
   - **Subdomain:** `pb.troebel`
   - **Domain:** `wotis-cloud.com`
   - **Service:** `http://localhost:8055`
4. Save

**Verify tunnel works:**
```bash
curl https://pb.troebel.wotis-cloud.com/api/health
```
Expected: `{"code":200,"message":"API is healthy."}`

---

## Step 1: Update Code for Public PocketBase URL

### 1.1 Update docker-compose.yml

Change from:
```yaml
args:
  - NEXT_PUBLIC_POCKETBASE_URL=http://192.168.1.63:8055
environment:
  - NEXT_PUBLIC_POCKETBASE_URL=http://192.168.1.63:8055
```

To:
```yaml
args:
  - NEXT_PUBLIC_POCKETBASE_URL=https://pb.troebel.wotis-cloud.com
environment:
  - NEXT_PUBLIC_POCKETBASE_URL=https://pb.troebel.wotis-cloud.com
```

### 1.2 Update next.config.ts

Add to `remotePatterns` array:
```typescript
{
  protocol: "https",
  hostname: "pb.troebel.wotis-cloud.com",
  pathname: "/api/files/**",
},
```

Full images config:
```typescript
images: {
  unoptimized: process.env.NODE_ENV === "development",
  remotePatterns: [
    {
      protocol: "https",
      hostname: "images.unsplash.com",
    },
    {
      protocol: "http",
      hostname: "192.168.1.63",
      port: "8055",
      pathname: "/api/files/**",
    },
    {
      protocol: "https",
      hostname: "pb.troebel.wotis-cloud.com",
      pathname: "/api/files/**",
    },
  ],
},
```

---

## Step 2: Copy Updated Files to Server

```bash
scp -r package.json package-lock.json Dockerfile docker-compose.yml next.config.ts tsconfig.json postcss.config.mjs eslint.config.mjs .dockerignore src public wouter@192.168.1.63:~/troebel-brewing/
```

**Files being deployed:**

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage build: Node.js 20 Alpine, standalone output |
| `docker-compose.yml` | Port mapping, environment variables, public PocketBase URL |
| `next.config.ts` | `output: "standalone"`, image remote patterns |
| `src/lib/pocketbase.ts` | PocketBase client singleton |
| `src/lib/api/beers.ts` | Public beer data fetching |
| `src/lib/api/admin.ts` | Admin CRUD operations |
| `src/components/ui/QuickAddModal.tsx` | Quick-add modal |
| `src/components/ui/Toast*.tsx` | Toast notifications |
| `src/store/*.ts` | Zustand stores |

---

## Step 3: Rebuild and Deploy Container

```bash
ssh wouter@192.168.1.63 "cd ~/troebel-brewing && docker-compose down && docker-compose build --no-cache && docker-compose up -d"
```

**Expected result:**
- Container restarts with Node.js runtime
- Port mapping: `8056:3000` (not 8056:80)
- Environment variables: `NEXT_PUBLIC_POCKETBASE_URL=https://pb.troebel.wotis-cloud.com`

---

## Step 4: Verify Deployment

### 4.1 Container Status
```bash
ssh wouter@192.168.1.63 "docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' | grep troebel"
```
**Expected:** `troebel-brewing` showing `8056->3000/tcp` (NOT 8056->80)

### 4.2 Container Logs
```bash
ssh wouter@192.168.1.63 "docker logs troebel-brewing --tail 50"
```
**Expected:** Next.js server started on port 3000

### 4.3 Local Network Test
```bash
ssh wouter@192.168.1.63 "curl -I http://localhost:8056"
```
**Expected:** HTTP 200 OK

---

## Step 5: Verify PocketBase Connectivity

### 5.1 Test Public PocketBase API
```bash
curl https://pb.troebel.wotis-cloud.com/api/collections/beers/records
```
**Expected:** JSON array of beers

### 5.2 Test Public Site
1. Open https://troebel.wotis-cloud.com
2. Open browser DevTools → Network tab
3. Verify homepage loads (Hero, Featured Beers section)
4. **Check beer images** - should load from `pb.troebel.wotis-cloud.com/api/files/...`

### 5.3 Test Beer Catalog
1. Navigate to /bieren
2. Verify beers load (watch Network tab - should call pb.troebel.wotis-cloud.com)
3. Open a beer detail page - verify variants work

---

## Step 6: Verify Admin Panel

### 6.1 Access Admin
1. Navigate to https://troebel.wotis-cloud.com/admin
2. Login with password: `TroebelAdmin2024`

### 6.2 Test Admin Functions
- [ ] Beer list loads
- [ ] Edit a beer → save changes
- [ ] Toggle featured status
- [ ] Adjust variant stock (+/-)
- [ ] **Check Network tab** - all API calls should go to pb.troebel.wotis-cloud.com

---

## Step 7: Smoke Test Complete Flow

### 7.1 Add to Cart
1. Navigate to /bieren
2. Click "Bestellen" on any beer
3. QuickAddModal should open
4. Select variant, add to cart
5. Toast notification should appear

### 7.2 View Cart
1. Navigate to /bestellen
2. Verify cart items display correctly
3. Verify prices match PocketBase data

---

## Architecture After Deployment

```
Internet Users
      │
      ▼
Cloudflare Tunnel
      │
      ├─── troebel.wotis-cloud.com ───► localhost:8056 (Next.js SSR)
      │                                        │
      │                                        │ Server renders pages
      │                                        │ Fetches from PocketBase
      │                                        ▼
      │                               (internal: 192.168.1.63:8055)
      │
      └─── pb.troebel.wotis-cloud.com ───► localhost:8055 (PocketBase API)
                                                  │
                                                  │ Client-side JS calls
                                                  │ Beer image requests
                                                  ▼
                                           (served to browsers)
```

---

## Rollback Plan (If Issues)

If deployment fails, restore the static nginx version:

```bash
# Stop broken container
ssh wouter@192.168.1.63 "cd ~/troebel-brewing && docker-compose down"

# Restore old static Dockerfile
ssh wouter@192.168.1.63 "cd ~/troebel-brewing && cat > Dockerfile << 'EOF'
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/out /usr/share/nginx/html
EXPOSE 80
CMD [\"nginx\", \"-g\", \"daemon off;\"]
EOF"

# Restore old docker-compose.yml
ssh wouter@192.168.1.63 "cd ~/troebel-brewing && cat > docker-compose.yml << 'EOF'
services:
  troebel-brewing:
    build: .
    container_name: troebel-brewing
    restart: unless-stopped
    ports:
      - \"8056:80\"
    labels:
      - \"com.centurylinklabs.watchtower.enable=false\"
EOF"

# Rebuild static version
ssh wouter@192.168.1.63 "cd ~/troebel-brewing && docker-compose build --no-cache && docker-compose up -d"
```

---

## Post-Deployment TODO

- [ ] **PocketBase Admin Security** - Add Cloudflare Access to `pb.troebel.wotis-cloud.com/_/`
- [ ] **Website Admin Security** - Add Cloudflare Access to /admin route (deferred)
- [ ] Monitor container logs for 24 hours
- [ ] Update `CLAUDE.md` production status

---

## Expected docker-compose.yml After Deployment

```yaml
services:
  troebel-brewing:
    build:
      context: .
      args:
        - NEXT_PUBLIC_POCKETBASE_URL=https://pb.troebel.wotis-cloud.com
    container_name: troebel-brewing
    restart: unless-stopped
    ports:
      - "8056:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_POCKETBASE_URL=https://pb.troebel.wotis-cloud.com
      - ADMIN_PASSWORD=TroebelAdmin2024
    labels:
      - "com.centurylinklabs.watchtower.enable=false"
```

---

## Success Criteria

1. **Site loads** at https://troebel.wotis-cloud.com
2. **Homepage** shows featured beers from PocketBase
3. **Beer images** load from pb.troebel.wotis-cloud.com (check Network tab!)
4. **Admin panel** accessible and functional (client-side API works)
5. **Cart** works end-to-end (add, remove, quantity changes)
6. **No console errors** in browser DevTools
7. **Container ports** show 8056→3000 (not 8056→80)
