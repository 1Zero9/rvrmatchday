/**
 * Mobile Page Container Component
 * Provides consistent page structure for all mobile sub-pages
 * Features: Gradient background, glass effects, consistent spacing
 */

import { ReactNode } from 'react';
import MobilePageHeader from './MobilePageHeader';

interface MobilePageContainerProps {
  title: string;
  subtitle?: string;
  icon?: string;
  showHomeButton?: boolean;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export default function MobilePageContainer({ 
  title, 
  subtitle, 
  icon,
  showHomeButton = true,
  children,
  className = '',
  contentClassName = ''
}: MobilePageContainerProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-[var(--club-primary)] via-[var(--club-secondary)] to-[var(--club-accent)] relative overflow-hidden ${className}`}>
      
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[var(--club-accent)]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[var(--club-primary)]/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <MobilePageHeader 
        title={title}
        subtitle={subtitle}
        icon={icon}
        showHomeButton={showHomeButton}
      />

      {/* Content */}
      <div className={`px-4 pb-8 relative z-10 ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
}