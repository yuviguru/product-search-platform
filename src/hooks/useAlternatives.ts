import { useMemo } from 'react'
import { Product } from '@/types/product'

interface ScoredProduct {
  product: Product
  score: number
  priceDiff: number
  ratingDiff: number
}

export function useAlternatives(product: Product | undefined, allProducts: Product[]) {
  return useMemo(() => {
    if (!product || allProducts.length === 0) {
      return { alternatives: [], sameCategory: [], samePriceRange: [], higherRated: [] }
    }

    // If product has manual alternatives, use those first
    const manualAlts = product.alternativeIds
      ? product.alternativeIds
          .map(id => allProducts.find(p => p.id === id))
          .filter((p): p is Product => p !== undefined)
      : []

    // Score all other products for algorithmic alternatives
    const scored: ScoredProduct[] = allProducts
      .filter(p => p.id !== product.id)
      .map(p => {
        let score = 0

        // Same category: +40 points
        if (p.category === product.category) score += 40

        // Same brand: +10 points (lower — users want variety)
        if (p.brand === product.brand) score += 10

        // Price within ±30%: up to +25 points (scaled by closeness)
        const priceDiff = Math.abs(p.price - product.price) / product.price
        if (priceDiff <= 0.3) {
          score += Math.round(25 * (1 - priceDiff / 0.3))
        }

        // Rating within ±0.5: +15 points
        const ratingDiff = Math.abs(p.rating - product.rating)
        if (ratingDiff <= 0.5) score += 15

        // Overlapping tags: +5 per shared tag
        if (product.tags && p.tags) {
          const shared = p.tags.filter(t => product.tags!.includes(t))
          score += shared.length * 5
        }

        // Overlapping specs: +5 per matching spec key
        if (product.specs && p.specs) {
          const sharedKeys = Object.keys(p.specs).filter(k => k in product.specs!)
          score += sharedKeys.length * 5
        }

        return {
          product: p,
          score,
          priceDiff: p.price - product.price,
          ratingDiff: p.rating - product.rating,
        }
      })
      .sort((a, b) => b.score - a.score)

    // Merge manual + algorithmic, dedup
    const seenIds = new Set(manualAlts.map(p => p.id))
    const algorithmicAlts = scored
      .filter(s => !seenIds.has(s.product.id) && s.score > 20)
      .slice(0, 6 - manualAlts.length)
      .map(s => s.product)

    const alternatives = [...manualAlts, ...algorithmicAlts]

    // Category-filtered views
    const sameCategory = allProducts
      .filter(p => p.id !== product.id && p.category === product.category)
      .slice(0, 6)

    const priceMin = product.price * 0.7
    const priceMax = product.price * 1.3
    const samePriceRange = allProducts
      .filter(p => p.id !== product.id && p.price >= priceMin && p.price <= priceMax)
      .slice(0, 6)

    const higherRated = allProducts
      .filter(p => p.id !== product.id && p.rating > product.rating)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6)

    return { alternatives, sameCategory, samePriceRange, higherRated }
  }, [product, allProducts])
}
