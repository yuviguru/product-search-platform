import { useState } from 'react'
import { X, ChevronUp, ChevronDown, GitCompare, Trash2, Sparkles } from 'lucide-react'
import { clsx } from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import { useComparisonStore } from '../../stores/comparisonStore'
import { getProductById, formatPrice, calculateDiscountedPrice } from '../../data/products'

interface CompareDrawerProps {
  onCompare: () => void
}

export function CompareDrawer({ onCompare }: CompareDrawerProps) {
  const { items, removeItem, clearAll, maxItems } = useComparisonStore()
  const [isMinimized, setIsMinimized] = useState(false)

  const products = items.map(item => getProductById(item.productId)).filter(Boolean)

  if (items.length === 0) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50"
      >
        {/* Gradient border top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-electric-purple via-electric-pink to-electric-teal" />

        <div className="bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-2xl shadow-purple-200/20">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-electric-purple to-electric-pink rounded-xl flex items-center justify-center">
                <GitCompare className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-display font-semibold text-slate-900">
                  Compare Products
                </span>
                <span className="ml-2 text-sm px-2 py-0.5 bg-gradient-to-r from-electric-purple/10 to-electric-pink/10 text-electric-purple rounded-full font-medium">
                  {items.length}/{maxItems}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => setIsMinimized(!isMinimized)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                {isMinimized ? (
                  <ChevronUp className="w-5 h-5 text-slate-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-500" />
                )}
              </motion.button>
              <motion.button
                onClick={clearAll}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-red-50 rounded-xl transition-colors text-slate-500 hover:text-red-500"
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <AnimatePresence>
            {!isMinimized && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-center gap-4 overflow-x-auto pb-2">
                    {/* Product items */}
                    {products.map((product, index) => (
                      <motion.div
                        key={product!.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex-shrink-0 relative group"
                      >
                        <div className="w-32 bg-gradient-to-br from-slate-50 to-white rounded-2xl overflow-hidden border border-slate-200 shadow-soft hover:shadow-card transition-all duration-300">
                          <div className="aspect-square overflow-hidden">
                            <img
                              src={product!.thumbnail}
                              alt={product!.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-3">
                            <p className="text-xs text-slate-700 font-medium line-clamp-1">
                              {product!.title}
                            </p>
                            <p className="text-sm text-gradient font-bold mt-1">
                              {formatPrice(calculateDiscountedPrice(product!.price, product!.discountPercentage))}
                            </p>
                          </div>
                        </div>

                        {/* Remove button */}
                        <motion.button
                          onClick={() => removeItem(product!.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={clsx(
                            'absolute -top-2 -right-2 p-1.5 bg-white rounded-full',
                            'border border-slate-200 shadow-lg',
                            'opacity-0 group-hover:opacity-100 transition-opacity',
                            'hover:bg-red-50 hover:border-red-200'
                          )}
                        >
                          <X className="w-3.5 h-3.5 text-slate-500 hover:text-red-500" />
                        </motion.button>
                      </motion.div>
                    ))}

                    {/* Empty slots */}
                    {Array.from({ length: maxItems - items.length }).map((_, i) => (
                      <motion.div
                        key={`empty-${i}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: (products.length + i) * 0.05 }}
                        className={clsx(
                          'flex-shrink-0 w-32 aspect-[3/4]',
                          'rounded-2xl border-2 border-dashed border-slate-200',
                          'flex flex-col items-center justify-center gap-2',
                          'bg-gradient-to-br from-slate-50/50 to-white/50'
                        )}
                      >
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-slate-400" />
                        </div>
                        <span className="text-xs text-slate-400 font-medium">Add product</span>
                      </motion.div>
                    ))}

                    {/* Compare button */}
                    <div className="flex-shrink-0 pl-6 border-l border-slate-200">
                      <motion.button
                        onClick={onCompare}
                        disabled={items.length < 2}
                        whileHover={items.length >= 2 ? { scale: 1.02 } : {}}
                        whileTap={items.length >= 2 ? { scale: 0.98 } : {}}
                        className={clsx(
                          'px-8 py-4 rounded-2xl font-semibold transition-all duration-300',
                          items.length >= 2
                            ? 'bg-gradient-to-r from-electric-purple to-electric-pink text-white shadow-lg shadow-purple-200/50 hover:shadow-xl hover:shadow-purple-300/50'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <GitCompare className="w-5 h-5" />
                          Compare{items.length >= 2 ? ` (${items.length})` : ''}
                        </span>
                      </motion.button>
                      {items.length < 2 && (
                        <p className="text-xs text-slate-500 mt-3 text-center font-medium">
                          Add {2 - items.length} more to compare
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
