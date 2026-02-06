import { useEffect, useCallback } from 'react'
import { useFilterStore } from '../stores/filterStore'
import { priceRange as defaultPriceRange } from '../data/products'
import { SortOption } from '../types/product'

export function useURLState() {
  const {
    query,
    categories,
    brands,
    priceRange,
    rating,
    inStock,
    sortBy,
    setQuery,
    toggleCategory,
    toggleBrand,
    setPriceRange,
    setRating,
    setInStock,
    setSortBy,
    clearFilters,
  } = useFilterStore()

  // Parse URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    // Query
    const q = params.get('q')
    if (q) setQuery(q)

    // Categories
    const cats = params.get('categories')
    if (cats) {
      cats.split(',').forEach(cat => {
        if (!useFilterStore.getState().categories.includes(cat)) {
          toggleCategory(cat)
        }
      })
    }

    // Brands
    const b = params.get('brands')
    if (b) {
      b.split(',').forEach(brand => {
        if (!useFilterStore.getState().brands.includes(brand)) {
          toggleBrand(brand)
        }
      })
    }

    // Price range
    const minPrice = params.get('min')
    const maxPrice = params.get('max')
    if (minPrice || maxPrice) {
      setPriceRange({
        min: minPrice ? parseInt(minPrice) : defaultPriceRange.min,
        max: maxPrice ? parseInt(maxPrice) : defaultPriceRange.max,
      })
    }

    // Rating
    const r = params.get('rating')
    if (r) setRating(parseInt(r))

    // In stock
    const stock = params.get('inStock')
    if (stock === 'true') setInStock(true)

    // Sort
    const sort = params.get('sort') as SortOption
    if (sort) setSortBy(sort)
  }, [])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()

    if (query) params.set('q', query)
    if (categories.length > 0) params.set('categories', categories.join(','))
    if (brands.length > 0) params.set('brands', brands.join(','))
    if (priceRange.min !== defaultPriceRange.min) params.set('min', priceRange.min.toString())
    if (priceRange.max !== defaultPriceRange.max) params.set('max', priceRange.max.toString())
    if (rating !== null) params.set('rating', rating.toString())
    if (inStock) params.set('inStock', 'true')
    if (sortBy !== 'relevance') params.set('sort', sortBy)

    const newURL = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname

    window.history.replaceState({}, '', newURL)
  }, [query, categories, brands, priceRange, rating, inStock, sortBy])

  // Generate shareable URL
  const getShareableURL = useCallback(() => {
    return window.location.href
  }, [])

  // Copy URL to clipboard
  const copyURLToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      return true
    } catch {
      return false
    }
  }, [])

  return {
    getShareableURL,
    copyURLToClipboard,
  }
}
