'use client'

import { useState, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Refrigerator, Loader2 } from 'lucide-react'
import IngredientChip from './IngredientChip'
import RecipeResultGrid from './RecipeResultGrid'
import type { RecipeCardData } from '@/components/recipe/RecipeCard'

/* ── DEMO DATA (replace with real Supabase query) ─────────────────── */
const DEMO_RECIPES: RecipeCardData[] = [
  {
    id: '1',
    name: 'Avocado & Quinoa Power Bowl',
    category: 'veg',
    mealType: 'Lunch',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
    prepTime: '25 min',
    servings: 2,
    tags: ['Gluten-Free', 'High Protein', 'Vegan'],
    matchCount: 5,
    totalIngredients: 6,
  },
  {
    id: '2',
    name: 'Spinach & Lentil Dahl',
    category: 'veg',
    mealType: 'Dinner',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80',
    prepTime: '35 min',
    servings: 4,
    tags: ['Iron-Rich', 'Vegan', 'Warming'],
    matchCount: 4,
    totalIngredients: 8,
  },
  {
    id: '3',
    name: 'Grilled Chicken & Veggie Tray',
    category: 'non-veg',
    mealType: 'Dinner',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80',
    prepTime: '40 min',
    servings: 4,
    tags: ['High Protein', 'Low Carb'],
    matchCount: 3,
    totalIngredients: 7,
  },
  {
    id: '4',
    name: 'Berry & Chia Overnight Oats',
    category: 'veg',
    mealType: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80',
    prepTime: '10 min',
    servings: 1,
    tags: ['Omega-3', 'No-Cook', 'Vegan'],
    matchCount: 4,
    totalIngredients: 5,
  },
  {
    id: '5',
    name: 'Turmeric & Ginger Soup',
    category: 'veg',
    mealType: 'Lunch',
    image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&q=80',
    prepTime: '30 min',
    servings: 3,
    tags: ['Anti-Inflammatory', 'Immune Boost'],
    matchCount: 3,
    totalIngredients: 9,
  },
  {
    id: '6',
    name: 'Coconut Mango Chia Pudding',
    category: 'veg',
    mealType: 'Dessert',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
    prepTime: '15 min',
    servings: 2,
    tags: ['Dairy-Free', 'Tropical', 'Clean'],
    matchCount: 2,
    totalIngredients: 5,
  },
]

/** Simple client-side match: count how many of the user's ingredients appear in the recipe's tags/name */
function matchRecipes(ingredients: string[], all: RecipeCardData[]): RecipeCardData[] {
  if (ingredients.length === 0) return []

  return all
    .map(r => {
      const hay = [r.name, ...(r.tags ?? [])].join(' ').toLowerCase()
      const matched = ingredients.filter(ing => hay.includes(ing.toLowerCase())).length
      return { ...r, matchCount: matched || r.matchCount }
    })
    .filter(r => (r.matchCount ?? 0) > 0)
    .sort((a, b) => (b.matchCount ?? 0) - (a.matchCount ?? 0))
}

export default function FridgeFinderUI() {
  const [input,       setInput]       = useState('')
  const [ingredients, setIngredients] = useState<string[]>([])
  const [results,     setResults]     = useState<RecipeCardData[]>([])
  const [loading,     setLoading]     = useState(false)
  const [searched,    setSearched]    = useState(false)

  const addIngredient = () => {
    const val = input.trim()
    if (!val || ingredients.includes(val.toLowerCase())) return
    setIngredients(prev => [...prev, val.toLowerCase()])
    setInput('')
    setSearched(false)
  }

  const removeIngredient = (label: string) => {
    setIngredients(prev => prev.filter(i => i !== label))
    setSearched(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addIngredient()
    }
  }

  const handleSearch = async () => {
    if (ingredients.length === 0) return
    setLoading(true)
    setSearched(false)

    // Simulate API call (replace with Supabase query)
    await new Promise(r => setTimeout(r, 1200))

    const matched = matchRecipes(ingredients, DEMO_RECIPES)
    setResults(matched)
    setLoading(false)
    setSearched(true)
  }

  return (
    <div>
      {/* ── Input panel ────────────────────────────────────── */}
      <div className="card p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-sage-100 flex items-center justify-center">
            <Refrigerator className="w-5 h-5 text-sage-600" />
          </div>
          <div>
            <h2 className="text-base font-outfit font-bold text-forest-900">
              What&apos;s in your fridge?
            </h2>
            <p className="text-xs text-charcoal-500 font-outfit">
              Type an ingredient and press Enter to add it
            </p>
          </div>
        </div>

        {/* Text input */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
            <input
              id="fridge-ingredient-input"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. avocado, oats, spinach…"
              className="input-clean pl-10"
            />
          </div>
          <motion.button
            type="button"
            onClick={addIngredient}
            disabled={!input.trim()}
            className="btn-secondary px-5 rounded-xl flex-shrink-0 disabled:opacity-40"
            whileTap={{ scale: 0.95 }}
          >
            Add
          </motion.button>
        </div>

        {/* Chips */}
        <AnimatePresence>
          {ingredients.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {ingredients.map(ing => (
                <IngredientChip
                  key={ing}
                  label={ing}
                  onRemove={() => removeIngredient(ing)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search button */}
        <motion.button
          id="fridge-search-btn"
          type="button"
          onClick={handleSearch}
          disabled={ingredients.length === 0 || loading}
          className="btn-primary w-full py-3.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
          whileHover={ingredients.length > 0 ? { scale: 1.01 } : {}}
          whileTap={ingredients.length > 0 ? { scale: 0.98 } : {}}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Searching your vault…
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Find Recipes ({ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''})
            </>
          )}
        </motion.button>

        {/* Empty state hint */}
        {ingredients.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs text-charcoal-400 font-outfit mt-4"
          >
            Try: avocado &middot; oats &middot; spinach &middot; chickpeas &middot; coconut milk
          </motion.p>
        )}
      </div>

      {/* ── Results ────────────────────────────────────────── */}
      <RecipeResultGrid
        recipes={results}
        isLoading={loading}
        searched={searched}
      />
    </div>
  )
}
