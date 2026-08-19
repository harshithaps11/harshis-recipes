'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import FeatureCard from '@/components/landing/FeatureCard'
import { RefreshCw, Refrigerator, BookOpen } from 'lucide-react'

const features = [
  {
    icon: RefreshCw,
    title: 'Clean-Swap Engine',
    description:
      'Instantly flag unhealthy ingredients as you type and get smart, measurement-accurate clean alternatives — from refined sugar to coconut sugar, heavy cream to cashew cream.',
    accent: 'sage' as const,
  },
  {
    icon: Refrigerator,
    title: 'Fridge Finder',
    description:
      'Tell us what ingredients you have and we will surface the best matching recipes from your vault. Never waste food again.',
    accent: 'gold' as const,
  },
  {
    icon: BookOpen,
    title: 'Recipe Vault',
    description:
      'Build your personal library of clean-eating recipes with beautiful cards, smart categorisation by meal type, and a veg/non-veg toggle.',
    accent: 'blush' as const,
  },
]

export default function LandingFeatures() {
  const featuresRef = useRef<HTMLDivElement>(null)
  const inView = useInView(featuresRef, { once: true, margin: '-100px' })

  return (
    <>
      {/* ── Features ──────────────────────────────────────── */}
      <section id="features" className="section-padding py-24">
        <div className="container-max">
          <div ref={featuresRef} className="text-center mb-16">
            <motion.span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-outfit font-semibold uppercase tracking-widest text-sage-700 bg-sage-100 border border-sage-200 mb-4"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
            >
              Everything you need
            </motion.span>
            <motion.h2
              className="text-4xl sm:text-5xl font-outfit font-black text-forest-900 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Built for clean eaters.
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────── */}
      <section id="how-it-works" className="section-padding py-24 bg-forest-900">
        <div className="container-max text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-outfit font-black text-white mb-4"
          >
            Three steps to a{' '}
            <span className="text-sage-300">cleaner kitchen.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/50 font-outfit max-w-xl mx-auto mb-16"
          >
            Simple. Intentional. Delicious.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Add Your Recipes', desc: 'Input recipes with ingredients, method, and meal type.' },
              { step: '02', title: 'Get Smart Swaps', desc: 'The Clean-Swap engine suggests healthy alternatives in real-time.' },
              { step: '03', title: 'Cook from Your Fridge', desc: 'Enter ingredients on hand and find matching recipes instantly.' },
            ].map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="glass-dark rounded-2xl p-8 text-left"
              >
                <div className="text-xs font-outfit font-bold uppercase tracking-widest text-sage-400 mb-3">{step}</div>
                <h3 className="text-xl font-outfit font-bold text-white mb-2">{title}</h3>
                <p className="text-white/50 font-outfit text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="section-padding py-24 bg-sage-gradient">
        <div className="container-max text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-outfit font-black text-forest-900 mb-4"
          >
            Ready to eat clean?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-charcoal-600 max-w-md mx-auto mb-8 font-outfit"
          >
            Join Harshi&apos;s Recipes and start building your personal clean-eating vault today.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/signup" className="btn-primary text-base px-10 py-4 rounded-2xl">
              Create Free Account
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
