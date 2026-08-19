import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import RecipeCard, { type RecipeCardData } from '@/components/recipe/RecipeCard'
import { PlusCircle, Refrigerator, TrendingUp, BookOpen, ChefHat, Leaf } from 'lucide-react'

export const metadata = {
  title: "Dashboard — Harshi's Recipes",
  description: 'Your personal clean-eating recipe dashboard.',
}

const quickLinks = [
  {
    href: '/dashboard/add-recipe',
    icon: PlusCircle,
    title: 'Add Recipe',
    desc: 'Add a new clean-eating recipe with smart ingredient swaps',
    gradient: 'from-sage-500 to-sage-700',
  },
  {
    href: '/dashboard/fridge-finder',
    icon: Refrigerator,
    title: 'Fridge Finder',
    desc: 'Find recipes from ingredients you already have',
    gradient: 'from-forest-800 to-forest-900',
  },
]

import { getRecipes } from '@/actions/recipes'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let recipes: any[] = []
  try {
    recipes = await getRecipes()
  } catch (err) {
    console.error('Failed to fetch recipes', err)
  }

  const vegCount = recipes.filter(r => r.category === 'Veg').length
  const nonVegCount = recipes.filter(r => r.category === 'Non-Veg').length

  const stats = [
    { label: 'Total Recipes', value: recipes.length.toString(), icon: BookOpen,  color: 'text-sage-600 bg-sage-100' },
    { label: 'Veg Recipes',   value: vegCount.toString(),  icon: Leaf,      color: 'text-sage-600 bg-sage-100' },
    { label: 'Non-Veg',       value: nonVegCount.toString(),  icon: TrendingUp, color: 'text-blush-500 bg-blush-100' },
  ]

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar isAuth />

      <main className="section-padding pt-24 pb-16">
        <div className="container-max">

          {/* ── Welcome ─────────────────────────────────────── */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-1">
              <ChefHat className="w-4 h-4 text-sage-500" />
              <p className="text-xs font-outfit font-semibold uppercase tracking-widest text-sage-600">
                Good morning
              </p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-outfit font-black text-forest-900">
              Welcome back, {user?.email?.split('@')[0] || 'Chef'}!
            </h1>
            <p className="text-charcoal-500 font-outfit text-sm mt-2">
              Here&apos;s what&apos;s cooking in your vault today.
            </p>
          </div>

          {/* ── Stats ───────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="card p-5 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="text-2xl font-outfit font-black text-forest-900">{value}</div>
                  <div className="text-xs font-outfit text-charcoal-500">{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Quick access ────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {quickLinks.map(({ href, icon: Icon, title, desc, gradient }) => (
              <Link
                key={href}
                href={href}
                className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${gradient} group hover:-translate-y-1 transition-transform duration-200`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                    <Icon className="w-5 h-5 text-white" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-base font-outfit font-bold text-white mb-1">{title}</h3>
                    <p className="text-white/60 font-outfit text-sm leading-snug">{desc}</p>
                  </div>
                </div>
                <div className="mt-5 text-white/70 text-xs font-outfit font-semibold group-hover:text-white transition-colors flex items-center gap-1">
                  Get started
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {/* ── Recent Recipes ──────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-outfit font-bold text-forest-900">
                Recent Recipes
              </h2>
              <Link href="#" className="text-xs font-outfit font-semibold text-sage-600 hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.length > 0 ? (
                recipes.slice(0, 6).map(recipe => (
                  <RecipeCard key={recipe.id} recipe={{
                    id: recipe.id,
                    name: recipe.title,
                    category: recipe.category.toLowerCase() as 'veg' | 'non-veg',
                    mealType: recipe.meal_type,
                    image: recipe.image_url,
                  }} />
                ))
              ) : (
                <div className="col-span-full py-12 text-center border-2 border-dashed border-cream-300 rounded-2xl">
                  <p className="text-charcoal-500 font-outfit">You haven't added any recipes yet.</p>
                  <Link href="/dashboard/add-recipe" className="text-sage-600 font-outfit font-bold hover:underline mt-2 inline-block">
                    Add your first recipe
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
