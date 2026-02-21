# Affiliate Product Website - Feature Plan

## Overview

Transform the existing product search platform into a full-featured affiliate product website with news, video reviews, AI-powered insights, and product alternatives. All new features follow the existing three-layer state pattern (URL state, Zustand local state, React Query server state).

---

## Phase 1: Foundation — Routing & Product Detail Page

The current app is a single-page layout with no router. Every feature below depends on having dedicated pages, so this is the prerequisite.

### 1.1 Add React Router

- Install `react-router-dom`
- Create route structure:
  ```
  /                     → Home (current search/grid view)
  /product/:id          → Product Detail Page
  /news                 → News Feed
  /news/:id             → News Article Detail
  /compare              → Full Comparison Page (move from modal)
  ```
- Update `Header.tsx` with navigation links (Home, News, Compare)
- Preserve existing URL parameter sync (`useURLState`) for the home page filters

### 1.2 Product Detail Page (`/product/:id`)

A dedicated page for each product — this is the anchor page for affiliate conversions. Sections:

| Section | Description |
|---------|-------------|
| **Hero** | Large product image, title, brand, rating, price with discount badge |
| **Buy Section** | Prominent "Buy on Amazon" affiliate CTA button, price comparison if available |
| **Specs Table** | Full specifications from the `specs` field, laid out in a clean table |
| **Description** | Full product description (currently truncated in cards) |
| **YouTube Reviews** | Embedded video reviews (Phase 2) |
| **AI Insights** | AI-generated analysis (Phase 3) |
| **Alternatives** | Similar products carousel (Phase 4) |

- Link `ProductCard` titles/images to `/product/:id`
- Add breadcrumb navigation: Home > Category > Product
- Add "Share" and "Copy Link" buttons
- Track clicks on affiliate links (analytics-ready)

### 1.3 Updated Data Layer

- Extend the `Product` interface:
  ```typescript
  export interface Product {
    // ... existing fields ...
    youtubeReviewIds?: string[]       // YouTube video IDs
    aiSummary?: string                // AI-generated product summary
    aiPros?: string[]                 // AI-identified pros
    aiCons?: string[]                 // AI-identified cons
    aiValueScore?: number             // AI value-for-money score (1-10)
    alternatives?: number[]           // IDs of alternative products
  }
  ```
- Add corresponding fields to Airtable Products table
- Update `airtableApi.ts` transformation to parse new fields

---

## Phase 2: YouTube Review Integration

Embed top YouTube review videos directly on product pages so users don't leave the site before clicking affiliate links.

### 2.1 Data Storage

**Option A — Manual Curation (Recommended to start)**
- Add `youtubeUrls` field to Airtable Products table (Long text, one URL per line)
- Parse into `youtubeReviewIds[]` in `airtableApi.ts`
- Manually curate the best 2-3 review videos per product via SiteStripe workflow

**Option B — YouTube Data API (Future)**
- Use YouTube Data API v3 to search: `"{product title}" review`
- Filter by view count, recency, channel reputation
- Cache results in Airtable or a lightweight backend
- Requires API key and quota management

### 2.2 Components

```
src/components/product-detail/
├── YouTubeReviewSection.tsx    # Section container with heading
├── YouTubeEmbed.tsx            # Responsive iframe embed (16:9)
└── YouTubeCard.tsx             # Thumbnail card for video selection
```

**YouTubeReviewSection:**
- Display heading: "Top Video Reviews"
- Horizontal scrollable list of `YouTubeCard` thumbnails
- Active video plays in large `YouTubeEmbed` above the list
- Show video count badge
- Lazy-load iframes (only load when section scrolls into view)

**YouTubeEmbed:**
- Responsive 16:9 aspect ratio container
- Privacy-enhanced mode (`youtube-nocookie.com`)
- Loading skeleton while iframe loads
- Fallback message if no videos available

**YouTubeCard:**
- Thumbnail image from `https://img.youtube.com/vi/{VIDEO_ID}/mqdefault.jpg`
- Play button overlay
- Click switches the active embed

### 2.3 ProductCard Enhancement

- Add a small YouTube icon badge on `ProductCard` if the product has reviews
- Clicking it navigates to the product detail page scrolled to the video section

---

## Phase 3: AI Insights

Provide AI-generated analysis to help users make informed decisions — and stay on the page longer before converting.

### 3.1 Data Strategy

**Option A — Pre-generated & Stored (Recommended)**
- Generate insights offline using Claude API for each product
- Store results in Airtable fields: `aiSummary`, `aiPros`, `aiCons`, `aiValueScore`
- Refresh periodically (weekly or on product data change)
- Zero runtime cost, instant display

