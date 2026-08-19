'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ChefHat, ArrowRight, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [shake,    setShake]    = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      setShake(true)
      setTimeout(() => setShake(false), 600)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left decorative panel ─────────────────────────── */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 bg-dark-gradient items-center justify-center p-16 relative overflow-hidden"
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #c98fa3 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #e6b8c3 0%, transparent 70%)' }} />

        <div className="relative z-10 text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-sage-600 flex items-center justify-center mx-auto mb-8">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-outfit font-black text-white mb-4 leading-tight">
            Welcome back to<br />
            <span className="text-sage-300">Harshi&apos;s Kitchen.</span>
          </h2>
          <p className="text-white/50 font-outfit font-light text-sm leading-relaxed">
            Sign in to access your personal recipe vault, smart ingredient swaps, and fridge-to-table finder.
          </p>

          {/* Decorative card */}
          <motion.div
            className="mt-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 text-left"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-sage-600/30 flex items-center justify-center flex-shrink-0">
                <ChefHat className="w-5 h-5 text-sage-300" />
              </div>
              <div>
                <div className="text-white text-sm font-outfit font-semibold">Quinoa Buddha Bowl</div>
                <div className="text-white/40 text-xs font-outfit">Lunch · Veg · 420 kcal</div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['Quinoa', 'Avocado', 'Chickpeas'].map(t => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-sage-600/20 text-sage-300 font-outfit">{t}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Right: Login form ──────────────────────────────── */}
      <motion.div
        className="flex-1 flex items-center justify-center p-6 lg:p-16 bg-white"
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-sage-600 flex items-center justify-center">
              <ChefHat className="w-4 h-4 text-white" />
            </div>
            <span className="font-lora font-bold text-forest-900 italic">Harshi&apos;s Recipes</span>
          </div>

          <h1 className="text-3xl font-outfit font-black text-forest-900 mb-1">Sign in</h1>
          <p className="text-charcoal-500 font-outfit text-sm mb-8">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-sage-600 font-semibold hover:underline">Create one</Link>
          </p>

          <motion.form
            onSubmit={handleSubmit}
            animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="block text-xs font-outfit font-semibold text-charcoal-700 uppercase tracking-wider">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-clean pl-11"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="block text-xs font-outfit font-semibold text-charcoal-700 uppercase tracking-wider">
                  Password
                </label>
                <Link href="#" className="text-xs text-sage-600 hover:underline font-outfit">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-clean pl-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600 transition-colors"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-blush-100 border border-blush-300 text-blush-500 text-sm font-outfit"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-xl mt-2"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <motion.div
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-cream-200" />
            <span className="text-xs text-charcoal-400 font-outfit">or continue with</span>
            <div className="flex-1 h-px bg-cream-200" />
          </div>

          {/* Google */}
          <button
            id="login-google"
            className="btn-secondary w-full py-3.5 rounded-xl flex items-center justify-center gap-3"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </motion.div>
    </div>
  )
}
