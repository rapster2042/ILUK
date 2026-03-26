/*
# Add Custom Recipes Table

## 1. New Tables

### `custom_recipes`
Stores user-created custom recipes
- `id` (uuid, primary key)
- `user_id` (uuid, references user_profiles)
- `name` (text, not null) - Recipe name
- `prep_time` (text) - Preparation time
- `cost` (text) - Estimated cost
- `servings` (integer, default: 1) - Number of servings
- `ingredients` (jsonb) - Array of ingredient objects with item, amount1, amount2
- `instructions` (jsonb) - Array of instruction steps
- `created_at` (timestamptz, default: now())

## 2. Security
- No RLS enabled - public access via UUID
- Users can create and manage their own custom recipes

## 3. Notes
- Ingredients stored as JSON array: [{"item": "Pasta", "amount1": "100g", "amount2": "200g"}]
- Instructions stored as JSON array: ["Step 1", "Step 2"]
- Integrates with existing meal planning system
*/

CREATE TABLE IF NOT EXISTS custom_recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  prep_time text,
  cost text,
  servings integer DEFAULT 1,
  ingredients jsonb DEFAULT '[]'::jsonb,
  instructions jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);