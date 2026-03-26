import { ReactNode } from 'react';
import Header from './Header';
import { CrisisButton } from './CrisisButton';
import { Toaster } from '@/components/ui/toaster';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 pb-24 max-w-7xl">
        {children}
      </main>
      <CrisisButton />
      <Toaster />
    </div>
  );
};

export default Layout;
