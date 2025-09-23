/**
 * News Management Admin Portal
 * Dedicated page for creating and managing news articles
 */

import StandardLayout from '../../components/StandardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import NewsManager from '../../components/admin/NewsManager';
import { RequireAuth } from '../../components/SecureAuth';

function NewsManagementPortal() {
  return (
    <StandardLayout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <motion.div 
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📰 News Management Portal</h1>
              <p className="text-gray-600">Create and manage news articles and announcements</p>
            </div>
            <div className="flex space-x-4">
              <Link 
                href="/admin/tools"
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                ← Tools Portal
              </Link>
              <Link 
                href="/admin"
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Admin Dashboard
              </Link>
              <Link 
                href="/admin/users"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Users Portal →
              </Link>
            </div>
          </motion.div>

          {/* News Management Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <NewsManager />
            </div>
          </motion.div>

        </div>
      </div>
    </StandardLayout>
  );
}

// Secure wrapper for news management portal
export default function NewsManagementPage() {
  return (
    <RequireAuth>
      <NewsManagementPortal />
    </RequireAuth>
  );
}