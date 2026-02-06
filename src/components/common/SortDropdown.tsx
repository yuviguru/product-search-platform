import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
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

export function SortDropdown() {
  const { sortBy, setSortBy } = useFilterStore()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentOption = sortOptions.find(opt => opt.value === sortBy)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors',
          isOpen
            ? 'border-primary-500 text-primary-600 bg-primary-50'
            : 'border-surface-200 text-surface-700 hover:border-surface-300 bg-white'
        )}
      >
        <span>Sort: {currentOption?.label}</span>
        <ChevronDown className={clsx(
          'w-4 h-4 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-surface-200 shadow-lg z-20 animate-scale-in">
          <div className="py-1">
            {sortOptions.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  setSortBy(option.value)
                  setIsOpen(false)
                }}
                className={clsx(
                  'w-full flex items-center justify-between px-4 py-2 text-sm transition-colors',
                  sortBy === option.value
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-surface-700 hover:bg-surface-50'
                )}
              >
                <span>{option.label}</span>
                {sortBy === option.value && (
                  <Check className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
