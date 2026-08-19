# Harshi's Recipes — Clean Eating Recipe Vault

Harshi's Recipes is a premium, beautifully designed full-stack web application for curating, managing, and discovering clean-eating recipes. Built with a focus on stunning UI/UX, it features seamless authentication, a "Clean-Swap" smart ingredient suggestion engine, and a "Fridge Finder" to match on-hand ingredients with saved recipes.

## ✨ Features

- **Beautiful, Premium UI:** Built with Next.js, Tailwind CSS, and Framer Motion for a "fresh, healthy, and clean" aesthetic.
- **Recipe Vault:** Securely store your personal clean-eating recipes, categorised by Veg/Non-Veg and Meal Type.
- **Smart Clean-Swaps:** The ingredient input form automatically detects unhealthy ingredients (like refined sugar or heavy cream) and suggests healthy, measurement-accurate alternatives in real-time.
- **Fridge Finder:** Enter the ingredients you currently have in your kitchen to instantly discover matching recipes from your vault.
- **Supabase Authentication:** Secure, robust user sign-up and login flow.
- **Server Actions:** Fully server-side data fetching and mutation using Next.js App Router for optimal performance.

## 🛠 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL + Row Level Security)
- **Deployment:** [Vercel](https://vercel.com)

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/your-username/harshis-recipes.git
cd harshis-recipes
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Supabase
1. Create a new project on [Supabase](https://supabase.com).
2. Go to your project's SQL Editor and run the migration script located at `supabase/migrations/00_initial_schema.sql` to set up the tables and Row Level Security.
3. Get your project URL and Anon Key from the Supabase dashboard (Project Settings > API).

### 4. Configure Environment Variables
Rename the provided `.env.local.template` file to `.env.local` and add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Deployment (Vercel)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to a GitHub repository.
2. Log into Vercel and click **Add New Project**.
3. Import your GitHub repository.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**.

## 🎨 Design System
The app uses a custom color palette defined in `tailwind.config.ts`:
- **Cream:** Backgrounds and soft borders (`#FDFBF7`, etc.)
- **Sage:** Primary accents and buttons (`#86A789`, `#4A7C5E`)
- **Blush/Dusty Rose:** Warm highlights (`#F5B8B0`, `#C98FA3`)
- **Forest:** Headings and deep contrast text (`#1A2E22`)

---
*Crafted for a cleaner, healthier kitchen.*
