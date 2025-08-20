import StandardLayout from '@/components/StandardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Results() {
  return (
    <StandardLayout title="Results">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-8"
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Match Results
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              View comprehensive match results, scores, and detailed reports from all our teams. 
              Track performance and celebrate achievements across the club.
            </p>
          </div>

          {/* Coming Soon Banner */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-8 text-center text-white">
            <div className="text-4xl mb-4">⚙️</div>
            <h2 className="text-2xl font-bold mb-4">Under Development</h2>
            <p className="text-lg opacity-90 mb-6">
              We're creating a comprehensive results system featuring detailed match reports, 
              player statistics, photo galleries, and performance analytics.
            </p>
            <div className="text-sm opacity-75">
              Coming features: Match reports • Player stats • Team performance • Photo galleries • Video highlights
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
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Detailed Reports</h3>
            <p className="text-gray-600 text-sm">
              In-depth match analysis with goal scorers, assists, and key moments from every game.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl mb-4">👤</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Player Statistics</h3>
            <p className="text-gray-600 text-sm">
              Track individual player performance, goals, assists, and appearances throughout the season.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl mb-4">📸</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Match Gallery</h3>
            <p className="text-gray-600 text-sm">
              Photo galleries and video highlights from matches to capture and share memorable moments.
            </p>
          </div>
        </motion.div>

        {/* Recent Results Preview */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Recent Results Preview
          </h3>
          <div className="space-y-4">
            {/* Sample Result Cards */}
            <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">U12 Division 1</div>
                <div className="font-semibold">Rivervalley Rangers vs St. Mary's FC</div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-green-600">3-1</span>
                <span className="text-sm text-gray-500">Win</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">U14 Division 2</div>
                <div className="font-semibold">Celtic FC vs Rivervalley Rangers</div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-blue-600">2-2</span>
                <span className="text-sm text-gray-500">Draw</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">Senior Squad</div>
                <div className="font-semibold">Rivervalley Rangers vs United FC</div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-green-600">4-0</span>
                <span className="text-sm text-gray-500">Win</span>
              </div>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">Sample data - Full results system coming soon</p>
          </div>
        </motion.div>

        {/* Navigation Links */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
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
            
            <Link href="/match-central/tables" className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">📋</div>
              <div className="font-semibold text-gray-900">League Tables</div>
              <div className="text-sm text-gray-600">Standings & statistics</div>
            </Link>
          </div>
          
          <div className="text-center mt-6">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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