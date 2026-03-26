import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Accessibility } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState, useEffect, useRef } from 'react';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Budgeting', path: '/budgeting' },
  { name: 'Bills & Payments', path: '/bills' },
  { name: 'Rent & Housing', path: '/housing' },
  { name: 'Benefits', path: '/benefits' },
  { name: 'Housework', path: '/housework' },
  { name: 'Shopping & Food', path: '/shopping' },
  { name: 'Progress', path: '/progress' },
];

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const previousPathRef = useRef<string>('/');

  // Track previous path (excluding settings)
  useEffect(() => {
    if (location.pathname !== '/settings') {
      previousPathRef.current = location.pathname;
    }
  }, [location.pathname]);

  const handleSettingsClick = () => {
    if (location.pathname === '/settings') {
      // If on settings page, go back to previous page
      navigate(previousPathRef.current);
    } else {
      // If not on settings page, go to settings
      navigate('/settings');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="xl:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={`px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-primary">Independent Life UK</h1>
          </Link>
        </div>

        <nav className="hidden xl:flex items-center gap-1">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <Button variant="ghost" size="icon" onClick={handleSettingsClick}>
          <Accessibility className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
