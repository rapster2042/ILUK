import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X } from 'lucide-react';

export const PWAUpdatePrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    // Wait for page load to avoid blocking
    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        
        if (registration) {
          console.log('[PWA] Service Worker already registered');
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[PWA] New version available');
                  setNeedRefresh(true);
                  setShowPrompt(true);
                }
              });
            }
          });

          // Check for updates periodically
          setInterval(() => {
            registration.update().catch(err => {
              console.log('[PWA] Update check failed:', err);
            });
          }, 60000); // Check every minute
        } else {
          console.log('[PWA] No service worker registered yet');
        }
      } catch (error) {
        console.error('[PWA] Service Worker check error:', error);
      }
    };

    // Delay registration check to not block initial render
    const timer = setTimeout(() => {
      registerSW();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    setShowPrompt(false);
  };

  const handleUpdate = async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.waiting) {
        // Tell the waiting service worker to activate
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // Listen for the controlling service worker change
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.error('[PWA] Update error:', error);
      window.location.reload();
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="shadow-2xl border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">
                {needRefresh ? 'Update Available' : 'App Ready'}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={close}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            {needRefresh
              ? 'A new version is available. Update now for the latest features.'
              : 'App is ready to work offline!'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2">
            {needRefresh && (
              <Button onClick={handleUpdate} className="flex-1">
                Update Now
              </Button>
            )}
            <Button
              variant={needRefresh ? 'outline' : 'default'}
              onClick={close}
              className="flex-1"
            >
              {needRefresh ? 'Later' : 'Got it'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
