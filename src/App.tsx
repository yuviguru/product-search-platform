import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Filter, X, Share2, Check, AlertCircle, RefreshCw, Sparkles, WifiOff, PackageOpen } from 'lucide-react'
import { clsx } from 'clsx'

import { Header } from './components/common/Header'
import { SearchBar } from './components/search/SearchBar'
import { FilterPanel } from './components/filters/FilterPanel'
import { ProductGrid } from './components/products/ProductGrid'
import { CompareDrawer } from './components/comparison/CompareDrawer'
import { CompareModal } from './components/comparison/CompareModal'
import { SortSelect } from './components/common/SortSelect'
import { EmptyState } from './components/common/EmptyState'

import { useProducts } from './hooks/useProducts'
import { useSearch } from './hooks/useSearch'
import { useURLState } from './hooks/useURLState'
import { useFilterStore } from './stores/filterStore'

function App() {
  const [showFilters, setShowFilters] = useState(false)
  const [showCompareModal, setShowCompareModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const { products: allProducts, isLoading, isError, error, refetch } = useProducts()
  const { products, totalCount, filterCounts, isFiltered } = useSearch(allProducts)
  const { query } = useFilterStore()
  const { copyURLToClipboard } = useURLState()

  const handleShare = async () => {
    const success = await copyURLToClipboard()
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-mesh overflow-x-hidden">
      <Header onCompareClick={() => setShowCompareModal(true)} />

      {/* Hero Search Section */}
      <div className="relative overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-electric-purple/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-electric-pink/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-electric-teal/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-electric-purple/10 to-electric-pink/10 border border-electric-purple/20 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-electric-purple" />
              <span className="text-sm font-semibold text-electric-purple">Smart Product Discovery</span>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-3 text-center">
              Find Your <span className="text-gradient">Perfect Product</span>
            </h1>
            <p className="text-slate-500 text-center mb-8 max-w-lg">
              Search through thousands of products with AI-powered suggestions and smart filtering
            </p>
            <SearchBar products={allProducts} />
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:flex lg:gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel filterCounts={filterCounts} />
            </div>
          </aside>

          {/* Products Section */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center justify-between gap-4 mb-8"
            >
              <div className="flex items-center gap-4">
                {/* Mobile filter button */}
                <motion.button
                  onClick={() => setShowFilters(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-soft"
                >
                  <Filter className="w-4 h-4 text-electric-purple" />
                  <span className="font-medium text-slate-700">Filters</span>
                </motion.button>

                <p className="text-slate-600">
                  {isFiltered ? (
                    <>
                      <span className="font-bold text-slate-900">{totalCount}</span>
                      {' '}results
                      {query && (
                        <span> for "<span className="font-semibold text-electric-purple">{query}</span>"</span>
                      )}
                    </>
                  ) : (
                    <>
                      <span className="font-bold text-slate-900">{totalCount}</span>
                      {' '}products
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Share button */}
                {isFiltered && (
                  <motion.button
                    onClick={handleShare}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={clsx(
                      'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300',
                      copied
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200/50'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-soft'
                    )}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        Share
                      </>
                    )}
                  </motion.button>
                )}

                <SortSelect />
              </div>
            </motion.div>

            {/* Products Grid */}
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-electric-purple to-electric-pink animate-spin" style={{ clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%, 50% 25%, 75% 25%, 75% 75%, 50% 75%)' }} />
                  <div className="absolute inset-2 bg-white rounded-full" />
                  <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-electric-purple animate-pulse" />
                </div>
                <p className="text-slate-600 font-medium mt-6">Loading amazing products...</p>
              </motion.div>
            ) : isError ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="relative mb-8"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-orange-100 rounded-3xl flex items-center justify-center border border-rose-200/50">
                    <WifiOff className="w-10 h-10 text-rose-500" />
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <AlertCircle className="w-4 h-4 text-white" />
                  </motion.div>
                </motion.div>

                <h3 className="text-2xl font-display font-bold text-slate-900 mb-3">
                  Oops! Connection hiccup
                </h3>
                <p className="text-slate-500 mb-2 max-w-md leading-relaxed">
                  Our product shelves are temporarily unreachable. This is usually a brief network issue.
                </p>
                <p className="text-sm text-slate-400 mb-8 max-w-md">
                  {error?.message || 'An unexpected error occurred.'}
                </p>

                <motion.button
                  onClick={() => refetch()}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-electric-purple to-electric-pink text-white font-semibold rounded-xl shadow-lg shadow-purple-200/50 hover:shadow-xl transition-all duration-300"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reconnect
                </motion.button>
              </motion.div>
            ) : allProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="relative mb-8"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-electric-purple/10 to-electric-pink/10 rounded-3xl flex items-center justify-center border border-electric-purple/20">
                    <PackageOpen className="w-10 h-10 text-electric-purple" />
                  </div>
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-electric-purple to-electric-pink rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </motion.div>
                </motion.div>

                <h3 className="text-2xl font-display font-bold text-slate-900 mb-3">
                  The shelves are empty... for now
                </h3>
                <p className="text-slate-500 mb-8 max-w-md leading-relaxed">
                  No products are available at the moment. We're busy restocking with incredible finds. Check back soon!
                </p>

                <motion.button
                  onClick={() => refetch()}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-electric-purple to-electric-pink text-white font-semibold rounded-xl shadow-lg shadow-purple-200/50 hover:shadow-xl transition-all duration-300"
                >
                  <RefreshCw className="w-4 h-4" />
                  Check again
                </motion.button>
              </motion.div>
            ) : products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filters Overlay */}
      <AnimatePresence>
        {showFilters && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setShowFilters(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-full max-w-xs bg-white z-50 lg:hidden overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <h2 className="font-display font-bold text-lg text-slate-900">Filters</h2>
                <motion.button
                  onClick={() => setShowFilters(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </motion.button>
              </div>
              <FilterPanel filterCounts={filterCounts} className="border-0 rounded-none shadow-none bg-transparent" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Compare Drawer */}
      <CompareDrawer onCompare={() => setShowCompareModal(true)} allProducts={allProducts} />

      {/* Compare Modal */}
      <AnimatePresence>
        {showCompareModal && (
          <CompareModal
            isOpen={showCompareModal}
            onClose={() => setShowCompareModal(false)}
            allProducts={allProducts}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
