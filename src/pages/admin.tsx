import StandardLayout from '../components/StandardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple demo login (in real app, this would be proper authentication)
    if (loginForm.username === 'admin' && loginForm.password === 'rvrfc2025') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials. Try: admin / rvrfc2025');
    }
  };

  const siteStatus = {
    lastUpdated: '2025-01-21 14:30:00',
    totalPages: 42,
    activePushes: 3,
    pendingChanges: 5,
    uptime: '99.9%',
    lastBackup: '2025-01-21 02:00:00'
  };

  const recentChanges = [
    { date: '2025-01-21 14:15', user: 'Design Team', action: 'Updated hero section CTAs on home page', status: 'live' },
    { date: '2025-01-21 13:45', user: 'Content Team', action: 'Added new coach recruitment page', status: 'live' },
    { date: '2025-01-21 12:30', user: 'Admin', action: 'Updated sponsor logos section', status: 'pending' },
    { date: '2025-01-21 11:15', user: 'Design Team', action: 'Fixed hero section height responsiveness', status: 'live' },
    { date: '2025-01-21 10:00', user: 'Content Team', action: 'Added template instructions for image replacement', status: 'live' }
  ];

  if (!isLoggedIn) {
    return (
      <StandardLayout title="Admin Login">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <div className="text-center">
                <div className="text-6xl mb-4">🔐</div>
                <h2 className="text-3xl font-bold text-gray-900">Admin Access</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Secure dashboard for site management
                </p>
              </div>
            </div>
            
            <motion.form 
              className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-lg"
              onSubmit={handleLogin}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter username"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Sign In
                </button>
              </div>
              
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Demo credentials: admin / rvrfc2025
                </p>
              </div>
            </motion.form>
          </div>
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout title="Admin Dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Site Dashboard</h1>
            <p className="text-gray-600">Monitor and manage RVRFC website</p>
          </div>
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Site Status Cards */}
            <motion.div 
              className="grid md:grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-3xl mb-2">🟢</div>
                <h3 className="text-lg font-semibold text-gray-900">Site Status</h3>
                <p className="text-2xl font-bold text-green-600">Online</p>
                <p className="text-sm text-gray-600">Uptime: {siteStatus.uptime}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-3xl mb-2">📄</div>
                <h3 className="text-lg font-semibold text-gray-900">Total Pages</h3>
                <p className="text-2xl font-bold text-blue-600">{siteStatus.totalPages}</p>
                <p className="text-sm text-gray-600">All sections</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-3xl mb-2">⏳</div>
                <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
                <p className="text-2xl font-bold text-orange-600">{siteStatus.pendingChanges}</p>
                <p className="text-sm text-gray-600">Changes waiting</p>
              </div>
            </motion.div>

            {/* Recent Changes */}
            <motion.div 
              className="bg-white rounded-lg shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Changes</h2>
              <div className="space-y-3">
                {recentChanges.map((change, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{change.action}</p>
                      <p className="text-xs text-gray-600">by {change.user} • {change.date}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      change.status === 'live' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {change.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* System Information */}
            <motion.div 
              className="bg-white rounded-lg shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">System Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium">{siteStatus.lastUpdated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Deployments:</span>
                    <span className="font-medium">{siteStatus.activePushes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Framework:</span>
                    <span className="font-medium">Next.js 15.4.6</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Backup:</span>
                    <span className="font-medium">{siteStatus.lastBackup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Environment:</span>
                    <span className="font-medium">Production</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">CDN Status:</span>
                    <span className="font-medium text-green-600">Active</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Quick Actions */}
            <motion.div 
              className="bg-white rounded-lg shadow p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  📝 View Change Log
                </button>
                <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  🔄 Refresh Cache
                </button>
                <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  📊 Analytics Report
                </button>
                <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  🛡️ Security Scan
                </button>
                <hr className="my-2" />
                <Link href="/home" className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  🏠 View Live Site
                </Link>
              </div>
            </motion.div>

            {/* Environment Status */}
            <motion.div 
              className="bg-white rounded-lg shadow p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Environment Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Production</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">Live</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Staging</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">Ready</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Development</span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">Active</span>
                </div>
              </div>
            </motion.div>

            {/* Alerts */}
            <motion.div 
              className="bg-white rounded-lg shadow p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-900">✅ All systems operational</p>
                  <p className="text-xs text-green-700">Last check: 5 minutes ago</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">ℹ️ Scheduled maintenance</p>
                  <p className="text-xs text-blue-700">Sunday 3AM - Database optimization</p>
                </div>
              </div>
            </motion.div>

            {/* Version Info */}
            <motion.div 
              className="bg-gray-50 rounded-lg p-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <h4 className="font-semibold text-gray-900 mb-2">Site Version</h4>
              <p className="text-sm text-gray-600">v2.1.0 - Community Design</p>
              <p className="text-xs text-gray-500 mt-1">Released: January 21, 2025</p>
            </motion.div>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
}