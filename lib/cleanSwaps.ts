export interface CleanSwap {
  swap: string
  conversion: string
  reason: string
  emoji: string
}

/** Map of unhealthy ingredients → clean-eating alternatives with measurement conversions */
export const CLEAN_SWAPS: Record<string, CleanSwap> = {
  // Sweeteners
  'refined sugar':     { swap: 'Coconut Sugar',     conversion: '1:1 ratio',                   reason: 'Lower glycemic index, retains trace minerals',   emoji: '🥥' },
  'white sugar':       { swap: 'Coconut Sugar',     conversion: '1:1 ratio',                   reason: 'Lower glycemic index, natural caramel notes',    emoji: '🥥' },
  'brown sugar':       { swap: 'Coconut Sugar',     conversion: '1:1 ratio',                   reason: 'Deeper flavor, lower GI',                        emoji: '🥥' },
  'powdered sugar':    { swap: 'Blended Dates',     conversion: '¾ cup per 1 cup sugar',       reason: 'Whole-food sweetness with fiber',                 emoji: '🌴' },
  'corn syrup':        { swap: 'Pure Maple Syrup',  conversion: '¾ cup per 1 cup corn syrup', reason: 'Antioxidants, natural minerals',                  emoji: '🍁' },
  'artificial sweetener': { swap: 'Raw Honey',      conversion: '½ cup per 1 cup sugar',       reason: 'Natural enzymes and antioxidants',               emoji: '🍯' },

  // Dairy
  'heavy cream':       { swap: 'Full-Fat Coconut Cream', conversion: '1:1 ratio',              reason: 'Dairy-free, MCTs for sustained energy',          emoji: '🥥' },
  'heavy whipping cream': { swap: 'Full-Fat Coconut Cream', conversion: '1:1 ratio',           reason: 'Same richness, plant-based',                     emoji: '🥥' },
  'butter':            { swap: 'Cold-Pressed Coconut Oil or Avocado Oil', conversion: '¾ cup oil per 1 cup butter', reason: 'Healthy fats, higher smoke point', emoji: '🥑' },
  'margarine':         { swap: 'Grass-Fed Butter or Ghee',  conversion: '1:1 ratio',           reason: 'No trans fats, better fatty-acid profile',       emoji: '🌾' },
  'full-fat milk':     { swap: 'Oat Milk or Almond Milk', conversion: '1:1 ratio',             reason: 'Lower saturated fat, plant-based',               emoji: '🌾' },
  'cream cheese':      { swap: 'Cashew Cream Cheese', conversion: '1:1 ratio',                 reason: 'Whole-food fats, no additives',                  emoji: '🥜' },
  'sour cream':        { swap: 'Plain Greek Yogurt', conversion: '1:1 ratio',                  reason: 'More protein, probiotics, less fat',             emoji: '🥛' },

  // Flour & Grains
  'white flour':       { swap: 'Whole Wheat Flour or Almond Flour', conversion: '1:1 for WW · ¾ cup almond per 1 cup WF', reason: 'More fiber, protein, and nutrients', emoji: '🌾' },
  'all-purpose flour': { swap: 'Oat Flour',         conversion: '1⅓ cup oat per 1 cup AP',   reason: 'More fiber, whole grain',                        emoji: '🌾' },
  'white rice':        { swap: 'Brown Rice or Cauliflower Rice', conversion: '1:1 for brown · Steam cauliflower', reason: 'More fiber, lower glycemic', emoji: '🥦' },
  'white pasta':       { swap: 'Lentil or Chickpea Pasta', conversion: '1:1 ratio',            reason: 'More protein and fiber',                         emoji: '🫘' },
  'bread crumbs':      { swap: 'Almond Meal',       conversion: '1:1 ratio',                  reason: 'Grain-free, more protein',                       emoji: '🥜' },

  // Oils & Fats
  'vegetable oil':     { swap: 'Avocado Oil',       conversion: '1:1 ratio',                  reason: 'Heart-healthy monounsaturated fats, higher smoke point', emoji: '🥑' },
  'canola oil':        { swap: 'Cold-Pressed Olive Oil', conversion: '1:1 ratio',             reason: 'Anti-inflammatory, less processed',              emoji: '🫒' },
  'shortening':        { swap: 'Coconut Oil',       conversion: '1:1 ratio',                  reason: 'Natural saturated fat, no hydrogenation',        emoji: '🥥' },

  // Sauces & Condiments
  'mayonnaise':        { swap: 'Avocado Mayo or Hummus', conversion: '1:1 ratio',             reason: 'Healthier fats, no refined oils',                emoji: '🥑' },
  'ketchup':           { swap: 'Homemade Tomato Sauce', conversion: '1:1 ratio',              reason: 'No added sugar or preservatives',                emoji: '🍅' },
  'soy sauce':         { swap: 'Coconut Aminos',    conversion: '1:1 ratio',                  reason: 'Lower sodium, gluten-free',                      emoji: '🥥' },

  // Proteins
  'bacon':             { swap: 'Turkey Bacon or Tempeh Strips', conversion: '1:1 ratio',      reason: 'Less saturated fat, less sodium',                emoji: '🥩' },
  'ground beef':       { swap: 'Ground Turkey or Lentils', conversion: '1:1 ratio for turkey · ½ cup lentils per serving', reason: 'Leaner protein', emoji: '🥩' },

  // Sweetened drinks / misc
  'condensed milk':    { swap: 'Coconut Condensed Milk', conversion: '1:1 ratio',             reason: 'Dairy-free, lower sugar',                        emoji: '🥥' },
  'chocolate chips':   { swap: 'Cacao Nibs or Dark Choc Chips (70%+)', conversion: '1:1 ratio', reason: 'More antioxidants, less sugar',               emoji: '🍫' },
}

/** Returns the clean swap if the ingredient name contains a known unhealthy key (fuzzy match) */
export function getCleanSwap(ingredientName: string): (CleanSwap & { original: string }) | null {
  const lower = ingredientName.toLowerCase().trim()
  if (!lower || lower.length < 3) return null

  for (const [key, value] of Object.entries(CLEAN_SWAPS)) {
    if (lower.includes(key) || key.includes(lower)) {
      return { ...value, original: key }
    }
  }
  return null
}
