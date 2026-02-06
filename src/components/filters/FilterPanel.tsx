import { useState } from 'react'
import { ChevronDown, ChevronUp, Star, Sparkles, SlidersHorizontal } from 'lucide-react'
import { clsx } from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import { useFilterStore } from '../../stores/filterStore'
import { categories, brands, priceRange as defaultPriceRange } from '../../data/products'
import { FilterCounts } from '../../types/product'

interface FilterPanelProps {
  filterCounts: FilterCounts
  className?: string
}

export function FilterPanel({ filterCounts, className }: FilterPanelProps) {
  return (
    <div className={clsx(
      'bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-soft overflow-hidden',
      className
    )}>
      {/* Header */}
      <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-electric-purple to-electric-pink rounded-lg flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-display font-semibold text-slate-900">Filters</h2>
          </div>
          <ClearFiltersButton />
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        <CategoryFilter counts={filterCounts.categories} />
        <BrandFilter counts={filterCounts.brands} />
        <PriceFilter />
        <RatingFilter counts={filterCounts.ratings} />
        <StockFilter />
      </div>
    </div>
  )
}

function ClearFiltersButton() {
  const { hasActiveFilters, clearFilters, getActiveFilterCount } = useFilterStore()
  const count = getActiveFilterCount()

  if (!hasActiveFilters()) return null

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={clearFilters}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="text-sm bg-gradient-to-r from-electric-purple/10 to-electric-pink/10 text-electric-purple hover:from-electric-purple/20 hover:to-electric-pink/20 px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5 transition-all duration-200"
    >
      Clear all
      <span className="w-5 h-5 bg-electric-purple/20 rounded-full flex items-center justify-center text-xs">
        {count}
      </span>
    </motion.button>
  )
}

interface FilterSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  badge?: number
}

function FilterSection({ title, children, defaultOpen = true, badge }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="px-5 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-1 text-left group"
      >
        <span className="font-semibold text-slate-800 flex items-center gap-2">
          {title}
          {badge !== undefined && badge > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-xs bg-gradient-to-r from-electric-purple to-electric-pink text-white px-2 py-0.5 rounded-full font-bold"
            >
              {badge}
            </motion.span>
          )}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="p-1 rounded-lg group-hover:bg-slate-100 transition-colors"
        >
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="pt-3 pb-1">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CategoryFilter({ counts }: { counts: Record<string, number> }) {
  const { categories: selectedCategories, toggleCategory } = useFilterStore()

  return (
    <FilterSection title="Category" badge={selectedCategories.length}>
      <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
        {categories.map((category, index) => {
          const count = counts[category.slug] || 0
          const isSelected = selectedCategories.includes(category.slug)
          const isDisabled = count === 0 && !isSelected

          return (
            <motion.label
              key={category.slug}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-200',
                isSelected
                  ? 'bg-gradient-to-r from-electric-purple/10 to-electric-pink/10 border border-electric-purple/20'
                  : 'hover:bg-slate-50 border border-transparent',
                isDisabled && 'opacity-40 cursor-not-allowed'
              )}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => !isDisabled && toggleCategory(category.slug)}
                disabled={isDisabled}
                className="checkbox-vibrant"
              />
              <span className={clsx(
                'flex-1 text-sm font-medium',
                isSelected ? 'text-electric-purple' : 'text-slate-700'
              )}>
                {category.name}
              </span>
              <span className={clsx(
                'text-xs px-2 py-0.5 rounded-full font-medium',
                isSelected ? 'bg-electric-purple/20 text-electric-purple' : 'bg-slate-100 text-slate-500',
                isDisabled && 'line-through'
              )}>
                {count}
              </span>
            </motion.label>
          )
        })}
      </div>
    </FilterSection>
  )
}

function BrandFilter({ counts }: { counts: Record<string, number> }) {
  const { brands: selectedBrands, toggleBrand } = useFilterStore()
  const [showAll, setShowAll] = useState(false)

  const displayBrands = showAll ? brands : brands.slice(0, 6)

  return (
    <FilterSection title="Brand" badge={selectedBrands.length}>
      <div className="space-y-1">
        {displayBrands.map((brand, index) => {
          const count = counts[brand.name] || 0
          const isSelected = selectedBrands.includes(brand.name)
          const isDisabled = count === 0 && !isSelected

          return (
            <motion.label
              key={brand.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-200',
                isSelected
                  ? 'bg-gradient-to-r from-electric-purple/10 to-electric-pink/10 border border-electric-purple/20'
                  : 'hover:bg-slate-50 border border-transparent',
                isDisabled && 'opacity-40 cursor-not-allowed'
              )}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => !isDisabled && toggleBrand(brand.name)}
                disabled={isDisabled}
                className="checkbox-vibrant"
              />
              <span className={clsx(
                'flex-1 text-sm font-medium',
                isSelected ? 'text-electric-purple' : 'text-slate-700'
              )}>
                {brand.name}
              </span>
              <span className={clsx(
                'text-xs px-2 py-0.5 rounded-full font-medium',
                isSelected ? 'bg-electric-purple/20 text-electric-purple' : 'bg-slate-100 text-slate-500',
                isDisabled && 'line-through'
              )}>
                {count}
              </span>
            </motion.label>
          )
        })}
      </div>

      {brands.length > 6 && (
        <motion.button
          onClick={() => setShowAll(!showAll)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-3 text-sm text-electric-purple hover:text-electric-pink font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {showAll ? 'Show less' : `Show all (${brands.length})`}
        </motion.button>
      )}
    </FilterSection>
  )
}