**Option B — On-demand Generation (Future)**
- Add a lightweight API proxy (Netlify Function or Cloudflare Worker)
- Call Claude API when user views product detail and cache result
- More dynamic but adds infrastructure and API costs

### 3.2 Insight Content Structure

For each product, the AI generates:

| Field | Description | Example |
|-------|-------------|---------|
| **Summary** | 2-3 sentence overview focusing on value proposition | "The MacBook Air M2 delivers exceptional performance for everyday tasks while maintaining all-day battery life. Best suited for students and professionals who prioritize portability." |
| **Pros** | 3-5 key advantages | ["Excellent battery life", "Silent fanless design", "Sharp Retina display"] |
| **Cons** | 2-4 honest drawbacks | ["Limited to 1 external display", "Base model has only 8GB RAM"] |
| **Value Score** | 1-10 rating of price-to-performance | 8.5 |
| **Best For** | Target audience in 1 sentence | "Ideal for students, content creators, and mobile professionals" |
| **Verdict** | Buy/wait/skip recommendation | "Strong Buy — best ultrabook value in its price range" |

### 3.3 Components

```
src/components/product-detail/
├── AIInsightsSection.tsx       # Full insight panel
├── AIScoreBadge.tsx            # Circular score indicator (1-10)
├── ProConList.tsx              # Styled pros/cons with icons
└── AIVerdictBanner.tsx         # Highlighted verdict strip
```

**AIInsightsSection:**
- "AI Analysis" header with sparkle icon and "Powered by AI" badge
- Summary paragraph
- Two-column pros (green checkmarks) / cons (red x marks) layout
- Value Score as circular progress indicator
- "Best For" and "Verdict" in a highlighted banner
- Subtle disclaimer: "AI-generated analysis. Verify details before purchasing."

**AIScoreBadge:**
- Circular SVG with gradient fill based on score
- Color coding: 8-10 green, 6-7.9 amber, below 6 red
- Animated fill on scroll-into-view
- Shows on ProductCard as a small badge (optional)

### 3.4 ProductCard Enhancement

- Add small "AI Score" badge (e.g., "AI: 8.5") on cards that have insights
- Users see at-a-glance which products are highly rated by AI

---

## Phase 4: Product Alternatives & Closest Matches

Help users discover similar products — keeping them browsing and increasing conversion chance.

### 4.1 Matching Algorithm

**Client-side matching** (no backend required):

```typescript
function findAlternatives(product: Product, allProducts: Product[]): Product[] {
  // Score each product based on similarity:
  // 1. Same category                    → +40 points
  // 2. Same brand                       → +10 points (lower — users want options)
  // 3. Price within ±30% range          → +25 points (scaled by closeness)
  // 4. Rating within ±0.5              → +15 points
  // 5. Overlapping tags                 → +10 points (per shared tag)
  // 6. Overlapping specs                → +10 points (per matching spec key)

  // Exclude the product itself
  // Return top 4-6 products sorted by score
}
```

**AI-enhanced matching** (stored in Airtable):
- Use Claude to analyze product specs and identify true alternatives
- Store as `alternatives: [productId1, productId2, ...]` in Airtable
- Fall back to algorithm if AI alternatives not available

### 4.2 Components

```
src/components/product-detail/
├── AlternativesSection.tsx     # "You Might Also Like" section
├── AlternativeCard.tsx         # Compact comparison card
└── ComparisonStrip.tsx         # Quick compare bar
```

**AlternativesSection:**
- Heading: "Similar Products" or "Alternatives to Consider"
- Horizontal scrollable row of `AlternativeCard` components
- "Compare All" button that adds alternatives to comparison
- Filter tabs: "Same Category", "Same Price Range", "Higher Rated"

**AlternativeCard:**
- Compact card (smaller than ProductCard)
- Key differentiators highlighted:
  - Price difference: "+$50 more" or "$30 cheaper" (green/red)
  - Rating comparison: "★ 0.3 higher"
  - Key spec differences (e.g., "4GB more RAM")
- "Compare" quick-add button
- "View" link to that product's detail page
- Affiliate "Buy" button

### 4.3 Hook

```typescript
// src/hooks/useAlternatives.ts
function useAlternatives(product: Product, allProducts: Product[]): {
  alternatives: ScoredProduct[]
  sameCategory: Product[]
  samePriceRange: Product[]
  higherRated: Product[]
  isLoading: boolean
}
```

