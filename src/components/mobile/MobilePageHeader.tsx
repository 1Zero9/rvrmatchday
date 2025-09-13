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
  showHomeButton = true,
  className = ''
}: MobilePageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`px-4 py-4 relative z-10 ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-3 shadow-2xl mx-1 relative"
      >
        <div className="absolute inset-1 bg-white/5 rounded-xl backdrop-blur-sm" />
        
        {/* Home Button */}
        {showHomeButton && (
          <div className="absolute -top-2 -right-2 z-10">
            <Link href="/home" className="bg-blue-500/90 backdrop-blur-sm rounded-full p-1 border-2 border-white/50 shadow-lg block">
              <div className="w-5 h-5 flex items-center justify-center">
                <span className="text-white text-xs">🏠</span>
              </div>
            </Link>
          </div>
        )}
        
        <div className="relative z-10">
          {/* Header Layout: Logo Left, Title Centered */}
          <div className="flex items-center mb-2">
            {/* Logo - Left Side, Clickable Home Link */}
            <Link href="/home" className="group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20 shadow-lg flex-shrink-0 group-hover:bg-white/20 transition-all duration-300"
              >
                <Image 
                  src="/images/logo.png" 
                  alt="RVR AFC Logo - Home" 
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-md"
                />
              </motion.div>
            </Link>
            
            {/* Page Title - Centered */}
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center space-x-2">
                {icon && <span className="text-lg">{icon}</span>}
                <h1 className="text-lg font-bold drop-shadow-lg leading-tight text-white">{title}</h1>
              </div>
              {subtitle && (
                <p className="text-blue-200 text-xs drop-shadow-md mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          
          {/* Club Name Bar */}
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20 text-center">
            <p className="text-white/90 text-xs font-medium">
              Rivervalley Rangers AFC
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}