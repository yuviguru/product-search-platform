import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, User, Tag } from 'lucide-react'
import { NewsArticle } from '@/types/product'

interface NewsCardProps {
  article: NewsArticle
  index?: number
}

const categoryColors: Record<string, string> = {
  'Product Launch': 'from-electric-purple to-electric-pink',
  'Review Roundup': 'from-blue-500 to-cyan-500',
  'Deal Alert': 'from-amber-500 to-orange-500',
  'Industry News': 'from-emerald-500 to-teal-500',
}

export function NewsCard({ article, index = 0 }: NewsCardProps) {
  const gradientClass = categoryColors[article.category] || 'from-slate-500 to-slate-600'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
    >
      <Link
        to={`/news/${article.slug}`}
        className="group block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-2 transition-all duration-300"
      >
        {/* Cover Image */}
        <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
          {article.coverImage ? (
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradientClass} opacity-20`} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Category Badge */}
          <span className={`absolute top-3 left-3 px-3 py-1 bg-gradient-to-r ${gradientClass} text-white text-xs font-bold rounded-full shadow-lg`}>
            {article.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-display font-semibold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-electric-purple transition-colors">
            {article.title}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-3 mb-4">{article.summary}</p>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {article.author}
            </span>
            {article.relatedProductIds.length > 0 && (
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                {article.relatedProductIds.length} product{article.relatedProductIds.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
