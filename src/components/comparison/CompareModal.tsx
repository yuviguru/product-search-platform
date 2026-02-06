import { X, Star, Check, Minus, Trophy, Sparkles } from 'lucide-react'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { useComparisonStore } from '../../stores/comparisonStore'
import { getProductById, formatPrice, calculateDiscountedPrice } from '../../data/products'
import { Product } from '../../types/product'

interface CompareModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CompareModal({ isOpen, onClose }: CompareModalProps) {
  const { items, removeItem } = useComparisonStore()
  const products = items.map(item => getProductById(item.productId)).filter(Boolean) as Product[]

  if (!isOpen || products.length < 2) {
    return null
  }

  // Get all unique spec keys from all products
  const allSpecKeys = [...new Set(
    products.flatMap(p => Object.keys(p.specs || {}))
  )]

  // Find best values for highlighting
  const getBestValue = (key: string, type: 'min' | 'max' | 'highest-rating'): number | null => {
    const values = products
      .map((p, index) => {
        if (key === 'price') return { index, value: calculateDiscountedPrice(p.price, p.discountPercentage) }
        if (key === 'rating') return { index, value: p.rating }
        return null
      })
      .filter(Boolean) as { index: number; value: number }[]

    if (values.length === 0) return null

    if (type === 'min') {
      return values.reduce((min, curr) => curr.value < min.value ? curr : min).index
    }
    return values.reduce((max, curr) => curr.value > max.value ? curr : max).index
  }

  const bestPriceIndex = getBestValue('price', 'min')
  const bestRatingIndex = getBestValue('rating', 'max')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl my-8 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-electric-purple/5 via-electric-pink/5 to-electric-teal/5 border-b border-slate-100">
          {/* Gradient accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-electric-purple via-electric-pink to-electric-teal" />

          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-electric-purple to-electric-pink rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-slate-900">
                  Compare Products
                </h2>
                <p className="text-sm text-slate-500">Side-by-side comparison of {products.length} products</p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </motion.button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Product Headers */}
            <thead>
              <tr className="border-b border-slate-100">
                <th className="p-5 text-left w-44 bg-gradient-to-b from-slate-50 to-white sticky left-0 z-10">
                  <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Feature</span>
                </th>
                {products.map((product, index) => (
                  <th key={product.id} className="p-5 text-center min-w-[200px]">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      <motion.button
                        onClick={() => removeItem(product.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute -top-2 -right-2 p-1.5 bg-white rounded-full border border-slate-200 shadow-md hover:bg-red-50 hover:border-red-200 transition-colors z-10"
                      >
                        <X className="w-3.5 h-3.5 text-slate-500 hover:text-red-500" />
                      </motion.button>
                      <div className="w-28 h-28 mx-auto mb-4 rounded-2xl overflow-hidden shadow-card bg-gradient-to-br from-slate-50 to-white">
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="font-semibold text-slate-900 text-sm line-clamp-2 mb-1">
                        {product.title}
                      </p>
                      <p className="text-xs text-electric-purple font-medium">{product.brand}</p>
                    </motion.div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* Price Row */}
              <tr className="bg-gradient-to-r from-electric-purple/5 via-electric-pink/5 to-transparent">
                <td className="p-5 font-semibold text-slate-700 sticky left-0 bg-gradient-to-r from-electric-purple/5 to-transparent">
                  Price
                </td>
                {products.map((product, index) => {
                  const discounted = calculateDiscountedPrice(product.price, product.discountPercentage)
                  const isBest = bestPriceIndex === index

                  return (
                    <td key={product.id} className="p-5 text-center">
                      <div className={clsx(
                        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full',
                        isBest && 'bg-emerald-100'
                      )}>
                        {isBest && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"
                          >
                            <Trophy className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                        <span className={clsx(
                          'text-lg font-bold',
                          isBest ? 'text-emerald-600' : 'text-slate-900'
                        )}>
                          {formatPrice(discounted)}
                        </span>
                      </div>
                      {product.discountPercentage > 0 && (
                        <p className="text-xs text-slate-400 line-through mt-1">
                          {formatPrice(product.price)}
                        </p>
                      )}
                    </td>
                  )
                })}
              </tr>

              {/* Rating Row */}
              <tr>
                <td className="p-5 font-semibold text-slate-700 sticky left-0 bg-white">Rating</td>
                {products.map((product, index) => {
                  const isBest = bestRatingIndex === index

                  return (
                    <td key={product.id} className="p-5 text-center">
                      <div className={clsx(
                        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full',
                        isBest && 'bg-amber-100'
                      )}>
                        {isBest && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center"
                          >
                            <Trophy className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className={clsx(
                            'font-bold',
                            isBest ? 'text-amber-600' : 'text-slate-700'
                          )}>
                            {product.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </td>
                  )
                })}
              </tr>

              {/* Stock Row */}
              <tr className="bg-slate-50/50">
                <td className="p-5 font-semibold text-slate-700 sticky left-0 bg-slate-50/50">Availability</td>
                {products.map(product => (
                  <td key={product.id} className="p-5 text-center">
                    {product.stock > 0 ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 rounded-full text-emerald-700 font-medium text-sm">
                        <Check className="w-4 h-4" />
                        {product.stock} in stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1.5 bg-slate-100 rounded-full text-slate-500 font-medium text-sm">
                        Out of stock
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Tags Row */}
              <tr>
                <td className="p-5 font-semibold text-slate-700 sticky left-0 bg-white">Features</td>
                {products.map(product => (
                  <td key={product.id} className="p-5 text-center">
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {product.tags?.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-600 text-xs font-medium rounded-full border border-slate-100"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Spec Rows */}
              {allSpecKeys.map((key, i) => (
                <tr key={key} className={i % 2 === 0 ? 'bg-slate-50/50' : ''}>
                  <td className={clsx(
                    'p-5 font-semibold text-slate-700 sticky left-0',
                    i % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'
                  )}>
                    {key}
                  </td>
                  {products.map(product => {
                    const value = product.specs?.[key]
                    return (
                      <td key={product.id} className="p-5 text-center text-slate-600 font-medium">
                        {value !== undefined ? (
                          String(value)
                        ) : (
                          <Minus className="w-4 h-4 text-slate-300 mx-auto" />
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-3 h-3 text-white" />
                </div>
                <span className="font-medium">Best value highlighted</span>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2.5 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              Close Comparison
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
