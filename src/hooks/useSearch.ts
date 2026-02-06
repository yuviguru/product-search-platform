import { useMemo, useState, useCallback } from 'react'
import Fuse from 'fuse.js'
import { useFilterStore } from '../stores/filterStore'
import { Product, FilterCounts, SortOption } from '../types/product'

const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'brand', weight: 0.25 },
    { name: 'category', weight: 0.2 },
    { name: 'description', weight: 0.1 },
    { name: 'tags', weight: 0.05 },
  ],
  threshold: 0.3,
  includeScore: true,
}

function sortProducts(items: Product[], sortBy: SortOption): Product[] {
  const sorted = [...items]

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating)
    case 'name':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case 'relevance':
    default:
      return sorted
  }
}

export function useSearch(products: Product[]) {
  const {
    query,
    categories,
    brands,
    priceRange,
    rating,
    inStock,
    sortBy,
  } = useFilterStore()

  // Calculate default price range from products
  const defaultPriceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 10000 }
    return {
      min: Math.min(...products.map(p => p.price)),
      max: Math.max(...products.map(p => p.price)),
    }
  }, [products])

  // Create Fuse instance
  const fuse = useMemo(() => new Fuse(products, fuseOptions), [products])

  // Filter and search products
  const filteredProducts = useMemo(() => {
    if (products.length === 0) return []

    let results: Product[]

    // Text search
    if (query.trim()) {
      const searchResults = fuse.search(query)
      results = searchResults.map(r => r.item)
    } else {
      results = [...products]
    }

    // Category filter
    if (categories.length > 0) {
      results = results.filter(p => categories.includes(p.category))
    }

    // Brand filter
    if (brands.length > 0) {
      results = results.filter(p => brands.includes(p.brand))
    }

    // Price filter
    results = results.filter(p => 
      p.price >= priceRange.min && p.price <= priceRange.max
    )

    // Rating filter
    if (rating !== null) {
      results = results.filter(p => p.rating >= rating)
    }

    // Stock filter
    if (inStock) {
      results = results.filter(p => p.stock > 0)
    }

    // Sort
    return sortProducts(results, sortBy)
  }, [query, categories, brands, priceRange, rating, inStock, sortBy, fuse])

  // Calculate filter counts based on current filters (excluding the filter being counted)
  const filterCounts = useMemo((): FilterCounts => {
    if (products.length === 0) {
      return {
        categories: {},
        brands: {},
        priceRanges: [],
        ratings: { 4: 0, 3: 0, 2: 0, 1: 0 },
        total: 0,
      }
    }

    // Start with products filtered by query only
    let baseProducts: Product[]
    if (query.trim()) {
      const searchResults = fuse.search(query)
      baseProducts = searchResults.map(r => r.item)
    } else {
      baseProducts = [...products]
    }

    // Apply all filters except the one we're counting
    const getFilteredExcluding = (exclude: 'category' | 'brand' | 'price' | 'rating') => {
      let results = baseProducts

      if (exclude !== 'category' && categories.length > 0) {
        results = results.filter(p => categories.includes(p.category))
      }
      if (exclude !== 'brand' && brands.length > 0) {
        results = results.filter(p => brands.includes(p.brand))
      }
      if (exclude !== 'price') {
        results = results.filter(p => p.price >= priceRange.min && p.price <= priceRange.max)
      }
      if (exclude !== 'rating' && rating !== null) {
        results = results.filter(p => p.rating >= rating)
      }
      if (inStock) {
        results = results.filter(p => p.stock > 0)
      }

      return results
    }

    // Category counts
    const categoryProducts = getFilteredExcluding('category')
    const categoryCountMap: Record<string, number> = {}
    categoryProducts.forEach(p => {
      categoryCountMap[p.category] = (categoryCountMap[p.category] || 0) + 1
    })

    // Brand counts
    const brandProducts = getFilteredExcluding('brand')
    const brandCountMap: Record<string, number> = {}
    brandProducts.forEach(p => {
      brandCountMap[p.brand] = (brandCountMap[p.brand] || 0) + 1
    })

    // Price range counts
    const priceProducts = getFilteredExcluding('price')
    const priceRanges = [
      { range: 'Under $100', min: 0, max: 100 },
      { range: '$100 - $500', min: 100, max: 500 },
      { range: '$500 - $1000', min: 500, max: 1000 },
      { range: '$1000 - $2000', min: 1000, max: 2000 },
      { range: 'Over $2000', min: 2000, max: Infinity },
    ].map(range => ({
      ...range,
      count: priceProducts.filter(p => p.price >= range.min && p.price < range.max).length
    }))

    // Rating counts
    const ratingProducts = getFilteredExcluding('rating')
    const ratingCountMap: Record<number, number> = {
      4: ratingProducts.filter(p => p.rating >= 4).length,
      3: ratingProducts.filter(p => p.rating >= 3).length,
      2: ratingProducts.filter(p => p.rating >= 2).length,
      1: ratingProducts.filter(p => p.rating >= 1).length,
    }

    return {
      categories: categoryCountMap,
      brands: brandCountMap,
      priceRanges,
      ratings: ratingCountMap,
      total: filteredProducts.length,
    }
  }, [query, categories, brands, priceRange, rating, inStock, fuse, filteredProducts, products])

  return {
    products: filteredProducts,
    totalCount: filteredProducts.length,
    filterCounts,
    defaultPriceRange,
    isFiltered: query.trim() !== '' || categories.length > 0 || brands.length > 0 ||
      priceRange.min !== defaultPriceRange.min || priceRange.max !== defaultPriceRange.max ||
      rating !== null || inStock,
  }
}

// Recent searches hook
const RECENT_SEARCHES_KEY = 'recent-searches'
const MAX_RECENT_SEARCHES = 5

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const addSearch = useCallback((query: string) => {
    if (!query.trim()) return

    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== query.toLowerCase())
      const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES)
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const removeSearch = useCallback((query: string) => {
    setRecentSearches(prev => {
      const updated = prev.filter(s => s !== query)
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearSearches = useCallback(() => {
    setRecentSearches([])
    localStorage.removeItem(RECENT_SEARCHES_KEY)
  }, [])

  return {
    recentSearches,
    addSearch,
    removeSearch,
    clearSearches,
  }
}
