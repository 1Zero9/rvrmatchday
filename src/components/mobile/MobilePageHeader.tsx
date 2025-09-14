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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`px-4 pt-16 pb-2 relative z-10 ${className}`}
    >
      {/* Compact Page Title Only */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-1">
          {icon && <span className="text-xl">{icon}</span>}
          <h1 className="text-xl font-bold drop-shadow-lg text-white">{title}</h1>
        </div>
        {subtitle && (
          <p className="text-[#98C0F0] text-sm drop-shadow-md opacity-90">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}