export interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
  // Enhanced fields for comparison
  specs?: ProductSpecs
  tags?: string[]
  // Amazon Associate affiliate link
  affiliateUrl?: string
  // YouTube review video IDs
  youtubeReviewIds?: string[]
  // AI Insights
  aiSummary?: string
  aiPros?: string[]
  aiCons?: string[]
  aiValueScore?: number
  aiBestFor?: string
  aiVerdict?: string
  // Manual alternative product IDs
  alternativeIds?: number[]
}

export interface ProductSpecs {
  [key: string]: string | number | boolean
}

export interface Category {
  slug: string
  name: string
  count: number
}

export interface Brand {
  name: string
  count: number
}

export interface PriceRange {
  min: number
  max: number
}

export interface FilterState {
  query: string
  categories: string[]
  brands: string[]
  priceRange: PriceRange
  rating: number | null
  inStock: boolean
  sortBy: SortOption
}

export type SortOption = 
  | 'relevance'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'name'

export interface FilterCounts {
  categories: Record<string, number>
  brands: Record<string, number>
  priceRanges: { range: string; min: number; max: number; count: number }[]
  ratings: Record<number, number>
  total: number
}

export interface SearchSuggestion {
  type: 'recent' | 'product' | 'category' | 'brand'
  text: string
  id?: number
}

export interface ComparisonItem {
  productId: number
  addedAt: number
}

export interface NewsArticle {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  coverImage: string
  category: NewsCategory
  relatedProductIds: number[]
  tags: string[]
  publishedAt: string
  author: string
  featured: boolean
}

export type NewsCategory = 'Product Launch' | 'Review Roundup' | 'Deal Alert' | 'Industry News' | 'All'
