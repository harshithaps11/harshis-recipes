import Navbar from '@/components/layout/Navbar'
import FridgeFinderUI from '@/components/fridge/FridgeFinderUI'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata = {
  title: "Fridge Finder — Harshi's Recipes",
  description: 'Find recipes based on ingredients you already have.',
}

export default function FridgeFinderPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar isAuth />

      <main className="section-padding pt-24 pb-16">
        <div className="container-max max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs font-outfit text-charcoal-400 mb-8">
            <Link href="/dashboard" className="hover:text-sage-600 transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-forest-900 font-semibold">Fridge Finder</span>
          </nav>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-outfit font-black text-forest-900 mb-2">
              Fridge Finder
            </h1>
            <p className="text-charcoal-500 font-outfit text-sm max-w-xl">
              Tell us what ingredients you have right now, and we&apos;ll surface the best matching
              recipes from your vault — sorted by how many ingredients you already have.
            </p>
          </div>

          <FridgeFinderUI />
        </div>
      </main>
    </div>
  )
}
