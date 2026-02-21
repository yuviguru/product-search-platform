import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Star, ExternalLink, ChevronRight, ArrowLeft, Share2,
  ShoppingCart, ImageOff, Sparkles, Tag, Package, Youtube
} from 'lucide-react'
import { clsx } from 'clsx'

import { useProducts } from '@/hooks/useProducts'
import { useAlternatives } from '@/hooks/useAlternatives'
import { formatPrice, calculateDiscountedPrice } from '@/data/products'
import { YouTubeReviewSection } from '@/components/product-detail/YouTubeReviewSection'
import { AIInsightsSection } from '@/components/product-detail/AIInsightsSection'
import { AlternativesSection } from '@/components/product-detail/AlternativesSection'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { products, isLoading } = useProducts()

  const product = useMemo(
    () => products.find(p => p.id === Number(id)),
    [products, id]
  )

  const { alternatives, sameCategory, samePriceRange, higherRated } = useAlternatives(product, products)

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-48 bg-slate-200 rounded-lg" />
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="aspect-square bg-slate-200 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-10 bg-slate-200 rounded-lg w-3/4" />
              <div className="h-6 bg-slate-200 rounded-lg w-1/2" />
              <div className="h-20 bg-slate-200 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Product Not Found</h2>
          <p className="text-slate-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-electric-purple to-electric-pink text-white font-semibold rounded-xl shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </motion.div>
      </div>
    )
  }

  const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage)
  const hasDiscount = product.discountPercentage > 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Breadcrumb */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 text-sm text-slate-500 mb-6"
      >
        <Link to="/" className="hover:text-electric-purple transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="capitalize">{product.category.replace('-', ' ')}</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900 font-medium truncate">{product.title}</span>
      </motion.nav>

      {/* Product Hero */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-10">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-card"
        >
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
              <ImageOff className="w-16 h-16 mb-2" />
              <span className="text-sm">Image unavailable</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {hasDiscount && (
              <span className="px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-bold rounded-full shadow-lg">
                -{Math.round(product.discountPercentage)}% OFF
              </span>
            )}
            {product.stock < 10 && product.stock > 0 && (
              <span className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Low stock
              </span>
            )}
          </div>

          {/* AI Score Badge */}
          {product.aiValueScore && (
            <div className="absolute top-4 right-4 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex flex-col items-center justify-center">
              <span className="text-xs text-slate-500 font-medium">AI</span>
              <span className={clsx(
                'text-lg font-bold',
                product.aiValueScore >= 8 ? 'text-emerald-600' : product.aiValueScore >= 6 ? 'text-amber-600' : 'text-red-500'
              )}>{product.aiValueScore}</span>
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          {/* Brand & Category */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-electric-purple uppercase tracking-wider">
              {product.brand}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-sm text-slate-500 capitalize">
              {product.category.replace('-', ' ')}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900 mb-4">
            {product.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={clsx(
                    'w-5 h-5',
                    i < Math.floor(product.rating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-200'
                  )}
                />
              ))}
            </div>
            <span className="text-lg font-semibold text-slate-700">{product.rating.toFixed(1)}</span>
            <span className="text-sm text-slate-400">|</span>
            <span className="text-sm text-slate-500">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
          </div>

          {/* Description */}
          <p className="text-slate-600 leading-relaxed mb-6">{product.description}</p>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className={clsx(
              'text-3xl sm:text-4xl font-bold',
              hasDiscount ? 'text-gradient' : 'text-slate-900'
            )}>
              {formatPrice(discountedPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xl text-slate-400 line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            {product.affiliateUrl && (
              <motion.a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FF9900] to-[#FFAD33] hover:from-[#e88a00] hover:to-[#FF9900] text-white text-base font-semibold rounded-xl shadow-lg shadow-orange-200/50 transition-all duration-300"
              >
                <ShoppingCart className="w-5 h-5" />
                Buy on Amazon
                <ExternalLink className="w-4 h-4" />
              </motion.a>
            )}
            {product.youtubeReviewIds && product.youtubeReviewIds.length > 0 && (
              <a
                href="#reviews"
                className="flex items-center justify-center gap-2 px-6 py-4 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-colors"
              >
                <Youtube className="w-5 h-5" />
                Watch Reviews ({product.youtubeReviewIds.length})
              </a>
            )}
          </div>
        </motion.div>
      </div>

      {/* Specs Table */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-card p-6 sm:p-8 mb-8"
        >
          <h2 className="text-xl font-display font-bold text-slate-900 mb-4">Specifications</h2>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1">
            {Object.entries(product.specs).map(([key, value], i) => (
              <div
                key={key}
                className={clsx(
                  'flex items-center justify-between py-3 border-b border-slate-100',
                  i === Object.keys(product.specs!).length - 1 && 'border-b-0'
                )}
              >
                <span className="text-sm font-medium text-slate-500">{key}</span>
                <span className="text-sm font-semibold text-slate-900">{String(value)}</span>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* YouTube Reviews */}
      {product.youtubeReviewIds && product.youtubeReviewIds.length > 0 && (
        <div id="reviews" className="mb-8">
          <YouTubeReviewSection videoIds={product.youtubeReviewIds} />
        </div>
      )}

      {/* AI Insights */}
      <div className="mb-8">
        <AIInsightsSection product={product} />
      </div>

      {/* Alternatives */}
      <div className="mb-8">
        <AlternativesSection
          product={product}
          alternatives={alternatives}
          sameCategory={sameCategory}
          samePriceRange={samePriceRange}
          higherRated={higherRated}
        />
      </div>

      {/* Back to Products */}
      <div className="text-center py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-electric-purple transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all products
        </Link>
      </div>
    </div>
  )
}
