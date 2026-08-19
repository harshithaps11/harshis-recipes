export type CategoryEnum = 'Veg' | 'Non-Veg'
export type MealTypeEnum = 'Breakfast' | 'Snack' | 'Lunch' | 'Dinner' | 'Dessert'

export interface Profile {
  id: string
  email: string
  created_at: string
}

export interface Recipe {
  id: string
  user_id: string
  title: string
  category: CategoryEnum
  meal_type: MealTypeEnum
  instructions: string[]
  estimated_calories: number | null
  estimated_protein: number | null
  estimated_carbs: number | null
  image_url: string | null
  created_at: string
}

export interface Ingredient {
  id: string
  name: string
}

export interface RecipeIngredient {
  id: string
  recipe_id: string
  ingredient_id: string
  quantity: string
  amount: number | null
  unit: string | null
}

// Joined representation often needed for the UI
export interface RecipeWithIngredients extends Recipe {
  ingredients: {
    quantity: string
    ingredient: {
      name: string
    }
  }[]
}

// Database schema definition for Supabase client
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at'>
        Update: Partial<Omit<Profile, 'created_at'>>
      }
      recipes: {
        Row: Recipe
        Insert: Omit<Recipe, 'id' | 'created_at' | 'user_id'> & { user_id?: string }
        Update: Partial<Omit<Recipe, 'id' | 'created_at' | 'user_id'>>
      }
      ingredients: {
        Row: Ingredient
        Insert: Omit<Ingredient, 'id'>
        Update: Partial<Omit<Ingredient, 'id'>>
      }
      recipe_ingredients: {
        Row: RecipeIngredient
        Insert: Omit<RecipeIngredient, 'id'>
        Update: Partial<Omit<RecipeIngredient, 'id'>>
      }
    }
    Functions: {
      find_recipes_by_available_ingredients: {
        Args: { available_ingredients: string[] }
        Returns: {
          recipe_id: string
          title: string
          category: CategoryEnum
          meal_type: MealTypeEnum
          image_url: string | null
          total_ingredients: number
          matching_ingredients: number
        }[]
      }
    }
  }
}
