// Price range - use very wide default to accommodate any currency/data source (Airtable INR products)
export const priceRange = {
  min: 0,
  max: 10000000  // 1 crore - wide enough for INR products
}

// Helper functions
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function calculateDiscountedPrice(price: number, discount: number): number {
  return Math.round(price * (1 - discount / 100))
}

export function formatCategoryName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
