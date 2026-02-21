import { Info } from 'lucide-react'

export function AffiliateDisclosure() {
  return (
    <div className="bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-start gap-2 text-xs text-slate-400">
          <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <p>
            As an Amazon Associate, I earn from qualifying purchases. Product prices and availability are subject to change.
            Links on this site may be affiliate links.
          </p>
        </div>
      </div>
    </div>
  )
}
