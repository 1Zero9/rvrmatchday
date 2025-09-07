import { ReactNode } from 'react';
import MobileNavigation from './MobileNavigation';
import Footer from './Footer';

interface MobileLayoutProps {
  children: ReactNode;
  currentPage?: string;
  showNavigation?: boolean;
}

export default function MobileLayout({ 
  children, 
  currentPage,
  showNavigation = true 
}: MobileLayoutProps) {
  return (
    <div className="md:hidden min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      {showNavigation && <MobileNavigation currentPage={currentPage} />}
      
      {/* Main Content */}
      <main className={`flex-1 ${showNavigation ? 'pt-0' : 'pt-4'}`}>
        {children}
      </main>
      
      {/* Mobile Footer */}
      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
}