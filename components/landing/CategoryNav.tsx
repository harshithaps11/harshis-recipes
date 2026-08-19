'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const categories = [
  { id: 'all',        label: 'All' },
  { id: 'breakfast',  label: 'Breakfast' },
  { id: 'lunch',      label: 'Lunch' },
  { id: 'dinner',     label: 'Dinner' },
  { id: 'rolls',      label: 'Rolls' },
  { id: 'biryani',    label: 'Biryani' },
  { id: 'desserts',   label: 'Desserts' },
  { id: 'ice-cream',  label: 'Ice Cream' },
  { id: 'snacks',     label: 'Snacks' },
  { id: 'soups',      label: 'Soups' },
  { id: 'salads',     label: 'Salads' },
  { id: 'smoothies',  label: 'Smoothies' },
]

interface CategoryNavProps {
  onSelect?: (id: string) => void
}

export default function CategoryNav({ onSelect }: CategoryNavProps) {
  const [active, setActive] = useState('all')
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -220 : 220, behavior: 'smooth' })
  }

  const handleSelect = (id: string) => {
    setActive(id)
    onSelect?.(id)
  }

  return (
    <div
      className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-cream-200"
      role="navigation"
      aria-label="Recipe categories"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">

          {/* Left scroll */}
          <button
            onClick={() => scroll('left')}
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-charcoal-400 hover:text-forest-900 hover:bg-cream-100 transition-colors"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Pills */}
          <div
            ref={scrollRef}
            className="flex items-center gap-1.5 overflow-x-auto py-3 flex-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map(cat => (
              <motion.button
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-outfit font-medium transition-all duration-200 whitespace-nowrap ${
                  active === cat.id
                    ? 'bg-sage-600 text-white shadow-sage'
                    : 'text-charcoal-600 hover:bg-cream-100 hover:text-forest-900 border border-transparent hover:border-cream-200'
                }`}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>

          {/* Right scroll */}
          <button
            onClick={() => scroll('right')}
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-charcoal-400 hover:text-forest-900 hover:bg-cream-100 transition-colors"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
