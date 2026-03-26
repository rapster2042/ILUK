import { supabase } from './supabase';
import type {
  UserProfile,
  Task,
  MoodCheckin,
  Budget,
  Reminder,
  ProgressBadge,
  LearningProgress,
  ShoppingList,
  CustomRecipe,
  MealPlan,
  MealSlot,
  SmallWin
} from '@/types';

export const getUserId = (): string => {
  let userId = localStorage.getItem('independent_life_user_id');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('independent_life_user_id', userId);
  }
  return userId;
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  return data;
};

export const createUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert([{ id: userId }])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating user profile:', error);
    return null;
  }
  return data;
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ ...updates, last_active: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
  return data;
};

export const getTasks = async (userId: string, completed?: boolean): Promise<Task[]> => {
  let query = supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (completed !== undefined) {
    query = query.eq('completed', completed);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
};

export const createTask = async (
  userId: string,
  task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'completed' | 'completed_at'>
): Promise<Task | null> => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ ...task, user_id: userId }])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating task:', error);
    return null;
  }
  return data;
};

export const updateTask = async (
  taskId: string,
  updates: Partial<Task>
): Promise<Task | null> => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating task:', error);
    return null;
  }
  return data;
};

export const deleteTask = async (taskId: string): Promise<boolean> => {
  const { error } = await supabase.from('tasks').delete().eq('id', taskId);

  if (error) {
    console.error('Error deleting task:', error);
    return false;
  }
  return true;
};

/**
 * Creates a completed task for a significant action and checks for badges
 * This ensures all major actions count toward task completion and first task badge
 * 
 * @param userId - The user's ID
 * @param title - The task title (e.g., "Created your first budget")
 * @param description - The task description
 * @param category - The task category
 * @returns The created task or null if failed
 */
export const createCompletedTaskForAction = async (
  userId: string,
  title: string,
  description: string,
  category: Task['category']
): Promise<Task | null> => {
  console.log(`[Task Creation] Creating completed task: ${title}`);
  
  // Create the task
  const task = await createTask(userId, {
    title,
    description,
    category
  });
  
  if (!task) {
    console.error('[Task Creation] Failed to create task');
    return null;
  }
  
  // Mark it as completed immediately
  const { data, error } = await supabase
    .from('tasks')
    .update({
      completed: true,
      completed_at: new Date().toISOString()
    })
    .eq('id', task.id)
    .select()
    .maybeSingle();
  
  if (error) {
    console.error('[Task Creation] Error marking task as completed:', error);
    return task; // Return the task even if update failed
  }
  
  console.log('[Task Creation] Task created and marked as completed');
  
  // Check for badges (including first_task)
  await checkAndAwardBadges(userId);
  
  return data || task;
};

export const getMoodCheckins = async (userId: string, limit = 30): Promise<MoodCheckin[]> => {
  const { data, error } = await supabase
    .from('mood_checkins')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching mood checkins:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
};

export const createMoodCheckin = async (
  userId: string,
  mood: MoodCheckin['mood'],
  notes?: string
): Promise<MoodCheckin | null> => {
  const { data, error } = await supabase
    .from('mood_checkins')
    .insert([{ user_id: userId, mood, notes }])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating mood checkin:', error);
    return null;
  }
  return data;
};

export const getBudget = async (userId: string): Promise<Budget | null> => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching budget:', error);
    return null;
  }
  return data;
};

export const createOrUpdateBudget = async (
  userId: string,
  budget: Omit<Budget, 'id' | 'user_id' | 'updated_at'>
): Promise<Budget | null> => {
  const existing = await getBudget(userId);

  if (existing) {
    const { data, error } = await supabase
      .from('budgets')
      .update({ ...budget, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating budget:', error);
      return null;
    }
    return data;
  }

  const { data, error } = await supabase
    .from('budgets')
    .insert([{ ...budget, user_id: userId }])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating budget:', error);
    return null;
  }
  return data;
};

export const getReminders = async (userId: string, completed?: boolean): Promise<Reminder[]> => {
  let query = supabase
    .from('reminders')
    .select('*')
    .eq('user_id', userId)
    .order('due_date', { ascending: true });

  if (completed !== undefined) {
    query = query.eq('completed', completed);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching reminders:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
};

export const createReminder = async (
  userId: string,
  reminder: Omit<Reminder, 'id' | 'user_id' | 'created_at' | 'completed'>
): Promise<Reminder | null> => {
  const { data, error } = await supabase
    .from('reminders')
    .insert([{ ...reminder, user_id: userId }])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating reminder:', error);
    return null;
  }
  return data;
};

export const updateReminder = async (
  reminderId: string,
  updates: Partial<Reminder>
): Promise<Reminder | null> => {
  const { data, error } = await supabase
    .from('reminders')
    .update(updates)
    .eq('id', reminderId)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating reminder:', error);
    return null;
  }
  return data;
};

