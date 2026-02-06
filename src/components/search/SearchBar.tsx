import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Search, X, Clock, TrendingUp, Sparkles } from 'lucide-react'
import { clsx } from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import { useFilterStore } from '../../stores/filterStore'
import { useRecentSearches } from '../../hooks/useSearch'
import { categories } from '../../data/products'
import { Product } from '../../types/product'

interface SearchBarProps {
  onSearch?: (query: string) => void
  products?: Product[]
}

export function SearchBar({ onSearch, products = [] }: SearchBarProps) {
  const { query, setQuery } = useFilterStore()
  const { recentSearches, addSearch, removeSearch } = useRecentSearches()

  const [inputValue, setInputValue] = useState(query)
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  // Sync with store query
  useEffect(() => {
    setInputValue(query)
  }, [query])

  // Debounced search
  const debouncedSearch = useCallback((value: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      setQuery(value)
      if (value.trim()) {
        addSearch(value.trim())
      }
      onSearch?.(value)
    }, 300)
  }, [setQuery, addSearch, onSearch])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    debouncedSearch(value)
  }

  const handleClear = () => {
    setInputValue('')
    setQuery('')
    inputRef.current?.focus()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    setQuery(inputValue)
    if (inputValue.trim()) {
      addSearch(inputValue.trim())
    }
    setShowSuggestions(false)
    inputRef.current?.blur()
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    setQuery(suggestion)
    addSearch(suggestion)
    setShowSuggestions(false)
  }

  const handleFocus = () => {
    setIsFocused(true)
    setShowSuggestions(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
    // Delay hiding to allow click on suggestions
    setTimeout(() => setShowSuggestions(false), 200)
  }

  // Extract unique categories from products
  const productCategories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category))]
    return uniqueCategories.map(cat => ({ name: cat, slug: cat.toLowerCase().replace(/\s+/g, '-') }))
  }, [products])

  // Use product categories if available, otherwise fall back to static categories
  const availableCategories = productCategories.length > 0 ? productCategories : categories

  // Generate suggestions
  const suggestions = inputValue.trim()
    ? [
        // Matching products
        ...products
          .filter(p =>
            p.title.toLowerCase().includes(inputValue.toLowerCase()) ||
            p.brand.toLowerCase().includes(inputValue.toLowerCase())
          )
          .slice(0, 4)
          .map(p => ({ type: 'product' as const, text: p.title, id: p.id })),
        // Matching categories
        ...availableCategories
          .filter(c => c.name.toLowerCase().includes(inputValue.toLowerCase()))
          .slice(0, 2)
          .map(c => ({ type: 'category' as const, text: c.name })),
      ]
    : []

  const showRecent = !inputValue.trim() && recentSearches.length > 0

  return (
    <div className="relative w-full max-w-2xl z-50">
      <form onSubmit={handleSubmit}>
        <div className={clsx(
          'relative flex items-center',
          'bg-white/80 backdrop-blur-sm rounded-2xl transition-all duration-300',
          isFocused
            ? 'shadow-lg shadow-purple-200/40 ring-2 ring-electric-purple/30'
            : 'shadow-soft hover:shadow-md'
        )}>
          {/* Gradient border effect */}
          <div className={clsx(
            'absolute inset-0 rounded-2xl p-[2px] pointer-events-none transition-opacity duration-300',
            isFocused ? 'opacity-100' : 'opacity-0',
            'bg-gradient-to-r from-electric-purple via-electric-pink to-electric-teal'
          )}>
            <div className="absolute inset-[2px] bg-white rounded-[14px]" />
          </div>

          {/* Search icon */}
          <div className={clsx(
            'absolute left-4 z-10 transition-all duration-300',
            isFocused && 'scale-110'
          )}>
            <Search className={clsx(
              'w-5 h-5 transition-colors duration-300',
              isFocused ? 'text-electric-purple' : 'text-slate-400'
            )} />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Search products, brands, categories..."
            className={clsx(
              'relative z-10 w-full py-4 pl-12 pr-12',
              'bg-transparent text-slate-900 placeholder:text-slate-400',
              'focus:outline-none rounded-2xl',
              'text-base font-medium'
            )}
          />

          {inputValue && (
            <motion.button
              type="button"
              onClick={handleClear}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-4 z-10 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </motion.button>
          )}
        </div>
      </form>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && (showRecent || suggestions.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={clsx(
              'absolute top-full left-0 right-0 mt-3 z-500',
              'bg-white/95 backdrop-blur-xl rounded-2xl',
              'border border-slate-100 shadow-xl shadow-slate-200/50',
              'overflow-hidden'
            )}
          >
            {/* Recent searches */}
            {showRecent && (
              <div className="p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  <Clock className="w-3.5 h-3.5" />
                  Recent Searches
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between group"
                    >
                      <button
                        onClick={() => handleSuggestionClick(search)}
                        className="flex-1 text-left px-4 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-slate-50 hover:to-purple-50 text-slate-700 text-sm font-medium transition-all duration-200"
                      >
                        {search}
                      </button>
                      <button
                        onClick={() => removeSearch(search)}
                        className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-slate-100 rounded-lg transition-all duration-200"
                      >
                        <X className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Search suggestions */}
            {suggestions.length > 0 && (
              <div className={clsx('p-4', showRecent && 'border-t border-slate-100')}>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Suggestions
                </div>
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-slate-50 hover:to-purple-50 text-left transition-all duration-200 group"
                    >
                      <span className={clsx(
                        'text-xs px-2.5 py-1 rounded-full font-semibold transition-all duration-200',
                        suggestion.type === 'product' && 'bg-gradient-to-r from-electric-purple/10 to-electric-pink/10 text-electric-purple group-hover:from-electric-purple/20 group-hover:to-electric-pink/20',
                        suggestion.type === 'category' && 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 group-hover:from-amber-200 group-hover:to-orange-200'
                      )}>
                        {suggestion.type === 'product' ? (
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            product
                          </span>
                        ) : (
                          suggestion.type
                        )}
                      </span>
                      <span className="text-slate-700 text-sm font-medium group-hover:text-slate-900 transition-colors">
                        {suggestion.text}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
