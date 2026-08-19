'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  accent?: 'sage' | 'gold' | 'blush'
  index?: number
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  accent = 'sage',
  index = 0,
}: FeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const accentStyles: Record<string, { wrap: string; icon: string }> = {
    sage:  { wrap: 'bg-sage-100 border-sage-200',   icon: 'text-sage-600'  },
    blush: { wrap: 'bg-blush-100 border-blush-300', icon: 'text-blush-500' },
    gold:  { wrap: 'bg-yellow-50 border-yellow-200',icon: 'text-yellow-600'},
  }

  const styles = accentStyles[accent] ?? accentStyles.sage

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="card p-8 group cursor-default transition-all duration-300"
    >
      {/* Icon */}
      <div className={`inline-flex items-center justify-center w-13 h-13 w-12 h-12 rounded-2xl border mb-6 group-hover:scale-110 transition-transform duration-300 ${styles.wrap}`}>
        <Icon className={`w-5 h-5 ${styles.icon}`} strokeWidth={1.75} />
      </div>

      {/* Title */}
      <h3 className="text-xl font-outfit font-bold text-forest-900 mb-3">{title}</h3>

      {/* Description */}
      <p className="text-charcoal-600 font-outfit font-light leading-relaxed text-sm">
        {description}
      </p>

      {/* Accent line */}
      <motion.div
        className="mt-6 h-0.5 rounded-full bg-gradient-to-r from-sage-300 to-sage-100"
        initial={{ scaleX: 0, originX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, delay: index * 0.15 + 0.3 }}
      />
    </motion.div>
  )
}
