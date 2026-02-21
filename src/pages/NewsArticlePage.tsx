import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, User, ChevronRight, ExternalLink, Star, Newspaper } from 'lucide-react'

import { useNewsArticle } from '@/hooks/useNews'
import { useProducts } from '@/hooks/useProducts'
import { formatPrice, calculateDiscountedPrice } from '@/data/products'

export function NewsArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const { article, isLoading } = useNewsArticle(slug || '')
  const { products } = useProducts()

  const relatedProducts = useMemo(() => {
    if (!article) return []
    return article.relatedProductIds
      .map(id => products.find(p => p.id === id))
      .filter(Boolean) as typeof products
  }, [article, products])

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded-lg mb-6" />
        <div className="aspect-[21/9] bg-slate-200 rounded-2xl mb-8" />
        <div className="space-y-4">
          <div className="h-10 bg-slate-200 rounded-lg w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-5/6" />
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <Newspaper className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Article Not Found</h2>
        <p className="text-slate-500 mb-6">This article doesn't exist or has been removed.</p>
        <Link
          to="/news"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-electric-purple to-electric-pink text-white font-semibold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to News
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Breadcrumb */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 text-sm text-slate-500 mb-6"
      >
        <Link to="/" className="hover:text-electric-purple transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/news" className="hover:text-electric-purple transition-colors">News</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900 font-medium truncate">{article.title}</span>
      </motion.nav>

      {/* Hero Image */}
      {article.coverImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-8"
        >
          <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </motion.div>
      )}

      {/* Article Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <span className="inline-block px-3 py-1 bg-gradient-to-r from-electric-purple/10 to-electric-pink/10 text-electric-purple text-sm font-semibold rounded-full mb-4">
          {article.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-4">
          {article.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            {article.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {new Date(article.publishedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      </motion.div>

      {/* Article Content */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="prose prose-slate max-w-none mb-12 prose-headings:font-display prose-a:text-electric-purple prose-img:rounded-xl"
      >
        {/* Render content as paragraphs (simple Markdown-like rendering) */}
        {article.content.split('\n\n').map((paragraph, i) => {
          if (paragraph.startsWith('# ')) {
            return <h1 key={i}>{paragraph.slice(2)}</h1>
          }
          if (paragraph.startsWith('## ')) {
            return <h2 key={i}>{paragraph.slice(3)}</h2>
          }
          if (paragraph.startsWith('### ')) {
            return <h3 key={i}>{paragraph.slice(4)}</h3>
          }
          if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
            return (
              <ul key={i}>
                {paragraph.split('\n').map((item, j) => (
                  <li key={j}>{item.replace(/^[-*]\s/, '')}</li>
                ))}
              </ul>
            )
          }
          return <p key={i}>{paragraph}</p>
        })}
      </motion.article>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-card p-6 sm:p-8 mb-8"
        >
          <h2 className="text-xl font-display font-bold text-slate-900 mb-6">Related Products</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {relatedProducts.map(product => {
              const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage)
              return (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group flex gap-4 p-4 rounded-xl border border-slate-100 hover:border-electric-purple/20 hover:shadow-card transition-all duration-200"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-electric-purple transition-colors">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-slate-900">{formatPrice(discountedPrice)}</span>
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-slate-500">{product.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    {product.affiliateUrl && (
                      <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-[#FF9900]">
                        View on Amazon <ExternalLink className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </motion.section>
      )}

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {article.tags.map(tag => (
            <span key={tag} className="px-3 py-1.5 bg-slate-100 text-slate-500 text-sm rounded-lg">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Back */}
      <div className="text-center py-4">
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-electric-purple transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all news
        </Link>
      </div>
    </div>
  )
}
