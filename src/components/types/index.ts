export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export interface UserProfile {
  id: string;
  mood_tracking_enabled: boolean;
  voice_enabled: boolean;
  text_size: 'small' | 'medium' | 'large';
  contrast_mode: 'normal' | 'high' | 'low';
  reduced_motion: boolean;
  created_at: string;
  last_active: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category?: 'budgeting' | 'bills' | 'housework' | 'shopping' | 'learning';
  completed: boolean;
  completed_at?: string;
  created_at: string;
}

export interface MoodCheckin {
  id: string;
  user_id: string;
  mood: 'great' | 'good' | 'okay' | 'anxious' | 'struggling' | 'crisis';
  notes?: string;
  created_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  rent: number;
  food: number;
  bills: number;
  fun: number;
  other: number;
  total_income: number;
  updated_at: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  reminder_type?: 'bill' | 'maintenance' | 'task';
  due_date?: string;
  recurring: boolean;
  recurring_interval?: 'weekly' | 'monthly' | 'yearly';
  completed: boolean;
  created_at: string;
}

export interface ProgressBadge {
  id: string;
  user_id: string;
  badge_type: string;
  badge_name: string;
  earned_at: string;
}

export interface LearningProgress {
  id: string;
  user_id: string;
  module_name: 'budgeting' | 'bills' | 'rent' | 'benefits' | 'housework' | 'shopping' | 'learning';
  lesson_id: string;
  completed: boolean;
  completed_at?: string;
  created_at: string;
}

export interface ShoppingList {
  id: string;
  user_id: string;
  list_name: string;
  items: ShoppingItem[];
  created_at: string;
  updated_at: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity?: number;
  checked: boolean;
}

export interface CustomRecipe {
  id: string;
  user_id: string;
  name: string;
  prep_time?: string;
  cost?: string;
  servings: number;
  ingredients: { item: string; amount1: string; amount2: string }[];
  instructions: string[];
  created_at: string;
}

export interface MealPlan {
  id: string;
  user_id: string;
  day: string;
  meals: MealSlot[];
  created_at: string;
  updated_at: string;
}

export interface MealSlot {
  id: string;
  recipe: Recipe;
  servings: number;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: { item: string; amount1: string; amount2: string }[];
  instructions: string[];
  prepTime: string;
  cost: string;
  difficulty: 'Easy' | 'Very Easy' | 'Medium' | 'Hard';
  tags: string[];
  searchTerms: string[];
}

export interface RouteConfig {
  name: string;
  path: string;
  element: React.ReactNode;
  visible?: boolean;
}

export interface SmallWin {
  id: number;
  title: string;
  category: 'self-care' | 'financial' | 'household' | 'social' | 'learning' | 'health';
  created_at: string;
}

export interface UserSmallWinsHistory {
  id: string;
  user_uuid: string;
  small_win_id: number;
  shown_at: string;
  created_at: string;
}
