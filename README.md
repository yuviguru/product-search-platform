# 🔍 Product Search Platform

A modern, intelligent product search and comparison platform demonstrating advanced frontend architecture patterns.

**Live Demo:** [search.yuvaraj-guru.com](https://search.yuvaraj-guru.com)

![Product Search Platform](./screenshot.png)

## ✨ Key Features

### Smart Search
- **Fuzzy Search** - Finds products even with typos
- **Auto-suggestions** - Product, category, and brand suggestions
- **Recent Searches** - Remembers your last 5 searches
- **Debounced Input** - 300ms debounce to reduce unnecessary renders

### Advanced Filtering
- **Dynamic Filter Counts** - Shows available products per filter option
- **Multi-select Facets** - Select multiple categories/brands
- **Price Range** - Min/max inputs with quick preset buttons
- **Rating Filter** - Filter by minimum star rating
- **Stock Filter** - Show only in-stock items

### Product Comparison
- **Compare up to 4 products** - Side-by-side spec comparison
- **Persistent Selection** - Comparison list saved to localStorage
- **Highlight Best Values** - Trophy icons show best price/rating
- **Spec Comparison Table** - All product specs in one view

### URL State Sync
- **Shareable Links** - All filters reflected in URL
- **Browser History** - Back/forward navigation works
- **Copy to Clipboard** - One-click URL sharing

### Performance
- **Client-side Search** - No API calls for filtering
- **Optimized Renders** - Zustand for minimal re-renders
- **Lazy Loading** - Images load as needed
- **Animations** - Smooth Framer Motion transitions

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| State | Zustand |
| Search | Fuse.js |
| Animations | Framer Motion |
| Data Fetching | TanStack React Query |
| Icons | Lucide React |

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Header, EmptyState, SortSelect
│   ├── comparison/      # CompareDrawer, CompareModal
│   ├── filters/         # FilterPanel with all filter types
│   ├── products/        # ProductCard, ProductGrid
│   └── search/          # SearchBar with suggestions
├── hooks/
│   ├── useSearch.ts     # Search + filter logic
│   └── useURLState.ts   # URL synchronization
├── stores/
│   ├── filterStore.ts   # Zustand filter state
│   └── comparisonStore.ts # Comparison state + persistence
├── data/
│   └── products.ts      # Mock product data with specs
├── types/
│   └── product.ts       # TypeScript interfaces
└── App.tsx              # Main application
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/product-search-platform.git
cd product-search-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

## 🎯 Architecture Highlights

### State Management Strategy

| State Type | Location | Purpose |
|------------|----------|---------|
| URL State | URLSearchParams | Shareable filters |
| Local State | Zustand | UI state, comparison list |
| Server State | React Query | Product data (extendable) |

### Filter Count Algorithm

The filter counts update dynamically based on *other* active filters:

```typescript
// Example: Category filter counts
// If brand "Apple" is selected, category counts show
// only products available for Apple brand
const getFilteredExcluding = (exclude: 'category' | 'brand' | ...) => {
  // Apply all filters EXCEPT the one being counted
  // This shows users what's actually available
}
```

### Search Implementation

Uses Fuse.js for client-side fuzzy search with weighted keys:

```typescript
const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.4 },    // Most important
    { name: 'brand', weight: 0.25 },
    { name: 'category', weight: 0.2 },
    { name: 'description', weight: 0.1 },
    { name: 'tags', weight: 0.05 },
  ],
  threshold: 0.3,  // Fuzzy matching tolerance
}
```

## 📱 Responsive Design

| Breakpoint | Layout |
|------------|--------|
| Mobile (<768px) | Single column, slide-out filters |
| Tablet (768px-1024px) | 2-column grid |
| Desktop (1024px+) | 3-4 column grid, sidebar filters |

## 🔮 Future Enhancements

- [ ] Virtual scrolling for large datasets
- [ ] AI-powered search (natural language queries)
- [ ] AI comparison summary
- [ ] Backend API integration
- [ ] User authentication + saved comparisons

## 📊 Performance Targets

| Metric | Target | Actual |
|--------|--------|--------|
| Lighthouse Performance | >90 | TBD |
| First Contentful Paint | <1.0s | TBD |
| Filter Update | <50ms | ✅ Client-side |
| Search Response | <200ms | ✅ Client-side |

## 📄 License

MIT License - feel free to use this project as a reference or starting point.

## 👤 Author

**Yuvaraj** - Frontend Architect
- Portfolio: [yuvaraj-guru.com](https://yuvaraj-guru.com)
- GitHub: [@yourusername](https://github.com/yourusername)

---

*Built as a portfolio project demonstrating modern frontend architecture patterns.*
