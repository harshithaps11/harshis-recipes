import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import RecipeForm from '@/components/recipe/RecipeForm'
import { getRecipeById } from '@/actions/recipes'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Edit Recipe — Harshi\'s Recipes',
}

export default async function EditRecipePage({ params }: { params: { id: string } }) {
  let recipe: any = null
  
  try {
    recipe = await getRecipeById(params.id)
  } catch (err) {
    console.error(err)
  }

  if (!recipe) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar isAuth />
      
      <main className="section-padding pt-24 pb-16">
        <div className="container-max">
          <div className="max-w-2xl mx-auto mb-8">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-1 text-sm font-outfit font-semibold text-charcoal-400 hover:text-sage-600 transition-colors mb-6"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to dashboard
            </Link>
            
            <h1 className="text-3xl font-outfit font-black text-forest-900 mb-2">
              Edit Recipe
            </h1>
            <p className="text-charcoal-500 font-outfit">
              Make changes to {recipe.title}.
            </p>
          </div>

          <RecipeForm initialData={recipe} />
        </div>
      </main>
    </div>
  )
}
