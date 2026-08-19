'use client'

import { motion } from 'framer-motion'
import { Trash2, GripVertical } from 'lucide-react'

export interface MethodStepData {
  id: string
  text: string
}

interface MethodStepRowProps {
  step: MethodStepData
  index: number
  onChange: (id: string, value: string) => void
  onRemove: (id: string) => void
  onAddRow?: () => void
  canRemove: boolean
}

export default function MethodStepRow({ step, index, onChange, onRemove, onAddRow, canRemove }: MethodStepRowProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-start gap-3 group"
    >
      {/* Drag handle */}
      <div className="flex items-center gap-1 mt-3 flex-shrink-0 cursor-grab">
        <GripVertical className="w-4 h-4 text-cream-300 group-hover:text-cream-400 transition-colors" />
      </div>

      {/* Step number badge */}
      <div className="flex-shrink-0 mt-2.5">
        <div className="w-7 h-7 rounded-full bg-sage-600 text-white flex items-center justify-center text-xs font-outfit font-bold">
          {index + 1}
        </div>
      </div>

      {/* Textarea */}
      <textarea
        id={`method-step-${step.id}`}
        value={step.text}
        onChange={e => onChange(step.id, e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onAddRow?.()
          }
        }}
        placeholder={`Step ${index + 1}: Describe what to do…`}
        rows={2}
        className="flex-1 input-clean resize-none leading-relaxed"
      />

      {/* Remove */}
      {canRemove && (
        <motion.button
          type="button"
          onClick={() => onRemove(step.id)}
          className="mt-2.5 flex-shrink-0 p-2 rounded-lg text-charcoal-400 hover:text-blush-500 hover:bg-blush-100 transition-colors opacity-0 group-hover:opacity-100"
          whileTap={{ scale: 0.85 }}
          aria-label="Remove step"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      )}
    </motion.div>
  )
}
