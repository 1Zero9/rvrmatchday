import { ReactNode } from 'react';
import MobileNavigationPro from './mobile/MobileNavigationPro';

interface MobileLayoutProps {
  children: ReactNode;
  currentPage?: string;
  showNavigation?: boolean;
  clubData?: {
    name: string;
    logo: string;
    established: string;
    colors: {
      primary: string;
      secondary: string;
    };
  };
}

export default function MobileLayout({ 
  children, 
  currentPage,
  showNavigation = true,
  clubData 
}: MobileLayoutProps) {
  return (
    <div className="md:hidden min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Professional Mobile Navigation */}
      {showNavigation && (
        <MobileNavigationPro 
          currentPage={currentPage} 
          clubData={clubData}
        />
      )}
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Brand Footer */}
      <footer className="bg-gradient-to-r from-[var(--club-primary)] to-[var(--club-secondary)] py-8 px-4 text-center">
        <div className="text-xs text-white space-y-2">
          <p className="font-semibold">© 2025 Rivervalley Rangers AFC</p>
          <p className="text-[var(--club-accent)] opacity-90">Powered by RVR Football Platform</p>
          <p className="text-[var(--club-accent)] opacity-75 text-xs">Community Football Since 1981</p>
        </div>
      </footer>
    </div>
  );
}