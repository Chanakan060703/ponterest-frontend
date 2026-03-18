# Pinterest Feed Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Pinterest-like homepage in the frontend that consumes the existing backend image/category APIs, falls back to placeholder mock data, and supports search, category filters, tag filtering, and infinite scroll in batches of 10.

**Architecture:** Keep the route entry simple and move interaction-heavy logic into a focused client feed module. Use small reusable feed components, a shared normalization/API layer, and local mock data so the page works with or without backend data.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, browser `fetch`, Intersection Observer

---

## Chunk 1: Data Layer and Types

### Task 1: Define shared frontend data types

**Files:**
- Create: `src/lib/types.ts`

- [ ] **Step 1: Add image/category/tag types used by both API and mock data**

- [ ] **Step 2: Include a normalized image type with**
  - `id`
  - `title`
  - `imageUrl`
  - `categoryId`
  - `categoryName`
  - `tags`
  - `width`
  - `height`
  - `source`

- [ ] **Step 3: Keep types permissive enough to map unknown backend shapes safely**

- [ ] **Step 4: Commit**

Run:
```bash
git add src/lib/types.ts
git commit -m "feat: add feed data types"
```

### Task 2: Add mock fallback dataset

**Files:**
- Create: `src/lib/mock-data.ts`
- Modify: `src/lib/types.ts`

- [ ] **Step 1: Create 20-30 mock images across several categories**

- [ ] **Step 2: Use `placehold.co` image URLs with varied dimensions so card heights differ**

- [ ] **Step 3: Add realistic sample tags with unlimited-per-image support**

- [ ] **Step 4: Export mock categories and helper accessors**

- [ ] **Step 5: Commit**

Run:
```bash
git add src/lib/types.ts src/lib/mock-data.ts
git commit -m "feat: add mock feed fallback data"
```

### Task 3: Build API and normalization helpers

**Files:**
- Create: `src/lib/api.ts`
- Modify: `src/lib/types.ts`
- Modify: `src/lib/mock-data.ts`

- [ ] **Step 1: Add a small fetch helper targeting `http://localhost:5001`**

- [ ] **Step 2: Implement helpers for**
  - `fetchCategories`
  - `fetchImages`
  - `searchImages`

- [ ] **Step 3: Normalize backend records into the shared image/category types**

- [ ] **Step 4: Add fallback behavior to mock data on request failure or empty results**

- [ ] **Step 5: Commit**

Run:
```bash
git add src/lib/types.ts src/lib/mock-data.ts src/lib/api.ts
git commit -m "feat: add feed api helpers and fallback normalization"
```

## Chunk 2: Feed Components

### Task 4: Create reusable header and search/filter UI

**Files:**
- Create: `src/components/feed/header.tsx`
- Create: `src/components/feed/search-bar.tsx`
- Create: `src/components/feed/category-tabs.tsx`
- Create: `src/components/feed/active-filters.tsx`
- Modify: `src/lib/types.ts`

- [ ] **Step 1: Add a branded header component suitable for the homepage**

- [ ] **Step 2: Add a controlled search component with clear/search interactions**

- [ ] **Step 3: Add horizontally scrollable category tabs with active state**

- [ ] **Step 4: Add compact active-filter chips for category/tag/search summary**

- [ ] **Step 5: Keep component props small and typed**

- [ ] **Step 6: Commit**

Run:
```bash
git add src/components/feed/header.tsx src/components/feed/search-bar.tsx src/components/feed/category-tabs.tsx src/components/feed/active-filters.tsx src/lib/types.ts
git commit -m "feat: add feed header and filter controls"
```

### Task 5: Create image card and masonry grid components

**Files:**
- Create: `src/components/feed/image-card.tsx`
- Create: `src/components/feed/image-grid.tsx`
- Modify: `src/lib/types.ts`

- [ ] **Step 1: Build an image card that renders variable-height images, title, category, and tag chips**

- [ ] **Step 2: Make tag chips clickable and keyboard-friendly**

- [ ] **Step 3: Build a masonry-style grid using CSS columns or responsive grid rules**

- [ ] **Step 4: Add loading sentinel placement for infinite scroll**

- [ ] **Step 5: Commit**

Run:
```bash
git add src/components/feed/image-card.tsx src/components/feed/image-grid.tsx src/lib/types.ts
git commit -m "feat: add feed cards and masonry grid"
```

## Chunk 3: Page Assembly and Interaction Logic

### Task 6: Implement the client feed orchestrator

**Files:**
- Create: `src/components/feed/feed-page.tsx`
- Modify: `src/lib/api.ts`
- Modify: `src/lib/mock-data.ts`
- Modify: `src/lib/types.ts`

- [ ] **Step 1: Create client state for**
  - categories
  - all fetched images
  - selected category
  - selected tag
  - search text
  - visible item count
  - loading/error state

- [ ] **Step 2: Load initial categories and images on mount**

- [ ] **Step 3: Refetch or recompute data when category/search changes**

- [ ] **Step 4: Filter images by clicked tag without backend changes**

- [ ] **Step 5: Reset visible count to 10 whenever the active dataset changes**

- [ ] **Step 6: Use Intersection Observer to increase visible count by 10 near page bottom**

- [ ] **Step 7: Add empty and fallback-friendly states**

- [ ] **Step 8: Commit**

Run:
```bash
git add src/components/feed/feed-page.tsx src/lib/api.ts src/lib/mock-data.ts src/lib/types.ts
git commit -m "feat: add feed page behavior and infinite scroll"
```

### Task 7: Replace the starter route with the new feed

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace the starter content with the feed page entry**

- [ ] **Step 2: Update metadata to match the application**

- [ ] **Step 3: Refresh global styles/tokens to support the new visual direction**

- [ ] **Step 4: Keep layout responsive and aligned with the established feed styling**

- [ ] **Step 5: Commit**

Run:
```bash
git add src/app/page.tsx src/app/layout.tsx src/app/globals.css
git commit -m "feat: replace starter page with pinterest-style feed"
```

## Chunk 4: Verification

### Task 8: Verify the implementation

**Files:**
- Modify as needed based on findings from verification

- [ ] **Step 1: Run lint**

Run:
```bash
npm run lint
```
Expected: no ESLint errors

- [ ] **Step 2: Run production build**

Run:
```bash
npm run build
```
Expected: successful Next.js build

- [ ] **Step 3: Manually verify**
  - initial page shows up to 10 cards
  - scrolling loads more cards
  - search updates results
  - category tab filters results
  - clicking a tag filters results
  - mock fallback still renders when API is unavailable

- [ ] **Step 4: Commit final fixes if verification required changes**

Run:
```bash
git add .
git commit -m "fix: polish feed verification issues"
```
