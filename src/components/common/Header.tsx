import { GitCompare, Menu, ShoppingCart, Sparkles } from 'lucide-react'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { useComparisonStore } from '../../stores/comparisonStore'

interface HeaderProps {
  onCompareClick?: () => void
}

export function Header({ onCompareClick }: HeaderProps) {
  const { items } = useComparisonStore()
  const compareCount = items.length

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      {/* Gradient accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-electric-purple via-electric-pink to-electric-teal" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-gradient-to-br from-electric-purple via-electric-pink to-electric-teal rounded-xl flex items-center justify-center shadow-lg shadow-purple-200/50"
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <div className="hidden sm:block">
                <span className="font-display font-bold text-xl text-gradient">
                  ProductSearch
                </span>
                <span className="block text-[10px] text-slate-400 font-medium -mt-0.5 tracking-wide">
                  SMART DISCOVERY
                </span>
              </div>
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Compare button */}
            <motion.button
              onClick={onCompareClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={clsx(
                'relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300',
                compareCount > 0
                  ? 'bg-gradient-to-r from-electric-purple/10 to-electric-pink/10 text-electric-purple border border-electric-purple/20'
                  : 'hover:bg-slate-100 text-slate-600 border border-transparent'
              )}
            >
              <GitCompare className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-semibold">Compare</span>
              {compareCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-electric-purple to-electric-pink text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
                >
                  {compareCount}
                </motion.span>
              )}
            </motion.button>

            {/* Cart button (demo) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                0
              </span>
            </motion.button>

            {/* Mobile menu */}
            <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors lg:hidden">
              <Menu className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
