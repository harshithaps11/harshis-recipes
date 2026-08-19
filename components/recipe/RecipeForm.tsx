'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusCircle, Upload, ChefHat, Loader2, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import IngredientRow, { type IngredientRowData } from './IngredientRow'
import MethodStepRow, { type MethodStepData } from './MethodStepRow'
import { createRecipe, updateRecipe } from '@/actions/recipes'
import type { CategoryEnum, MealTypeEnum, RecipeWithIngredients } from '@/types/database'

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Brunch']

type Category = 'veg' | 'non-veg'
type SubmitState = 'idle' | 'loading' | 'success'

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

export default function RecipeForm({ initialData }: { initialData?: any }) {
  const router = useRouter()

  const [name,        setName]        = useState(initialData?.title || '')
  const [category,    setCategory]    = useState<Category>(initialData?.category.toLowerCase() || 'veg')
  const [mealType,    setMealType]    = useState(initialData?.meal_type || '')
  
  const [ingredients, setIngredients] = useState<IngredientRowData[]>(
    initialData?.recipe_ingredients?.length > 0
      ? initialData.recipe_ingredients.map((ri: any) => ({
          id: uid(),
          name: ri.ingredients?.name || '',
          quantity: ri.quantity || ''
        }))
      : [{ id: uid(), name: '', quantity: '' }]
  )
  
  const [steps,       setSteps]       = useState<MethodStepData[]>(
    initialData?.instructions?.length > 0
      ? initialData.instructions.map((step: string) => ({
          id: uid(),
          text: step
        }))
      : [{ id: uid(), text: '' }]
  )
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null)
  const [submitState, setSubmitState]   = useState<SubmitState>('idle')

  /* ── Ingredients ─────────────────────────────────────────── */
  const addIngredient = () =>
    setIngredients(prev => [...prev, { id: uid(), name: '', quantity: '' }])

  const updateIngredient = useCallback(
    (id: string, field: 'name' | 'quantity', value: string) =>
      setIngredients(prev =>
        prev.map(r => (r.id === id ? { ...r, [field]: value } : r))
      ),
    []
  )

  const removeIngredient = useCallback(
    (id: string) => setIngredients(prev => prev.filter(r => r.id !== id)),
    []
  )

  /* ── Method steps ────────────────────────────────────────── */
  const addStep = () =>
    setSteps(prev => [...prev, { id: uid(), text: '' }])

  const updateStep = useCallback(
    (id: string, value: string) =>
      setSteps(prev => prev.map(s => (s.id === id ? { ...s, text: value } : s))),
    []
  )

  const removeStep = useCallback(
    (id: string) => setSteps(prev => prev.filter(s => s.id !== id)),
    []
  )

  /* ── Image upload ────────────────────────────────────────── */
  const handleImage = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = e => setImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  /* ── Submit ──────────────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitState('loading')
    
    try {
      const payload = {
        title: name,
        category: category === 'veg' ? 'Veg' as CategoryEnum : 'Non-Veg' as CategoryEnum,
        meal_type: mealType as MealTypeEnum,
        instructions: steps.map(s => s.text).filter(t => t.trim().length > 0),
        ingredients: ingredients
          .filter(i => i.name.trim().length > 0)
          .map(i => ({ name: i.name, quantity: i.quantity })),
        image_url: imagePreview || undefined
      }

      if (initialData?.id) {
        await updateRecipe(initialData.id, payload)
      } else {
        await createRecipe(payload)
      }
      
      setSubmitState('success')
      setTimeout(() => {
        setSubmitState('idle')
        router.push('/dashboard')
      }, 1500)
    } catch (err) {
      console.error(err)
      setSubmitState('idle')
      alert('Failed to save recipe. Please try again.')
    }
  }

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <form onSubmit={handleSubmit} className="space-y-10 max-w-2xl mx-auto">

      {/* ── Recipe Name ──────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <label className="text-xs font-outfit font-bold uppercase tracking-widest text-charcoal-600">
            Recipe Name
          </label>
          <span className="text-xs text-charcoal-400 font-outfit">{name.length}/80</span>
        </div>
        <input
          id="recipe-name"
          type="text"
          maxLength={80}
          required
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Avocado & Quinoa Power Bowl"
          className="input-clean text-lg font-lora placeholder:font-outfit placeholder:text-sm"
        />
      </motion.section>

      {/* ── Category + Meal Type ─────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-6"
      >
        {/* Veg / Non-Veg toggle */}
        <div className="space-y-3">
          <label className="text-xs font-outfit font-bold uppercase tracking-widest text-charcoal-600">
            Category
          </label>
          <div className="relative flex rounded-xl overflow-hidden border border-cream-300 bg-cream-100 p-1 h-11">
            <motion.div
              className={`absolute top-1 bottom-1 rounded-lg transition-all duration-300 ${
                category === 'veg' ? 'left-1 right-1/2 mr-0.5' : 'left-1/2 right-1 ml-0.5'
              }`}
              style={{
                background: category === 'veg'
                  ? 'linear-gradient(135deg, #a06078, #c98fa3)'
                  : 'linear-gradient(135deg, #e67e72, #f5b8b0)',
              }}
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
            {(['veg', 'non-veg'] as Category[]).map(cat => (
              <button
                key={cat}
                type="button"
                id={`category-${cat}`}
                onClick={() => setCategory(cat)}
                className={`relative z-10 flex-1 text-xs font-outfit font-bold capitalize transition-colors duration-200 ${
                  category === cat ? 'text-white' : 'text-charcoal-500'
                }`}
              >
                {cat === 'veg' ? 'Vegetarian' : 'Non-Veg'}
              </button>
            ))}
          </div>
        </div>

        {/* Meal type dropdown */}
        <div className="space-y-3">
          <label className="text-xs font-outfit font-bold uppercase tracking-widest text-charcoal-600">
            Meal Type
          </label>
          <select
            id="meal-type"
            required
            value={mealType}
            onChange={e => setMealType(e.target.value)}
            className="input-clean appearance-none cursor-pointer"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234a5568' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
          >
            <option value="">Select meal type…</option>
            {MEAL_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </motion.section>

      {/* ── Ingredients ──────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-outfit font-bold text-forest-900">
            Ingredients
          </h2>
          <div className="flex items-center gap-3 text-xs text-charcoal-400 font-outfit">
            <span className="w-44 text-center font-semibold">Name</span>
            <span className="w-28 text-center font-semibold">Quantity</span>
            <span className="w-8" />
          </div>
        </div>

        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {ingredients.map((row, i) => (
              <IngredientRow
                key={row.id}
                row={row}
                index={i}
                onChange={updateIngredient}
                onRemove={removeIngredient}
                onAddRow={addIngredient}
                canRemove={ingredients.length > 1}
              />
            ))}
          </AnimatePresence>
        </div>

        <motion.button
          type="button"
          onClick={addIngredient}
          className="flex items-center gap-2 text-sm font-outfit font-semibold text-sage-600 hover:text-sage-700 transition-colors mt-2"
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.96 }}
        >
          <PlusCircle className="w-4 h-4" />
          Add ingredient
        </motion.button>

        {/* Clean-swap info banner */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700 font-outfit">
          <span className="text-amber-500 font-bold">Tip</span>
          <span>
            Type ingredients like <strong>&quot;refined sugar&quot;</strong> or <strong>&quot;heavy cream&quot;</strong> to see clean-swap suggestions automatically.
          </span>
        </div>
      </motion.section>

      {/* ── Method Steps ─────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h2 className="text-base font-outfit font-bold text-forest-900">Method</h2>

        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {steps.map((step, i) => (
              <MethodStepRow
                key={step.id}
                step={step}
                index={i}
                onChange={updateStep}
                onRemove={removeStep}
                onAddRow={addStep}
                canRemove={steps.length > 1}
              />
            ))}
          </AnimatePresence>
        </div>

        <motion.button
          type="button"
          onClick={addStep}
          className="flex items-center gap-2 text-sm font-outfit font-semibold text-sage-600 hover:text-sage-700 transition-colors"
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.96 }}
        >
          <PlusCircle className="w-4 h-4" />
          Add step
        </motion.button>
      </motion.section>

      {/* ── Image Upload ─────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="space-y-3"
      >
        <label className="text-xs font-outfit font-bold uppercase tracking-widest text-charcoal-600">
          Recipe Photo (optional)
        </label>

        <div
          className="relative rounded-2xl border-2 border-dashed border-cream-300 bg-cream-50 hover:border-sage-400 hover:bg-sage-50/30 transition-all duration-200 overflow-hidden"
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault()
            handleImage(e.dataTransfer.files[0])
          }}
        >
          {imagePreview ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} alt="Recipe preview" className="w-full h-64 object-cover" />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-charcoal-600 hover:bg-white transition-colors shadow-sm text-sm"
              >
                ✕
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-3 py-12 cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-cream-100 flex items-center justify-center">
                <Upload className="w-6 h-6 text-charcoal-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-outfit font-semibold text-charcoal-600">
                  Drop photo here or <span className="text-sage-600">browse</span>
                </p>
                <p className="text-xs text-charcoal-400 font-outfit mt-1">PNG, JPG up to 10MB</p>
              </div>
              <input
                id="recipe-image"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={e => handleImage(e.target.files?.[0])}
              />
            </label>
          )}
        </div>
      </motion.section>

      {/* ── Submit ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-4 pb-8"
      >
        <motion.button
          id="recipe-submit"
          type="submit"
          disabled={submitState !== 'idle'}
          className={`btn-primary px-10 py-4 rounded-2xl text-base ${
            submitState === 'success' ? '!bg-sage-500' : ''
          }`}
          whileHover={submitState === 'idle' ? { scale: 1.02 } : {}}
          whileTap={submitState === 'idle' ? { scale: 0.98 } : {}}
        >
          <AnimatePresence mode="wait">
            {submitState === 'idle' && (
              <motion.span key="idle" className="flex items-center gap-2"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ChefHat className="w-4 h-4" />
                Save Recipe
              </motion.span>
            )}
            {submitState === 'loading' && (
              <motion.span key="loading" className="flex items-center gap-2"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving…
              </motion.span>
            )}
            {submitState === 'success' && (
              <motion.span key="success" className="flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <CheckCircle2 className="w-4 h-4" />
                Recipe Saved!
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <button type="button" className="btn-ghost text-sm text-charcoal-500">
          Save as draft
        </button>
      </motion.div>
    </form>
  )
}
