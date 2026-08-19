'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CategoryNav from '@/components/landing/CategoryNav'
import RecipeCard from '@/components/recipe/RecipeCard'
import type { Recipe, CategoryEnum, MealTypeEnum } from '@/types/database'
import Link from 'next/link'

interface RecipeFeedProps {
  initialRecipes: any[]
  isAuth: boolean
}

export default function RecipeFeed({ initialRecipes, isAuth }: RecipeFeedProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  // Map the frontend category IDs to the database ENUMs for filtering
  const dbCategoryMap: Record<string, { cat?: CategoryEnum, meal?: MealTypeEnum }> = {
    'all': {},
    'breakfast': { meal: 'Breakfast' },
    'lunch': { meal: 'Lunch' },
    'dinner': { meal: 'Dinner' },
    'desserts': { meal: 'Dessert' },
    'snacks': { meal: 'Snack' },
    // Custom logic could be added for other tabs like rolls, biryani, etc.
    // For now, we will filter locally based on title or tags if needed, or just meal type.
  }

  const filteredRecipes = initialRecipes.filter(recipe => {
    if (activeCategory === 'all') return true
    
    const filter = dbCategoryMap[activeCategory]
    if (filter?.meal) {
      return recipe.meal_type === filter.meal
    }
    
    // Fallback: search title for keywords
    return recipe.title.toLowerCase().includes(activeCategory.replace('-', ' '))
  })

  return (
    <section className="relative z-20 bg-cream-50 pb-24">
      {/* Category Navigation */}
      <CategoryNav onSelect={setActiveCategory} />

      <div className="container-max section-padding mt-12">
        {!isAuth ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 glass rounded-3xl border border-cream-200"
          >
            <div className="w-16 h-16 bg-sage-100 text-sage-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-outfit font-bold text-forest-900 mb-2">Your Vault is Locked</h3>
            <p className="text-charcoal-500 font-outfit max-w-md mx-auto mb-6">
              Sign in to view your personal collection of clean-eating recipes, or create a free account to start building your vault.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/login" className="btn-secondary">Sign in</Link>
              <Link href="/signup" className="btn-primary">Create Account</Link>
            </div>
          </motion.div>
        ) : filteredRecipes.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredRecipes.map((recipe) => (
                <motion.div
                  key={recipe.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <RecipeCard recipe={{
                    id: recipe.id,
                    name: recipe.title,
                    category: recipe.category.toLowerCase() as 'veg' | 'non-veg',
                    mealType: recipe.meal_type,
                    image: recipe.image_url,
                    prepTime: '20 min', // Mock data since it's not in DB schema currently
                    servings: 2,        // Mock data
                    tags: []
                  }} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 bg-cream-200 text-cream-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3 className="text-xl font-outfit font-bold text-forest-900 mb-2">No recipes found</h3>
            <p className="text-charcoal-500 font-outfit mb-6">
              {initialRecipes.length === 0 
                ? "Your vault is empty! Add your first clean recipe to get started."
                : "No recipes match this category."}
            </p>
            {initialRecipes.length === 0 && (
              <Link href="/dashboard/add-recipe" className="btn-primary">
                Add New Recipe
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}
