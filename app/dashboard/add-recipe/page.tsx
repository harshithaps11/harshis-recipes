import Navbar from '@/components/layout/Navbar'
import RecipeForm from '@/components/recipe/RecipeForm'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata = {
  title: "Add Recipe — Harshi's Recipes",
  description: 'Add a new clean-eating recipe to your personal vault.',
}

export default function AddRecipePage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar isAuth />

      <main className="section-padding pt-24 pb-16">
        <div className="container-max">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs font-outfit text-charcoal-400 mb-8">
            <Link href="/dashboard" className="hover:text-sage-600 transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-forest-900 font-semibold">Add Recipe</span>
          </nav>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-outfit font-black text-forest-900 mb-2">
              Add a new recipe
            </h1>
            <p className="text-charcoal-500 font-outfit text-sm">
              Fill in the details below. The Clean-Swap engine will flag unhealthy ingredients automatically.
            </p>
          </div>

          {/* Form card */}
          <div className="card p-8 sm:p-10">
            <RecipeForm />
          </div>
        </div>
      </main>
    </div>
  )
}
