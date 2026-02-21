import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import { Header } from './components/common/Header'
import { CompareDrawer } from './components/comparison/CompareDrawer'
import { CompareModal } from './components/comparison/CompareModal'
import { AffiliateDisclosure } from './components/common/AffiliateDisclosure'

import { useProducts } from './hooks/useProducts'
import { HomePage } from './pages/HomePage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { NewsPage } from './pages/NewsPage'
import { NewsArticlePage } from './pages/NewsArticlePage'

function App() {
  const [showCompareModal, setShowCompareModal] = useState(false)
  const { products: allProducts } = useProducts()

  return (
    <div className="min-h-screen bg-mesh overflow-x-hidden flex flex-col">
      <Header onCompareClick={() => setShowCompareModal(true)} />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:slug" element={<NewsArticlePage />} />
        </Routes>
      </div>

      {/* Affiliate Disclosure Footer */}
      <AffiliateDisclosure />

      {/* Compare Drawer */}
      <CompareDrawer onCompare={() => setShowCompareModal(true)} allProducts={allProducts} />

      {/* Compare Modal */}
      <AnimatePresence>
        {showCompareModal && (
          <CompareModal
            isOpen={showCompareModal}
            onClose={() => setShowCompareModal(false)}
            allProducts={allProducts}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
