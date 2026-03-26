import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X, Smartphone, Monitor, Share2, MoreVertical } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type Platform = 'android' | 'ios' | 'desktop' | 'unknown';

const detectPlatform = (): Platform => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  
  console.log('[PWA Install] User Agent:', userAgent);
  console.log('[PWA Install] Is Standalone:', isStandalone);
  console.log('[PWA Install] Navigator Standalone:', (window.navigator as any).standalone);
  
  // Check if already running as PWA
  if (isStandalone || (window.navigator as any).standalone) {
    console.log('[PWA Install] Already running as PWA, not showing prompt');
    return 'unknown'; // Don't show prompt if already installed
  }

  // Detect iOS
  if (/iphone|ipad|ipod/.test(userAgent)) {
    console.log('[PWA Install] Detected iOS');
    return 'ios';
  }

  // Detect Android
  if (/android/.test(userAgent)) {
    console.log('[PWA Install] Detected Android');
    return 'android';
  }

  // Desktop
  if (!/mobile/.test(userAgent)) {
    console.log('[PWA Install] Detected Desktop');
    return 'desktop';
  }

  console.log('[PWA Install] Platform unknown');
  return 'unknown';
};

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [platform, setPlatform] = useState<Platform>('unknown');

  useEffect(() => {
    const detectedPlatform = detectPlatform();
    setPlatform(detectedPlatform);
    console.log('[PWA Install] Platform set to:', detectedPlatform);

    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

    console.log('[PWA Install] Dismissed:', dismissed);
    console.log('[PWA Install] Days since dismissed:', daysSinceDismissed);

    // Show prompt if not dismissed or if it's been more than 7 days
    // Also show if dismissed more than 1 hour ago (for testing after uninstall)
    const hoursSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60);
    const shouldShow = !dismissed || daysSinceDismissed > 7 || hoursSinceDismissed > 1;
    console.log('[PWA Install] Should show prompt:', shouldShow);
    console.log('[PWA Install] Hours since dismissed:', hoursSinceDismissed);

    if (shouldShow) {
      if (detectedPlatform === 'ios') {
        // For iOS, show custom prompt after 3 seconds
        console.log('[PWA Install] Setting iOS prompt timer (3s)');
        setTimeout(() => {
          console.log('[PWA Install] Showing iOS prompt');
          setShowPrompt(true);
        }, 3000);
      } else if (detectedPlatform === 'android') {
        // For Android, show prompt after 3 seconds even without beforeinstallprompt
        // This provides fallback instructions if the event doesn't fire
        console.log('[PWA Install] Setting Android fallback prompt timer (3s)');
        setTimeout(() => {
          console.log('[PWA Install] Showing Android fallback prompt');
          setShowPrompt(true);
        }, 3000);
      } else if (detectedPlatform === 'desktop') {
        // For desktop, show after 5 seconds
        console.log('[PWA Install] Setting desktop prompt timer (5s)');
        setTimeout(() => {
          console.log('[PWA Install] Showing desktop prompt');
          setShowPrompt(true);
        }, 5000);
      }
    }

    // Listen for beforeinstallprompt event (Android/Desktop Chrome)
    const handler = (e: Event) => {
      console.log('[PWA Install] beforeinstallprompt event fired!');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      if (shouldShow) {
        setTimeout(() => {
          console.log('[PWA Install] Showing prompt after beforeinstallprompt event');
          setShowPrompt(true);
        }, 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    console.log('[PWA Install] Added beforeinstallprompt listener');

    // Add a global function to manually clear dismissal (for testing)
    (window as any).clearPWADismissal = () => {
      localStorage.removeItem('pwa-install-dismissed');
      console.log('[PWA Install] Dismissal cleared! Reload page to see prompt.');
      window.location.reload();
    };
    console.log('[PWA Install] Run window.clearPWADismissal() to reset prompt');

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      console.log('[PWA Install] Removed beforeinstallprompt listener');
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`[PWA] User ${outcome} the install prompt`);
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    console.log('[PWA Install] User dismissed prompt');
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  console.log('[PWA Install] Render check - showPrompt:', showPrompt, 'platform:', platform);

  if (!showPrompt || platform === 'unknown') {
    console.log('[PWA Install] Not rendering prompt');
    return null;
  }

  // Android with native install prompt (beforeinstallprompt event fired)
  if (deferredPrompt && platform === 'android') {
    console.log('[PWA Install] Rendering Android native install prompt');
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-primary/20 animate-in slide-in-from-bottom-4 duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-xl">Install Independent Life UK</CardTitle>
                  <CardDescription className="mt-1">
                    Get quick access and work offline
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleDismiss}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Launch directly from your home screen</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Works offline - access content anytime</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Faster loading and better performance</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>No app store required - free forever</span>
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleInstall} className="flex-1" size="lg">
                <Download className="mr-2 h-4 w-4" />
                Install App
              </Button>
              <Button variant="outline" onClick={handleDismiss} className="flex-1" size="lg">
                Not Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Desktop with native install prompt
  if (deferredPrompt && platform === 'desktop') {
    console.log('[PWA Install] Rendering desktop native install prompt');
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-primary/20 animate-in slide-in-from-bottom-4 duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-xl">Install Independent Life UK</CardTitle>
                  <CardDescription className="mt-1">
                    Get quick access and work offline
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleDismiss}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Launch directly from your desktop</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Works offline - access content anytime</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Faster loading and better performance</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>No app store required - free forever</span>
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleInstall} className="flex-1" size="lg">
                <Download className="mr-2 h-4 w-4" />
                Install App
              </Button>
              <Button variant="outline" onClick={handleDismiss} className="flex-1" size="lg">
                Not Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Android fallback instructions (no beforeinstallprompt event)
  if (platform === 'android') {
    console.log('[PWA Install] Rendering Android fallback instructions');
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-primary/20 animate-in slide-in-from-bottom-4 duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-xl">Install Independent Life UK</CardTitle>
                  <CardDescription className="mt-1">
                    Get quick access and work offline
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleDismiss}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Launch directly from your home screen</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Works offline - access content anytime</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Faster loading and better performance</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>No app store required - free forever</span>
              </p>
            </div>
            <div className="bg-accent/50 rounded-lg p-4 space-y-3">
              <p className="font-semibold text-sm">To install:</p>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Tap the menu button</p>
                    <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                      <MoreVertical className="h-4 w-4" />
                      <span className="text-xs">(Three dots in browser)</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Select "Install app" or "Add to Home screen"</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Tap "Install" or "Add"</p>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={handleDismiss} className="w-full" size="lg">
              Got it, thanks!
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // iOS custom instructions
  if (platform === 'ios') {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-primary/20 animate-in slide-in-from-bottom-4 duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-xl">Install Independent Life UK</CardTitle>
                  <CardDescription className="mt-1">
                    Get quick access and work offline
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleDismiss}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Launch directly from your home screen</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Works offline - access content anytime</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Faster loading and better performance</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>No app store required - free forever</span>
              </p>
            </div>
            <div className="bg-accent/50 rounded-lg p-4 space-y-3">
              <p className="font-semibold text-sm">To install:</p>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Tap the Share button</p>
                    <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                      <Share2 className="h-4 w-4" />
                      <span className="text-xs">(Square with arrow)</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Scroll and tap "Add to Home Screen"</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Tap "Add"</p>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={handleDismiss} className="w-full" size="lg">
              Got it, thanks!
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Desktop without native prompt (Firefox, etc.)
  if (platform === 'desktop') {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-primary/20 animate-in zoom-in-95 duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-xl">Install Independent Life UK</CardTitle>
                  <CardDescription className="mt-1">
                    Get quick access and work offline
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleDismiss}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Launch directly from your desktop</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Works offline - access content anytime</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Faster loading and better performance</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>No app store required - free forever</span>
              </p>
            </div>
            <div className="bg-accent/50 rounded-lg p-4 space-y-3">
              <p className="font-semibold text-sm">To install:</p>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Click the menu button</p>
                    <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                      <MoreVertical className="h-4 w-4" />
                      <span className="text-xs">(Three dots in browser)</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Select "Install Independent Life UK"</p>
                    <p className="text-muted-foreground text-xs mt-1">Or look for install icon in address bar</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Click "Install"</p>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={handleDismiss} className="w-full" size="lg">
              Got it, thanks!
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};
