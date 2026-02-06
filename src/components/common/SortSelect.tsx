import { ChevronDown, ArrowUpDown } from 'lucide-react'
import { clsx } from 'clsx'
import { useFilterStore } from '../../stores/filterStore'
import { SortOption } from '../../types/product'

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name', label: 'Name: A to Z' },
]

export function SortSelect() {
  const { sortBy, setSortBy } = useFilterStore()

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-electric-purple/20 to-electric-pink/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur" />
      <div className="relative flex items-center">
        <div className="absolute left-3 flex items-center pointer-events-none">
          <ArrowUpDown className="w-4 h-4 text-slate-400 group-hover:text-electric-purple transition-colors" />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className={clsx(
            'appearance-none bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl',
            'pl-10 pr-10 py-2.5 text-sm font-medium text-slate-700',
            'focus:outline-none focus:ring-2 focus:ring-electric-purple/30 focus:border-electric-purple',
            'hover:border-electric-purple/50 hover:shadow-soft',
            'cursor-pointer transition-all duration-200'
          )}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-electric-purple transition-colors" />
      </div>
    </div>
  )
}
