import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, CheckCircle2 } from 'lucide-react';
import { getUserId, getProgressBadges, getTasks, getLearningProgress, checkAndAwardBadges } from '@/db/api';
import type { ProgressBadge, Task, LearningProgress } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const allBadges = [
  { type: 'first_task', name: 'First Task', description: 'Completed your first task', icon: '✓' },
  { type: 'first_budget', name: 'Budget Creator', description: 'Created your first budget', icon: '💰' },
  { type: 'asked_help', name: 'Asked for Help', description: 'Reached out for support', icon: '🤝' },
  { type: 'week_streak', name: 'Week Warrior', description: 'Completed tasks for 7 days', icon: '🔥' },
  { type: 'learning_started', name: 'Learning Journey', description: 'Started a learning module', icon: '📚' },
  { type: 'bills_learned', name: 'Bills Expert', description: 'Completed bills module', icon: '📋' },
];

const learningModules = [
  {
    id: 'food-safety',
    name: 'Food Safety Basics',
    icon: '🍽️',
    lessons: [
      { id: 'food-safety-1', name: 'Understanding Food Dates' },
      { id: 'food-safety-2', name: 'Safe Food Storage' },
      { id: 'food-safety-3', name: 'Cooking Safely' }
    ]
  },
  {
    id: 'cleaning-practices',
    name: 'Cleaning Best Practices',
    icon: '🧹',
    lessons: [
      { id: 'cleaning-1', name: 'Essential Cleaning Products' },
      { id: 'cleaning-2', name: 'Preventing Mould & Damp' },
      { id: 'cleaning-3', name: 'Deep Cleaning Made Simple' }
    ]
  },
  {
    id: 'home-security',
    name: 'Home Security',
    icon: '🔒',
    lessons: [
      { id: 'security-1', name: 'Basic Home Security' },
      { id: 'security-2', name: 'Scams & Doorstep Safety' },
      { id: 'security-3', name: 'Fire & Carbon Monoxide Safety' }
    ]
  },
  {
    id: 'energy-saving',
    name: 'Energy & Money Saving',
    icon: '💡',
    lessons: [
      { id: 'energy-1', name: 'Understanding Your Energy Bills' },
      { id: 'energy-2', name: 'Easy Ways to Save Energy' },
      { id: 'energy-3', name: 'Help with Energy Bills' }
    ]
  },
  {
    id: 'basic-maintenance',
    name: 'Basic Home Maintenance',
    icon: '🔧',
    lessons: [
      { id: 'maintenance-1', name: 'Quick Fixes Anyone Can Do' },
      { id: 'maintenance-2', name: 'When to Call Your Landlord' },
      { id: 'maintenance-3', name: 'Basic Tool Kit' }
    ]
  }
];

const Progress = () => {
  const [badges, setBadges] = useState<ProgressBadge[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [learningProgress, setLearningProgress] = useState<LearningProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLearningDialog, setShowLearningDialog] = useState(false);
  const userId = getUserId();

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    // Check for any new badges first
    await checkAndAwardBadges(userId);
    
    const [badgesData, tasksData, learningData] = await Promise.all([
      getProgressBadges(userId),
      getTasks(userId),
      getLearningProgress(userId)
    ]);

    setBadges(badgesData);
    setTasks(tasksData);
    setLearningProgress(learningData);
    setLoading(false);
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completedModules = learningProgress.filter(l => l.completed).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold mb-2">Your Progress</h1>
        <p className="text-muted-foreground text-lg">
          Celebrate your wins - no matter how small
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="text-2xl">{completedTasks}</CardTitle>
            <CardDescription>Tasks Completed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-success">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm">Keep going!</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="text-2xl">{badges.length}</CardTitle>
            <CardDescription>Badges Earned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-primary">
              <Award className="h-5 w-5" />
              <span className="text-sm">You're doing great</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-soft cursor-pointer hover:card-medium transition-shadow" onClick={() => setShowLearningDialog(true)}>
          <CardHeader>
            <CardTitle className="text-2xl">{completedModules}</CardTitle>
            <CardDescription>Lessons Completed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-secondary">
              <span className="text-2xl">📚</span>
              <span className="text-sm">Learning journey</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-soft">
        <CardHeader>
          <CardTitle>Your Badges</CardTitle>
          <CardDescription>
            Skills you've learned - no competition, just your journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {allBadges.map((badge) => {
              const earned = badges.find(b => b.badge_type === badge.type);
              return (
                <div
                  key={badge.type}
                  className={`border rounded-lg p-4 ${
                    earned
                      ? 'border-primary bg-accent'
                      : 'border-border bg-muted opacity-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{badge.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold">{badge.name}</h3>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                      {earned && (
                        <p className="text-xs text-primary mt-1">
                          Earned {new Date(earned.earned_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {earned && (
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="card-soft bg-accent">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">Remember:</h3>
          <ul className="space-y-2 text-sm">
            <li>• Progress isn't linear - some days are harder than others</li>
            <li>• Every small step counts</li>
            <li>• You're learning life skills that many people struggle with</li>
            <li>• Asking for help is a strength, not a weakness</li>
            <li>• You're doing better than you think</li>
          </ul>
        </CardContent>
      </Card>

      <Dialog open={showLearningDialog} onOpenChange={setShowLearningDialog}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Your Learning Journey</DialogTitle>
            <DialogDescription>
              Track your progress across all learning modules
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {learningModules.map((module) => {
              const completedLessons = module.lessons.filter(lesson =>
                learningProgress.some(p => p.lesson_id === lesson.id && p.completed)
              );
              const progress = Math.round((completedLessons.length / module.lessons.length) * 100);

              return (
                <div key={module.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{module.icon}</span>
                      <div>
                        <h3 className="font-semibold">{module.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {completedLessons.length} of {module.lessons.length} lessons completed
                        </p>
                      </div>
                    </div>
                    {progress > 0 && (
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">{progress}%</div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    {module.lessons.map((lesson) => {
                      const isCompleted = learningProgress.some(
                        p => p.lesson_id === lesson.id && p.completed
                      );
                      return (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-2 text-sm"
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-muted-foreground shrink-0" />
                          )}
                          <span className={isCompleted ? 'text-foreground' : 'text-muted-foreground'}>
                            {lesson.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={() => setShowLearningDialog(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Progress;
