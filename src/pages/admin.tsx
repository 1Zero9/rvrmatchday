import StandardLayout from '../components/StandardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import AdminChangelog from '../components/AdminChangelog';
import AdminTodoList from '../components/AdminTodoList';
import AdminSiteMap from '../components/AdminSiteMap';
import UnifiedAccountManagement from '../components/UnifiedAccountManagement';
import SessionRecording from '../components/SessionRecording';
import SiteStatusReport from '../components/admin/SiteStatusReport';
import SpecialEventsManager from '../components/admin/SpecialEventsManager';
import VolunteerNotifications from '../components/admin/VolunteerNotifications';
import { supabase } from '../lib/supabase';
import { AuthProvider, RequireAuth, useAuth } from '../components/SecureAuth';

// Embedded Duplicate Cleaner Tool
function DuplicateCleanerTool() {
  const [duplicates, setDuplicates] = useState([]);
  const [loading, setLoading] = useState(false);

  const findDuplicates = async () => {
    setLoading(true);
    try {
      const { data: matches, error } = await supabase
        .from('matches')
        .select('*');

      if (error) {
        console.error('Error fetching matches:', error);
        return;
      }

      // Find duplicates by comparing home_team, away_team, scheduled_date
      const seen = new Map();
      const duplicateGroups = [];

      matches.forEach(match => {
        const key = `${match.home_team}-${match.away_team}-${match.scheduled_date}`;
        if (seen.has(key)) {
          // Found duplicate
          seen.get(key).push(match);
        } else {
          seen.set(key, [match]);
        }
      });

      // Filter to only groups with more than one match
      seen.forEach((group, key) => {
        if (group.length > 1) {
          duplicateGroups.push({ key, matches: group });
        }
      });

      setDuplicates(duplicateGroups);
    } catch (error) {
      console.error('Error finding duplicates:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">🔍 Duplicate Match Cleaner</h3>
      
      <button
        onClick={findDuplicates}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 mb-4"
      >
        {loading ? 'Scanning...' : 'Find Duplicates'}
      </button>

      {duplicates.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-red-600">Found {duplicates.length} duplicate groups:</h4>
          {duplicates.map((group, index) => (
            <div key={index} className="border border-red-200 rounded p-3 bg-red-50">
              <p className="font-medium text-sm text-red-800 mb-2">{group.key}</p>
              <div className="space-y-1">
                {group.matches.map(match => (
                  <div key={match.id} className="text-xs text-gray-600 flex justify-between">
                    <span>ID: {match.id} | Status: {match.status}</span>
                    <span>{new Date(match.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {duplicates.length === 0 && !loading && (
        <p className="text-green-600 text-sm">✅ No duplicates found</p>
      )}
    </div>
  );
}

// Embedded Admin Tools Tab
function AdminToolsTab() {
  const [dbStats, setDbStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const fetchDbStats = async () => {
    setLoadingStats(true);
    try {
      const tables = ['matches', 'teams', 'players', 'tracker_users', 'account_requests'];
      const stats = {};
      
      for (const table of tables) {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (!error) {
          stats[table] = count;
        }
      }
      
      setDbStats(stats);
    } catch (error) {
      console.error('Error fetching DB stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const clearLocalStorageData = () => {
    const keys = [
      'rvr_match_tracker_teams',
      'rvr_match_tracker_players', 
      'rvr_match_tracker_matches',
      'rvr_match_tracker_match_events',
      'rvr_match_tracker_match_stats',
      'rvr_match_tracker_users'
    ];
    
    keys.forEach(key => localStorage.removeItem(key));
    alert('Test data cleared from localStorage');
  };

  return (
    <div className="space-y-6">
      {/* Database Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">📊 Database Statistics</h3>
          <button
            onClick={fetchDbStats}
            disabled={loadingStats}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loadingStats ? 'Loading...' : 'Refresh Stats'}
          </button>
        </div>
        
        {dbStats && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(dbStats).map(([table, count]) => (
              <div key={table} className="text-center p-3 bg-gray-50 rounded">
                <div className="text-2xl font-bold text-blue-600">{count}</div>
                <div className="text-sm text-gray-600 capitalize">{table.replace('_', ' ')}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Storage Management */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">🗄️ Storage Management</h3>
        <div className="space-y-3">
          <button
            onClick={clearLocalStorageData}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Clear Test Data (localStorage)
          </button>
          <p className="text-sm text-gray-600">
            Clears all local development test data from browser storage
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">🔗 Quick Admin Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Link href="/user-management" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-center">
            👥 User Management
          </Link>
          <Link href="/match-central-secure" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center">
            ⚽ Match Central
          </Link>
          <Link href="/account-request" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-center">
            📝 Test Account Form
          </Link>
          <a href="https://supabase.com/dashboard" target="_blank" rel="noopener" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-center">
            🗄️ Database Dashboard
          </a>
        </div>
      </div>

      {/* Marketing & Development Tools */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">🎯 Marketing & Development Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link href="/marketing-panel" target="_blank" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded hover:from-blue-700 hover:to-indigo-700 text-center">
            🎮 Marketing Panel
          </Link>
          <Link href="/modular-demo" target="_blank" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded hover:from-purple-700 hover:to-pink-700 text-center">
            🧩 Modular Demo
          </Link>
          <Link href="/modules" target="_blank" className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 rounded hover:from-orange-700 hover:to-red-700 text-center">
            📦 Business Modules
          </Link>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
          <p className="text-sm text-blue-800">
            <strong>Marketing Panel:</strong> Interactive module simulator for sales demos (price-free)<br/>
            <strong>Modular Demo:</strong> Technical architecture demonstration<br/>
            <strong>Business Modules:</strong> Full product pricing and revenue model
          </p>
        </div>
      </div>

      {/* Duplicate Cleaner */}
      <DuplicateCleanerTool />
    </div>
  );
}

function AdminDashboardContent() {
  const [activeTab, setActiveTab] = useState('');
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [pendingVolunteerSignups, setPendingVolunteerSignups] = useState(0);
  const { user, profile, signOut } = useAuth();

  // Check for pending volunteer signups
  const checkPendingVolunteerSignups = async () => {
    try {
      const { data, error } = await supabase
        .from('volunteer_signups')
        .select('id')
        .eq('status', 'pending');

      if (!error && data) {
        setPendingVolunteerSignups(data.length);
      }
    } catch (err) {
      console.error('Error checking volunteer signups:', err);
    }
  };

  // Check for pending requests
  useEffect(() => {
    const checkPendingRequests = async () => {
      try {
        console.log('Checking for pending requests...');
        const { count, error } = await supabase
          .from('account_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        console.log('Pending requests check result:', { count, error });
        
        if (!error && count !== null) {
          console.log('Setting pending requests count to:', count);
          setPendingRequestsCount(count);
        } else if (error) {
          console.log('Account requests table might not exist or error occurred:', error);
          // If table doesn't exist, create some demo pending requests for testing
          if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
            console.log('Setting demo pending requests count for testing');
            setPendingRequestsCount(2); // Demo value to show the notification system works
          } else {
            setPendingRequestsCount(0);
          }
        }
      } catch (error) {
        console.error('Error checking pending requests:', error);
        setPendingRequestsCount(0);
      }
    };

    checkPendingRequests();
    checkPendingVolunteerSignups();
    
    // Check every 30 seconds
    const interval = setInterval(() => {
      checkPendingRequests();
      checkPendingVolunteerSignups();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <StandardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Volunteer Notifications */}
        <VolunteerNotifications 
          onNewSignup={(count) => setPendingVolunteerSignups(count)}
        />
        
        {/* Header */}
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Monitor and manage RVRFC website</p>
            {profile && (
              <p className="text-sm text-blue-600">Welcome, {profile.full_name} ({profile.email})</p>
            )}
          </div>
          <button 
            onClick={signOut}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            🔓 Secure Logout
          </button>
        </motion.div>

        {/* Admin Dashboard Grid */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                id: 'users', 
                title: 'User Management', 
                description: 'Manage user accounts, roles, and permissions',
                icon: '👥', 
                color: 'from-blue-500 to-blue-600',
                hasNotification: pendingRequestsCount > 0, 
                notificationCount: pendingRequestsCount,
                route: '/admin/users'
              },
              { 
                id: 'events', 
                title: 'Special Events', 
                description: 'Create and manage promotional event cards',
                icon: '🎉', 
                color: 'from-purple-500 to-purple-600',
                route: '/admin/events'
              },
              { 
                id: 'site-status', 
                title: 'Site Status', 
                description: 'Monitor site health and performance',
                icon: '📊', 
                color: 'from-green-500 to-green-600',
                route: '/admin/status'
              },
              { 
                id: 'tasks', 
                title: 'Task Management', 
                description: 'Track development and admin tasks',
                icon: '✅', 
                color: 'from-orange-500 to-orange-600',
                route: '/admin/tasks'
              },
              { 
                id: 'sitemap', 
                title: 'Site Map', 
                description: 'View and analyze site structure',
                icon: '🗺️', 
                color: 'from-indigo-500 to-indigo-600',
                route: '/admin/sitemap'
              },
              { 
                id: 'tools', 
                title: 'Admin Tools', 
                description: 'Database tools and utilities',
                icon: '🛠️', 
                color: 'from-red-500 to-red-600',
                route: '/admin/tools'
              },
              { 
                id: 'news', 
                title: 'News Management', 
                description: 'Create and manage news articles and announcements',
                icon: '📰', 
                color: 'from-emerald-500 to-emerald-600',
                route: '/admin/news'
              },
              { 
                id: 'volunteers', 
                title: 'Volunteer Management', 
                description: 'Create opportunities and manage volunteer signups',
                icon: '🤝', 
                color: 'from-blue-500 to-indigo-600',
                hasNotification: pendingVolunteerSignups > 0,
                notificationCount: pendingVolunteerSignups,
                route: '/admin/volunteers'
              }
            ].map((card) => (
              <motion.div
                key={card.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="relative group cursor-pointer"
                onClick={() => window.location.href = card.route}
              >
                <div className={`bg-gradient-to-br ${card.color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Enhanced Notification Badge - Better Positioning */}
                  {card.hasNotification && (
                    <div className="absolute top-2 right-2 z-20">
                      <div className="bg-red-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center animate-pulse border-3 border-white shadow-xl">
                        {card.notificationCount}
                      </div>
                      {/* Glowing ring effect */}
                      <div className="absolute inset-0 bg-red-400 rounded-full w-8 h-8 animate-ping opacity-75"></div>
                    </div>
                  )}
                  
                  {/* Icon */}
                  <div className="text-4xl mb-4 relative z-10">{card.icon}</div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                    <p className="text-white/90 text-sm leading-relaxed">{card.description}</p>
                  </div>
                  
                  {/* Hover Arrow */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Admin Window Content */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-2">👥 User Management Console</h2>
                  <p className="text-blue-100">Comprehensive user account management system</p>
                </div>
                <button
                  onClick={() => setActiveTab('')}
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <UnifiedAccountManagement />
            </div>
          </motion.div>
        )}

        {activeTab === 'events' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-2">🎉 Special Events Manager</h2>
                  <p className="text-purple-100">Create and manage promotional event cards</p>
                </div>
                <button
                  onClick={() => setActiveTab('')}
                  className="text-purple-200 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <SpecialEventsManager />
            </div>
          </motion.div>
        )}

        {activeTab === 'site-status' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-2">📊 Site Status Monitor</h2>
                  <p className="text-green-100">Real-time site health and performance metrics</p>
                </div>
                <button
                  onClick={() => setActiveTab('')}
                  className="text-green-200 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <SiteStatusReport />
            </div>
          </motion.div>
        )}

        {activeTab === 'tasks' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-2">✅ Task Management Center</h2>
                  <p className="text-orange-100">Development and administrative task tracking</p>
                </div>
                <button
                  onClick={() => setActiveTab('')}
                  className="text-orange-200 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <AdminTodoList />
            </div>
          </motion.div>
        )}

        {activeTab === 'sitemap' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-2">🗺️ Site Structure Analyzer</h2>
                  <p className="text-indigo-100">Complete site map and page analysis</p>
                </div>
                <button
                  onClick={() => setActiveTab('')}
                  className="text-indigo-200 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <AdminSiteMap />
            </div>
          </motion.div>
        )}

        {activeTab === 'tools' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-2">🛠️ Admin Tools & Utilities</h2>
                  <p className="text-red-100">Database management and system utilities</p>
                </div>
                <button
                  onClick={() => setActiveTab('')}
                  className="text-red-200 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <AdminToolsTab />
            </div>
          </motion.div>
        )}

      </div>
    </StandardLayout>
  );
}

// Secure wrapper for admin dashboard
export default function AdminDashboard() {
  return (
    <RequireAuth>
      <AdminDashboardContent />
    </RequireAuth>
  );
}