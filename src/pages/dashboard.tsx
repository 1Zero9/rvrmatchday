/**
 * Live Dashboard - Match Central Hub
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Modern glass morphism dashboard for live match data,
 * fixtures, results, and season statistics.
 */

import StandardLayout from '../components/StandardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GlassCard, GlassActionCard, GlassStats, GlassHero } from '../components/Glass';

export default function LiveDashboard() {
  const recentMatches = [
    {
      id: 1,
      date: '2024-08-18',
      team: 'U12',
      opponent: 'Meadowbrook FC',
      result: '3-2',
      status: 'won',
      venue: 'Home'
    },
    {
      id: 2,
      date: '2024-08-15',
      team: 'First Team',
      opponent: 'Riverside United',
      result: '1-1',
      status: 'draw',
      venue: 'Away'
    },
    {
      id: 3,
      date: '2024-08-12',
      team: 'U16',
      opponent: 'Oakwood Athletic',
      result: '0-2',
      status: 'lost',
      venue: 'Home'
    }
  ];

  const upcomingMatches = [
    {
      id: 1,
      date: '2024-08-25',
      time: '14:30',
      team: 'First Team',
      opponent: 'Greenfield FC',
      venue: 'Away',
      league: 'Division 1A'
    },
    {
      id: 2,
      date: '2024-08-26',
      time: '11:00',
      team: 'U14',
      opponent: 'Hillside Rovers',
      venue: 'Home',
      league: 'Youth League'
    },
    {
      id: 3,
      date: '2024-08-28',
      time: '19:30',
      team: 'Reserve Team',
      opponent: 'Parkside United',
      venue: 'Home',
      league: 'Division 3B'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won':
        return 'bg-green-100 text-green-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      case 'draw':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <StandardLayout>
      {/* 
      ===================================================================
      🎬 DASHBOARD HERO CUSTOMIZATION (NON-CODER FRIENDLY)
      ===================================================================
      
      TO ADD DASHBOARD BACKGROUND IMAGE:
      1. Save your image as: /public/images/dashboard-hero.jpg
      2. Replace the backgroundImage path below
      
      TO ADD VIDEO BACKGROUND:
      1. Save video as: /public/videos/dashboard-hero.mp4
      2. Replace backgroundImage with backgroundVideo="/videos/dashboard-hero.mp4"
      
      BEST DASHBOARD BACKGROUNDS:
      - Match action shots from the pitch
      - Stadium/ground overview
      - Team celebration moments
      - Training session energy
      
      IMAGE SPECS: 1920x1080px minimum, sports action preferred
      ===================================================================
      */}
      <GlassHero 
        backgroundImage="/images/homepg-image1.jpg"
        height="h-[50vh] min-h-[400px]"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white mb-8"
        >
          <div className="text-6xl mb-6">⚽</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Match Central</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Your complete matchday experience - live scores, fixtures, and results
          </p>
        </motion.div>

        {/* Quick Action Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto"
        >
          <GlassActionCard
            icon="📅"
            title="Fixtures"
            description="Upcoming matches"
            href="/match-central/fixtures"
            gradient="blue"
          />
          <GlassActionCard
            icon="🏆"
            title="Results"
            description="Latest scores"
            href="/match-central/results"
            gradient="green"
          />
          <GlassActionCard
            icon="📊"
            title="Tables"
            description="League standings"
            href="/match-central/tables"
            gradient="purple"
          />
        </motion.div>
      </GlassHero>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          
          {/* Recent Results */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassCard intensity="medium" className="p-6 bg-gradient-to-br from-green-50 to-blue-50">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="text-2xl mr-3">🏆</span>
                Recent Results
              </h2>
            
            <div className="space-y-4">
              {recentMatches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{match.team}</h3>
                      <p className="text-sm text-gray-600">vs {match.opponent}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(match.status)}`}>
                      {match.result}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{new Date(match.date).toLocaleDateString()}</span>
                    <span>{match.venue}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            
              <Link 
                href="/match-central/results"
                className="block mt-6 bg-blue-600 text-white text-center font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View All Results
              </Link>
            </GlassCard>
          </motion.div>

          {/* Upcoming Fixtures */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <GlassCard intensity="medium" className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="text-2xl mr-3">📅</span>
                Upcoming Fixtures
              </h2>
            
            <div className="space-y-4">
              {upcomingMatches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{match.team}</h3>
                      <p className="text-sm text-gray-600">vs {match.opponent}</p>
                      <p className="text-xs text-blue-600">{match.league}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{match.time}</p>
                      <p className="text-xs text-gray-500">{match.venue}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(match.date).toLocaleDateString('en-GB', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long' 
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
            
              <Link 
                href="/match-central/fixtures"
                className="block mt-6 bg-green-600 text-white text-center font-semibold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                View All Fixtures
              </Link>
            </GlassCard>
          </motion.div>
        </div>

        {/* Season Statistics - Glass Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Season Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <GlassStats 
                icon="🏆" 
                value="15" 
                label="Matches Won" 
                gradient="green" 
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <GlassStats 
                icon="🤝" 
                value="6" 
                label="Draws" 
                gradient="orange" 
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <GlassStats 
                icon="📉" 
                value="4" 
                label="Matches Lost" 
                gradient="purple" 
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <GlassStats 
                icon="⚽" 
                value="42" 
                label="Goals Scored" 
                gradient="blue" 
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Additional Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="bg-gradient-to-br from-blue-900 via-purple-900 to-green-900 rounded-2xl p-8"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">Match Central Hub</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <GlassActionCard
              icon="📅"
              title="Full Fixtures"
              description="Complete match schedule"
              href="/match-central/fixtures"
              gradient="blue"
              size="lg"
            />
            <GlassActionCard
              icon="🏆"
              title="All Results"
              description="Season match results"
              href="/match-central/results"
              gradient="green"
              size="lg"
            />
            <GlassActionCard
              icon="📊"
              title="League Tables"
              description="Current standings"
              href="/match-central/tables"
              gradient="purple"
              size="lg"
            />
          </div>
        </motion.div>

      </div>
    </StandardLayout>
  );
}