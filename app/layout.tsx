import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Harshi's Recipes — Clean Eating Recipe Vault",
  description: "Discover, create, and manage beautiful clean-eating recipes. Find recipes from ingredients you have, get healthy ingredient swaps, and build your personal recipe vault.",
  keywords: ['recipes', 'clean eating', 'healthy food', 'meal planning', 'cooking'],
  openGraph: {
    title: "Harshi's Recipes",
    description: 'Your personal clean-eating recipe vault',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-cream-50 text-forest-900 font-outfit antialiased">
        {children}
      </body>
    </html>
  )
}
