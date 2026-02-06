import { Product } from '../types/product'

const AIRTABLE_PAT = import.meta.env.VITE_AIRTABLE_PAT
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID
const AIRTABLE_TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME || 'Products'

const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`

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
  }
}

interface AirtableResponse {
  records: AirtableRecord[]
  offset?: string
}

function transformRecord(record: AirtableRecord, index: number): Product {
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
