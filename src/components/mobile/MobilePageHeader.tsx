/**
 * Mobile Page Header Component
 * Provides consistent header styling for all mobile sub-pages
 * Features: Combined logo/title, home button, glassmorphism design
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface MobilePageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  showHomeButton?: boolean;
  className?: string;
}

export default function MobilePageHeader({ 
  title, 
  subtitle, 
  icon,
  showHomeButton = false, // Default to false since main nav has home link
  className = ''
}: MobilePageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`px-6 pt-16 pb-6 relative z-10 ${className}`}
    >
      {/* Enhanced Page Header */}
      <div className="text-center">
        {/* Home button indicator */}
        {showHomeButton && (
          <Link href="/home" className="absolute top-4 right-4 w-8 h-8 bg-blue-500/80 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/40 shadow-lg z-10">
            <span className="text-white text-sm font-bold">🏠</span>
          </Link>
        )}
        
        {/* Glass container for title */}
        <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/25 shadow-2xl mb-4">
          <div className="flex items-center justify-center space-x-3 mb-2">
            {icon && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
                className="text-3xl drop-shadow-lg"
              >
                {icon}
              </motion.span>
            )}
            <h1 className="text-2xl font-bold drop-shadow-lg text-white">{title}</h1>
          </div>
          {subtitle && (
            <p className="text-slate-200 text-sm drop-shadow-md font-medium opacity-90">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}