export const deleteReminder = async (reminderId: string): Promise<boolean> => {
  const { error } = await supabase.from('reminders').delete().eq('id', reminderId);

  if (error) {
    console.error('Error deleting reminder:', error);
    return false;
  }
  return true;
};

export const getProgressBadges = async (userId: string): Promise<ProgressBadge[]> => {
  const { data, error } = await supabase
    .from('progress_badges')
    .select('*')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false });

  if (error) {
    console.error('Error fetching progress badges:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
};

export const awardBadge = async (
  userId: string,
  badgeType: string,
  badgeName: string
): Promise<ProgressBadge | null> => {
  // Use upsert with onConflict to prevent duplicates
  const { data, error } = await supabase
    .from('progress_badges')
    .upsert(
      { user_id: userId, badge_type: badgeType, badge_name: badgeName },
      { onConflict: 'user_id,badge_type', ignoreDuplicates: true }
    )
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error awarding badge:', error);
    return null;
  }
  return data;
};

export const checkAndAwardBadges = async (userId: string): Promise<void> => {
  try {
    console.log('[Badge Check] Starting badge check for user:', userId);
    
    // Get all user data
    const [tasks, learningProgress, badges] = await Promise.all([
      getTasks(userId),
      getLearningProgress(userId),
      getProgressBadges(userId)
    ]);

    console.log('[Badge Check] Total tasks:', tasks.length);
    console.log('[Badge Check] Completed tasks:', tasks.filter(t => t.completed).length);
    console.log('[Badge Check] Current badges:', badges.map(b => b.badge_type));

    const earnedBadgeTypes = badges.map(b => b.badge_type);

    // Check for first task badge
    const completedTasks = tasks.filter(t => t.completed);
    console.log('[Badge Check] Checking first_task badge. Completed:', completedTasks.length, 'Has badge:', earnedBadgeTypes.includes('first_task'));
    
    if (completedTasks.length >= 1 && !earnedBadgeTypes.includes('first_task')) {
      console.log('[Badge Check] Awarding first_task badge!');
      const result = await awardBadge(userId, 'first_task', 'First Task');
      console.log('[Badge Check] first_task badge result:', result);
    }

    // Check for learning started badge
    const completedLessons = learningProgress.filter(l => l.completed);
    if (completedLessons.length >= 1 && !earnedBadgeTypes.includes('learning_started')) {
      console.log('[Badge Check] Awarding learning_started badge!');
      await awardBadge(userId, 'learning_started', 'Learning Journey');
    }

    // Check for bills learned badge (3 lessons in bills/energy module)
    const billsLessons = learningProgress.filter(
      l => l.completed && (l.module_name === 'bills' || l.lesson_id?.includes('energy'))
    );
    if (billsLessons.length >= 3 && !earnedBadgeTypes.includes('bills_learned')) {
      console.log('[Badge Check] Awarding bills_learned badge!');
      await awardBadge(userId, 'bills_learned', 'Bills Expert');
    }

    // Check for week streak badge (tasks completed on 7 different days)
    if (completedTasks.length >= 7) {
      const uniqueDays = new Set(
        completedTasks.map(t => new Date(t.completed_at || t.created_at).toDateString())
      );
      if (uniqueDays.size >= 7 && !earnedBadgeTypes.includes('week_streak')) {
        console.log('[Badge Check] Awarding week_streak badge!');
        await awardBadge(userId, 'week_streak', 'Week Warrior');
      }
    }
    
    console.log('[Badge Check] Badge check complete');
  } catch (error) {
    console.error('[Badge Check] Error checking badges:', error);
  }
};

export const getLearningProgress = async (
  userId: string,
  moduleName?: string
): Promise<LearningProgress[]> => {
  let query = supabase
    .from('learning_progress')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (moduleName) {
    query = query.eq('module_name', moduleName);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching learning progress:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
};

export const updateLearningProgress = async (
  userId: string,
  moduleName: string,
  lessonId: string,
  completed: boolean
): Promise<LearningProgress | null> => {
  const existing = await supabase
    .from('learning_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('module_name', moduleName)
    .eq('lesson_id', lessonId)
    .maybeSingle();

  if (existing.data) {
    const { data, error } = await supabase
      .from('learning_progress')
      .update({
        completed,
        completed_at: completed ? new Date().toISOString() : null
      })
      .eq('id', existing.data.id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating learning progress:', error);
      return null;
    }
    return data;
  }

  const { data, error } = await supabase
    .from('learning_progress')
    .insert([{
      user_id: userId,
      module_name: moduleName,
      lesson_id: lessonId,
      completed,
      completed_at: completed ? new Date().toISOString() : null
    }])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating learning progress:', error);
    return null;
  }
  return data;
};

export const getShoppingLists = async (userId: string): Promise<ShoppingList[]> => {
  const { data, error } = await supabase
    .from('shopping_lists')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching shopping lists:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
};

export const createShoppingList = async (
  userId: string,
  listName: string
): Promise<ShoppingList | null> => {
  const { data, error } = await supabase
    .from('shopping_lists')
    .insert([{ user_id: userId, list_name: listName, items: [] }])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating shopping list:', error);
    return null;
  }
  return data;
};

