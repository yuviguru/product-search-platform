import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { fetchNews } from '@/services/airtableApi'
import { NewsArticle, NewsCategory } from '@/types/product'

export function useNews(category?: NewsCategory) {
  const query = useQuery<NewsArticle[], Error>({
    queryKey: ['news'],
    queryFn: fetchNews,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  })

  const articles = useMemo(() => {
    const data = query.data ?? []
    const sorted = [...data].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    if (category && category !== 'All') {
      return sorted.filter(a => a.category === category)
    }
    return sorted
  }, [query.data, category])

  const featured = useMemo(() => {
    return articles.find(a => a.featured) || articles[0]
  }, [articles])

  return {
    articles,
    featured,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  }
}

export function useNewsArticle(slug: string) {
  const { articles, isLoading, isError, error } = useNews()

  const article = useMemo(() => {
    return articles.find(a => a.slug === slug)
  }, [articles, slug])

  return { article, isLoading, isError, error }
}
