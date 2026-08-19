-- 1. Create custom types
CREATE TYPE category_enum AS ENUM ('Veg', 'Non-Veg');
CREATE TYPE meal_type_enum AS ENUM ('Breakfast', 'Snack', 'Lunch', 'Dinner', 'Dessert');

-- 2. Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger to automatically create a profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Recipes Table
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category category_enum NOT NULL,
  meal_type meal_type_enum NOT NULL,
  instructions TEXT[] NOT NULL DEFAULT '{}',
  estimated_calories NUMERIC,
  estimated_protein NUMERIC,
  estimated_carbs NUMERIC,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Ingredients Table
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL
);

-- Lowercase trigger for ingredients name
CREATE OR REPLACE FUNCTION public.lowercase_ingredient_name()
RETURNS TRIGGER AS $$
BEGIN
  NEW.name = LOWER(TRIM(NEW.name));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_lowercase_ingredient_name
  BEFORE INSERT OR UPDATE ON ingredients
  FOR EACH ROW EXECUTE FUNCTION public.lowercase_ingredient_name();

-- 5. Recipe_Ingredients Junction Table
CREATE TABLE recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
  quantity TEXT NOT NULL,
  amount NUMERIC,
  unit TEXT
);


-- --------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- --------------------------------------------------------

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read and update their own profile
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Recipes: Users can CRUD their own recipes
CREATE POLICY "Users can view own recipes" 
  ON recipes FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recipes" 
  ON recipes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipes" 
  ON recipes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipes" 
  ON recipes FOR DELETE USING (auth.uid() = user_id);

-- Ingredients: Anyone authenticated can read or insert ingredients
-- We don't restrict who can see ingredients since they are shared global entities
CREATE POLICY "Authenticated users can view ingredients" 
  ON ingredients FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert ingredients" 
  ON ingredients FOR INSERT TO authenticated WITH CHECK (true);

-- Recipe Ingredients: Inherit permissions from recipes (via user_id)
-- We need to join with recipes to check if the user owns the recipe
CREATE POLICY "Users can view own recipe ingredients" 
  ON recipe_ingredients FOR SELECT 
  USING (EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id AND user_id = auth.uid()));

CREATE POLICY "Users can insert own recipe ingredients" 
  ON recipe_ingredients FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id AND user_id = auth.uid()));

CREATE POLICY "Users can update own recipe ingredients" 
  ON recipe_ingredients FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id AND user_id = auth.uid()));

CREATE POLICY "Users can delete own recipe ingredients" 
  ON recipe_ingredients FOR DELETE 
  USING (EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id AND user_id = auth.uid()));


-- --------------------------------------------------------
-- FRIDGE FINDER RPC FUNCTION (Reverse Search)
-- --------------------------------------------------------

CREATE OR REPLACE FUNCTION find_recipes_by_available_ingredients(available_ingredients TEXT[])
RETURNS TABLE (
  recipe_id UUID,
  title TEXT,
  category category_enum,
  meal_type meal_type_enum,
  image_url TEXT,
  total_ingredients BIGINT,
  matching_ingredients BIGINT
) AS $$
BEGIN
  -- Convert the input array to a lowercase standard representation
  -- array_to_string / string_to_array to ensure we handle things uniformly
  -- We'll do the matching directly against the ingredients table
  
  RETURN QUERY
  WITH available_set AS (
    SELECT LOWER(TRIM(unnest(available_ingredients))) AS ing_name
  ),
  recipe_ing_stats AS (
    SELECT 
      r.id AS rec_id,
      r.title AS rec_title,
      r.category AS rec_category,
      r.meal_type AS rec_meal_type,
      r.image_url AS rec_image_url,
      COUNT(ri.id) AS total_ings,
      COUNT(a.ing_name) AS matched_ings
    FROM recipes r
    JOIN recipe_ingredients ri ON ri.recipe_id = r.id
    JOIN ingredients i ON i.id = ri.ingredient_id
    LEFT JOIN available_set a ON i.name = a.ing_name
    WHERE r.user_id = auth.uid() -- Only search the user's vault
    GROUP BY r.id, r.title, r.category, r.meal_type, r.image_url
  )
  SELECT 
    rec_id,
    rec_title,
    rec_category,
    rec_meal_type,
    rec_image_url,
    total_ings,
    matched_ings
  FROM recipe_ing_stats
  WHERE total_ings = matched_ings -- ONLY return recipes where ALL ingredients matched
  ORDER BY matched_ings DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