export const updateShoppingList = async (
  listId: string,
  updates: Partial<ShoppingList>
): Promise<ShoppingList | null> => {
  const { data, error } = await supabase
    .from('shopping_lists')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', listId)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating shopping list:', error);
    return null;
  }
  return data;
};

export const deleteShoppingList = async (listId: string): Promise<boolean> => {
  const { error } = await supabase.from('shopping_lists').delete().eq('id', listId);

  if (error) {
    console.error('Error deleting shopping list:', error);
    return false;
  }
  return true;
};

export const getCustomRecipes = async (userId: string): Promise<CustomRecipe[]> => {
  const { data, error } = await supabase
    .from('custom_recipes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching custom recipes:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
};

export const createCustomRecipe = async (
  userId: string,
  recipe: Omit<CustomRecipe, 'id' | 'user_id' | 'created_at'>
): Promise<CustomRecipe | null> => {
  const { data, error } = await supabase
    .from('custom_recipes')
    .insert([{ ...recipe, user_id: userId }])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating custom recipe:', error);
    return null;
  }
  return data;
};

export const updateCustomRecipe = async (
  recipeId: string,
  updates: Partial<CustomRecipe>
): Promise<CustomRecipe | null> => {
  const { data, error } = await supabase
    .from('custom_recipes')
    .update(updates)
    .eq('id', recipeId)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating custom recipe:', error);
    return null;
  }
  return data;
};

export const deleteCustomRecipe = async (recipeId: string): Promise<boolean> => {
  const { error } = await supabase.from('custom_recipes').delete().eq('id', recipeId);

  if (error) {
    console.error('Error deleting custom recipe:', error);
    return false;
  }
  return true;
};

export const getMealPlans = async (userId: string): Promise<MealPlan[]> => {
  const { data, error } = await supabase
    .from('meal_plans')
    .select('*')
    .eq('user_id', userId)
    .order('day', { ascending: true });

  if (error) {
    console.error('Error fetching meal plans:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
};

export const saveMealPlan = async (
  userId: string,
  day: string,
  meals: MealSlot[]
): Promise<MealPlan | null> => {
  const { data, error } = await supabase
    .from('meal_plans')
    .upsert(
      {
        user_id: userId,
        day,
        meals,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'user_id,day' }
    )
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error saving meal plan:', error);
    return null;
  }
  return data;
};

export const deleteMealPlan = async (userId: string, day: string): Promise<boolean> => {
  const { error } = await supabase
    .from('meal_plans')
    .delete()
    .eq('user_id', userId)
    .eq('day', day);

  if (error) {
    console.error('Error deleting meal plan:', error);
    return false;
  }
  return true;
};

export const createMealPlanShoppingList = async (
  userId: string,
  items: { name: string; quantity?: number }[]
): Promise<ShoppingList | null> => {
  const shoppingItems = items.map(item => ({
    id: crypto.randomUUID(),
    name: item.name,
    quantity: item.quantity,
    checked: false
  }));

  const existingLists = await getShoppingLists(userId);
  const mealPlanList = existingLists.find(list => list.list_name === 'Meal Plan Shopping List');

  if (mealPlanList) {
    return await updateShoppingList(mealPlanList.id, {
      items: shoppingItems,
      updated_at: new Date().toISOString()
    });
  } else {
    return await createShoppingListWithItems(userId, 'Meal Plan Shopping List', shoppingItems);
  }
};

export const createShoppingListWithItems = async (
  userId: string,
  listName: string,
  items: { id: string; name: string; quantity?: number; checked: boolean }[]
): Promise<ShoppingList | null> => {
  const { data, error } = await supabase
    .from('shopping_lists')
    .insert([{ user_id: userId, list_name: listName, items }])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating shopping list with items:', error);
    return null;
  }
  return data;
};

// Small Wins API
export const getDailySmallWins = async (userUuid: string, count: number = 3) => {
  const { data, error } = await supabase
    .rpc('get_daily_small_wins', {
      p_user_uuid: userUuid,
      p_count: count
    });

  if (error) {
    console.error('Error fetching daily small wins:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
};

export const recordShownWins = async (userUuid: string, winIds: number[]) => {
  const { error } = await supabase
    .rpc('record_shown_wins', {
      p_user_uuid: userUuid,
      p_win_ids: winIds
    });

  if (error) {
    console.error('Error recording shown wins:', error);
  }
};
