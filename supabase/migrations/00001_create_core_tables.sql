/*
# Create Core Tables for Independent Life UK

## 1. New Tables

### `user_profiles`
Stores anonymous user profiles with UUID-based identification
- `id` (uuid, primary key) - Anonymous user identifier
- `mood_tracking_enabled` (boolean, default: true) - Whether user wants mood tracking
- `voice_enabled` (boolean, default: false) - Voice narration preference
- `text_size` (text, default: 'medium') - Text size preference (small/medium/large)
- `contrast_mode` (text, default: 'normal') - Contrast preference (normal/high/low)
- `reduced_motion` (boolean, default: false) - Reduced motion preference
- `created_at` (timestamptz, default: now())
- `last_active` (timestamptz, default: now())

### `tasks`
Stores daily task suggestions and completions
- `id` (uuid, primary key)
- `user_id` (uuid, references user_profiles)
- `title` (text, not null)
- `description` (text)
- `category` (text) - budgeting/bills/housework/shopping/learning
- `completed` (boolean, default: false)
- `completed_at` (timestamptz)
- `created_at` (timestamptz, default: now())

### `mood_checkins`
Tracks user mood over time
- `id` (uuid, primary key)
- `user_id` (uuid, references user_profiles)
- `mood` (text, not null) - great/good/okay/struggling/crisis
- `notes` (text)
- `created_at` (timestamptz, default: now())

### `budgets`
Stores user budget allocations
- `id` (uuid, primary key)
- `user_id` (uuid, references user_profiles)
- `rent` (numeric, default: 0)
- `food` (numeric, default: 0)
- `bills` (numeric, default: 0)
- `fun` (numeric, default: 0)
- `other` (numeric, default: 0)
- `total_income` (numeric, default: 0)
- `updated_at` (timestamptz, default: now())

### `reminders`
Stores user reminders for bills and tasks
- `id` (uuid, primary key)
- `user_id` (uuid, references user_profiles)
- `title` (text, not null)
- `description` (text)
- `reminder_type` (text) - bill/maintenance/task
- `due_date` (date)
- `recurring` (boolean, default: false)
- `recurring_interval` (text) - weekly/monthly/yearly
- `completed` (boolean, default: false)
- `created_at` (timestamptz, default: now())

### `progress_badges`
Tracks earned badges and achievements
- `id` (uuid, primary key)
- `user_id` (uuid, references user_profiles)
- `badge_type` (text, not null) - first_bill/asked_help/budget_created/etc
- `badge_name` (text, not null)
- `earned_at` (timestamptz, default: now())

### `learning_progress`
Tracks progress through educational modules
- `id` (uuid, primary key)
- `user_id` (uuid, references user_profiles)
- `module_name` (text, not null) - budgeting/bills/rent/benefits/housework/shopping
- `lesson_id` (text, not null)
- `completed` (boolean, default: false)
- `completed_at` (timestamptz)
- `created_at` (timestamptz, default: now())

### `shopping_lists`
Stores user shopping lists
- `id` (uuid, primary key)
- `user_id` (uuid, references user_profiles)
- `list_name` (text, not null)
- `items` (jsonb, default: '[]') - Array of shopping items
- `created_at` (timestamptz, default: now())
- `updated_at` (timestamptz, default: now())

## 2. Security
- No RLS enabled - this is a public tool where users manage their own data via UUID
- All tables are accessible to anyone with a valid UUID
- No authentication required - anonymous UUID-based access

## 3. Notes
- Using UUID-based anonymous user system
- No authentication or login required
- Users identified by UUID stored in localStorage
- All data is user-specific but publicly accessible via UUID
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mood_tracking_enabled boolean DEFAULT true,
  voice_enabled boolean DEFAULT false,
  text_size text DEFAULT 'medium',
  contrast_mode text DEFAULT 'normal',
  reduced_motion boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  last_active timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create mood_checkins table
CREATE TABLE IF NOT EXISTS mood_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  mood text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  rent numeric DEFAULT 0,
  food numeric DEFAULT 0,
  bills numeric DEFAULT 0,
  fun numeric DEFAULT 0,
  other numeric DEFAULT 0,
  total_income numeric DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Create reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  reminder_type text,
  due_date date,
  recurring boolean DEFAULT false,
  recurring_interval text,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create progress_badges table
CREATE TABLE IF NOT EXISTS progress_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  badge_type text NOT NULL,
  badge_name text NOT NULL,
  earned_at timestamptz DEFAULT now()
);

-- Create learning_progress table
CREATE TABLE IF NOT EXISTS learning_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  module_name text NOT NULL,
  lesson_id text NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create shopping_lists table
CREATE TABLE IF NOT EXISTS shopping_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  list_name text NOT NULL,
  items jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_mood_checkins_user_id ON mood_checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_due_date ON reminders(due_date);
CREATE INDEX IF NOT EXISTS idx_progress_badges_user_id ON progress_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_user_id ON learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_shopping_lists_user_id ON shopping_lists(user_id);