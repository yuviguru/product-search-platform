import { useState } from 'react'
import { GitCompare, Menu, Search, Newspaper, Home, X } from 'lucide-react'
import { clsx } from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useComparisonStore } from '../../stores/comparisonStore'

interface HeaderProps {
  onCompareClick?: () => void
}

export function Header({ onCompareClick }: HeaderProps) {
  const { items } = useComparisonStore()
  const compareCount = items.length
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'Products', icon: Home },
    { to: '/news', label: 'News', icon: Newspaper },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      {/* Gradient accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-electric-purple via-electric-pink to-electric-teal" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-gradient-to-br from-electric-purple via-electric-pink to-electric-teal rounded-xl flex items-center justify-center shadow-lg shadow-purple-200/50"
              >
                <Search className="w-5 h-5 text-white" />
              </motion.div>
              <div className="hidden sm:block">
                <span className="font-display font-bold text-xl text-gradient">
                  ProductSearch
                </span>
                <span className="block text-[10px] text-slate-400 font-medium -mt-0.5 tracking-wide">
                  SMART DISCOVERY
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  location.pathname === link.to
                    ? 'bg-gradient-to-r from-electric-purple/10 to-electric-pink/10 text-electric-purple'
                    : 'text-slate-600 hover:bg-slate-100'
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </nav>

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

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors md:hidden"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-600" />
              ) : (
                <Menu className="w-5 h-5 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl overflow-hidden"
          >
            <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    location.pathname === link.to
                      ? 'bg-gradient-to-r from-electric-purple/10 to-electric-pink/10 text-electric-purple'
                      : 'text-slate-600 hover:bg-slate-50'
                  )}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
