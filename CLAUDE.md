# CLAUDE.md - Project Intelligence

This file provides context for AI assistants working with this codebase.

## Project Overview

This is a **client-side product search and comparison platform** built with React 18, TypeScript, and Vite. It's deployed at search.yuvaraj-guru.com. The app demonstrates advanced frontend patterns including fuzzy search, multi-faceted filtering, and product comparison features—all running entirely client-side.

## Tech Stack

- **React 18.3** with hooks (no class components)
- **TypeScript 5.6** (strict mode disabled)
- **Vite 5.4** for dev server and bundling
- **Zustand 5.0** for state management
- **TanStack React Query 5.60** (configured for future API integration)
- **Fuse.js 7.0** for fuzzy search
- **Tailwind CSS 3.4** for styling
- **Framer Motion 11** for animations

## Commands

```bash
npm run dev      # Start dev server with hot reload
npm run build    # TypeScript compile + Vite production build
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

## Project Structure

```
src/
├── components/
│   ├── common/        # Header, ActiveFilters, EmptyState, SortDropdown
│   ├── filters/       # FilterPanel with all filter controls
│   ├── search/        # SearchBar with suggestions
│   ├── products/      # ProductCard, ProductGrid
│   ├── comparison/    # CompareDrawer, CompareModal
│   └── layout/        # Layout components
├── hooks/
│   ├── useProducts.ts # Fetches products from Airtable
│   ├── useSearch.ts   # Search + filtering + sorting logic (CORE)
│   └── useURLState.ts # URL parameter synchronization
├── services/
│   └── airtableApi.ts # Airtable REST API client
├── stores/
│   ├── filterStore.ts      # Filter state (Zustand)
│   └── comparisonStore.ts  # Comparison list with localStorage
├── types/
│   └── product.ts     # All TypeScript interfaces
├── data/
│   └── products.ts    # Mock product dataset + utility functions
├── App.tsx            # Main app component
├── main.tsx           # Entry point with React Query provider
└── index.css          # Global styles + Tailwind directives
```

## Architecture Patterns

### Three-Layer State Management

1. **URL State** (`useURLState.ts`): Filter params synced to URL for shareable links
2. **Local UI State** (Zustand stores): Filter selections, comparison list
3. **Server State** (React Query): Fetches products from Airtable API

### Key Files to Understand

- `src/hooks/useProducts.ts` - Fetches products from Airtable via React Query
- `src/hooks/useSearch.ts` - Core search/filter/sort logic with Fuse.js
- `src/services/airtableApi.ts` - Airtable REST API integration
- `src/stores/filterStore.ts` - All filter state and actions
- `src/stores/comparisonStore.ts` - Comparison list with localStorage persistence
- `src/types/product.ts` - All TypeScript interfaces

### Search Configuration (Fuse.js)

Weighted fuzzy search with these priorities:
- Title: 40% weight
- Brand: 25% weight
- Category: 20% weight
- Description: 10% weight
- Tags: 5% weight
- Threshold: 0.3 (allows ~30% character mismatch)

### URL Parameters

The app syncs these to the URL for shareable state:
- `q` - Search query
- `categories` - Comma-separated category slugs
- `brands` - Comma-separated brand names
- `min`/`max` - Price range
- `rating` - Minimum rating (1-4)
- `inStock` - Boolean for stock filter
- `sort` - Sort option (relevance, price-asc, price-desc, rating, name)

## Code Conventions

### Component Patterns

- Functional components with hooks only
- Custom hooks for business logic extraction
- `clsx` for conditional class names
- Framer Motion for animations
- Tailwind utility classes (no CSS modules)

### State Management

- Use Zustand stores for shared state
- Use `useMemo` for expensive computations (search results, filter counts)
- Filter store has computed helpers: `hasActiveFilters()`, `getActiveFilterCount()`
- Comparison store persists to localStorage under key "product-comparison"

### Path Alias

Use `@/` for imports from `src/`:
```typescript
import { Product } from '@/types/product';
import { useSearch } from '@/hooks/useSearch';
```

## Important Implementation Details

### Filter Counts Algorithm

Filter counts show available items per option with OTHER filters applied (not the filter being counted). This prevents showing "0" for unselected options.

### Comparison Feature

- Maximum 4 products can be compared
- Best price/rating highlighted with trophy icons
- Comparison list persists across sessions (localStorage)

### Responsive Breakpoints

- Mobile: <768px (single column, slide-out filters)
- Tablet: 768px-1024px (2-column grid)
- Desktop: 1024px+ (3-4 column grid with sidebar)

## Design Tokens (Tailwind)

Custom colors defined in `tailwind.config.js`:
- `surface-*`: Grayscale palette (50-950)
- `primary-*`: Blue-based (#2563eb)
- `accent-*`: Amber-based (#f59e0b)
- `success/warning/danger`: Status colors

Custom animations: `fade-in`, `slide-up`, `slide-in-right`, `scale-in`

## Testing

No test framework is currently configured. When adding tests:
- Consider Vitest (integrates with Vite)
- Use React Testing Library for component tests
- Focus on testing `useSearch` hook logic and filter behaviors

## Deployment

Deployed on Netlify with SPA redirect configured in `netlify.toml`:
- Build: `npm run build`
- Publish: `dist/`
- All routes redirect to `/index.html` with 200 status

## Airtable Integration

Product data is stored in Airtable and fetched via REST API. This allows managing products without code changes.

### Configuration

Environment variables (in `.env`):
```
VITE_AIRTABLE_PAT=your_personal_access_token
VITE_AIRTABLE_BASE_ID=your_base_id
VITE_AIRTABLE_TABLE_NAME=Products
```

### Airtable Table Schema

The Products table has these fields:
- `title` (Single line text) - Product name
- `description` (Long text) - Product description
- `price` (Number) - Price in USD
- `discountPercentage` (Number) - Discount percentage
- `rating` (Number) - Rating 0-5
- `stock` (Number) - Stock quantity
- `brand` (Single line text) - Brand name
- `category` (Single line text) - Category name
- `thumbnail` (URL) - Product image URL
- `tags` (Single line text) - Comma-separated tags
- `affiliateUrl` (URL) - Amazon affiliate link
- `specs` (Long text) - JSON string of specifications

### Data Flow

1. `useProducts()` hook calls `fetchProducts()` from `airtableApi.ts`
2. React Query caches results (5min stale, 30min garbage collection)
3. `useSearch()` receives products and applies filters/search
4. App.tsx displays loading/error states or filtered products

### Adding/Editing Products

1. Open Airtable base directly
2. Add or edit records in the Products table
3. Refresh the app to see changes (or wait for cache to expire)

### Troubleshooting

- **401 Unauthorized**: Check PAT token is valid and has correct scopes
- **404 Not Found**: Verify Base ID and Table Name are correct
- **No products showing**: Check browser console for API errors

## Amazon Associate Integration

This project uses Amazon Associate affiliate links for monetization. Each product has an `affiliateUrl` field containing Amazon links with tracking tags.

### Current Setup (Pre-API Access)

Until 10 qualifying sales are made, we use manually created SiteStripe links:
- Links are stored in Airtable in the `affiliateUrl` field
- Format: `https://www.amazon.com/dp/ASIN?tag=YOUR_TAG`
- Replace `YOUR_TAG` with your actual Amazon Associate tracking ID

