import { useState } from 'react'
import { motion } from 'framer-motion'
import { Newspaper, Sparkles, Rocket, Star, Percent, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useNews } from '@/hooks/useNews'
import { NewsCard } from '@/components/news/NewsCard'
import { NewsCategory } from '@/types/product'

const categories: { id: NewsCategory; label: string; icon: typeof Globe }[] = [
  { id: 'All', label: 'All News', icon: Globe },
  { id: 'Product Launch', label: 'Launches', icon: Rocket },
  { id: 'Review Roundup', label: 'Reviews', icon: Star },
  { id: 'Deal Alert', label: 'Deals', icon: Percent },
  { id: 'Industry News', label: 'Industry', icon: Newspaper },
]

export function NewsPage() {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('All')
  const { articles, featured, isLoading, isError } = useNews(activeCategory)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-electric-purple/10 to-electric-pink/10 border border-electric-purple/20 rounded-full mb-4 w-fit mx-auto">
          <Sparkles className="w-4 h-4 text-electric-purple" />
          <span className="text-sm font-semibold text-electric-purple">Product News & Updates</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-3">
          Latest <span className="text-gradient">News</span>
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto">
          Stay updated with product launches, reviews, deals, and industry insights
        </p>
      </motion.div>

      {/* Featured Article */}
      {featured && activeCategory === 'All' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <Link
            to={`/news/${featured.slug}`}
            className="group block relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
          >
            <div className="relative aspect-[21/9] sm:aspect-[3/1] bg-slate-900">
              {featured.coverImage && (
                <img
                  src={featured.coverImage}
                  alt={featured.title}
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                <span className="inline-block px-3 py-1 bg-gradient-to-r from-electric-purple to-electric-pink text-white text-xs font-bold rounded-full mb-3">
                  Featured
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2 group-hover:text-electric-teal transition-colors">
                  {featured.title}
                </h2>
                <p className="text-white/70 max-w-2xl line-clamp-2">{featured.summary}</p>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Category Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-electric-purple to-electric-pink text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <cat.icon className="w-4 h-4" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-card animate-pulse">
              <div className="aspect-[16/9] bg-slate-200" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-4 bg-slate-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-20">
          <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-display font-bold text-slate-900 mb-2">Unable to load news</h3>
          <p className="text-slate-500">Check back later for the latest updates.</p>
        </div>
      ) : articles.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <NewsCard key={article.id} article={article} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-display font-bold text-slate-900 mb-2">No articles yet</h3>
          <p className="text-slate-500">News articles will appear here once published.</p>
        </div>
      )}
    </div>
  )
}
