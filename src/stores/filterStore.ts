import { create } from 'zustand'
import { FilterState, SortOption, PriceRange } from '../types/product'
import { priceRange as defaultPriceRange } from '../data/products'

interface FilterStore extends FilterState {
  // Actions
  setQuery: (query: string) => void
  toggleCategory: (category: string) => void
  toggleBrand: (brand: string) => void
  setPriceRange: (range: PriceRange) => void
  setRating: (rating: number | null) => void
  setInStock: (inStock: boolean) => void
  setSortBy: (sort: SortOption) => void
  clearFilters: () => void
  clearCategories: () => void
  clearBrands: () => void
  
  // Computed
  hasActiveFilters: () => boolean
  getActiveFilterCount: () => number
}

const initialState: FilterState = {
  query: '',
  categories: [],
  brands: [],
  priceRange: defaultPriceRange,
  rating: null,
  inStock: false,
  sortBy: 'relevance',
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  ...initialState,

  setQuery: (query) => set({ query }),

  toggleCategory: (category) => set((state) => ({
    categories: state.categories.includes(category)
      ? state.categories.filter(c => c !== category)
      : [...state.categories, category]
  })),

  toggleBrand: (brand) => set((state) => ({
    brands: state.brands.includes(brand)
      ? state.brands.filter(b => b !== brand)
      : [...state.brands, brand]
  })),

  setPriceRange: (range) => set({ priceRange: range }),

  setRating: (rating) => set({ rating }),

  setInStock: (inStock) => set({ inStock }),

  setSortBy: (sortBy) => set({ sortBy }),

  clearFilters: () => set(initialState),

  clearCategories: () => set({ categories: [] }),

  clearBrands: () => set({ brands: [] }),

  hasActiveFilters: () => {
    const state = get()
    return (
      state.query !== '' ||
      state.categories.length > 0 ||
      state.brands.length > 0 ||
      state.priceRange.min !== defaultPriceRange.min ||
      state.priceRange.max !== defaultPriceRange.max ||
      state.rating !== null ||
      state.inStock
    )
  },

  getActiveFilterCount: () => {
    const state = get()
    let count = 0
    if (state.categories.length > 0) count += state.categories.length
    if (state.brands.length > 0) count += state.brands.length
    if (state.priceRange.min !== defaultPriceRange.min || state.priceRange.max !== defaultPriceRange.max) count++
    if (state.rating !== null) count++
    if (state.inStock) count++
    return count
  },
}))
