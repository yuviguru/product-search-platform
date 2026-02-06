import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ComparisonItem } from '../types/product'

interface ComparisonStore {
  items: ComparisonItem[]
  maxItems: number
  isDrawerOpen: boolean
  
  // Actions
  addItem: (productId: number) => boolean
  removeItem: (productId: number) => void
  clearAll: () => void
  toggleDrawer: () => void
  setDrawerOpen: (open: boolean) => void
  
  // Computed
  isInComparison: (productId: number) => boolean
  canAddMore: () => boolean
  getCount: () => number
}

export const useComparisonStore = create<ComparisonStore>()(
  persist(
    (set, get) => ({
      items: [],
      maxItems: 4,
      isDrawerOpen: false,

      addItem: (productId) => {
        const state = get()
        if (state.items.length >= state.maxItems) {
          return false
        }
        if (state.items.some(item => item.productId === productId)) {
          return false
        }
        set({
          items: [...state.items, { productId, addedAt: Date.now() }],
          isDrawerOpen: true,
        })
        return true
      },

      removeItem: (productId) => set((state) => ({
        items: state.items.filter(item => item.productId !== productId),
        isDrawerOpen: state.items.length > 1 ? state.isDrawerOpen : false,
      })),

      clearAll: () => set({ items: [], isDrawerOpen: false }),

      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      setDrawerOpen: (open) => set({ isDrawerOpen: open }),

      isInComparison: (productId) => get().items.some(item => item.productId === productId),

      canAddMore: () => get().items.length < get().maxItems,

      getCount: () => get().items.length,
    }),
    {
      name: 'product-comparison',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
