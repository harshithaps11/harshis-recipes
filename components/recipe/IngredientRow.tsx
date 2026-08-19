'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, GripVertical } from 'lucide-react'
import { getCleanSwap } from '@/lib/cleanSwaps'
import CleanSwapTooltip from './CleanSwapTooltip'
import type { CleanSwap } from '@/lib/cleanSwaps'

export interface IngredientRowData {
  id: string
  name: string
  quantity: string
}

interface IngredientRowProps {
  row: IngredientRowData
  index: number
  onChange: (id: string, field: 'name' | 'quantity', value: string) => void
  onRemove: (id: string) => void
  onAddRow?: () => void
  canRemove: boolean
}

export default function IngredientRow({ row, index, onChange, onRemove, onAddRow, canRemove }: IngredientRowProps) {
  const [swap, setSwap] = useState<(CleanSwap & { original: string }) | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [flagged, setFlagged] = useState(false)

  // Debounce clean-swap detection on name input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setDismissed(false)

    debounceRef.current = setTimeout(() => {
      const result = getCleanSwap(row.name)
      setSwap(result)
      setFlagged(!!result)
    }, 500)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [row.name])

  const handleDismiss = () => {
    setDismissed(true)
    setSwap(null)
    setFlagged(false)
  }

  const handleApply = (swapName: string) => {
    onChange(row.id, 'name', swapName)
    setSwap(null)
    setFlagged(false)
    setDismissed(true)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.25 }}
      className="relative"
    >
      {/* Row number + drag handle */}
      <div className="flex items-start gap-2">
        <div className="flex items-center gap-1 pt-3 flex-shrink-0">
          <GripVertical className="w-4 h-4 text-cream-400 cursor-grab" />
          <span className="text-xs font-outfit font-bold text-charcoal-400 w-4 text-right">
            {index + 1}
          </span>
        </div>

        {/* Name input (with clean-swap flag) */}
        <div className="flex-1 relative">
          <div className="relative">
            <input
              id={`ingredient-name-${row.id}`}
              type="text"
              value={row.name}
              onChange={e => onChange(row.id, 'name', e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  onAddRow?.()
                }
              }}
              placeholder="e.g. Oats, Avocado, Refined sugar…"
              className={`input-clean pr-8 transition-all ${
                flagged && !dismissed
                  ? 'border-amber-400 bg-amber-50/50'
                  : ''
              }`}
            />
            {/* Flag indicator */}
            {flagged && !dismissed && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm"
                title="Clean swap available"
              >
                ⚠️
              </motion.span>
            )}
          </div>

          {/* Tooltip */}
          {!dismissed && (
            <CleanSwapTooltip
              swap={swap}
              onDismiss={handleDismiss}
              onApply={handleApply}
            />
          )}
        </div>

        {/* Quantity input */}
        <div className="w-32 flex-shrink-0">
          <input
            id={`ingredient-qty-${row.id}`}
            type="text"
            value={row.quantity}
            onChange={e => onChange(row.id, 'quantity', e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                onAddRow?.()
              }
            }}
            placeholder="e.g. 1 cup"
            className="input-clean text-center"
          />
        </div>

        {/* Remove button */}
        {canRemove && (
          <motion.button
            type="button"
            onClick={() => onRemove(row.id)}
            className="mt-2.5 flex-shrink-0 p-2 rounded-lg text-charcoal-400 hover:text-blush-500 hover:bg-blush-100 transition-colors"
            whileTap={{ scale: 0.85 }}
            aria-label="Remove ingredient"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
