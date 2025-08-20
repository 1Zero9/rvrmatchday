import StandardLayout from '../../components/StandardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Fixtures() {
  return (
    <StandardLayout title="Fixtures">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-8"
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📅</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Upcoming Fixtures
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay up to date with all upcoming matches across all our teams. From youth development to senior squads, never miss a game.
            </p>
          </div>

          {/* Coming Soon Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-center text-white">
            <div className="text-4xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
            <p className="text-lg opacity-90 mb-6">
              We're building an interactive fixtures system that will show all upcoming matches, 
              team schedules, venue information, and match previews.
            </p>
            <div className="text-sm opacity-75">
              Features in development: Live fixture updates • Team filtering • Calendar integration • Match notifications
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
            <div className="text-3xl mb-4">⚽</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All Teams</h3>
            <p className="text-gray-600 text-sm">
              View fixtures for youth teams, senior squads, and development groups all in one place.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl mb-4">📍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Venue Details</h3>
            <p className="text-gray-600 text-sm">
              Get directions, parking information, and facility details for every match venue.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl mb-4">🔔</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Reminders</h3>
            <p className="text-gray-600 text-sm">
              Never miss a match with customizable notifications and calendar integration.
            </p>
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
            
            <Link href="/match-central/results" className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">🏆</div>
              <div className="font-semibold text-gray-900">Results</div>
              <div className="text-sm text-gray-600">Match results & reports</div>
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
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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