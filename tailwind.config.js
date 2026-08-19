/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50:  '#fdf5f7',
          100: '#f8f2f4',  // #F8F2F4
          200: '#f0dce3',
          300: '#e6b8c3',  // #E6B8C3
          400: '#c98fa3',  // #C98FA3 — primary accent
          500: '#b5788e',
          600: '#a06078',  // #A06078 — dark accent
          700: '#8a4f65',
          800: '#6d3a4e',
          900: '#3f2a33',  // #3F2A33
        },
        cream: {
          50:  '#faf8f3',  // page background (kept warm)
          100: '#f5f0e8',  // card background
          200: '#ece4d4',
          300: '#ddd0bc',
          400: '#c9b89c',
        },
        forest: {
          800: '#2e1f26',
          900: '#3f2a33',  // primary text (dark espresso)
        },
        blush: {
          100: '#fde8e5',
          200: '#fbd0ca',
          300: '#f5b8b0',  // non-veg accent
          400: '#ef9a8f',
          500: '#e67e72',
        },
        charcoal: {
          500: '#4a5568',
          600: '#3d4a5c',
          700: '#2d3748',  // secondary text
          800: '#1e2a3a',
        },
        gold: {
          300: '#f6d860',
          400: '#f0c84a',
          500: '#e8b020',
        },
      },
      fontFamily: {
        outfit: ['var(--font-outfit)', 'Outfit', 'sans-serif'],
        lora:   ['var(--font-lora)',   'Lora',   'serif'],
      },
      backgroundImage: {
        'sage-gradient':   'linear-gradient(135deg, #fdf5f7 0%, #f8f2f4 50%, #f0dce3 100%)',
        'hero-gradient':   'linear-gradient(135deg, #faf8f3 0%, #fdf5f7 40%, #f8f2f4 100%)',
        'card-gradient':   'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(253,245,247,0.8) 100%)',
        'dark-gradient':   'linear-gradient(135deg, #3f2a33 0%, #2e1f26 50%, #4a3039 100%)',
      },
      animation: {
        'fade-up':     'fadeUp 0.6s ease-out forwards',
        'fade-in':     'fadeIn 0.5s ease-out forwards',
        'shimmer':     'shimmer 2s infinite',
        'pulse-soft':  'pulseSoft 3s ease-in-out infinite',
        'float':       'float 6s ease-in-out infinite',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%':      { opacity: '1',   transform: 'scale(1.03)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'glass':     '0 8px 32px rgba(160, 96, 120, 0.12), inset 0 1px 0 rgba(255,255,255,0.6)',
        'glass-lg':  '0 20px 60px rgba(160, 96, 120, 0.18), inset 0 1px 0 rgba(255,255,255,0.7)',
        'card':      '0 4px 24px rgba(63, 42, 51, 0.08)',
        'card-hover':'0 16px 48px rgba(63, 42, 51, 0.16)',
        'sage':      '0 4px 20px rgba(160, 96, 120, 0.3)',
        'sage-lg':   '0 8px 40px rgba(160, 96, 120, 0.4)',
        'inset':     'inset 0 2px 8px rgba(63, 42, 51, 0.06)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
}