### Updating Affiliate Links

1. Open the Airtable Products table
2. Edit the `affiliateUrl` field for any product
3. Replace placeholder ASINs with actual Amazon product ASINs
4. Verify links redirect properly and track correctly

### Future: Product Advertising API

Once you qualify for API access (10+ sales within 180 days):
1. Apply for Product Advertising API access in Amazon Associates
2. Create API credentials (Access Key, Secret Key, Partner Tag)
3. Implement API calls to fetch real-time product data, prices, and images
4. Store credentials in environment variables (never commit to repo)

### Affiliate Disclosure

Remember to add proper affiliate disclosure on your site per FTC guidelines and Amazon's Operating Agreement.

## Common Tasks

### Adding a New Filter

1. Add filter state to `src/stores/filterStore.ts`
2. Add URL param handling in `src/hooks/useURLState.ts`
3. Add filter logic in `src/hooks/useSearch.ts`
4. Add UI in `src/components/filters/FilterPanel.tsx`

### Adding New Product Data

Add products directly in Airtable:
1. Open the Airtable Products table
2. Add a new row with all required fields
3. For `specs`, use a JSON string like: `{"Display": "15.6 inch", "RAM": "16GB"}`
4. For `tags`, use comma-separated values: `laptop, gaming, portable`

### Modifying Search Behavior

Edit Fuse.js configuration in `src/hooks/useSearch.ts`. Key options:
- `keys` array with weight values
- `threshold` (0-1, lower = stricter matching)
- `minMatchCharLength`, `distance`, etc.

## Performance Notes

- All operations are client-side (<50ms filter updates, <200ms search)
- Zustand's selective subscriptions prevent unnecessary re-renders
- Images use native lazy loading
- Bundle is tree-shaken by Vite
