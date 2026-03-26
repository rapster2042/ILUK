import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Circle, 
  Smile, 
  Meh, 
  Frown, 
  AlertCircle, 
  Heart, 
  Zap, 
  Award, 
  TrendingUp,
  Wallet,
  FileText,
  Home as HomeIcon,
  UtensilsCrossed,
  ShoppingCart,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getUserId, getTasks, createTask, updateTask, createMoodCheckin, getMoodCheckins, getUserProfile, createUserProfile, checkAndAwardBadges, getDailySmallWins, recordShownWins, getProgressBadges } from '@/db/api';
import type { Task, MoodCheckin, SmallWin } from '@/types';

const moodOptions = [
  { value: 'great', label: 'Great', icon: Smile, color: 'text-success' },
  { value: 'good', label: 'Good', icon: Smile, color: 'text-primary' },
  { value: 'okay', label: 'Okay', icon: Meh, color: 'text-warning' },
  { value: 'anxious', label: 'Anxious', icon: Zap, color: 'text-warning' },
  { value: 'struggling', label: 'Struggling', icon: Frown, color: 'text-destructive' },
  { value: 'crisis', label: 'Crisis', icon: AlertCircle, color: 'text-crisis' },
];

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState<MoodCheckin['mood'] | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const userId = getUserId();

  // Get localStorage key for today's small wins
  const getSmallWinsStorageKey = () => {
    const today = new Date().toDateString();
    return `small_wins_${userId}_${today}`;
  };

  // Load checked states from localStorage
  const loadCheckedStates = (): Record<string, boolean> => {
    const key = getSmallWinsStorageKey();
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : {};
  };

  // Save checked states to localStorage
  const saveCheckedStates = (states: Record<string, boolean>) => {
    const key = getSmallWinsStorageKey();
    localStorage.setItem(key, JSON.stringify(states));
  };

  // Clean up old localStorage entries (keep only today's)
  const cleanupOldStorageEntries = () => {
    const today = new Date().toDateString();
    const prefix = `small_wins_${userId}_`;
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix) && !key.includes(today)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  };

  useEffect(() => {
    cleanupOldStorageEntries();
    initializeUser();
  }, []);

  const initializeUser = async () => {
    // Ensure user profile exists
    const profile = await getUserProfile(userId);
    if (!profile) {
      console.log('Creating user profile for:', userId);
      await createUserProfile(userId);
    }
    loadTasks();
    loadTodayMood();
  };

  const loadTodayMood = async () => {
    const moodCheckins = await getMoodCheckins(userId, 1);
    if (moodCheckins.length > 0) {
      const latestMood = moodCheckins[0];
      const today = new Date().toDateString();
      const moodDate = new Date(latestMood.created_at).toDateString();
      
      // Only set the mood if it was checked in today
      if (moodDate === today) {
        setSelectedMood(latestMood.mood);
      }
    }
  };

  const loadTasks = async () => {
    try {
      const todayTasks = await getTasks(userId, false);
      const today = new Date().toDateString();
      const todayTasksFiltered = todayTasks.filter(
        task => new Date(task.created_at).toDateString() === today
      );

      console.log('Today tasks filtered:', todayTasksFiltered);

      if (todayTasksFiltered.length === 0) {
        // Fetch daily small wins from database
        const smallWins = await getDailySmallWins(userId, 3);
        console.log('Fetched small wins:', smallWins);

        if (smallWins.length > 0) {
          // Remove duplicates based on title (case-insensitive)
          const uniqueWins = smallWins.filter((win: SmallWin, index: number, self: SmallWin[]) => 
            index === self.findIndex((w: SmallWin) => w.title.toLowerCase() === win.title.toLowerCase())
          );
          console.log('Unique small wins after deduplication:', uniqueWins);

          // Record that these wins were shown
          const winIds = uniqueWins.map((win: SmallWin) => win.id);
          await recordShownWins(userId, winIds);

          // Create tasks from small wins
          const newTasks: Task[] = [];
          for (const win of uniqueWins) {
            const taskData = {
              title: win.title,
              description: `${win.category} task`,
              category: win.category === 'self-care' || win.category === 'health' ? 'learning' : 
                        win.category === 'financial' ? 'budgeting' :
                        win.category === 'social' ? 'learning' :
                        win.category as 'budgeting' | 'bills' | 'housework' | 'shopping' | 'learning'
            };
            const created = await createTask(userId, taskData);
            console.log('Created task:', created);
            if (created) {
              newTasks.push(created);
            }
          }
          
          // Restore checked states from localStorage
          const checkedStates = loadCheckedStates();
          const tasksWithStates = newTasks.map(task => {
            const isChecked = checkedStates[task.title] || false;
            if (isChecked && !task.completed) {
              // Update task in database to match localStorage state
              updateTask(task.id, {
                completed: true,
                completed_at: new Date().toISOString()
              });
              return { ...task, completed: true, completed_at: new Date().toISOString() };
            }
            return task;
          });
          
          setTasks(tasksWithStates);
          console.log('Set tasks with restored states:', tasksWithStates);
        }
      } else {
        // Remove duplicates from existing tasks based on title
        const uniqueTasks = todayTasksFiltered.filter((task, index, self) => 
          index === self.findIndex(t => t.title.toLowerCase() === task.title.toLowerCase())
        );
        
        // Take only first 3 tasks
        const limitedTasks = uniqueTasks.slice(0, 3);
        
        // Restore checked states from localStorage (don't update database, just display)
        const checkedStates = loadCheckedStates();
        const tasksWithStates = limitedTasks.map(task => {
          const isChecked = checkedStates[task.title];
          // If localStorage has a state for this task, use it for display
          if (isChecked !== undefined) {
            return { ...task, completed: isChecked };
          }
          return task;
        });
        
        console.log('Loaded existing tasks with states:', tasksWithStates);
        setTasks(tasksWithStates);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskToggle = async (task: Task) => {
    const newCompletedState = !task.completed;
    
    const updated = await updateTask(task.id, {
      completed: newCompletedState,
      completed_at: newCompletedState ? new Date().toISOString() : undefined
    });

    if (updated) {
      setTasks(tasks.map(t => t.id === task.id ? updated : t));
      
      // Save checked state to localStorage
      const checkedStates = loadCheckedStates();
      checkedStates[task.title] = newCompletedState;
      saveCheckedStates(checkedStates);
      console.log('Saved checked state to localStorage:', task.title, newCompletedState);
      
      if (updated.completed) {
        toast({
          title: '🎉 Well done!',
          description: "You completed a task. That's a win!",
        });
        // Check for badges after completing a task
        console.log('Checking for badges after task completion...');
        const badgesBefore = await getProgressBadges(userId);
        await checkAndAwardBadges(userId);
        const badgesAfter = await getProgressBadges(userId);
        
        // Check if new badges were awarded
        if (badgesAfter.length > badgesBefore.length) {
          const newBadges = badgesAfter.filter(
            after => !badgesBefore.some(before => before.badge_type === after.badge_type)
          );
          newBadges.forEach(badge => {
            toast({
              title: '🏆 New Badge Earned!',
              description: `You earned the "${badge.badge_name}" badge!`,
            });
          });
        }
        console.log('Badge check complete');
      }
    }
  };

  const handleMoodCheckin = async (mood: MoodCheckin['mood']) => {
    setSelectedMood(mood);
    await createMoodCheckin(userId, mood);
    
    if (mood === 'struggling' || mood === 'crisis') {
      navigate('/support');
    } else {
      toast({
        title: 'Thank you for checking in',
        description: 'Your mood has been recorded.',
      });
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
        <p className="text-muted-foreground text-lg">
          Let's take things one small step at a time
        </p>
      </div>

      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            How are you feeling today?
          </CardTitle>
          <CardDescription>
            Optional - helps us suggest the right tasks for you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            {moodOptions.map((mood) => {
              const Icon = mood.icon;
              return (
                <button
                  key={mood.value}
                  onClick={() => handleMoodCheckin(mood.value as MoodCheckin['mood'])}
                  className={`mood-button flex flex-col items-center justify-center ${selectedMood === mood.value ? 'selected' : ''}`}
                >
                  <Icon className={`h-8 w-8 ${mood.color}`} />
                  <p className="text-sm mt-2">{mood.label}</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="card-soft">
        <CardHeader>
          <CardTitle>Today's Small Wins</CardTitle>
          <CardDescription>
            {completedCount === 0 && 'Pick one to start - no pressure'}
            {completedCount > 0 && `${completedCount} of 3 completed - you're doing great!`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <p className="text-muted-foreground">Loading tasks...</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="bg-card-mint rounded-2xl p-5 card-soft flex items-start gap-3 cursor-pointer border-0"
                onClick={() => handleTaskToggle(task)}
              >
                {task.completed ? (
                  <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0 mt-1" />
                ) : (
                  <Circle className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="card-soft hover:card-medium transition-shadow bg-card-blue border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Money Buckets
            </CardTitle>
            <CardDescription>Simple budgeting made easy</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/budgeting">
              <Button className="w-full">Start Budgeting</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="card-soft hover:card-medium transition-shadow bg-card-peach border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Bills & Payments
            </CardTitle>
            <CardDescription>Understand what you need to pay</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/bills">
              <Button className="w-full">Learn About Bills</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="card-soft hover:card-medium transition-shadow bg-card-mint border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HomeIcon className="h-5 w-5" />
              Rent & Housing
            </CardTitle>
            <CardDescription>Know your rights and responsibilities</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/housing">
              <Button className="w-full">Housing Guide</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="card-soft hover:card-medium transition-shadow bg-card-blue border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5" />
              Meal Plans
            </CardTitle>
            <CardDescription>Easy recipes with shared ingredients</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/meal-plans">
              <Button className="w-full">View Recipes</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="card-soft hover:card-medium transition-shadow bg-card-peach border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Shopping & Food
            </CardTitle>
            <CardDescription>Budget-friendly meal planning</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/shopping">
              <Button className="w-full">Shopping Help</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="card-soft hover:card-medium transition-shadow bg-card-mint border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Housework & Cleaning
            </CardTitle>
            <CardDescription>Simple guides for keeping your space tidy</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/housework">
              <Button className="w-full">Cleaning Guides</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="card-soft hover:card-medium transition-shadow bg-card-pink border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Learning Centre
            </CardTitle>
            <CardDescription>Essential skills for independent living</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/learning">
              <Button className="w-full">Start Learning</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="card-soft hover:card-medium transition-shadow bg-card-lavender border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Benefits & Financial Help
            </CardTitle>
            <CardDescription>Understand UK benefits and support available</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/benefits">
              <Button className="w-full">Explore Benefits</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="card-soft hover:card-medium transition-shadow bg-card-blue border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Your Progress
            </CardTitle>
            <CardDescription>Track your achievements and earned badges</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/progress">
              <Button className="w-full">View Progress</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
