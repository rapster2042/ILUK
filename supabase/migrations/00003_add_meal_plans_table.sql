/*
# Add Meal Plans Table

## Purpose
Store user meal plans for the week with persistence across sessions.

## Tables

### meal_plans
- `id` (uuid, primary key): Unique identifier for each meal plan entry
- `user_id` (text, not null): Anonymous user identifier (UUID stored in localStorage)
- `day` (text, not null): Day of the week (Monday-Sunday)
- `meals` (jsonb, not null, default '[]'): Array of meal slots with recipe and servings data
- `created_at` (timestamptz): When the meal plan was created
- `updated_at` (timestamptz): When the meal plan was last updated

## Indexes
- Unique index on (user_id, day) to ensure one meal plan per day per user
- Index on user_id for fast lookups

## Security
- No RLS (Row Level Security) enabled - public access for anonymous users
- All users can read and modify their own meal plans based on user_id

## Notes
- Meals are stored as JSONB array containing: id, recipe object, servings
- One row per user per day
- Updates replace the entire meals array for that day
*/

CREATE TABLE IF NOT EXISTS meal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  day text NOT NULL,
  meals jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_day UNIQUE (user_id, day)
);

CREATE INDEX idx_meal_plans_user_id ON meal_plans(user_id);
CREATE INDEX idx_meal_plans_updated_at ON meal_plans(updated_at DESC);