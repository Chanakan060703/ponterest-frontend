# Pinterest Feed Design

**Date:** 2026-03-18

## Goal

Build a frontend-only homepage that feels similar to Pinterest and integrates with the existing backend image APIs without requiring any backend changes. The page should show image cards with uneven heights, keyword tags, category filtering, search, and infinite scrolling that reveals up to 10 additional items at a time.

## Scope

In scope:

- Replace the starter homepage with a production-style discovery feed
- Read image, category, and search data from the existing backend API
- Fall back to local placeholder/mock data when API data is unavailable or empty
- Filter visible results by category, search text, and clicked image tags
- Split major UI pieces into reusable components

Out of scope:

- Any backend code or schema changes
- Authentication flows
- Create/edit/delete image management
- Persisting user filter preferences

## User Experience

The homepage acts as a visual discovery feed. At the top, users see a reusable header with brand/navigation styling, a search bar, and a horizontal category tab bar. Below that, users see a masonry-style image grid where each card has:

- An image with a variable display height
- Title text
- Category label
- A flexible list of tag chips

The page initially renders up to 10 items. As the user scrolls near the bottom, the next batch of up to 10 is appended automatically. Clicking a tag chip narrows the currently displayed dataset to images containing that tag. Users can clear or switch filters without reloading the page.

## Data Strategy

The frontend will consume these backend endpoints from `http://localhost:5001`:

- `GET /images`
- `GET /images/search?search=...`
- `GET /categories`

`GET /tags` is optional for supplemental UI state, but the main feed can derive tag chips from the image payload if present. Because backend availability and seed data are uncertain, the frontend will maintain a local mock dataset shaped like the API response. If image/category requests fail, return empty results, or produce incomplete content, the page will render the mock dataset instead of a blank state.

Placeholder images will use `https://placehold.co/` with varied dimensions and labels so the masonry layout feels intentional even without real uploaded images.

## Frontend Architecture

Recommended structure:

- `src/app/page.tsx`
  - Server entry that renders the feed shell and imports the client feed module
- `src/components/feed/feed-page.tsx`
  - Main client-side orchestrator for fetch, filter, pagination, and empty/loading/error states
- `src/components/feed/header.tsx`
  - Reusable top header/brand/navigation component
- `src/components/feed/search-bar.tsx`
  - Controlled search field with debounce/submit handling
- `src/components/feed/category-tabs.tsx`
  - Horizontal category filter tabs with active state
- `src/components/feed/image-grid.tsx`
  - Masonry grid and infinite-scroll sentinel
- `src/components/feed/image-card.tsx`
  - Variable-height card, metadata, and clickable tags
- `src/lib/api.ts`
  - Small API wrapper and fetch helpers
- `src/lib/mock-data.ts`
  - Fallback images/categories/tags
- `src/lib/types.ts`
  - Shared frontend types for image/category/tag data

This keeps data logic and presentation separated without over-engineering the page.

## Filtering and Infinite Scroll

The page will maintain a single normalized dataset in client state and derive visible results from it. Filtering priority:

1. Category selection changes the source fetch or local subset
2. Search text uses `/images/search` when non-empty
3. Clicked tag chips narrow the already loaded result set to matching images

Infinite scroll will not request paginated backend data because the documented API does not expose pagination. Instead, the page will load the full current result set for the active query/filter combination, then reveal items in slices of 10 using an intersection observer sentinel. This keeps behavior aligned with the requirement while staying compatible with the current backend.

## Error Handling

- If `categories` fails, use mock categories
- If images/search fails or returns no useful records, use mock images
- If a record lacks tags/category/image URL, normalize it with sensible fallbacks
- Show lightweight empty state messaging and active-filter chips when no results match the current search/filter combination

## Visual Direction

The page should feel inspired by Pinterest rather than copying it literally:

- Warm neutral background with subtle gradients or panels
- Rounded cards with strong image focus
- Dense but readable masonry spacing
- Expressive header and filter controls
- Clear active states for selected category and tag filters

The layout must remain usable on mobile by collapsing into narrower columns and horizontally scrollable category tabs.

## Testing and Verification

Minimum verification for implementation:

- `npm run lint`
- `npm run build`

Manual verification:

- Feed shows real API data when backend is available
- Feed falls back to mock data when backend is unavailable
- Search updates visible results
- Category tabs update the dataset
- Clicking a tag chip filters the visible results
- Scrolling appends 10 more cards at a time

## Risks and Mitigations

- Backend image payload shape may differ from assumptions
  - Mitigation: normalize API responses defensively and fill gaps from mock-friendly defaults
- Search/category endpoints may not return identical payload shapes
  - Mitigation: centralize transformation logic in `src/lib/api.ts`
- Large unpaginated datasets could be heavy
  - Mitigation: acceptable for current scope; reveal results incrementally in the UI
