/**
 * 📱 MOBILE DASHBOARD
 * Main mobile app home screen
 * Optimized for speed and touch interaction
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  QuickActionCard, 
  MatchPreviewCard, 
  NewsFeed,
  MobileLoading,
  MobileError,
  type QuickAction,
  type MatchPreview,
  type NewsItem 
} from './MobileAppCore';

interface MobileDashboardProps {
  onNavigate: (screen: string) => void;
  user?: any;
}

export default function MobileDashboard({ onNavigate, user }: MobileDashboardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextMatch, setNextMatch] = useState<MatchPreview | null>(null);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);

  // Quick Actions for different user types
  const getQuickActions = (): QuickAction[] => {
    const baseActions: QuickAction[] = [
      {
        id: 'fixtures',
        title: 'Fixtures',
        subtitle: 'View upcoming matches',
        icon: '📅',
        color: 'bg-gradient-to-br from-blue-500 to-blue-600',
        action: () => onNavigate('fixtures')
      },
      {
        id: 'teams',
        title: 'Teams',
        subtitle: 'Browse all squads',
        icon: '👥',
        color: 'bg-gradient-to-br from-purple-500 to-purple-600',
        action: () => onNavigate('teams')
      },
      {
        id: 'results',
        title: 'Results',
        subtitle: 'Latest scores',
        icon: '🏆',
        color: 'bg-gradient-to-br from-green-500 to-green-600',
        action: () => onNavigate('fixtures')
      },
      {
        id: 'contact',
        title: 'Contact',
        subtitle: 'Get in touch',
        icon: '📞',
        color: 'bg-gradient-to-br from-orange-500 to-orange-600',
        action: () => window.open('/contact', '_blank')
      }
    ];

    // Add coaching tools if user is authenticated
    if (user) {
      baseActions.unshift({
        id: 'match-record',
        title: 'Record Match',
        subtitle: 'Quick score entry',
        icon: '⚽',
        color: 'bg-gradient-to-br from-[#972A4C] to-red-600',
        action: () => onNavigate('match-record'),
        badge: 'NEW'
      });
    }

    return baseActions.slice(0, 4); // Max 4 actions for clean layout
  };

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Simulate API calls - replace with real data loading
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock next match data
        setNextMatch({
          id: '1',
          homeTeam: 'RVR Rangers U12',
          awayTeam: 'Castleknock Celtic',
          datetime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          location: 'Rivervalley Sports Ground',
          isHome: true
        });

        // Mock news data
        setLatestNews([
          {
            id: '1',
            title: 'Training Session Tomorrow',
            summary: 'U12 team training at 6pm. Please bring boots and water.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            category: 'club'
          },
          {
            id: '2',
            title: 'Match Postponed',
            summary: 'Saturday match vs Blanchardstown postponed due to weather.',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
            category: 'match',
            urgent: true
          },
          {
            id: '3',
            title: 'Great Win Last Weekend!',
            summary: 'U10s secured a fantastic 3-1 victory. Well done team!',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            category: 'match'
          }
        ]);

        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('Failed to load dashboard. Please try again.');
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>
        <MobileLoading />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <MobileError 
          message={error} 
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }

  return (
    <div className="pb-24"> {/* Space for bottom nav */}
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-gradient-to-br from-[#972A4C] to-[#5E7794] text-white"
      >
        <h2 className="text-2xl font-bold mb-2">
          Welcome{user ? ` back, ${user.name?.split(' ')[0]}` : ' to RVR AFC'}!
        </h2>
        <p className="text-white/80">
          {user ? 'Ready to record some matches?' : 'Your mobile gateway to club information'}
        </p>
      </motion.div>

      {/* Quick Actions */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          {getQuickActions().map((action, index) => (
            <QuickActionCard
              key={action.id}
              action={action}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Next Match Preview */}
      {nextMatch && (
        <div className="px-6 mb-6">
          <MatchPreviewCard match={nextMatch} />
        </div>
      )}

      {/* News Feed */}
      <div className="px-6 mb-6">
        <NewsFeed news={latestNews} />
      </div>

      {/* Club Stats Quick View */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mx-6 mb-6 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h3 className="font-bold text-gray-800 mb-4">Club At A Glance</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-[#972A4C]">18</div>
            <div className="text-xs text-gray-600">Teams</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#972A4C]">350+</div>
            <div className="text-xs text-gray-600">Players</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#972A4C]">42</div>
            <div className="text-xs text-gray-600">Years</div>
          </div>
        </div>
      </motion.div>

      {/* Help Tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mx-6 mb-6 bg-blue-50 rounded-xl p-4 border border-blue-200"
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-semibold text-blue-900 text-sm">Pro Tip</h4>
            <p className="text-blue-700 text-xs">
              Use the Record Match feature during games for real-time scoring!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}