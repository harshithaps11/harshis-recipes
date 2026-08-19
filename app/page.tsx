import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import LandingFeatures from '@/components/landing/LandingFeatures'
import RecipeFeed from '@/components/landing/RecipeFeed'
import { createClient } from '@/lib/supabase/server'
import { getRecipes } from '@/actions/recipes'

export default async function LandingPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAuth = !!user

  // Fetch recipes if authenticated, otherwise empty array
  let recipes: any[] = []
  if (isAuth) {
    try {
      recipes = await getRecipes()
    } catch (err) {
      console.error('Failed to fetch recipes', err)
    }
  }

  return (
    <main className="min-h-screen bg-cream-50">
      <Navbar isAuth={isAuth} />

      {/* ── Hero ──────────────────────────────────────────── */}
      <HeroSection />

      {/* ── Dynamic Recipe Feed & Category Filter ─────────── */}
      <RecipeFeed initialRecipes={recipes} isAuth={isAuth} />

      {/* ── Features & How it works ───────────────────────── */}
      {!isAuth && <LandingFeatures />}

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="section-padding py-8 border-t border-cream-200">
        <div className="container-max flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-charcoal-500 font-outfit">
            &copy; {new Date().getFullYear()} Harshi&apos;s Recipes. All rights reserved.
          </p>
          <div className="flex gap-6">
            {!isAuth ? (
              <>
                <Link href="/login"  className="text-xs text-charcoal-500 hover:text-sage-600 transition-colors font-outfit">Sign in</Link>
                <Link href="/signup" className="text-xs text-charcoal-500 hover:text-sage-600 transition-colors font-outfit">Sign up</Link>
              </>
            ) : (
              <span className="text-xs text-charcoal-400 font-outfit">
                Logged in as {user?.email}
              </span>
            )}
          </div>
        </div>
      </footer>
    </main>
  )
}
