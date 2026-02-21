import { motion } from 'framer-motion'
import { Sparkles, CheckCircle2, XCircle, Target, Award, Info } from 'lucide-react'
import { Product } from '@/types/product'

interface AIInsightsSectionProps {
  product: Product
}

function AIScoreBadge({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 36
  const offset = circumference - (score / 10) * circumference
  const color = score >= 8 ? '#10b981' : score >= 6 ? '#f59e0b' : '#ef4444'

  return (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="36" fill="none" stroke="#e2e8f0" strokeWidth="6" />
        <motion.circle
          cx="40" cy="40" r="36" fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-900">{score}</span>
        <span className="text-[10px] text-slate-500 font-medium">/ 10</span>
      </div>
    </div>
  )
}

export function AIInsightsSection({ product }: AIInsightsSectionProps) {
  const { aiSummary, aiPros, aiCons, aiValueScore, aiBestFor, aiVerdict } = product

  if (!aiSummary && !aiPros && !aiCons) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-2xl shadow-card p-6 sm:p-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-electric-purple to-electric-pink rounded-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900">AI Analysis</h2>
          <p className="text-sm text-slate-500">Powered by AI</p>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr,auto] gap-6">
        <div className="space-y-6">
          {/* Summary */}
          {aiSummary && (
            <p className="text-slate-600 leading-relaxed">{aiSummary}</p>
          )}

          {/* Pros & Cons */}
          <div className="grid sm:grid-cols-2 gap-4">
            {aiPros && aiPros.length > 0 && (
              <div className="bg-emerald-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Pros
                </h3>
                <ul className="space-y-2">
                  {aiPros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-emerald-700">
                      <span className="mt-1 w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {aiCons && aiCons.length > 0 && (
              <div className="bg-red-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-red-800 mb-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Cons
                </h3>
                <ul className="space-y-2">
                  {aiCons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                      <span className="mt-1 w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Best For */}
          {aiBestFor && (
            <div className="flex items-start gap-3 bg-blue-50 rounded-xl p-4">
              <Target className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-blue-800 mb-1">Best For</h3>
                <p className="text-sm text-blue-700">{aiBestFor}</p>
              </div>
            </div>
          )}

          {/* Verdict */}
          {aiVerdict && (
            <div className="flex items-start gap-3 bg-gradient-to-r from-electric-purple/5 to-electric-pink/5 border border-electric-purple/10 rounded-xl p-4">
              <Award className="w-5 h-5 text-electric-purple flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-electric-purple mb-1">Verdict</h3>
                <p className="text-sm text-slate-700">{aiVerdict}</p>
              </div>
            </div>
          )}
        </div>

        {/* Value Score */}
        {aiValueScore && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Value Score</span>
            <AIScoreBadge score={aiValueScore} />
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 flex items-start gap-2 text-xs text-slate-400">
        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
        <p>AI-generated analysis. Verify details before purchasing.</p>
      </div>
    </motion.section>
  )
}
