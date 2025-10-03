/**
 * 📱 MOBILE FIXTURES & RESULTS
 * Clean list view optimized for mobile browsing
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MobileLoading, MobileError } from './MobileAppCore';

interface Fixture {
  id: string;
  homeTeam: string;
  awayTeam: string;
  datetime: Date;
  location: string;
  homeScore?: number;
  awayScore?: number;
  status: 'upcoming' | 'live' | 'completed' | 'postponed';
  division: string;
}

interface MobileFixturesProps {
  onBack: () => void;
}

export default function MobileFixtures({ onBack }: MobileFixturesProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'results'>('all');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');

  // Load fixtures data
  useEffect(() => {
    const loadFixtures = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock fixtures data
        setFixtures([
          {
            id: '1',
            homeTeam: 'RVR Rangers U12',
            awayTeam: 'Castleknock Celtic',
            datetime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            location: 'Rivervalley Sports Ground',
            status: 'upcoming',
            division: 'U12 Premier'
          },
          {
            id: '2',
            homeTeam: 'Blanchardstown United',
            awayTeam: 'RVR Rangers U10',
            datetime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            location: 'Blanchardstown FC',
            status: 'upcoming',
            division: 'U10 Division 1'
          },
          {
            id: '3',
            homeTeam: 'RVR Rangers Girls U14',
            awayTeam: 'Swords Celtic',
            datetime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            location: 'Rivervalley Sports Ground',
            homeScore: 3,
            awayScore: 1,
            status: 'completed',
            division: 'Girls U14 League'
          },
          {
            id: '4',
            homeTeam: 'Cabinteely FC',
            awayTeam: 'RVR Rangers U16',
            datetime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            location: 'Cabinteely FC',
            homeScore: 2,
            awayScore: 4,
            status: 'completed',
            division: 'U16 Premier'
          },
          {
            id: '5',
            homeTeam: 'RVR Rangers U8',
            awayTeam: 'Finglas United',
            datetime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            location: 'Rivervalley Sports Ground',
            status: 'postponed',
            division: 'U8 Developmental'
          }
        ]);

        setIsLoading(false);
      } catch (err) {
        setError('Failed to load fixtures');
        setIsLoading(false);
      }
    };

    loadFixtures();
  }, []);

  // Filter fixtures
  const filteredFixtures = fixtures.filter(fixture => {
    if (filter === 'upcoming' && fixture.status !== 'upcoming') return false;
    if (filter === 'results' && fixture.status !== 'completed') return false;
    if (selectedTeam !== 'all' && !fixture.homeTeam.includes(selectedTeam) && !fixture.awayTeam.includes(selectedTeam)) return false;
    return true;
  });

  // Get status display
  const getStatusDisplay = (fixture: Fixture) => {
    switch (fixture.status) {
      case 'upcoming':
        return {
          text: formatDateTime(fixture.datetime),
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          icon: '📅'
        };
      case 'completed':
        return {
          text: `${fixture.homeScore} - ${fixture.awayScore}`,
          color: 'text-green-600',
          bg: 'bg-green-50',
          icon: '✅'
        };
      case 'live':
        return {
          text: 'LIVE',
          color: 'text-red-600',
          bg: 'bg-red-50',
          icon: '🔴'
        };
      case 'postponed':
        return {
          text: 'POSTPONED',
          color: 'text-orange-600',
          bg: 'bg-orange-50',
          icon: '⏸️'
        };
      default:
        return {
          text: 'Unknown',
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          icon: '❓'
        };
    }
  };

  // Format date and time
  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-IE', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get unique teams for filter
  const teams = Array.from(new Set([
    ...fixtures.flatMap(f => [f.homeTeam, f.awayTeam])
  ])).filter(team => team.includes('RVR')).sort();

  if (isLoading) {
    return (
      <div className="p-6">
        <MobileLoading />
        <p className="text-center text-gray-600 mt-4">Loading fixtures...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <MobileError message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="pb-24 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <span className="text-xl">←</span>
            <span>Back</span>
          </button>
          <h1 className="font-bold text-lg">Fixtures & Results</h1>
          <div className="w-16"></div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 p-4 space-y-4">
        {/* Status Filter */}
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'All', icon: '📋' },
            { key: 'upcoming', label: 'Upcoming', icon: '📅' },
            { key: 'results', label: 'Results', icon: '🏆' }
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => setFilter(option.key as any)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                filter === option.key
                  ? 'bg-[#972A4C] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>

        {/* Team Filter */}
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700"
        >
          <option value="all">All RVR Teams</option>
          {teams.map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>
      </div>

      {/* Fixtures List */}
      <div className="p-4 space-y-3">
        <AnimatePresence>
          {filteredFixtures.map((fixture, index) => {
            const status = getStatusDisplay(fixture);
            return (
              <motion.div
                key={fixture.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                {/* Division */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {fixture.division}
                  </span>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${status.bg}`}>
                    <span className="text-xs">{status.icon}</span>
                    <span className={`text-xs font-medium ${status.color}`}>
                      {status.text}
                    </span>
                  </div>
                </div>

                {/* Teams */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1 text-center">
                    <div className={`font-semibold ${fixture.homeTeam.includes('RVR') ? 'text-[#972A4C]' : 'text-gray-900'}`}>
                      {fixture.homeTeam}
                    </div>
                    <div className="text-xs text-gray-500">Home</div>
                    {fixture.status === 'completed' && (
                      <div className="text-2xl font-bold text-gray-900 mt-1">
                        {fixture.homeScore}
                      </div>
                    )}
                  </div>

                  <div className="mx-4 text-xl font-bold text-gray-400">
                    {fixture.status === 'completed' ? '-' : 'VS'}
                  </div>

                  <div className="flex-1 text-center">
                    <div className={`font-semibold ${fixture.awayTeam.includes('RVR') ? 'text-[#972A4C]' : 'text-gray-900'}`}>
                      {fixture.awayTeam}
                    </div>
                    <div className="text-xs text-gray-500">Away</div>
                    {fixture.status === 'completed' && (
                      <div className="text-2xl font-bold text-gray-900 mt-1">
                        {fixture.awayScore}
                      </div>
                    )}
                  </div>
                </div>

                {/* Location & Time */}
                <div className="border-t pt-3 text-center">
                  <div className="text-sm text-gray-700">{fixture.location}</div>
                  {fixture.status === 'upcoming' && (
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDateTime(fixture.datetime)}
                    </div>
                  )}
                </div>

                {/* Quick Actions for RVR matches */}
                {fixture.homeTeam.includes('RVR') || fixture.awayTeam.includes('RVR') ? (
                  <div className="flex space-x-2 mt-3 pt-3 border-t">
                    <button className="flex-1 bg-blue-50 text-blue-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                      📍 Directions
                    </button>
                    <button className="flex-1 bg-green-50 text-green-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">
                      📞 Contact
                    </button>
                  </div>
                ) : null}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty State */}
        {filteredFixtures.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📅</div>
            <h3 className="font-bold text-gray-900 mb-2">No fixtures found</h3>
            <p className="text-gray-600 text-sm">
              Try adjusting your filters or check back later
            </p>
          </motion.div>
        )}
      </div>

      {/* Quick Add Button (for coaches) */}
      <div className="fixed bottom-20 right-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="bg-[#972A4C] text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl"
        >
          +
        </motion.button>
      </div>
    </div>
  );
}