---

## Phase 5: News & Product Updates Feed

A content section to drive organic traffic, keep users engaged, and promote products contextually.

### 5.1 Data Strategy

**Option A — Airtable-powered Blog (Recommended to start)**
- New Airtable table: `News`
  ```
  Fields:
  - title (Single line text)
  - slug (Single line text) — URL-friendly identifier
  - summary (Long text) — Short preview
  - content (Long text) — Full article in Markdown
  - coverImage (URL) — Hero image
  - category (Single select) — "Product Launch", "Review Roundup", "Deal Alert", "Industry News"
  - relatedProducts (Linked records → Products) — Products mentioned
  - tags (Single line text) — Comma-separated
  - publishedAt (Date) — Publication date
  - author (Single line text)
  - featured (Checkbox) — Pin to top
  ```
- Fetch via existing Airtable API pattern (new `airtableNewsApi.ts`)
- Write articles manually or generate with AI assistance

**Option B — External News API (Future enhancement)**
- Integrate a tech news API (e.g., NewsAPI, GNews, or RSS feeds)
- Auto-curate based on product categories in the catalog
- Combine with Airtable for editorial control

### 5.2 Components

```
src/components/news/
├── NewsFeed.tsx               # Main feed page
├── NewsCard.tsx               # Article preview card
├── NewsArticle.tsx            # Full article view
├── FeaturedNews.tsx           # Hero banner for featured articles
├── NewsFilters.tsx            # Category filter tabs
└── RelatedProducts.tsx        # Product cards linked to article
```

**NewsFeed Page (`/news`):**
- Featured article hero banner at top
- Category filter tabs: All, Product Launches, Reviews, Deals, Industry
- Grid of `NewsCard` components (2-3 columns)
- Pagination or infinite scroll
- "Related Products" sidebar (desktop) linking to catalog

**NewsCard:**
- Cover image with category badge overlay
- Title (2-line clamp)
- Summary (3-line clamp)
- Published date and author
- Related product count badge
- Click navigates to `/news/:slug`

**NewsArticle Page (`/news/:slug`):**
- Hero image with gradient overlay
- Title, author, date, category badge
- Markdown content rendered with a library (e.g., `react-markdown`)
- **Related Products Section** — Cards for products mentioned in the article, each with affiliate links
- "Share" buttons
- "More Articles" section at bottom

### 5.3 Home Page Integration

- Add a "Latest News" section below the product grid on the home page
- Show 3 most recent articles as cards
- "View All News →" link to `/news`

### 5.4 Hooks & Services

```typescript
// src/services/airtableNewsApi.ts
fetchNewsArticles(): Promise<NewsArticle[]>
fetchNewsArticleBySlug(slug: string): Promise<NewsArticle>

// src/hooks/useNews.ts
useNews(): { articles, featured, isLoading, error }
useNewsArticle(slug: string): { article, relatedProducts, isLoading }

// src/stores/newsStore.ts (Zustand)
newsCategory: string
setNewsCategory: (cat: string) => void
```

---

## Phase 6: Cross-cutting Enhancements

### 6.1 Affiliate Link Tracking

- Wrap all affiliate links in a tracking utility:
  ```typescript
  function trackAffiliateClick(productId: number, source: string) {
    // source: "product-card", "detail-page", "comparison", "news-article", "alternative"
    // Log to analytics (Google Analytics events, or a simple Airtable log table)
  }
  ```
- Add UTM parameters to affiliate URLs based on source
- Helps understand which features drive the most conversions

### 6.2 SEO & Meta Tags

- Add `react-helmet-async` for dynamic page titles and meta descriptions
- Product detail pages: title, description, Open Graph image
- News articles: title, description, OG image, article schema
- Structured data (JSON-LD) for products (price, rating, availability)

### 6.3 Affiliate Disclosure

- Add a persistent disclosure banner or footer note: "As an Amazon Associate, I earn from qualifying purchases"
- Per FTC guidelines and Amazon's Operating Agreement
- Show on all pages that contain affiliate links

### 6.4 Analytics Integration

- Add Google Analytics 4 (or similar)
- Track: page views, search queries, filter usage, affiliate clicks, comparison usage, news reads
- Helps optimize product curation and content strategy

---

## Implementation Priority & Dependencies

```
Phase 1: Foundation (Routing + Product Detail)     ← START HERE
  │
  ├── Phase 2: YouTube Reviews                     ← Independent
  ├── Phase 3: AI Insights                         ← Independent
  ├── Phase 4: Alternatives                        ← Independent
  │
  └── Phase 5: News Feed                           ← Independent (parallel with 2-4)

Phase 6: Cross-cutting                             ← After core features
```

