import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Product } from '@/types/product'
import { AffiliateDisclosure } from '@/components/common/AffiliateDisclosure'
import { AlternativesSection } from '@/components/product-detail/AlternativesSection'

function makeProduct(overrides: Partial<Product> & { id: number }): Product {
  return {
    title: `Product ${overrides.id}`,
    description: '',
    price: 100,
    discountPercentage: 0,
    rating: 4.0,
    stock: 10,
    brand: 'BrandA',
    category: 'electronics',
    thumbnail: '',
    images: [],
    ...overrides,
  }
}

describe('AffiliateDisclosure', () => {
  it('renders the Amazon Associate disclosure text', () => {
    render(<AffiliateDisclosure />)
    expect(
      screen.getByText(/Amazon Associate/i)
    ).toBeInTheDocument()
  })

  it('mentions affiliate links', () => {
    render(<AffiliateDisclosure />)
    expect(
      screen.getByText(/affiliate links/i)
    ).toBeInTheDocument()
  })
})

describe('AlternativesSection', () => {
  const product = makeProduct({ id: 1, category: 'laptops', price: 1000 })
  const alt1 = makeProduct({ id: 2, title: 'Alt Laptop 1', category: 'laptops', price: 1100, rating: 4.5 })
  const alt2 = makeProduct({ id: 3, title: 'Alt Laptop 2', category: 'laptops', price: 900, rating: 3.5 })

  it('renders section heading', () => {
    render(
      <MemoryRouter>
        <AlternativesSection
          product={product}
          alternatives={[alt1, alt2]}
          sameCategory={[alt1, alt2]}
          samePriceRange={[alt1]}
          higherRated={[alt1]}
        />
      </MemoryRouter>
    )

    expect(screen.getByText('Alternatives to Consider')).toBeInTheDocument()
  })

  it('renders alternative product titles', () => {
    render(
      <MemoryRouter>
        <AlternativesSection
          product={product}
          alternatives={[alt1, alt2]}
          sameCategory={[alt1]}
          samePriceRange={[]}
          higherRated={[]}
        />
      </MemoryRouter>
    )

    expect(screen.getByText('Alt Laptop 1')).toBeInTheDocument()
    expect(screen.getByText('Alt Laptop 2')).toBeInTheDocument()
  })

  it('shows tab buttons', () => {
    render(
      <MemoryRouter>
        <AlternativesSection
          product={product}
          alternatives={[alt1]}
          sameCategory={[alt1]}
          samePriceRange={[alt1]}
          higherRated={[alt1]}
        />
      </MemoryRouter>
    )

    expect(screen.getByText('Recommended')).toBeInTheDocument()
    expect(screen.getByText('Same Category')).toBeInTheDocument()
    expect(screen.getByText('Similar Price')).toBeInTheDocument()
    expect(screen.getByText('Higher Rated')).toBeInTheDocument()
  })

  it('switches tabs when clicked', () => {
    render(
      <MemoryRouter>
        <AlternativesSection
          product={product}
          alternatives={[alt1]}
          sameCategory={[alt2]}
          samePriceRange={[]}
          higherRated={[]}
        />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText('Same Category'))
    expect(screen.getByText('Alt Laptop 2')).toBeInTheDocument()
  })

  it('returns null when no alternatives exist', () => {
    const { container } = render(
      <MemoryRouter>
        <AlternativesSection
          product={product}
          alternatives={[]}
          sameCategory={[]}
          samePriceRange={[]}
          higherRated={[]}
        />
      </MemoryRouter>
    )

    expect(container.innerHTML).toBe('')
  })

  it('renders price difference labels', () => {
    render(
      <MemoryRouter>
        <AlternativesSection
          product={product}
          alternatives={[alt1]}
          sameCategory={[]}
          samePriceRange={[]}
          higherRated={[]}
        />
      </MemoryRouter>
    )

    // alt1 is $1100 vs product $1000, so +$100
    expect(screen.getByText('+$100')).toBeInTheDocument()
  })
})
