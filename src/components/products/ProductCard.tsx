import { useState } from 'react'
import { Star, Heart, Check, Plus, ExternalLink, Sparkles, ImageOff } from 'lucide-react'
import { clsx } from 'clsx'
import { Link } from 'react-router-dom'
import { Product } from '../../types/product'
import { formatPrice, calculateDiscountedPrice } from '../../data/products'
import { useComparisonStore } from '../../stores/comparisonStore'
import { motion } from 'framer-motion'

interface ProductCardProps {
  product: Product
  index?: number
}

// Fallback image when product image fails to load
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&h=400&fit=crop'

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem, removeItem, isInComparison, canAddMore } = useComparisonStore()
  const inComparison = isInComparison(product.id)
  const [imageError, setImageError] = useState(false)

  const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage)
  const hasDiscount = product.discountPercentage > 0

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (inComparison) {
      removeItem(product.id)
    } else if (canAddMore()) {
      addItem(product.id)
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={clsx(
        'group relative bg-white rounded-2xl overflow-hidden flex flex-col h-full',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-2 hover:shadow-card-hover',
        inComparison
          ? 'ring-2 ring-electric-purple shadow-glow'
          : 'shadow-card hover:shadow-card-hover'
      )}
    >
      {/* Gradient border effect on hover - only shows around the card edge */}
      {!inComparison && (
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #f472b6, #06b6d4)',
            padding: '2px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
      )}

      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden block">
        {imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
            <ImageOff className="w-12 h-12 mb-2" />
            <span className="text-xs">Image unavailable</span>
          </div>
        ) : (
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
            onError={handleImageError}
          />
        )}

        {/* Subtle overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {hasDiscount && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.06 + 0.2, type: "spring" }}
              className="px-2.5 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg"
            >
              -{Math.round(product.discountPercentage)}%
            </motion.span>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <span className="px-2.5 py-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Low stock
            </span>
          )}
          {product.stock === 0 && (
            <span className="px-2.5 py-1 bg-slate-500 text-white text-xs font-semibold rounded-full">
              Out of stock
            </span>
          )}
        </div>

        {/* Quick actions - slide in from right */}
        <div className={clsx(
          'absolute top-3 right-3 flex flex-col gap-2 z-10',
          'translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100',
          'transition-all duration-300 ease-out'
        )}>
          <button
            className="p-2.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
            aria-label="Add to wishlist"
          >
            <Heart className="w-4 h-4 text-slate-600 hover:text-rose-500 transition-colors" />
          </button>
        </div>

        {/* Compare button overlay - slide up */}
        <motion.button
          onClick={handleCompareClick}
          disabled={!inComparison && !canAddMore()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={clsx(
            'absolute bottom-3 right-3 flex items-center gap-1.5 px-4 py-2 rounded-xl z-10',
            'text-xs font-semibold transition-all duration-300',
            'translate-y-16 opacity-0 group-hover:translate-y-0 group-hover:opacity-100',
            inComparison
              ? 'bg-gradient-to-r from-electric-purple to-electric-pink text-white shadow-glow'
              : canAddMore()
                ? 'bg-white/90 backdrop-blur-sm text-slate-700 shadow-lg hover:bg-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          )}
        >
          {inComparison ? (
            <>
              <Check className="w-4 h-4" />
              Added
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Compare
            </>
          )}
        </motion.button>
      </Link>

      {/* Content */}
      <div className="relative p-5 flex flex-col flex-grow">
        {/* Category & Brand */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-electric-purple uppercase tracking-wider">
            {product.brand}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span className="text-xs text-slate-500 capitalize">
            {product.category.replace('-', ' ')}
          </span>
        </div>

        {/* Title */}
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="font-display font-semibold text-slate-900 mb-3 line-clamp-2 group-hover:text-electric-purple transition-colors duration-300">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={clsx(
                  'w-4 h-4 transition-colors',
                  i < Math.floor(product.rating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-200'
                )}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-slate-700">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-slate-400">({product.stock} in stock)</span>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600 text-xs font-medium rounded-lg border border-slate-100"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Feature Badges */}
        {(product.aiValueScore || (product.youtubeReviewIds && product.youtubeReviewIds.length > 0)) && (
          <div className="flex items-center gap-2 mb-3">
            {product.aiValueScore && (
              <span className={clsx(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold',
                product.aiValueScore >= 8 ? 'bg-emerald-50 text-emerald-700' :
                product.aiValueScore >= 6 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
              )}>
                <Sparkles className="w-3 h-3" />
                AI: {product.aiValueScore}/10
              </span>
            )}
            {product.youtubeReviewIds && product.youtubeReviewIds.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 rounded-md text-xs font-semibold">
                ▶ {product.youtubeReviewIds.length} review{product.youtubeReviewIds.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className={clsx(
            'text-xl font-bold',
            hasDiscount ? 'text-gradient' : 'text-slate-900'
          )}>
            {formatPrice(discountedPrice)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-slate-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Spacer to push button to bottom */}
        <div className="flex-grow" />

        {/* Buy on Amazon Button */}
        {product.affiliateUrl && (
          <motion.a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-[#FF9900] to-[#FFAD33] hover:from-[#e88a00] hover:to-[#FF9900] text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-orange-200/50 mt-auto"
          >
            <span>Buy on Amazon</span>
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        )}
      </div>

      {/* Selection indicator for comparison - gradient bar */}
      {inComparison && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-electric-purple via-electric-pink to-electric-teal origin-left"
        />
      )}
    </motion.div>
  )
}
