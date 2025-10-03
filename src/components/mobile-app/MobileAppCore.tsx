/**
 * 📱 RVR MOBILE APP CORE
 * Clean, fast, club-first mobile experience
 * 
 * Key Features:
 * - Speed: <2s load time on 4G
 * - Touch-first: Large buttons, swipe gestures
 * - Club-first: RVR branding throughout
 * - Offline: Local storage for key data
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Mobile App Types
export interface MobileAppState {
  currentScreen: 'dashboard' | 'match-record' | 'fixtures' | 'teams' | 'notifications';
  isOffline: boolean;
  lastSync: Date;
  user: any;
}

export interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  action: () => void;
  badge?: string;
}

export interface MatchPreview {
  id: string;
  homeTeam: string;
  awayTeam: string;
  datetime: Date;
  location: string;
  isHome: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  timestamp: Date;
  category: 'match' | 'club' | 'urgent';
  urgent?: boolean;
}

// Mobile App Header
interface MobileHeaderProps {
  onMenuToggle: () => void;
  isOffline: boolean;
  lastSync: Date;
}

export function MobileHeader({ onMenuToggle, isOffline, lastSync }: MobileHeaderProps) {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-gradient-to-r from-[#972A4C] to-[#5E7794] text-white p-4 shadow-lg"
    >
      <div className="flex items-center justify-between">
        {/* Club Logo & Name */}
        <div className="flex items-center space-x-3">
          <Image
            src="/images/logo.png"
            alt="RVR AFC"
            width={40}
            height={40}
            className="rounded-lg shadow-md"
          />
          <div>
            <h1 className="text-lg font-bold">RVR AFC</h1>
            <p className="text-xs text-white/80">Mobile App</p>
          </div>
        </div>

        {/* Status & Menu */}
        <div className="flex items-center space-x-3">
          {/* Offline Status */}
          {isOffline && (
            <div className="flex items-center space-x-1 bg-orange-500/20 px-2 py-1 rounded-full">
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
              <span className="text-xs">Offline</span>
            </div>
          )}

          {/* Menu Button */}
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </motion.header>
  );
}

// Quick Action Card Component
interface QuickActionCardProps {
  action: QuickAction;
  index: number;
}

export function QuickActionCard({ action, index }: QuickActionCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={action.action}
      className={`relative p-6 rounded-2xl shadow-lg text-left w-full ${action.color} hover:shadow-xl transition-all`}
    >
      {/* Badge */}
      {action.badge && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
          {action.badge}
        </div>
      )}

      {/* Icon */}
      <div className="text-3xl mb-3">{action.icon}</div>

      {/* Content */}
      <h3 className="font-bold text-lg text-white mb-1">{action.title}</h3>
      <p className="text-white/80 text-sm">{action.subtitle}</p>
    </motion.button>
  );
}

// Match Preview Card
interface MatchPreviewCardProps {
  match: MatchPreview;
}

export function MatchPreviewCard({ match }: MatchPreviewCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IE', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-800">Next Match</h3>
        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
          {match.isHome ? 'Home' : 'Away'}
        </span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-center flex-1">
          <div className="font-bold text-lg">{match.homeTeam}</div>
          <div className="text-xs text-gray-500">Home</div>
        </div>

        <div className="mx-4 text-2xl font-bold text-gray-400">VS</div>

        <div className="text-center flex-1">
          <div className="font-bold text-lg">{match.awayTeam}</div>
          <div className="text-xs text-gray-500">Away</div>
        </div>
      </div>

      <div className="text-center border-t pt-3">
        <div className="text-sm font-medium text-gray-700">{formatDate(match.datetime)}</div>
        <div className="text-xs text-gray-500">{match.location}</div>
      </div>
    </motion.div>
  );
}

// News Feed Component
interface NewsFeedProps {
  news: NewsItem[];
}

export function NewsFeed({ news }: NewsFeedProps) {
  const getCategoryColor = (category: string, urgent?: boolean) => {
    if (urgent) return 'bg-red-100 text-red-800 border-red-200';
    switch (category) {
      case 'match': return 'bg-green-100 text-green-800 border-green-200';
      case 'club': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString('en-IE', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-gray-800 mb-4">Latest News</h3>
      
      {news.slice(0, 3).map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
        >
          <div className="flex items-start justify-between mb-2">
            <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(item.category, item.urgent)}`}>
              {item.urgent ? 'URGENT' : item.category.toUpperCase()}
            </span>
            <span className="text-xs text-gray-500">{formatTime(item.timestamp)}</span>
          </div>
          
          <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
          <p className="text-sm text-gray-600 line-clamp-2">{item.summary}</p>
        </motion.div>
      ))}
    </div>
  );
}

// Bottom Navigation
interface BottomNavProps {
  currentScreen: string;
  onScreenChange: (screen: string) => void;
}

export function BottomNav({ currentScreen, onScreenChange }: BottomNavProps) {
  const navItems = [
    { id: 'dashboard', icon: '🏠', label: 'Home' },
    { id: 'match-record', icon: '⚽', label: 'Record' },
    { id: 'fixtures', icon: '📅', label: 'Fixtures' },
    { id: 'teams', icon: '👥', label: 'Teams' },
    { id: 'notifications', icon: '🔔', label: 'News' }
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 safe-area-bottom"
    >
      <div className="flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onScreenChange(item.id)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
              currentScreen === item.id
                ? 'text-[#972A4C] bg-[#972A4C]/10'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="text-xl mb-1">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </motion.nav>
  );
}

// Loading Component
export function MobileLoading() {
  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-3 border-[#972A4C] border-t-transparent rounded-full"
      />
    </div>
  );
}

// Error Component
export function MobileError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="text-center p-8">
      <div className="text-4xl mb-4">😞</div>
      <h3 className="font-bold text-gray-900 mb-2">Oops!</h3>
      <p className="text-sm text-gray-600 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="bg-[#972A4C] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#972A4C]/90 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}