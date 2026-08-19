'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, X, Leaf } from 'lucide-react'
import type { CleanSwap } from '@/lib/cleanSwaps'

interface CleanSwapTooltipProps {
  swap: (CleanSwap & { original: string }) | null
  onDismiss: () => void
  onApply: (swapName: string) => void
}

export default function CleanSwapTooltip({ swap, onDismiss, onApply }: CleanSwapTooltipProps) {
  return (
    <AnimatePresence>
      {swap && (
        <motion.div
          key="clean-swap-tooltip"
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute left-0 right-0 top-full mt-2 z-50"
          role="tooltip"
          aria-live="polite"
        >
          <div className="rounded-2xl border border-sage-200 bg-white p-4 shadow-glass-lg">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-sm flex-shrink-0">
                  ⚠️
                </div>
                <div>
                  <p className="text-xs font-outfit font-bold text-charcoal-700 leading-tight">
                    Clean-Swap Suggestion
                  </p>
                  <p className="text-xs text-charcoal-400 font-outfit capitalize">
                    &ldquo;{swap.original}&rdquo; detected
                  </p>
                </div>
              </div>
              <button
                onClick={onDismiss}
                className="text-charcoal-400 hover:text-charcoal-600 transition-colors flex-shrink-0"
                aria-label="Dismiss suggestion"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Swap content */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-sage-50 border border-sage-100 mb-3">
              <span className="text-lg flex-shrink-0">{swap.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs font-outfit">
                  <span className="text-charcoal-500 line-through truncate capitalize">{swap.original}</span>
                  <ArrowRight className="w-3 h-3 text-sage-500 flex-shrink-0" />
                  <span className="font-bold text-sage-700 truncate">{swap.swap}</span>
                </div>
                <p className="text-xs text-charcoal-500 font-outfit mt-0.5">
                  📏 {swap.conversion}
                </p>
              </div>
            </div>

            {/* Reason */}
            <div className="flex items-start gap-2 mb-3">
              <Leaf className="w-3.5 h-3.5 text-sage-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-charcoal-500 font-outfit leading-relaxed">
                {swap.reason}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => onApply(swap.swap)}
                className="flex-1 text-xs font-outfit font-semibold py-2 px-3 rounded-lg bg-sage-600 text-white hover:bg-sage-700 transition-colors"
              >
                Use {swap.swap}
              </button>
              <button
                onClick={onDismiss}
                className="text-xs font-outfit text-charcoal-500 hover:text-charcoal-700 px-3 py-2 rounded-lg hover:bg-cream-100 transition-colors"
              >
                Keep original
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
