'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ChefHat, ArrowRight, AlertCircle, User, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]
  const score = checks.filter(Boolean).length
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['', '#c98fa3', '#f0c84a', '#b5788e', '#a06078']

  if (!password) return null

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="mt-2 space-y-1.5"
    >
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: i <= score ? colors[score] : '#ece4d4' }}
          />
        ))}
      </div>
      {score > 0 && (
        <p className="text-xs font-outfit" style={{ color: colors[score] }}>
          {labels[score]} password
        </p>
      )}
    </motion.div>
  )
}

export default function SignupPage() {
  const router = useRouter()
  const [name,       setName]       = useState('')
  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [confirmPw,  setConfirmPw]  = useState('')
  const [agreed,     setAgreed]     = useState(false)
  const [showPw,     setShowPw]     = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')
  const [shake,      setShake]      = useState(false)
  const [success,    setSuccess]    = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (password !== confirmPw) {
      setError('Passwords do not match.')
      setShake(true)
      setTimeout(() => setShake(false), 600)
      return
    }
    if (!agreed) {
      setError('Please accept the terms to continue.')
      return
    }

    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      setShake(true)
      setTimeout(() => setShake(false), 600)
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/'), 2500)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-sm px-6"
        >
          <motion.div
            className="w-20 h-20 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-6"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 0.6, repeat: 2 }}
          >
            <CheckCircle2 className="w-10 h-10 text-sage-600" />
          </motion.div>
          <h2 className="text-2xl font-outfit font-black text-forest-900 mb-2">
            Account created!
          </h2>
          <p className="text-charcoal-500 font-outfit text-sm leading-relaxed">
            Check your email to confirm your account. Taking you to the home page shortly.
          </p>
        </motion.div>
      </div>
    )
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
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #c98fa3 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #e6b8c3 0%, transparent 70%)' }} />

        <div className="relative z-10 text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-sage-600 flex items-center justify-center mx-auto mb-8">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-outfit font-black text-white mb-4 leading-tight">
            Start your clean<br />
            <span className="text-sage-300">eating journey.</span>
          </h2>
          <p className="text-white/50 font-outfit font-light text-sm leading-relaxed max-w-xs mx-auto">
            Build your personal recipe collection with smart ingredient swaps and a fridge-to-table finder.
          </p>

          {/* Feature checklist */}
          <div className="mt-10 space-y-3 text-left">
            {[
              'Unlimited recipe storage',
              'Real-time clean ingredient swaps',
              'Fridge Finder — cook from what you have',
              'Veg and Non-Veg categorisation',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-sage-400 flex-shrink-0" />
                <span className="text-white/60 text-sm font-outfit">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Right: Signup form ─────────────────────────────── */}
      <motion.div
        className="flex-1 flex items-center justify-center p-6 lg:p-16 bg-white overflow-y-auto"
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="w-full max-w-sm py-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-sage-600 flex items-center justify-center">
              <ChefHat className="w-4 h-4 text-white" />
            </div>
            <span className="font-lora font-bold text-forest-900 italic">Harshi&apos;s Recipes</span>
          </div>

          <h1 className="text-3xl font-outfit font-black text-forest-900 mb-1">Create account</h1>
          <p className="text-charcoal-500 font-outfit text-sm mb-8">
            Already have one?{' '}
            <Link href="/login" className="text-sage-600 font-semibold hover:underline">Sign in</Link>
          </p>

          <motion.form
            onSubmit={handleSubmit}
            animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="signup-name" className="block text-xs font-outfit font-semibold text-charcoal-700 uppercase tracking-wider">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 pointer-events-none" />
                <input
                  id="signup-name"
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your full name"
                  className="input-clean pl-11"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="signup-email" className="block text-xs font-outfit font-semibold text-charcoal-700 uppercase tracking-wider">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 pointer-events-none" />
                <input
                  id="signup-email"
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
              <label htmlFor="signup-password" className="block text-xs font-outfit font-semibold text-charcoal-700 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 pointer-events-none" />
                <input
                  id="signup-password"
                  type={showPw ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
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
              <PasswordStrength password={password} />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="signup-confirm-password" className="block text-xs font-outfit font-semibold text-charcoal-700 uppercase tracking-wider">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400 pointer-events-none" />
                <input
                  id="signup-confirm-password"
                  type="password"
                  required
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                  placeholder="Re-enter your password"
                  className={`input-clean pl-11 ${
                    confirmPw && confirmPw !== password ? 'border-blush-300 focus:border-blush-300' : ''
                  }`}
                />
              </div>
              {confirmPw && confirmPw !== password && (
                <p className="text-xs text-blush-500 font-outfit">Passwords do not match</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 pt-1">
              <motion.button
                type="button"
                id="signup-terms"
                onClick={() => setAgreed(!agreed)}
                className={`w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 transition-all duration-200 flex items-center justify-center ${
                  agreed ? 'bg-sage-600 border-sage-600' : 'border-cream-300 bg-white'
                }`}
                whileTap={{ scale: 0.9 }}
                aria-checked={agreed}
                role="checkbox"
              >
                {agreed && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    viewBox="0 0 12 10"
                    className="w-3 h-3"
                  >
                    <polyline points="1 5 4.5 8.5 11 1" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </motion.svg>
                )}
              </motion.button>
              <span className="text-xs text-charcoal-500 font-outfit leading-relaxed">
                I agree to the{' '}
                <Link href="#" className="text-sage-600 hover:underline">Terms of Service</Link>{' '}
                and{' '}
                <Link href="#" className="text-sage-600 hover:underline">Privacy Policy</Link>
              </span>
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
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-xl"
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
                  Create account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.form>
        </div>
      </motion.div>
    </div>
  )
}
