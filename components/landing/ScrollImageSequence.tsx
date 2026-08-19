'use client'

import { useEffect, useRef, useState } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'

interface ScrollImageSequenceProps {
  /**
   * Array of image source paths.
   * Pass in your frames like:
   *   const frames = Array.from({ length: 120 }, (_, i) =>
   *     `/frames/frame${String(i + 1).padStart(3, '0')}.jpg`
   *   )
   * Then: <ScrollImageSequence frames={frames} scrollHeight="500vh" />
   */
  frames: string[]
  /** How tall the scroll container is (controls scroll animation speed) */
  scrollHeight?: string
  /** Optional CSS class for the outer wrapper */
  className?: string
}

export default function ScrollImageSequence({
  frames,
  scrollHeight = '400vh',
  className = '',
}: ScrollImageSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const imagesRef    = useRef<HTMLImageElement[]>([])
  const frameIndexRef = useRef(0)

  const [loaded, setLoaded] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Preload all frames
  useEffect(() => {
    if (frames.length === 0) return

    let loadedCount = 0
    const images: HTMLImageElement[] = []

    frames.forEach((src, i) => {
      const img = new Image()
      img.src = src
      img.onload = () => {
        loadedCount++
        setLoadProgress(Math.round((loadedCount / frames.length) * 100))
        if (loadedCount === frames.length) setLoaded(true)
      }
      img.onerror = () => {
        loadedCount++
        setLoadProgress(Math.round((loadedCount / frames.length) * 100))
        if (loadedCount === frames.length) setLoaded(true)
      }
      images[i] = img
    })

    imagesRef.current = images
  }, [frames])

  // Draw frame to canvas on scroll
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    return scrollYProgress.on('change', (progress) => {
      const idx = Math.min(
        Math.floor(progress * (frames.length - 1)),
        frames.length - 1
      )
      if (idx === frameIndexRef.current) return
      frameIndexRef.current = idx

      const img = imagesRef.current[idx]
      if (!img || !img.complete) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width  = img.naturalWidth  || 1280
      canvas.height = img.naturalHeight || 720
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
    })
  }, [scrollYProgress, frames.length])

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ height: scrollHeight }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-cream-50">
        {/* Loading bar */}
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-cream-50">
            <div className="w-64 h-1 bg-cream-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-sage-500 rounded-full"
                style={{ width: `${loadProgress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <p className="mt-4 text-sm text-charcoal-500 font-outfit">
              Loading frames… {loadProgress}%
            </p>
          </div>
        )}

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s' }}
        />

        {/* Gradient overlays for blending */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-cream-50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream-50 to-transparent" />
        </div>

        {/* Scroll hint */}
        {loaded && (
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <span className="text-xs text-charcoal-500 uppercase tracking-widest">Scroll</span>
            <motion.div
              className="w-0.5 h-8 bg-sage-400 origin-top"
              animate={{ scaleY: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        )}
      </div>
    </div>
  )
}
