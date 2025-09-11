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
    <div className="md:hidden min-h-screen bg-white">
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
      
      {/* Simple Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8 px-4 text-center">
        <div className="text-xs text-gray-500 space-y-2">
          <p>© 2025 Rivervalley Rangers AFC</p>
          <p>Powered by RVR Football Platform</p>
        </div>
      </footer>
    </div>
  );
}