import StandardLayout from '../../components/StandardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Tables() {
  return (
    <StandardLayout title="League Tables">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-8"
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📋</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              League Tables
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Track standings, statistics, and league positions for all our teams across different 
              divisions and age groups throughout the season.
            </p>
          </div>

          {/* Coming Soon Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-center text-white">
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-2xl font-bold mb-4">Building League System</h2>
            <p className="text-lg opacity-90 mb-6">
              We're developing a comprehensive league table system that will show real-time standings, 
              team statistics, and detailed performance metrics for all our squads.
            </p>
            <div className="text-sm opacity-75">
              Upcoming features: Live standings • Team stats • Goal difference • Form guides • Head-to-head records
            </div>
          </div>
        </motion.div>

        {/* Feature Preview Cards */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl mb-4">🏅</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Standings</h3>
            <p className="text-gray-600 text-sm">
              Real-time league positions updated automatically after every match result is recorded.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl mb-4">📈</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Metrics</h3>
            <p className="text-gray-600 text-sm">
              Goals scored, conceded, goal difference, and form guides for comprehensive team analysis.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Division</h3>
            <p className="text-gray-600 text-sm">
              Track all our teams across different age groups, divisions, and competition levels.
            </p>
          </div>
        </motion.div>

        {/* Sample Table Preview */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            League Table Preview
          </h3>
          <div className="text-center mb-4">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              U14 Division 2 - Sample Data
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left p-3 font-semibold">Pos</th>
                  <th className="text-left p-3 font-semibold">Team</th>
                  <th className="text-center p-3 font-semibold">P</th>
                  <th className="text-center p-3 font-semibold">W</th>
                  <th className="text-center p-3 font-semibold">D</th>
                  <th className="text-center p-3 font-semibold">L</th>
                  <th className="text-center p-3 font-semibold">GF</th>
                  <th className="text-center p-3 font-semibold">GA</th>
                  <th className="text-center p-3 font-semibold">GD</th>
                  <th className="text-center p-3 font-semibold">Pts</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3 font-bold text-green-600">1</td>
                  <td className="p-3 font-semibold">Celtic FC</td>
                  <td className="p-3 text-center">12</td>
                  <td className="p-3 text-center">10</td>
                  <td className="p-3 text-center">1</td>
                  <td className="p-3 text-center">1</td>
                  <td className="p-3 text-center">28</td>
                  <td className="p-3 text-center">8</td>
                  <td className="p-3 text-center text-green-600">+20</td>
                  <td className="p-3 text-center font-bold">31</td>
                </tr>
                <tr className="border-b hover:bg-gray-50 bg-blue-50">
                  <td className="p-3 font-bold text-blue-600">2</td>
                  <td className="p-3 font-semibold text-blue-600">Rivervalley Rangers</td>
                  <td className="p-3 text-center">12</td>
                  <td className="p-3 text-center">9</td>
                  <td className="p-3 text-center">2</td>
                  <td className="p-3 text-center">1</td>
                  <td className="p-3 text-center">26</td>
                  <td className="p-3 text-center">9</td>
                  <td className="p-3 text-center text-green-600">+17</td>
                  <td className="p-3 text-center font-bold">29</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3 font-bold">3</td>
                  <td className="p-3">United FC</td>
                  <td className="p-3 text-center">12</td>
                  <td className="p-3 text-center">7</td>
                  <td className="p-3 text-center">3</td>
                  <td className="p-3 text-center">2</td>
                  <td className="p-3 text-center">22</td>
                  <td className="p-3 text-center">12</td>
                  <td className="p-3 text-center text-green-600">+10</td>
                  <td className="p-3 text-center">24</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">4</td>
                  <td className="p-3">St. Mary's FC</td>
                  <td className="p-3 text-center">12</td>
                  <td className="p-3 text-center">5</td>
                  <td className="p-3 text-center">2</td>
                  <td className="p-3 text-center">5</td>
                  <td className="p-3 text-center">18</td>
                  <td className="p-3 text-center">17</td>
                  <td className="p-3 text-center text-green-600">+1</td>
                  <td className="p-3 text-center">17</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3">5</td>
                  <td className="p-3">Rovers FC</td>
                  <td className="p-3 text-center">12</td>
                  <td className="p-3 text-center">3</td>
                  <td className="p-3 text-center">4</td>
                  <td className="p-3 text-center">5</td>
                  <td className="p-3 text-center">15</td>
                  <td className="p-3 text-center">19</td>
                  <td className="p-3 text-center text-red-600">-4</td>
                  <td className="p-3 text-center">13</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">Sample league table - Live data coming soon</p>
          </div>
        </motion.div>

        {/* Division Categories */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl mb-2">👶</div>
            <div className="font-semibold text-gray-900">Youth (U8-U12)</div>
            <div className="text-sm text-gray-600">6 Teams</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl mb-2">🧒</div>
            <div className="font-semibold text-gray-900">Junior (U13-U16)</div>
            <div className="text-sm text-gray-600">5 Teams</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl mb-2">🧑</div>
            <div className="font-semibold text-gray-900">Senior (U17+)</div>
            <div className="text-sm text-gray-600">3 Teams</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl mb-2">🏆</div>
            <div className="font-semibold text-gray-900">Cup Competitions</div>
            <div className="text-sm text-gray-600">All Ages</div>
          </div>
        </motion.div>

        {/* Navigation Links */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-gray-50 rounded-lg p-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Explore Match Central
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/dashboard" className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold text-gray-900">Live Dashboard</div>
              <div className="text-sm text-gray-600">Real-time match updates</div>
            </Link>
            
            <Link href="/match-central/fixtures" className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">📅</div>
              <div className="font-semibold text-gray-900">Fixtures</div>
              <div className="text-sm text-gray-600">Upcoming matches</div>
            </Link>
            
            <Link href="/match-central/results" className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">🏆</div>
              <div className="font-semibold text-gray-900">Results</div>
              <div className="text-sm text-gray-600">Match results & reports</div>
            </Link>
          </div>
          
          <div className="text-center mt-6">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    </StandardLayout>
  );
}