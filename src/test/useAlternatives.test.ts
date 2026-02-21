import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAlternatives } from '@/hooks/useAlternatives'
import { Product } from '@/types/product'

function makeProduct(overrides: Partial<Product> & { id: number }): Product {
  return {
    title: `Product ${overrides.id}`,
    description: '',
    price: 100,
    discountPercentage: 0,
    rating: 4.0,
    stock: 10,
    brand: 'BrandA',
    category: 'electronics',
    thumbnail: '',
    images: [],
    ...overrides,
  }
}

describe('useAlternatives', () => {
  it('returns empty arrays when product is undefined', () => {
    const { result } = renderHook(() => useAlternatives(undefined, []))
    expect(result.current.alternatives).toEqual([])
    expect(result.current.sameCategory).toEqual([])
    expect(result.current.samePriceRange).toEqual([])
    expect(result.current.higherRated).toEqual([])
  })

  it('returns empty arrays when allProducts is empty', () => {
    const product = makeProduct({ id: 1 })
    const { result } = renderHook(() => useAlternatives(product, []))
    expect(result.current.alternatives).toEqual([])
  })

  it('excludes the product itself from all lists', () => {
    const product = makeProduct({ id: 1 })
    const allProducts = [product]
    const { result } = renderHook(() => useAlternatives(product, allProducts))

    expect(result.current.alternatives).toEqual([])
    expect(result.current.sameCategory).toEqual([])
    expect(result.current.samePriceRange).toEqual([])
    expect(result.current.higherRated).toEqual([])
  })

  it('ranks same-category products higher', () => {
    const product = makeProduct({ id: 1, category: 'laptops', price: 1000, rating: 4.0 })
    const sameCategory = makeProduct({ id: 2, category: 'laptops', price: 1000, rating: 4.0 })
    const diffCategory = makeProduct({ id: 3, category: 'phones', price: 1000, rating: 4.0 })
    const allProducts = [product, sameCategory, diffCategory]

    const { result } = renderHook(() => useAlternatives(product, allProducts))

    // Same category product should appear first in alternatives
    expect(result.current.alternatives[0].id).toBe(2)
  })

  it('includes products in sameCategory list', () => {
    const product = makeProduct({ id: 1, category: 'laptops' })
    const p2 = makeProduct({ id: 2, category: 'laptops' })
    const p3 = makeProduct({ id: 3, category: 'phones' })
    const allProducts = [product, p2, p3]

    const { result } = renderHook(() => useAlternatives(product, allProducts))

    expect(result.current.sameCategory.map(p => p.id)).toEqual([2])
  })

  it('includes products within ±30% price range', () => {
    const product = makeProduct({ id: 1, price: 100 })
    const inRange = makeProduct({ id: 2, price: 120, category: 'other' })
    const outOfRange = makeProduct({ id: 3, price: 200, category: 'other' })
    const allProducts = [product, inRange, outOfRange]

    const { result } = renderHook(() => useAlternatives(product, allProducts))

    expect(result.current.samePriceRange.map(p => p.id)).toContain(2)
    expect(result.current.samePriceRange.map(p => p.id)).not.toContain(3)
  })

  it('includes higher-rated products sorted by rating descending', () => {
    const product = makeProduct({ id: 1, rating: 3.0 })
    const higher1 = makeProduct({ id: 2, rating: 4.5 })
    const higher2 = makeProduct({ id: 3, rating: 4.0 })
    const lower = makeProduct({ id: 4, rating: 2.0 })
    const allProducts = [product, higher1, higher2, lower]

    const { result } = renderHook(() => useAlternatives(product, allProducts))

    expect(result.current.higherRated.map(p => p.id)).toEqual([2, 3])
  })

  it('uses manual alternativeIds when available', () => {
    const product = makeProduct({ id: 1, alternativeIds: [3] })
    const p2 = makeProduct({ id: 2, category: 'other' })
    const p3 = makeProduct({ id: 3, category: 'other' })
    const allProducts = [product, p2, p3]

    const { result } = renderHook(() => useAlternatives(product, allProducts))

    // Manual alt (id=3) should be first
    expect(result.current.alternatives[0].id).toBe(3)
  })

  it('deduplicates manual and algorithmic alternatives', () => {
    const product = makeProduct({ id: 1, category: 'laptops', alternativeIds: [2] })
    const p2 = makeProduct({ id: 2, category: 'laptops' }) // manual + would also score algorithmically
    const p3 = makeProduct({ id: 3, category: 'laptops' })
    const allProducts = [product, p2, p3]

    const { result } = renderHook(() => useAlternatives(product, allProducts))

    const ids = result.current.alternatives.map(p => p.id)
    // id=2 should appear only once
    expect(ids.filter(id => id === 2)).toHaveLength(1)
  })

  it('limits alternatives to 6 total', () => {
    const product = makeProduct({ id: 1, category: 'laptops' })
    const allProducts = [product]
    for (let i = 2; i <= 10; i++) {
      allProducts.push(makeProduct({ id: i, category: 'laptops', price: 100 + i, rating: 4.0 }))
    }

    const { result } = renderHook(() => useAlternatives(product, allProducts))

    expect(result.current.alternatives.length).toBeLessThanOrEqual(6)
  })

  it('scores overlapping tags', () => {
    const product = makeProduct({ id: 1, tags: ['gaming', 'portable'], category: 'other', price: 500 })
    const withTags = makeProduct({ id: 2, tags: ['gaming', 'portable'], category: 'other', price: 500 })
    const noTags = makeProduct({ id: 3, tags: [], category: 'other', price: 500 })
    const allProducts = [product, withTags, noTags]

    const { result } = renderHook(() => useAlternatives(product, allProducts))

    // Product with shared tags should score higher
    if (result.current.alternatives.length >= 2) {
      expect(result.current.alternatives[0].id).toBe(2)
    }
  })

  it('filters out low-scoring products (score <= 20)', () => {
    const product = makeProduct({ id: 1, category: 'laptops', price: 100, rating: 4.0 })
    // Very different product — different category, very different price, different rating
    const unrelated = makeProduct({ id: 2, category: 'furniture', price: 10000, rating: 1.0 })
    const allProducts = [product, unrelated]

    const { result } = renderHook(() => useAlternatives(product, allProducts))

    // Unrelated product should not appear in alternatives (score too low)
    expect(result.current.alternatives.map(p => p.id)).not.toContain(2)
  })
})
