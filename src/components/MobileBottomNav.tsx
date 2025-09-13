/**
 * Mobile Bottom Navigation Component
 * Provides easy access to key actions on mobile devices
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 */

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

interface MobileBottomNavProps {
  className?: string;
}

export default function MobileBottomNav({ className = '' }: MobileBottomNavProps) {
  const router = useRouter();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      href: '/home',
      isActive: router.pathname === '/home'
    },
    {
      id: 'matches',
      label: 'Matches',
      icon: '🏆',
      href: '/match-central',
      isActive: router.pathname === '/match-central'
    },
    {
      id: 'record',
      label: 'Record',
      icon: '📝',
      href: '/match-recorder?mode=record',
      isActive: router.pathname === '/match-recorder' && router.query.mode === 'record',
      isAction: true,
      color: 'bg-red-600 hover:bg-red-700'
    },
    {
      id: 'schedule',
      label: 'Schedule',
      icon: '📅',
      href: '/match-recorder?mode=schedule', 
      isActive: router.pathname === '/match-recorder' && router.query.mode === 'schedule',
      isAction: true,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'teams',
      label: 'Teams',
      icon: '👥',
      href: '/match-admin',
      isActive: router.pathname === '/match-admin'
    }
  ];

  return (
    <div className={`md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 ${className}`}>
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => (
          <Link key={item.id} href={item.href}>
            <motion.div
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all min-w-16 ${
                item.isAction 
                  ? `${item.color} text-white shadow-xl transform hover:scale-105 ring-2 ring-opacity-50`
                  : item.isActive
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-xl border border-green-500 transform scale-105 ring-2 ring-green-200 font-bold'
                    : 'text-gray-800 hover:text-gray-900 hover:bg-gray-200 bg-gray-100 shadow-md border border-gray-200 font-medium'
              }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </motion.div>
          </Link>
        ))}
      </div>
      
      {/* Safe area padding for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-white"></div>
    </div>
  );
}

// Hook to determine if bottom nav should be shown
export function useMobileBottomNav() {
  const router = useRouter();
  
  // Show on main app pages, hide on auth/setup pages
  const showBottomNav = [
    '/home',
    '/match-central',
    '/match-admin', 
    '/match-recorder',
    '/teams/girls',
    '/teams',
    '/matches'
  ].some(path => router.pathname.startsWith(path));

  return { showBottomNav };
}