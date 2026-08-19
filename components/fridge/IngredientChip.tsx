'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface IngredientChipProps {
  label: string
  onRemove: () => void
}

export default function IngredientChip({ label, onRemove }: IngredientChipProps) {
  return (
    <AnimatePresence>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.7, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.7, y: 4 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-sage-100 border border-sage-200 text-sage-700 text-sm font-outfit font-medium"
      >
        <span>{label}</span>
        <motion.button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className="w-4 h-4 rounded-full bg-sage-200 hover:bg-sage-300 text-sage-600 hover:text-sage-800 flex items-center justify-center transition-colors"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
        >
          <X className="w-2.5 h-2.5" />
        </motion.button>
      </motion.div>
    </AnimatePresence>
  )
}
