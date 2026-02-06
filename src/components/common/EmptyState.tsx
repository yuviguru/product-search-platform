import { Search, FilterX, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useFilterStore } from '../../stores/filterStore'

export function EmptyState() {
  const { query, clearFilters, hasActiveFilters } = useFilterStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      {/* Animated icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="relative"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-electric-purple/10 to-electric-pink/10 rounded-2xl flex items-center justify-center mb-6 border border-electric-purple/20">
          <Search className="w-10 h-10 text-electric-purple" />
        </div>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-electric-purple to-electric-pink rounded-full flex items-center justify-center"
        >
          <Sparkles className="w-3 h-3 text-white" />
        </motion.div>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xl font-display font-bold text-slate-900 mb-3"
      >
        No products found
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-slate-500 max-w-md mb-8 leading-relaxed"
      >
        {query
          ? <>We couldn't find any products matching "<span className="font-semibold text-electric-purple">{query}</span>". Try adjusting your search or filters.</>
          : "No products match your current filters. Try adjusting or clearing filters."
        }
      </motion.p>

      {hasActiveFilters() && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={clearFilters}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-electric-purple to-electric-pink text-white rounded-xl font-semibold shadow-lg shadow-purple-200/50 hover:shadow-xl transition-shadow"
        >
          <FilterX className="w-5 h-5" />
          Clear all filters
        </motion.button>
      )}
    </motion.div>
  )
}
