'use client'

import { motion } from 'framer-motion'
import { Clock, Users, Edit3 } from 'lucide-react'
import Link from 'next/link'

export interface RecipeCardData {
  id: string
  name: string
  category: 'veg' | 'non-veg'
  mealType: string
  image?: string
  matchCount?: number
  totalIngredients?: number
  prepTime?: string
  servings?: number
  tags?: string[]
}

export default function RecipeCard({ recipe }: { recipe: RecipeCardData }) {
  const isVeg = recipe.category === 'veg'
  const matchPct = recipe.matchCount && recipe.totalIngredients
    ? Math.round((recipe.matchCount / recipe.totalIngredients) * 100)
    : null

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="card overflow-hidden group cursor-pointer transition-all duration-300"
      style={{ boxShadow: '0 4px 24px rgba(26,46,34,0.07)' }}
      onHoverStart={() => {}}
      tabIndex={0}
      role="article"
      aria-label={recipe.name}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-cream-100">
        {recipe.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          // Fallback premium dummy photo
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80"
            alt="Healthy meal fallback"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {/* Veg / Non-veg dot */}
          <span
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-outfit font-bold backdrop-blur-sm border ${
              isVeg
                ? 'bg-sage-600/90 text-white border-sage-500/50'
                : 'bg-blush-500/90 text-white border-blush-400/50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {isVeg ? 'Veg' : 'Non-Veg'}
          </span>

          {/* Meal type */}
          <span className="px-2 py-0.5 rounded-full text-xs font-outfit font-semibold bg-white/80 backdrop-blur-sm text-charcoal-700 border border-white/60">
            {recipe.mealType}
          </span>
        </div>

        {/* Match badge */}
        {matchPct !== null && (
          <div className="absolute top-3 right-3">
            <div
              className="w-12 h-12 rounded-full flex flex-col items-center justify-center text-center backdrop-blur-md border border-white/60"
              style={{
                background: matchPct >= 80
                  ? 'rgba(74,124,94,0.9)'
                  : matchPct >= 50
                  ? 'rgba(246,216,96,0.9)'
                  : 'rgba(245,184,176,0.9)',
              }}
            >
              <span className="text-xs font-outfit font-black text-white leading-none">{matchPct}%</span>
              <span className="text-[9px] font-outfit text-white/80 leading-none mt-0.5">match</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 relative">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-lora font-semibold text-forest-900 text-base leading-snug line-clamp-2 group-hover:text-sage-700 transition-colors">
            {recipe.name}
          </h3>
          <Link
            href={`/dashboard/edit-recipe/${recipe.id}`}
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-lg text-charcoal-400 hover:text-sage-600 hover:bg-sage-50 transition-colors flex-shrink-0"
            aria-label="Edit recipe"
          >
            <Edit3 className="w-4 h-4" />
          </Link>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-charcoal-500 font-outfit mb-3">
          {recipe.prepTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {recipe.prepTime}
            </span>
          )}
          {recipe.servings && (
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {recipe.servings} servings
            </span>
          )}
        </div>

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {recipe.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-cream-100 text-charcoal-500 font-outfit border border-cream-200">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Matched ingredients count */}
        {recipe.matchCount !== undefined && recipe.totalIngredients !== undefined && (
          <div className="mt-3 pt-3 border-t border-cream-200">
            <div className="flex items-center justify-between text-xs font-outfit">
              <span className="text-charcoal-500">Ingredients matched</span>
              <span className="font-bold text-sage-600">
                {recipe.matchCount}/{recipe.totalIngredients}
              </span>
            </div>
            <div className="mt-1.5 h-1 rounded-full bg-cream-200 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: matchPct && matchPct >= 80
                    ? '#4a7c5e'
                    : matchPct && matchPct >= 50
                    ? '#f6d860'
                    : '#f5b8b0',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${matchPct}%` }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.article>
  )
}
