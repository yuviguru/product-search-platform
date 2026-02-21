import { describe, it, expect } from 'vitest'
import { transformRecord, transformNewsRecord } from '@/services/airtableApi'

describe('transformRecord', () => {
  it('transforms a basic record with defaults', () => {
    const record = { id: 'rec123', fields: {} }
    const product = transformRecord(record, 0)

    expect(product.id).toBe(1)
    expect(product.title).toBe('')
    expect(product.price).toBe(0)
    expect(product.rating).toBe(0)
    expect(product.images).toEqual([])
    expect(product.tags).toBeUndefined()
    expect(product.specs).toBeUndefined()
    expect(product.youtubeReviewIds).toBeUndefined()
    expect(product.aiPros).toBeUndefined()
    expect(product.aiCons).toBeUndefined()
    expect(product.alternativeIds).toBeUndefined()
  })

  it('transforms all basic fields correctly', () => {
    const record = {
      id: 'rec456',
      fields: {
        title: 'MacBook Pro',
        description: 'A laptop',
        price: 1999,
        discountPercentage: 10,
        rating: 4.5,
        stock: 25,
        brand: 'Apple',
        category: 'laptops',
        thumbnail: 'https://img.com/thumb.jpg?w=400',
        affiliateUrl: 'https://amazon.com/dp/B123',
      },
    }
    const product = transformRecord(record, 2)

    expect(product.id).toBe(3) // index + 1
    expect(product.title).toBe('MacBook Pro')
    expect(product.price).toBe(1999)
    expect(product.discountPercentage).toBe(10)
    expect(product.rating).toBe(4.5)
    expect(product.brand).toBe('Apple')
    expect(product.category).toBe('laptops')
    expect(product.affiliateUrl).toBe('https://amazon.com/dp/B123')
    // Images should replace w=400 with w=800
    expect(product.images).toEqual(['https://img.com/thumb.jpg?w=800'])
  })

  it('parses tags from comma-separated string', () => {
    const record = {
      id: 'rec1',
      fields: { tags: 'gaming, portable, lightweight' },
    }
    const product = transformRecord(record, 0)

    expect(product.tags).toEqual(['gaming', 'portable', 'lightweight'])
  })

  it('parses specs from JSON string', () => {
    const record = {
      id: 'rec1',
      fields: { specs: '{"RAM": "16GB", "Display": "15.6 inch"}' },
    }
    const product = transformRecord(record, 0)

    expect(product.specs).toEqual({ RAM: '16GB', Display: '15.6 inch' })
  })

  it('handles invalid specs JSON gracefully', () => {
    const record = {
      id: 'rec1',
      fields: { specs: 'not valid json' },
    }
    const product = transformRecord(record, 0)

    expect(product.specs).toBeUndefined()
  })

  // YouTube URL parsing tests
  it('parses YouTube watch URLs to video IDs', () => {
    const record = {
      id: 'rec1',
      fields: {
        youtubeUrls: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ\nhttps://youtube.com/watch?v=abc123def45',
      },
    }
    const product = transformRecord(record, 0)

    expect(product.youtubeReviewIds).toEqual(['dQw4w9WgXcQ', 'abc123def45'])
  })

  it('parses YouTube short URLs', () => {
    const record = {
      id: 'rec1',
      fields: { youtubeUrls: 'https://youtu.be/dQw4w9WgXcQ' },
    }
    const product = transformRecord(record, 0)

    expect(product.youtubeReviewIds).toEqual(['dQw4w9WgXcQ'])
  })

  it('parses YouTube embed URLs', () => {
    const record = {
      id: 'rec1',
      fields: { youtubeUrls: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    }
    const product = transformRecord(record, 0)

    expect(product.youtubeReviewIds).toEqual(['dQw4w9WgXcQ'])
  })

  it('parses YouTube shorts URLs', () => {
    const record = {
      id: 'rec1',
      fields: { youtubeUrls: 'https://www.youtube.com/shorts/dQw4w9WgXcQ' },
    }
    const product = transformRecord(record, 0)

    expect(product.youtubeReviewIds).toEqual(['dQw4w9WgXcQ'])
  })

  it('handles plain video IDs as fallback', () => {
    const record = {
      id: 'rec1',
      fields: { youtubeUrls: 'dQw4w9WgXcQ' },
    }
    const product = transformRecord(record, 0)

    // Falls back to trimmed string since regex doesn't match
    expect(product.youtubeReviewIds).toEqual(['dQw4w9WgXcQ'])
  })

  // AI fields parsing tests
  it('parses AI pros and cons from JSON arrays', () => {
    const record = {
      id: 'rec1',
      fields: {
        aiPros: '["Great battery", "Fast processor"]',
        aiCons: '["Expensive", "Heavy"]',
      },
    }
    const product = transformRecord(record, 0)

    expect(product.aiPros).toEqual(['Great battery', 'Fast processor'])
    expect(product.aiCons).toEqual(['Expensive', 'Heavy'])
  })

  it('handles invalid AI pros/cons JSON gracefully', () => {
    const record = {
      id: 'rec1',
      fields: {
        aiPros: 'not json',
        aiCons: '{broken',
      },
    }
    const product = transformRecord(record, 0)

    expect(product.aiPros).toBeUndefined()
    expect(product.aiCons).toBeUndefined()
  })

  it('passes through AI scalar fields directly', () => {
    const record = {
      id: 'rec1',
      fields: {
        aiSummary: 'A great product for everyday use.',
        aiValueScore: 8.5,
        aiBestFor: 'Students and professionals',
        aiVerdict: 'Strong Buy',
      },
    }
    const product = transformRecord(record, 0)

    expect(product.aiSummary).toBe('A great product for everyday use.')
    expect(product.aiValueScore).toBe(8.5)
    expect(product.aiBestFor).toBe('Students and professionals')
    expect(product.aiVerdict).toBe('Strong Buy')
  })

  // Alternative IDs parsing
  it('parses alternativeIds from comma-separated string', () => {
    const record = {
      id: 'rec1',
      fields: { alternativeIds: '2, 5, 8' },
    }
    const product = transformRecord(record, 0)

    expect(product.alternativeIds).toEqual([2, 5, 8])
  })

  it('filters out NaN from alternativeIds', () => {
    const record = {
      id: 'rec1',
      fields: { alternativeIds: '2, invalid, 8' },
    }
    const product = transformRecord(record, 0)

    expect(product.alternativeIds).toEqual([2, 8])
  })
})

describe('transformNewsRecord', () => {
  it('transforms a basic news record with defaults', () => {
    const record = { id: 'recNews1', fields: {} }
    const article = transformNewsRecord(record)

    expect(article.id).toBe('recNews1')
    expect(article.title).toBe('')
    expect(article.slug).toBe('recNews1') // falls back to record id
    expect(article.category).toBe('Industry News')
    expect(article.author).toBe('Editorial Team')
    expect(article.featured).toBe(false)
    expect(article.relatedProductIds).toEqual([])
    expect(article.tags).toEqual([])
  })

  it('transforms a full news record', () => {
    const record = {
      id: 'recNews2',
      fields: {
        title: 'New iPhone Released',
        slug: 'new-iphone-released',
        summary: 'Apple launches new iPhone',
        content: 'Full article content here.',
        coverImage: 'https://img.com/iphone.jpg',
        category: 'Product Launch',
        relatedProductIds: '1, 3, 5',
        tags: 'apple, iphone, launch',
        publishedAt: '2026-02-15',
        author: 'John Doe',
        featured: true,
      },
    }
    const article = transformNewsRecord(record)

    expect(article.title).toBe('New iPhone Released')
    expect(article.slug).toBe('new-iphone-released')
    expect(article.summary).toBe('Apple launches new iPhone')
    expect(article.content).toBe('Full article content here.')
    expect(article.coverImage).toBe('https://img.com/iphone.jpg')
    expect(article.category).toBe('Product Launch')
    expect(article.relatedProductIds).toEqual([1, 3, 5])
    expect(article.tags).toEqual(['apple', 'iphone', 'launch'])
    expect(article.publishedAt).toBe('2026-02-15')
    expect(article.author).toBe('John Doe')
    expect(article.featured).toBe(true)
  })

  it('filters out invalid relatedProductIds', () => {
    const record = {
      id: 'recNews3',
      fields: { relatedProductIds: '1, abc, 3' },
    }
    const article = transformNewsRecord(record)

    expect(article.relatedProductIds).toEqual([1, 3])
  })
})
