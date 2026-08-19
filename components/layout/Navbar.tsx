'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChefHat, Menu, X, Refrigerator, PlusCircle, LogOut, LayoutDashboard } from 'lucide-react'

const publicLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
]

const authLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/add-recipe', label: 'Add Recipe', icon: PlusCircle },
  { href: '/dashboard/fridge-finder', label: 'Fridge Finder', icon: Refrigerator },
]

export default function Navbar({ isAuth = false }: { isAuth?: boolean }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isLanding = pathname === '/'

  const handleSignOut = async () => {
    // Basic sign out using client component fetch or supabase client
    // Since we don't have a supabase client imported here yet, we can do a standard POST to an auth route, 
    // or we can just import the client. For simplicity, we can use window.location.
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass border-b border-white/60 shadow-sm'
            : 'bg-transparent'
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="container-max section-padding">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <motion.div
                className="w-9 h-9 rounded-xl bg-sage-600 flex items-center justify-center"
                whileHover={{ rotate: 10, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <ChefHat className="w-5 h-5 text-white" />
              </motion.div>
              <div className="flex flex-col leading-tight">
                <span className="font-lora font-bold text-forest-900 text-sm italic">
                  Harshi&apos;s
                </span>
                <span className="font-outfit font-semibold text-sage-600 text-xs uppercase tracking-widest">
                  Recipes
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {isAuth
                ? authLinks.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`btn-ghost flex items-center gap-1.5 ${
                        pathname === href ? 'text-sage-600 bg-sage-50' : ''
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  ))
                : isLanding
                ? publicLinks.map(({ href, label }) => (
                    <a key={href} href={href} className="btn-ghost">
                      {label}
                    </a>
                  ))
                : null}
            </nav>

            {/* Auth buttons */}
            <div className="hidden md:flex items-center gap-3">
              {isAuth ? (
                <button onClick={handleSignOut} className="btn-ghost text-charcoal-600 flex items-center gap-1.5">
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              ) : (
                <>
                  <Link href="/login"   className="btn-ghost">Sign in</Link>
                  <Link href="/signup"  className="btn-primary px-5 py-2.5 text-sm rounded-xl">
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden btn-ghost p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.div key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 pt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass border-b border-white/60 px-4 py-6 space-y-2"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
            >
              {isAuth ? (
                <>
                  {authLinks.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-forest-900 hover:bg-sage-50"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Icon className="w-4 h-4 text-sage-600" />
                      {label}
                    </Link>
                  ))}
                  <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-blush-600 hover:bg-blush-50 mt-2 text-left">
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </>
              ) : (
                  <>
                    <Link href="/login"  className="block px-4 py-3 rounded-xl text-forest-900 hover:bg-sage-50" onClick={() => setMenuOpen(false)}>Sign in</Link>
                    <Link href="/signup" className="block btn-primary text-center rounded-xl" onClick={() => setMenuOpen(false)}>Get Started</Link>
                  </>
                )}
            </motion.div>
            <div className="flex-1 bg-black/20 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
