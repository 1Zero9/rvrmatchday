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
    <div className={`min-h-screen bg-gradient-to-b from-slate-800 via-slate-700 to-slate-600 relative overflow-hidden ${className}`}>
      
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0">
        {/* Club maroon accent at top */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-red-900/60 to-transparent"></div>
        
        {/* Vibrant animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-3/4 w-48 h-48 bg-emerald-500/15 rounded-full blur-2xl animate-pulse delay-2000" />
        
        {/* Floating elements */}
        <div className="absolute top-20 right-10 w-4 h-4 bg-white/20 backdrop-blur-sm rounded-full animate-bounce" />
        <div className="absolute top-40 left-8 w-6 h-6 bg-white/15 backdrop-blur-sm rounded-full animate-pulse" />
        <div className="absolute bottom-32 right-20 w-3 h-3 bg-white/25 backdrop-blur-sm rounded-full animate-ping" />
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