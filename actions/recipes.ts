'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Database, CategoryEnum, MealTypeEnum } from '@/types/database'

export interface IngredientInput {
  name: string
  quantity: string
  amount?: number
  unit?: string
}

export interface CreateRecipeInput {
  title: string
  category: CategoryEnum
  meal_type: MealTypeEnum
  instructions: string[]
  ingredients: IngredientInput[]
  image_url?: string
}

/**
 * Calculates rough macros based on ingredients list
 * (In a real app, this would use a nutrition API or a vast local database)
 */
export async function calculateMacros(ingredients: IngredientInput[]) {
  // Mock calculation for demonstration purposes
  let calories = 0
  let protein = 0
  let carbs = 0

  for (const ing of ingredients) {
    const name = ing.name.toLowerCase()
    if (name.includes('chicken') || name.includes('beef') || name.includes('fish')) {
      calories += 200
      protein += 25
    } else if (name.includes('rice') || name.includes('quinoa') || name.includes('oats')) {
      calories += 150
      carbs += 30
      protein += 5
    } else if (name.includes('oil') || name.includes('butter') || name.includes('cream')) {
      calories += 120
    } else {
      calories += 20 // Veggies etc
      carbs += 4
    }
  }

  return { estimated_calories: calories, estimated_protein: protein, estimated_carbs: carbs }
}

/**
 * Creates a new recipe along with its ingredients transactionally.
 */
export async function createRecipe(input: CreateRecipeInput) {
  const supabase = createClient()
  
  // 1. Check auth
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  // 2. Calculate macros
  const macros = await calculateMacros(input.ingredients)

  // 3. Insert Recipe
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .insert({
      user_id: user.id,
      title: input.title,
      category: input.category,
      meal_type: input.meal_type,
      instructions: input.instructions,
      image_url: input.image_url || null,
      ...macros
    })
    .select('id')
    .single()

  if (recipeError) throw new Error(`Failed to create recipe: ${recipeError.message}`)

  // 4. Handle Ingredients
  for (const ing of input.ingredients) {
    const cleanName = ing.name.toLowerCase().trim()
    
    // Upsert ingredient (or just insert and ignore if exists using RPC or ON CONFLICT, 
    // but with standard Supabase JS we can check/insert)
    let ingredientId: string
    
    const { data: existingIng } = await supabase
      .from('ingredients')
      .select('id')
      .eq('name', cleanName)
      .single()
      
    if (existingIng) {
      ingredientId = existingIng.id
    } else {
      const { data: newIng, error: ingError } = await supabase
        .from('ingredients')
        .insert({ name: cleanName })
        .select('id')
        .single()
        
      if (ingError) throw new Error(`Failed to insert ingredient ${cleanName}`)
      ingredientId = newIng.id
    }

    // Insert junction
    await supabase
      .from('recipe_ingredients')
      .insert({
        recipe_id: recipe.id,
        ingredient_id: ingredientId,
        quantity: ing.quantity,
        amount: ing.amount || null,
        unit: ing.unit || null
      })
  }

  revalidatePath('/dashboard')
  return recipe.id
}

/**
 * Fetch recipes for the logged-in user, with optional filters
 */
export async function getRecipes(filters?: { category?: CategoryEnum, mealType?: MealTypeEnum }) {
  const supabase = createClient()
  
  let query = supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters?.category) {
    query = query.eq('category', filters.category)
  }
  if (filters?.mealType) {
    query = query.eq('meal_type', filters.mealType)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data
}

/**
 * Fetch a single recipe by ID with its ingredients
 */
export async function getRecipeById(id: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('recipes')
    .select(`
      *,
      recipe_ingredients (
        id,
        quantity,
        amount,
        unit,
        ingredients ( name )
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

/**
 * Delete a recipe
 */
export async function deleteRecipe(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('recipes').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard')
}

/**
 * Update a recipe and its ingredients
 */
export async function updateRecipe(id: string, updates: CreateRecipeInput) {
  const supabase = createClient()
  
  const macros = await calculateMacros(updates.ingredients)

  const updateData: any = {
    title: updates.title,
    category: updates.category,
    meal_type: updates.meal_type,
    instructions: updates.instructions,
    image_url: updates.image_url,
    ...macros
  }
  
  // Remove undefined fields
  Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key])
  
  const { error } = await supabase.from('recipes').update(updateData).eq('id', id)
  if (error) throw new Error(error.message)
    
  // Simple approach for ingredients: delete all existing mappings and re-insert
  await supabase.from('recipe_ingredients').delete().eq('recipe_id', id)

  for (const ing of updates.ingredients) {
    const cleanName = ing.name.toLowerCase().trim()
    let ingredientId: string
    
    const { data: existingIng } = await supabase
      .from('ingredients')
      .select('id')
      .eq('name', cleanName)
      .single()
      
    if (existingIng) {
      ingredientId = existingIng.id
    } else {
      const { data: newIng, error: ingError } = await supabase
        .from('ingredients')
        .insert({ name: cleanName })
        .select('id')
        .single()
        
      if (ingError) throw new Error(`Failed to insert ingredient ${cleanName}`)
      ingredientId = newIng.id
    }

    await supabase
      .from('recipe_ingredients')
      .insert({
        recipe_id: id,
        ingredient_id: ingredientId,
        quantity: ing.quantity,
        amount: ing.amount || null,
        unit: ing.unit || null
      })
  }
  
  revalidatePath('/dashboard')
  revalidatePath('/')
}

/**
 * Fridge Finder: Search using the Postgres RPC function
 */
export async function searchFridgeFinder(availableIngredients: string[]) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .rpc('find_recipes_by_available_ingredients', {
      available_ingredients: availableIngredients
    })

  if (error) throw new Error(error.message)
  return data
}
