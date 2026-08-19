'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, Variants } from 'framer-motion'
import { ArrowRight, ChevronDown, Refrigerator, RefreshCw, BarChart3 } from 'lucide-react'

const glassCards = [
  {
    icon: Refrigerator,
    title: 'Zero Guesswork',
    desc: 'Find meals using only the ingredients already in your fridge.',
  },
  {
    icon: RefreshCw,
    title: 'Clean Swaps',
    desc: 'Intelligent ingredient substitutes for health-conscious cooking.',
  },
  {
    icon: BarChart3,
    title: 'Nutrient Insights',
    desc: 'Auto-calculated protein, carbs, and calories per meal.',
  },
]

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const word: Variants = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <section className="relative h-screen min-h-[640px] flex flex-col items-center justify-center overflow-hidden">

      {/* ── Video background ──────────────────────────────── */}
      <video
        ref={videoRef}
        src="/hero-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />

      {/* ── Gradient overlay ──────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25" />

      {/* ── Hero content ──────────────────────────────────── */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">

        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/25 bg-white/10 backdrop-blur-md mb-7"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-sage-300 animate-pulse-soft" />
          <span className="text-xs font-outfit font-semibold text-white/90 uppercase tracking-widest">
            Your Clean Eating Vault
          </span>
        </motion.div>

        {/* Headline — word by word animation */}
        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          className="text-5xl sm:text-6xl lg:text-7xl font-outfit font-black text-white leading-[0.95] tracking-tight mb-6"
        >
          {['Wholesome.', 'Indulgent.'].map((w) => (
            <motion.span key={w} variants={word} className="block">
              {w}
            </motion.span>
          ))}
          <motion.span variants={word} className="block text-sage-300">
            100% Clean.
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="text-base sm:text-lg text-white/70 font-outfit font-light max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Your personal recipe vault for delicious, clean-eating meals — powered by smart ingredient matching and macro tracking.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/signup">
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-sage-600 text-white font-outfit font-semibold text-base cursor-pointer"
              style={{ boxShadow: '0 8px 32px rgba(160, 96, 120, 0.45)' }}
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </Link>

          <Link href="/dashboard/fridge-finder">
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/25 text-white font-outfit font-semibold text-base cursor-pointer hover:bg-white/15 transition-colors"
            >
              Try Fridge Finder
            </motion.div>
          </Link>
        </motion.div>
      </div>

      {/* ── Glass feature cards (bottom) ──────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 pb-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {glassCards.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.75 + i * 0.1 }}
              className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-5 text-white"
            >
              <Icon className="w-5 h-5 text-sage-300 mb-3" strokeWidth={1.5} />
              <h3 className="font-outfit font-bold text-sm mb-1.5">{title}</h3>
              <p className="text-xs text-white/60 font-outfit leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Scroll indicator ──────────────────────────────── */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: '13rem' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  )
}
