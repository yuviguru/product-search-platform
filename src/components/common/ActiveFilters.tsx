import { X } from 'lucide-react'
import { clsx } from 'clsx'
import { useFilterStore } from '../../stores/filterStore'
import { categories, brands, priceRange as defaultPriceRange } from '../../data/products'

export function ActiveFilters() {
  const {
    query,
    categories: selectedCategories,
    brands: selectedBrands,
    priceRange,
    rating,
    inStock,
    setQuery,
    toggleCategory,
    toggleBrand,
    setPriceRange,
    setRating,
    setInStock,
    hasActiveFilters,
    clearFilters,
  } = useFilterStore()

  if (!hasActiveFilters()) return null

  const getCategoryName = (slug: string) => 
    categories.find(c => c.slug === slug)?.name || slug

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-surface-500">Active filters:</span>

      {/* Search query */}
      {query && (
        <FilterChip
          label={`"${query}"`}
          onRemove={() => setQuery('')}
        />
      )}

      {/* Categories */}
      {selectedCategories.map(cat => (
        <FilterChip
          key={cat}
          label={getCategoryName(cat)}
          onRemove={() => toggleCategory(cat)}
          color="blue"
        />
      ))}

      {/* Brands */}
      {selectedBrands.map(brand => (
        <FilterChip
          key={brand}
          label={brand}
          onRemove={() => toggleBrand(brand)}
          color="purple"
        />
      ))}

      {/* Price range */}
      {(priceRange.min !== defaultPriceRange.min || priceRange.max !== defaultPriceRange.max) && (
        <FilterChip
          label={`$${priceRange.min} - $${priceRange.max}`}
          onRemove={() => setPriceRange(defaultPriceRange)}
          color="green"
        />
      )}

      {/* Rating */}
      {rating !== null && (
        <FilterChip
          label={`${rating}+ stars`}
          onRemove={() => setRating(null)}
          color="yellow"
        />
      )}

      {/* In stock */}
      {inStock && (
        <FilterChip
          label="In stock"
          onRemove={() => setInStock(false)}
          color="teal"
        />
      )}

      {/* Clear all */}
      <button
        onClick={clearFilters}
        className="text-sm text-primary-600 hover:text-primary-700 font-medium ml-2"
      >
        Clear all
      </button>
    </div>
  )
}

interface FilterChipProps {
  label: string
  onRemove: () => void
  color?: 'default' | 'blue' | 'purple' | 'green' | 'yellow' | 'teal'
}

function FilterChip({ label, onRemove, color = 'default' }: FilterChipProps) {
  const colorClasses = {
    default: 'bg-surface-100 text-surface-700',
    blue: 'bg-blue-50 text-blue-700',
    purple: 'bg-purple-50 text-purple-700',
    green: 'bg-green-50 text-green-700',
    yellow: 'bg-amber-50 text-amber-700',
    teal: 'bg-teal-50 text-teal-700',
  }

  return (
    <span className={clsx(
      'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium',
      colorClasses[color]
    )}>
      {label}
      <button
        onClick={onRemove}
        className="p-0.5 hover:bg-black/10 rounded-full transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </span>
  )
}