function PriceFilter() {
  const { priceRange, setPriceRange } = useFilterStore()
  const [localMin, setLocalMin] = useState(priceRange.min.toString())
  const [localMax, setLocalMax] = useState(priceRange.max.toString())

  const handleMinChange = (value: string) => {
    setLocalMin(value)
    const num = parseInt(value) || 0
    if (num <= priceRange.max) {
      setPriceRange({ ...priceRange, min: num })
    }
  }

  const handleMaxChange = (value: string) => {
    setLocalMax(value)
    const num = parseInt(value) || defaultPriceRange.max
    if (num >= priceRange.min) {
      setPriceRange({ ...priceRange, max: num })
    }
  }

  const isPriceFiltered = priceRange.min !== defaultPriceRange.min || priceRange.max !== defaultPriceRange.max

  return (
    <FilterSection title="Price" badge={isPriceFiltered ? 1 : 0}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Min</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₹</span>
              <input
                type="number"
                value={localMin}
                onChange={(e) => handleMinChange(e.target.value)}
                min={0}
                className="w-full pl-7 pr-3 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium focus:border-electric-purple focus:ring-2 focus:ring-electric-purple/20 transition-all duration-200"
              />
            </div>
          </div>
          <span className="text-slate-300 mt-6 font-bold">—</span>
          <div className="flex-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Max</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₹</span>
              <input
                type="number"
                value={localMax}
                onChange={(e) => handleMaxChange(e.target.value)}
                min={0}
                className="w-full pl-7 pr-3 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium focus:border-electric-purple focus:ring-2 focus:ring-electric-purple/20 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Quick price ranges */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Under ₹5K', min: 0, max: 5000 },
            { label: '₹5K-20K', min: 5000, max: 20000 },
            { label: '₹20K-50K', min: 20000, max: 50000 },
            { label: '₹50K+', min: 50000, max: defaultPriceRange.max },
          ].map((range, index) => (
            <motion.button
              key={range.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                setPriceRange({ min: range.min, max: range.max })
                setLocalMin(range.min.toString())
                setLocalMax(range.max.toString())
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={clsx(
                'px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200',
                priceRange.min === range.min && priceRange.max === range.max
                  ? 'bg-gradient-to-r from-electric-purple to-electric-pink text-white shadow-lg shadow-purple-200/50'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {range.label}
            </motion.button>
          ))}
        </div>
      </div>
    </FilterSection>
  )
}

function RatingFilter({ counts }: { counts: Record<number, number> }) {
  const { rating, setRating } = useFilterStore()

  return (
    <FilterSection title="Rating" badge={rating !== null ? 1 : 0}>
      <div className="space-y-1.5">
        {[4, 3, 2, 1].map((stars, index) => {
          const count = counts[stars] || 0
          const isSelected = rating === stars

          return (
            <motion.label
              key={stars}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-200',
                isSelected
                  ? 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200'
                  : 'hover:bg-slate-50 border border-transparent'
              )}
            >
              <input
                type="radio"
                name="rating"
                checked={isSelected}
                onChange={() => setRating(isSelected ? null : stars)}
                className="radio-vibrant"
              />
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={clsx(
                      'w-4 h-4 transition-colors',
                      i < stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                    )}
                  />
                ))}
              </span>
              <span className={clsx(
                'text-sm font-medium',
                isSelected ? 'text-amber-700' : 'text-slate-600'
              )}>
                & up
              </span>
              <span className={clsx(
                'ml-auto text-xs px-2 py-0.5 rounded-full font-medium',
                isSelected ? 'bg-amber-200/50 text-amber-700' : 'bg-slate-100 text-slate-500'
              )}>
                {count}
              </span>
            </motion.label>
          )
        })}
      </div>
    </FilterSection>
  )
}

function StockFilter() {
  const { inStock, setInStock } = useFilterStore()

  return (
    <FilterSection title="Availability" badge={inStock ? 1 : 0}>
      <motion.label
        whileHover={{ scale: 1.01 }}
        className={clsx(
          'flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200',
          inStock
            ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200'
            : 'hover:bg-slate-50 border border-transparent'
        )}
      >
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => setInStock(e.target.checked)}
          className="checkbox-vibrant"
        />
        <span className={clsx(
          'text-sm font-medium flex items-center gap-2',
          inStock ? 'text-emerald-700' : 'text-slate-700'
        )}>
          <span className={clsx(
            'w-2 h-2 rounded-full',
            inStock ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
          )} />
          In stock only
        </span>
      </motion.label>
    </FilterSection>
  )
}