**Recommended build order:**
1. **Phase 1** — Routing + Product Detail Page (everything depends on this)
2. **Phase 4** — Alternatives (pure client-side, no external dependencies)
3. **Phase 2** — YouTube Reviews (requires Airtable field + manual video curation)
4. **Phase 3** — AI Insights (requires generating insights, storing in Airtable)
5. **Phase 5** — News Feed (requires new Airtable table + content creation)
6. **Phase 6** — Polish (tracking, SEO, disclosure, analytics)

---

## New Dependencies

| Package | Purpose | Phase |
|---------|---------|-------|
| `react-router-dom` | Client-side routing | 1 |
| `react-markdown` | Render news article content | 5 |
| `react-helmet-async` | Dynamic meta tags / SEO | 6 |
| `remark-gfm` | GitHub-flavored markdown support | 5 |

No backend infrastructure is required. Everything runs client-side with Airtable as the CMS.

---

## New Airtable Schema

### Products Table — New Fields

| Field | Type | Phase |
|-------|------|-------|
| `youtubeUrls` | Long text (one URL per line) | 2 |
| `aiSummary` | Long text | 3 |
| `aiPros` | Long text (JSON array string) | 3 |
| `aiCons` | Long text (JSON array string) | 3 |
| `aiValueScore` | Number (1-10) | 3 |
| `aiBestFor` | Single line text | 3 |
| `aiVerdict` | Single line text | 3 |
| `alternativeIds` | Single line text (comma-separated IDs) | 4 |

### News Table — New Table

| Field | Type |
|-------|------|
| `title` | Single line text |
| `slug` | Single line text |
| `summary` | Long text |
| `content` | Long text (Markdown) |
| `coverImage` | URL |
| `category` | Single select |
| `relatedProductIds` | Single line text (comma-separated) |
| `tags` | Single line text (comma-separated) |
| `publishedAt` | Date |
| `author` | Single line text |
| `featured` | Checkbox |

---

## File Structure After All Phases

```
src/
├── components/
│   ├── common/              # Existing + AffiliateDisclosure, Breadcrumb, SEOHead
│   ├── filters/             # Existing (unchanged)
│   ├── search/              # Existing (unchanged)
│   ├── products/            # Existing + enhanced ProductCard
│   ├── comparison/          # Existing (unchanged)
│   ├── product-detail/      # NEW
│   │   ├── ProductDetailPage.tsx
│   │   ├── ProductHero.tsx
│   │   ├── SpecsTable.tsx
│   │   ├── YouTubeReviewSection.tsx
│   │   ├── YouTubeEmbed.tsx
│   │   ├── YouTubeCard.tsx
│   │   ├── AIInsightsSection.tsx
│   │   ├── AIScoreBadge.tsx
│   │   ├── ProConList.tsx
│   │   ├── AIVerdictBanner.tsx
│   │   ├── AlternativesSection.tsx
│   │   ├── AlternativeCard.tsx
│   │   └── ComparisonStrip.tsx
│   ├── news/                # NEW
│   │   ├── NewsFeed.tsx
│   │   ├── NewsCard.tsx
│   │   ├── NewsArticle.tsx
│   │   ├── FeaturedNews.tsx
│   │   ├── NewsFilters.tsx
│   │   └── RelatedProducts.tsx
│   └── layout/              # NEW - shared layout wrapper
│       └── PageLayout.tsx
├── hooks/
│   ├── useProducts.ts       # Existing (updated for new fields)
│   ├── useSearch.ts         # Existing (unchanged)
│   ├── useURLState.ts       # Existing (unchanged)
│   ├── useAlternatives.ts   # NEW
│   ├── useNews.ts           # NEW
│   └── useNewsArticle.ts    # NEW
├── services/
│   ├── airtableApi.ts       # Existing (updated for new fields)
│   ├── airtableNewsApi.ts   # NEW
│   └── affiliateTracking.ts # NEW
├── stores/
│   ├── filterStore.ts       # Existing (unchanged)
│   ├── comparisonStore.ts   # Existing (unchanged)
│   └── newsStore.ts         # NEW
├── types/
│   ├── product.ts           # Existing (extended)
│   └── news.ts              # NEW
├── data/
│   └── products.ts          # Existing (unchanged)
├── App.tsx                  # Updated with React Router
├── main.tsx                 # Updated with Router provider
└── index.css                # Extended with new component styles
```
