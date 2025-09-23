/**
 * Sitemap Admin Portal
 * Dedicated page for site structure analysis
 */

import StandardLayout from '../../components/StandardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AdminSiteMap from '../../components/AdminSiteMap';
import { RequireAuth } from '../../components/SecureAuth';

function SitemapPortal() {
  return (
    <StandardLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <motion.div 
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🗺️ Site Structure Portal</h1>
              <p className="text-gray-600">Complete site map and page analysis</p>
            </div>
            <div className="flex space-x-4">
              <Link 
                href="/admin/tasks"
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                ← Tasks Portal
              </Link>
              <Link 
                href="/admin"
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Admin Dashboard
              </Link>
              <Link 
                href="/admin/tools"
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Tools Portal →
              </Link>
            </div>
          </motion.div>

          {/* Sitemap Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <AdminSiteMap />
            </div>
          </motion.div>

        </div>
      </div>
    </StandardLayout>
  );
}

// Secure wrapper for sitemap portal
export default function SitemapPage() {
  return (
    <RequireAuth>
      <SitemapPortal />
    </RequireAuth>
  );
}