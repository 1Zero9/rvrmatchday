/**
 * Site Status Admin Portal
 * Dedicated page for monitoring site health and performance
 */

import StandardLayout from '../../components/StandardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SiteStatusReport from '../../components/admin/SiteStatusReport';
import { RequireAuth } from '../../components/SecureAuth';

function SiteStatusPortal() {
  return (
    <StandardLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <motion.div 
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📊 Site Status Portal</h1>
              <p className="text-gray-600">Real-time site health and performance monitoring</p>
            </div>
            <div className="flex space-x-4">
              <Link 
                href="/admin/events"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                ← Events Portal
              </Link>
              <Link 
                href="/admin"
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Admin Dashboard
              </Link>
              <Link 
                href="/admin/tasks"
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Tasks Portal →
              </Link>
            </div>
          </motion.div>

          {/* Site Status Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <SiteStatusReport />
            </div>
          </motion.div>

        </div>
      </div>
    </StandardLayout>
  );
}

// Secure wrapper for site status portal
export default function SiteStatusPage() {
  return (
    <RequireAuth>
      <SiteStatusPortal />
    </RequireAuth>
  );
}