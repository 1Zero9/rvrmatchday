import StandardLayout from '../../components/StandardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AdminPortal() {
  return (
    <StandardLayout title="Admin Portal">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">🔐</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin Portal</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Administrative tools and management resources for club officials
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* Access Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-amber-50 border border-amber-200 rounded-lg p-8 mb-8"
            >
              <div className="flex items-center mb-4">
                <div className="bg-amber-500 text-white rounded p-2 mr-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-amber-900">Restricted Access Area</h2>
              </div>
              <p className="text-amber-800 mb-4">
                This section is restricted to authorized club administrators only. Please log in with your admin credentials to access management tools and sensitive club information.
              </p>
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Administrator Login</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" placeholder="Enter admin username" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" placeholder="Enter password" />
                  </div>
                  <button className="w-full bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-amber-700 transition-colors">
                    Login to Admin Portal
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Admin Tools Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Admin Tools</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-6 opacity-75">
                  <div className="flex items-center mb-3">
                    <div className="bg-gray-400 text-white rounded p-2 mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-600">Member Management</h3>
                  </div>
                  <p className="text-gray-500 text-sm">View and manage all club members, registrations, and renewals</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 opacity-75">
                  <div className="flex items-center mb-3">
                    <div className="bg-gray-400 text-white rounded p-2 mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-600">Financial Management</h3>
                  </div>
                  <p className="text-gray-500 text-sm">Track membership fees, expenses, and generate financial reports</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 opacity-75">
                  <div className="flex items-center mb-3">
                    <div className="bg-gray-400 text-white rounded p-2 mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-600">Fixtures & Results</h3>
                  </div>
                  <p className="text-gray-500 text-sm">Update match fixtures, results, and league tables</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 opacity-75">
                  <div className="flex items-center mb-3">
                    <div className="bg-gray-400 text-white rounded p-2 mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-600">Communications</h3>
                  </div>
                  <p className="text-gray-500 text-sm">Send newsletters, manage mailing lists, and team communications</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 opacity-75">
                  <div className="flex items-center mb-3">
                    <div className="bg-gray-400 text-white rounded p-2 mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-600">Equipment & Facilities</h3>
                  </div>
                  <p className="text-gray-500 text-sm">Manage equipment inventory and facility bookings</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 opacity-75">
                  <div className="flex items-center mb-3">
                    <div className="bg-gray-400 text-white rounded p-2 mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-600">Compliance & Governance</h3>
                  </div>
                  <p className="text-gray-500 text-sm">Safeguarding records, policies, and regulatory compliance</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> All admin tools require proper authentication and role-based permissions. Contact the club secretary for access credentials or technical support.
                </p>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">Generate Member Reports</h3>
                    <p className="text-gray-600 text-sm">Export current member lists and registration status</p>
                  </div>
                  <button className="bg-gray-400 text-white px-4 py-2 rounded text-sm cursor-not-allowed" disabled>
                    Login Required
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">Send Club Newsletter</h3>
                    <p className="text-gray-600 text-sm">Compose and send newsletter to all members</p>
                  </div>
                  <button className="bg-gray-400 text-white px-4 py-2 rounded text-sm cursor-not-allowed" disabled>
                    Login Required
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">Update Match Results</h3>
                    <p className="text-gray-600 text-sm">Enter results for recent fixtures</p>
                  </div>
                  <button className="bg-gray-400 text-white px-4 py-2 rounded text-sm cursor-not-allowed" disabled>
                    Login Required
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">Backup System Data</h3>
                    <p className="text-gray-600 text-sm">Create backup of club database and files</p>
                  </div>
                  <button className="bg-gray-400 text-white px-4 py-2 rounded text-sm cursor-not-allowed" disabled>
                    Login Required
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            
            {/* Members Area Navigation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Members Area</h3>
              <nav className="space-y-2">
                <Link href="/members/parents" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50">Parents Area</Link>
                <Link href="/members/coaches" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50">Coaches Area</Link>
                <div className="bg-gradient-to-r from-amber-50 to-red-50 text-amber-700 px-3 py-2 rounded font-medium">Admin Portal</div>
              </nav>
            </motion.div>

            {/* System Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Website Status:</span>
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-600">Online</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Database:</span>
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-600">Connected</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Backup:</span>
                  <span className="text-gray-700">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Sessions:</span>
                  <span className="text-blue-600">3</span>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Admin Activity</h3>
              <div className="space-y-3 text-sm">
                <div className="border-l-3 border-blue-300 pl-3">
                  <p className="font-medium text-gray-700">New member registration</p>
                  <p className="text-gray-500">2 hours ago</p>
                </div>
                <div className="border-l-3 border-green-300 pl-3">
                  <p className="font-medium text-gray-700">Match result updated</p>
                  <p className="text-gray-500">1 day ago</p>
                </div>
                <div className="border-l-3 border-orange-300 pl-3">
                  <p className="font-medium text-gray-700">System backup completed</p>
                  <p className="text-gray-500">2 days ago</p>
                </div>
              </div>
            </motion.div>

            {/* Emergency Contacts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="bg-red-50 border border-red-200 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-red-900 mb-4">Emergency Contacts</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-red-900">Club Chairman</p>
                  <p className="text-red-700">Patrick O'Sullivan</p>
                  <p className="text-red-600">+353 87 123 4560</p>
                </div>
                <div>
                  <p className="font-medium text-red-900">Club Secretary</p>
                  <p className="text-red-700">John Murphy</p>
                  <p className="text-red-600">+353 87 123 4561</p>
                </div>
                <div>
                  <p className="font-medium text-red-900">Technical Support</p>
                  <p className="text-red-700">IT Support Team</p>
                  <p className="text-red-600">support@rvrfc.com</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
}