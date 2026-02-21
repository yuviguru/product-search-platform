import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, DollarSign, Star, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Product } from '@/types/product'
import { formatPrice, calculateDiscountedPrice } from '@/data/products'

interface AlternativesSectionProps {
  product: Product
  alternatives: Product[]
  sameCategory: Product[]
  samePriceRange: Product[]
  higherRated: Product[]
}

type Tab = 'recommended' | 'category' | 'price' | 'rated'

export function AlternativesSection({
  product,
  alternatives,
  sameCategory,
  samePriceRange,
  higherRated,
}: AlternativesSectionProps) {
  const [activeTab, setActiveTab] = useState<Tab>('recommended')

  const tabs = [
    { id: 'recommended' as Tab, label: 'Recommended', icon: TrendingUp },
    { id: 'category' as Tab, label: 'Same Category', icon: ArrowRight },
    { id: 'price' as Tab, label: 'Similar Price', icon: DollarSign },
    { id: 'rated' as Tab, label: 'Higher Rated', icon: Star },
  ]

  const currentProducts = {
    recommended: alternatives,
    category: sameCategory,
    price: samePriceRange,
    rated: higherRated,
  }[activeTab]

  if (alternatives.length === 0 && sameCategory.length === 0) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-2xl shadow-card p-6 sm:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900">Alternatives to Consider</h2>
          <p className="text-sm text-slate-500 mt-1">Similar products you might be interested in</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => {
          const count = currentProducts.length
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-electric-purple to-electric-pink text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Products */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {currentProducts.slice(0, 6).map((alt) => {
          const priceDiff = alt.price - product.price
          const ratingDiff = alt.rating - product.rating
          const discountedPrice = calculateDiscountedPrice(alt.price, alt.discountPercentage)

          return (
            <Link
              key={alt.id}
              to={`/product/${alt.id}`}
              className="group flex gap-4 p-4 rounded-xl border border-slate-100 hover:border-electric-purple/20 hover:shadow-card transition-all duration-200"
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                <img
                  src={alt.thumbnail}
                  alt={alt.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-electric-purple transition-colors">
                  {alt.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-slate-900">{formatPrice(discountedPrice)}</span>
                  {priceDiff !== 0 && (
                    <span className={`text-xs font-medium ${priceDiff < 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {priceDiff < 0 ? '' : '+'}{formatPrice(priceDiff)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-medium text-slate-600">{alt.rating.toFixed(1)}</span>
                  </div>
                  {ratingDiff !== 0 && (
                    <span className={`text-xs font-medium ${ratingDiff > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {ratingDiff > 0 ? '+' : ''}{ratingDiff.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {currentProducts.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-8">
          No alternatives found in this category.
        </p>
      )}
    </motion.section>
  )
}
