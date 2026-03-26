import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AlertCircle, Trash2 } from 'lucide-react';
import { useUserSettings } from '@/hooks/useUserSettings';
import { getUserId } from '@/db/api';
import { supabase } from '@/db/supabase';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Settings = () => {
  const { profile, updateSettings, loading } = useUserSettings();
  const { toast } = useToast();
  const [resetting, setResetting] = useState(false);

  const handleResetAllData = async () => {
    setResetting(true);
    try {
      const userId = getUserId();
      
      // Delete all user data from all tables
      const tables = [
        'tasks',
        'mood_checkins',
        'budgets',
        'reminders',
        'progress_badges',
        'learning_progress',
        'shopping_lists',
        'custom_recipes',
        'meal_plans',
        'meal_slots',
        'user_small_wins_history'
      ];

      console.log('Resetting data for user:', userId);
      
      for (const table of tables) {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('user_id', userId);
        
        if (error) {
          console.error(`Error deleting from ${table}:`, error);
        } else {
          console.log(`Deleted data from ${table}`);
        }
      }

      // Clear localStorage
      localStorage.removeItem('independent_life_user_id');
      
      // Check if running as PWA
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone;
      const isPWA = isStandalone || isIOSStandalone;
      
      // If running in browser (not PWA), also clear PWA install dismissal
      if (!isPWA && typeof (window as any).clearPWADismissal === 'function') {
        console.log('[Settings] Running in browser - clearing PWA dismissal');
        localStorage.removeItem('pwa-install-dismissed');
      } else if (isPWA) {
        console.log('[Settings] Running as PWA - keeping PWA dismissal state');
      }
      
      toast({
        title: '✓ Data Reset Complete',
        description: 'All your data has been cleared. The page will reload.',
      });

      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error resetting data:', error);
      toast({
        title: 'Error',
        description: 'Failed to reset data. Please try again.',
        variant: 'destructive',
      });
      setResetting(false);
    }
  };

  if (loading || !profile) {
    return <div className="text-center py-12">Loading settings...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground text-lg">
          Customize your experience
        </p>
      </div>

      <Card className="card-soft">
        <CardHeader>
          <CardTitle>Accessibility</CardTitle>
          <CardDescription>
            Adjust these settings to make the app work better for you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="voice">Voice Narration</Label>
              <p className="text-sm text-muted-foreground">
                Read content aloud using text-to-speech
              </p>
            </div>
            <Switch
              id="voice"
              checked={profile.voice_enabled}
              onCheckedChange={(checked) => updateSettings({ voice_enabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="motion">Reduced Motion</Label>
              <p className="text-sm text-muted-foreground">
                Minimize animations and transitions
              </p>
            </div>
            <Switch
              id="motion"
              checked={profile.reduced_motion}
              onCheckedChange={(checked) => updateSettings({ reduced_motion: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="mood">Mood Tracking</Label>
              <p className="text-sm text-muted-foreground">
                Show mood check-in on home page
              </p>
            </div>
            <Switch
              id="mood"
              checked={profile.mood_tracking_enabled}
              onCheckedChange={(checked) => updateSettings({ mood_tracking_enabled: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="text-size">Text Size</Label>
            <Select
              value={profile.text_size}
              onValueChange={(value: 'small' | 'medium' | 'large') =>
                updateSettings({ text_size: value })
              }
            >
              <SelectTrigger id="text-size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium (Default)</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contrast">Contrast Mode</Label>
            <Select
              value={profile.contrast_mode}
              onValueChange={(value: 'normal' | 'high' | 'low') =>
                updateSettings({ contrast_mode: value })
              }
            >
              <SelectTrigger id="contrast">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High Contrast</SelectItem>
                <SelectItem value="low">Low Contrast</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="card-soft border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions - use with caution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Reset All Data</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This will permanently delete all your data including tasks, badges, budgets, 
                learning progress, and settings. This action cannot be undone.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={resetting}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {resetting ? 'Resetting...' : 'Reset All Data'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your data from the app. This includes:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>All completed and pending tasks</li>
                        <li>All earned badges and progress</li>
                        <li>Budgets and financial data</li>
                        <li>Learning progress and completed lessons</li>
                        <li>Shopping lists and meal plans</li>
                        <li>Mood check-ins and reminders</li>
                      </ul>
                      <p className="mt-3 font-semibold">This action cannot be undone.</p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleResetAllData}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Yes, Delete Everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-soft bg-accent">
        <CardContent className="pt-6">
          <p className="text-sm">
            <strong>Privacy:</strong> All your data is stored securely and privately. 
            We never sell your information. You can delete all your data at any time by clearing your browser data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
