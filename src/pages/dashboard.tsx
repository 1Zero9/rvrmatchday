import StandardLayout from '../components/StandardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
    <StandardLayout title="Live Dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">⚽</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Match Central</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your complete matchday experience - live scores, fixtures, and results
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          
          {/* Recent Results */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
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
          </motion.div>

          {/* Upcoming Fixtures */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
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
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Season Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-green-600 mb-2">15</p>
              <p className="text-sm text-gray-600">Matches Won</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-yellow-600 mb-2">6</p>
              <p className="text-sm text-gray-600">Draws</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-600 mb-2">4</p>
              <p className="text-sm text-gray-600">Matches Lost</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600 mb-2">42</p>
              <p className="text-sm text-gray-600">Goals Scored</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <Link 
            href="/match-central/fixtures"
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-center"
          >
            <div className="text-3xl mb-3">📅</div>
            <h3 className="text-lg font-semibold mb-2">Full Fixtures</h3>
            <p className="text-green-100 text-sm">Complete match schedule</p>
          </Link>
          
          <Link 
            href="/match-central/results"
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 text-center"
          >
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="text-lg font-semibold mb-2">All Results</h3>
            <p className="text-blue-100 text-sm">Season match results</p>
          </Link>
          
          <Link 
            href="/match-central/tables"
            className="bg-gradient-to-r from-purple-600 to-violet-600 text-white p-6 rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-300 text-center"
          >
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold mb-2">League Tables</h3>
            <p className="text-purple-100 text-sm">Current standings</p>
          </Link>
        </motion.div>

      </div>
    </StandardLayout>
  );
}