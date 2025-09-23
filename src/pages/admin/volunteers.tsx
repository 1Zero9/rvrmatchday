/**
 * Volunteer Admin Portal
 * Dedicated page for managing volunteer opportunities and signups
 */

import StandardLayout from '../../components/StandardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import VolunteerManager from '../../components/admin/VolunteerManager';
import VolunteerSignupManager from '../../components/admin/VolunteerSignupManager';
import VolunteerNotifications from '../../components/admin/VolunteerNotifications';
import { RequireAuth } from '../../components/SecureAuth';

function VolunteerPortal() {
  const [activeTab, setActiveTab] = useState<'opportunities' | 'signups'>('opportunities');

  return (
    <StandardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Volunteer Notifications */}
          <VolunteerNotifications />
          
          {/* Header */}
          <motion.div 
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🤝 Volunteer Management Portal</h1>
              <p className="text-gray-600">Manage volunteer opportunities and review signups</p>
            </div>
            <div className="flex space-x-4">
              <Link 
                href="/admin/news"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                ← News Portal
              </Link>
              <Link 
                href="/admin"
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Admin Dashboard
              </Link>
              <Link 
                href="/admin/events"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Events Portal →
              </Link>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('opportunities')}
                className={`flex-1 px-6 py-4 text-lg font-semibold transition-all ${
                  activeTab === 'opportunities'
                    ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  🎯 Volunteer Opportunities
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Manage
                  </span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab('signups')}
                className={`flex-1 px-6 py-4 text-lg font-semibold transition-all ${
                  activeTab === 'signups'
                    ? 'bg-purple-600 text-white border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  📋 Volunteer Signups
                  <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    Review
                  </span>
                </span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'opportunities' && (
                <motion.div
                  key="opportunities"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Volunteer Opportunities Management</h2>
                    <p className="text-gray-600">
                      Create, edit, and manage volunteer opportunities. These will be displayed on the public volunteer page 
                      where club members can sign up.
                    </p>
                  </div>
                  <VolunteerManager />
                </motion.div>
              )}

              {activeTab === 'signups' && (
                <motion.div
                  key="signups"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Volunteer Signup Verification</h2>
                    <p className="text-gray-600">
                      Review and verify volunteer signups. Approve suitable candidates and communicate with potential volunteers 
                      through the verification process.
                    </p>
                  </div>
                  <VolunteerSignupManager />
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-blue-600">-</div>
              <div className="text-sm text-gray-600">Active Opportunities</div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl mb-2">⏳</div>
              <div className="text-2xl font-bold text-yellow-600">-</div>
              <div className="text-sm text-gray-600">Pending Reviews</div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-green-600">-</div>
              <div className="text-sm text-gray-600">Approved Volunteers</div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl mb-2">🎉</div>
              <div className="text-2xl font-bold text-purple-600">-</div>
              <div className="text-sm text-gray-600">Completed Tasks</div>
            </div>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 bg-white rounded-lg shadow p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">📚 How to Use the Volunteer Management System</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Managing Opportunities</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Create volunteer opportunities with detailed descriptions</li>
                  <li>• Set requirements, skills needed, and contact information</li>
                  <li>• Control visibility with active/inactive status</li>
                  <li>• Track how many volunteers have signed up</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Processing Signups</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Review volunteer applications and experience</li>
                  <li>• Approve or reject with detailed admin notes</li>
                  <li>• Track volunteer progress from signup to completion</li>
                  <li>• Maintain records for future opportunities</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>💡 Pro Tip:</strong> Use the search and filter functions to quickly find specific opportunities or signups. 
                The system automatically updates volunteer counts when signups are approved.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </StandardLayout>
  );
}

// Secure wrapper for volunteer portal
export default function VolunteerPage() {
  return (
    <RequireAuth>
      <VolunteerPortal />
    </RequireAuth>
  );
}