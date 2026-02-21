import { Product, NewsArticle } from '../types/product'

const AIRTABLE_PAT = import.meta.env.VITE_AIRTABLE_PAT
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID
const AIRTABLE_TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME || 'Products'
const AIRTABLE_NEWS_TABLE = import.meta.env.VITE_AIRTABLE_NEWS_TABLE || 'News'

const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`
const AIRTABLE_NEWS_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_NEWS_TABLE}`

interface AirtableRecord {
  id: string
  fields: {
    title?: string
    description?: string
    price?: number
    discountPercentage?: number
    rating?: number
    stock?: number
    brand?: string
    category?: string
    thumbnail?: string
    tags?: string
    affiliateUrl?: string
    specs?: string
    youtubeUrls?: string
    aiSummary?: string
    aiPros?: string
    aiCons?: string
    aiValueScore?: number
    aiBestFor?: string
    aiVerdict?: string
    alternativeIds?: string
  }
}

interface AirtableNewsRecord {
  id: string
  fields: {
    title?: string
    slug?: string
    summary?: string
    content?: string
    coverImage?: string
    category?: string
    relatedProductIds?: string
    tags?: string
    publishedAt?: string
    author?: string
    featured?: boolean
  }
}

interface AirtableResponse {
  records: AirtableRecord[]
  offset?: string
}

export function transformRecord(record: AirtableRecord, index: number): Product {
  const fields = record.fields

  // Parse specs from JSON string
  let specs: Record<string, string | number | boolean> | undefined
  if (fields.specs) {
    try {
      specs = JSON.parse(fields.specs)
    } catch {
      specs = undefined
    }
  }

  // Parse tags from comma-separated string
  const tags = fields.tags
    ? fields.tags.split(',').map(tag => tag.trim())
    : undefined

  // Parse YouTube URLs to video IDs
  const youtubeReviewIds = fields.youtubeUrls
    ? fields.youtubeUrls.split('\n').map(url => {
        const match = url.trim().match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/)
        return match ? match[1] : url.trim()
      }).filter(Boolean)
    : undefined

  // Parse AI pros/cons from JSON strings
  let aiPros: string[] | undefined
  if (fields.aiPros) {
    try { aiPros = JSON.parse(fields.aiPros) } catch { aiPros = undefined }
  }
  let aiCons: string[] | undefined
  if (fields.aiCons) {
    try { aiCons = JSON.parse(fields.aiCons) } catch { aiCons = undefined }
  }

  // Parse alternative IDs
  const alternativeIds = fields.alternativeIds
    ? fields.alternativeIds.split(',').map(id => parseInt(id.trim())).filter(n => !isNaN(n))
    : undefined

  return {
    id: index + 1, // Use sequential ID for consistency
    title: fields.title || '',
    description: fields.description || '',
    price: fields.price || 0,
    discountPercentage: fields.discountPercentage || 0,
    rating: fields.rating || 0,
    stock: fields.stock || 0,
    brand: fields.brand || '',
    category: fields.category || '',
    thumbnail: fields.thumbnail || '',
    images: fields.thumbnail ? [fields.thumbnail.replace('w=400', 'w=800')] : [],
    tags,
    specs,
    affiliateUrl: fields.affiliateUrl,
    youtubeReviewIds,
    aiSummary: fields.aiSummary,
    aiPros,
    aiCons,
    aiValueScore: fields.aiValueScore,
    aiBestFor: fields.aiBestFor,
    aiVerdict: fields.aiVerdict,
    alternativeIds,
  }
}

export async function fetchProducts(): Promise<Product[]> {
  const allRecords: AirtableRecord[] = []
  let offset: string | undefined

  // Fetch all records (handles pagination)
  do {
    const url = offset
      ? `${AIRTABLE_API_URL}?offset=${offset}`
      : AIRTABLE_API_URL

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status} ${response.statusText}`)
    }

    const data: AirtableResponse = await response.json()
    allRecords.push(...data.records)
    offset = data.offset
  } while (offset)

  // Transform records to Product interface
  return allRecords.map((record, index) => transformRecord(record, index))
}

export function transformNewsRecord(record: AirtableNewsRecord): NewsArticle {
  const fields = record.fields

  const relatedProductIds = fields.relatedProductIds
    ? fields.relatedProductIds.split(',').map(id => parseInt(id.trim())).filter(n => !isNaN(n))
    : []

  const tags = fields.tags
    ? fields.tags.split(',').map(tag => tag.trim())
    : []

  return {
    id: record.id,
    title: fields.title || '',
    slug: fields.slug || record.id,
    summary: fields.summary || '',
    content: fields.content || '',
    coverImage: fields.coverImage || '',
    category: (fields.category as NewsArticle['category']) || 'Industry News',
    relatedProductIds,
    tags,
    publishedAt: fields.publishedAt || new Date().toISOString(),
    author: fields.author || 'Editorial Team',
    featured: fields.featured || false,
  }
}

export async function fetchNews(): Promise<NewsArticle[]> {
  const allRecords: AirtableNewsRecord[] = []
  let offset: string | undefined

  do {
    const url = offset
      ? `${AIRTABLE_NEWS_API_URL}?offset=${offset}`
      : AIRTABLE_NEWS_API_URL

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Airtable News API error: ${response.status} ${response.statusText}`)
    }

    const data: AirtableResponse = await response.json()
    allRecords.push(...(data.records as unknown as AirtableNewsRecord[]))
    offset = data.offset
  } while (offset)

  return allRecords.map(transformNewsRecord)
}
