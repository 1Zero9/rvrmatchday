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
          <Link href="/account-admin" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-center">
            👥 Account Requests
          </Link>
          <Link href="/match-central" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center">
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const { user, profile, signOut } = useAuth();

  // Check for pending requests
  useEffect(() => {
    const checkPendingRequests = async () => {
      try {
        const { count, error } = await supabase
          .from('account_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        if (!error && count !== null) {
          setPendingRequestsCount(count);
        }
      } catch (error) {
        console.error('Error checking pending requests:', error);
      }
    };

    checkPendingRequests();
    
    // Check every 30 seconds
    const interval = setInterval(checkPendingRequests, 30000);
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

        {/* Tab Navigation */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
                { id: 'accounts', label: '👥 Account Management', icon: '👥', hasNotification: pendingRequestsCount > 0, notificationCount: pendingRequestsCount },
                { id: 'todos', label: '✅ Tasks', icon: '✅' },
                { id: 'changelog', label: '📝 Changelog', icon: '📝' },
                { id: 'sitemap', label: '🗺️ Site Map', icon: '🗺️' },
                { id: 'tools', label: '🛠️ Tools', icon: '🛠️', isSpecial: true }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative py-2 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : tab.isSpecial
                      ? 'border-transparent text-orange-600 hover:text-orange-800 hover:border-orange-300 font-bold'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } ${tab.hasNotification ? 'animate-pulse' : ''}`}
                >
                  <span className={tab.hasNotification ? 'text-orange-600 font-bold' : ''}>{tab.label}</span>
                  {tab.hasNotification && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                      {tab.notificationCount}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SiteStatusReport />
          </motion.div>
        )}

        {activeTab === 'accounts' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <UnifiedAccountManagement />
          </motion.div>
        )}

        {activeTab === 'todos' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AdminTodoList />
          </motion.div>
        )}

        {activeTab === 'changelog' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AdminChangelog />
          </motion.div>
        )}

        {activeTab === 'sitemap' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AdminSiteMap />
          </motion.div>
        )}

        {activeTab === 'tools' && (
          <AdminToolsTab />
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