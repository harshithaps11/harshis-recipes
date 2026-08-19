'use client'

import { motion } from 'framer-motion'
import RecipeCard, { type RecipeCardData } from '@/components/recipe/RecipeCard'

interface RecipeResultGridProps {
  recipes: RecipeCardData[]
  isLoading: boolean
  searched: boolean
}

const shimmerCards = Array.from({ length: 6 }, (_, i) => i)

export default function RecipeResultGrid({ recipes, isLoading, searched }: RecipeResultGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {shimmerCards.map(i => (
          <div key={i} className="card overflow-hidden">
            <div className="h-48 shimmer-bg" />
            <div className="p-5 space-y-3">
              <div className="h-4 shimmer-bg rounded-full w-3/4" />
              <div className="h-3 shimmer-bg rounded-full w-1/2" />
              <div className="flex gap-2">
                <div className="h-5 shimmer-bg rounded-full w-16" />
                <div className="h-5 shimmer-bg rounded-full w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (searched && recipes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="w-16 h-16 rounded-2xl bg-cream-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-cream-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4M3 11h18" />
          </svg>
        </div>
        <h3 className="text-xl font-outfit font-bold text-forest-900 mb-2">
          No matches found
        </h3>
        <p className="text-charcoal-500 font-outfit text-sm max-w-xs mx-auto">
          Try adding more ingredients or different combinations to find recipes in your vault.
        </p>
      </motion.div>
    )
  }

  if (!searched) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mt-10 mb-6">
        <h2 className="text-lg font-outfit font-bold text-forest-900">
          {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} matched
        </h2>
        <span className="text-xs font-outfit text-charcoal-400">Sorted by best match</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe, i) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
          >
            <RecipeCard recipe={recipe} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
