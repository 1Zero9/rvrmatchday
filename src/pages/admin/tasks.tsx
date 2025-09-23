/**
 * Task Management Admin Portal
 * Dedicated page for development and administrative task tracking
 */

import StandardLayout from '../../components/StandardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AdminTodoList from '../../components/AdminTodoList';
import { RequireAuth } from '../../components/SecureAuth';

function TaskManagementPortal() {
  return (
    <StandardLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <motion.div 
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">✅ Task Management Portal</h1>
              <p className="text-gray-600">Development and administrative task tracking</p>
            </div>
            <div className="flex space-x-4">
              <Link 
                href="/admin/status"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                ← Status Portal
              </Link>
              <Link 
                href="/admin"
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Admin Dashboard
              </Link>
              <Link 
                href="/admin/sitemap"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Sitemap Portal →
              </Link>
            </div>
          </motion.div>

          {/* Task Management Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <AdminTodoList />
            </div>
          </motion.div>

        </div>
      </div>
    </StandardLayout>
  );
}

// Secure wrapper for task management portal
export default function TaskManagementPage() {
  return (
    <RequireAuth>
      <TaskManagementPortal />
    </RequireAuth>
  );
}