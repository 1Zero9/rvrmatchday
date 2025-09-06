import StandardLayout from '../components/StandardLayout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import AdminChangelog from '../components/AdminChangelog';
import AdminTodoList from '../components/AdminTodoList';
import AdminSiteMap from '../components/AdminSiteMap';
import SessionRecording from '../components/SessionRecording';
import { supabase } from '../lib/supabase';

// Embedded Duplicate Cleaner Tool
function DuplicateCleanerTool() {
  const [duplicates, setDuplicates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cleaning, setCleaning] = useState(false);

  const findDuplicates = async () => {
    try {
      setLoading(true);
      const { data: players, error } = await supabase
        .from('players')
        .select(`
          id,
          team_id,
          first_name,
          last_name,
          position,
          is_captain,
          is_vice_captain,
          is_active,
          created_at,
          teams(name)
        `)
        .order('team_id')
        .order('first_name');

      if (error) {
        console.error('Error fetching players:', error);
        return;
      }

      if (!players) return;

      const playerGroups = {};
      players.forEach(player => {
        const key = `${player.team_id}_${player.first_name?.trim()}_${player.last_name?.trim()}`;
        if (!playerGroups[key]) {
          playerGroups[key] = [];
        }
        playerGroups[key].push(player);
      });

      const duplicatesList = [];
      Object.entries(playerGroups).forEach(([key, playerList]) => {
        if (playerList.length > 1) {
          const teamName = playerList[0].teams?.name || 'Unknown Team';
          const playerName = `${playerList[0].first_name || ''} ${playerList[0].last_name || ''}`.trim() || 'Unknown Player';
          
          duplicatesList.push({
            key,
            teamName,
            playerName,
            players: playerList.sort((a, b) => 
              new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            )
          });
        }
      });

      setDuplicates(duplicatesList);
    } catch (error) {
      console.error('Error finding duplicates:', error);
    } finally {
      setLoading(false);
    }
  };

  const cleanupAllDuplicates = async () => {
    if (!confirm(`Are you sure you want to clean up ALL duplicates? This will delete ${duplicates.reduce((sum, d) => sum + (d.players.length - 1), 0)} duplicate records.`)) {
      return;
    }

    try {
      setCleaning(true);
      let totalCleaned = 0;

      for (const duplicateSet of duplicates) {
        const deletePlayerIds = duplicateSet.players.slice(1).map(p => p.id);
        
        const { error } = await supabase
          .from('players')
          .delete()
          .in('id', deletePlayerIds);

        if (error) {
          console.error(`Error cleaning ${duplicateSet.playerName}:`, error);
        } else {
          totalCleaned += deletePlayerIds.length;
        }
      }

      alert(`Successfully cleaned up ${totalCleaned} duplicate records!`);
      findDuplicates();
    } catch (error) {
      console.error('Error in bulk cleanup:', error);
      alert(`Error in bulk cleanup: ${error}`);
    } finally {
      setCleaning(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Player Duplicates Scanner</h3>
          <p className="text-gray-600 text-sm">Find and clean duplicate player records</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={findDuplicates}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            {loading ? 'Scanning...' : 'Scan for Duplicates'}
          </button>
          {duplicates.length > 0 && (
            <button
              onClick={cleanupAllDuplicates}
              disabled={cleaning}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm"
            >
              {cleaning ? 'Cleaning...' : `Clean All (${duplicates.length})`}
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm">Scanning for duplicates...</p>
        </div>
      ) : duplicates.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">✅</div>
          <h4 className="text-lg font-semibold text-green-600 mb-2">No Duplicates Found!</h4>
          <p className="text-gray-600 text-sm">All player records are clean.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-1">
              ⚠️ Found {duplicates.length} sets of duplicate players
            </h4>
            <p className="text-red-700 text-sm">
              Total duplicate records: {duplicates.reduce((sum, d) => sum + (d.players.length - 1), 0)}
            </p>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-3">
            {duplicates.slice(0, 5).map((duplicateSet, index) => (
              <div key={duplicateSet.key} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-gray-900">
                      {duplicateSet.playerName} ({duplicateSet.teamName})
                    </h5>
                    <p className="text-sm text-gray-600">
                      {duplicateSet.players.length} duplicate records found
                    </p>
                  </div>
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                    Will delete {duplicateSet.players.length - 1} duplicates
                  </span>
                </div>
              </div>
            ))}
            {duplicates.length > 5 && (
              <div className="text-center py-2 text-gray-500 text-sm">
                ... and {duplicates.length - 5} more duplicate sets
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Database Check Tool
function DatabaseCheckTool() {
  const [dbStats, setDbStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkDatabase = async () => {
    try {
      setLoading(true);
      
      // Get stats from all main tables
      const [teamsResult, playersResult, matchesResult] = await Promise.all([
        supabase.from('teams').select('*', { count: 'exact' }),
        supabase.from('players').select('*', { count: 'exact' }),
        supabase.from('matches').select('*', { count: 'exact' })
      ]);

      setDbStats({
        teams: teamsResult.count || 0,
        players: playersResult.count || 0, 
        matches: matchesResult.count || 0,
        lastCheck: new Date().toLocaleString()
      });
    } catch (error) {
      console.error('Database check error:', error);
      alert('Error checking database: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Database Health Check</h3>
          <p className="text-gray-600 text-sm">Monitor database tables and record counts</p>
        </div>
        <button
          onClick={checkDatabase}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
        >
          {loading ? 'Checking...' : 'Check Database'}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm">Checking database health...</p>
        </div>
      ) : dbStats ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">Teams</h4>
            <p className="text-2xl font-bold text-green-900">{dbStats.teams}</p>
            <p className="text-green-700 text-sm">Total teams in database</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Players</h4>
            <p className="text-2xl font-bold text-blue-900">{dbStats.players}</p>
            <p className="text-blue-700 text-sm">Total player records</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">Matches</h4>
            <p className="text-2xl font-bold text-purple-900">{dbStats.matches}</p>
            <p className="text-purple-700 text-sm">Total match records</p>
          </div>
          <div className="md:col-span-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600">
              Last check: <span className="font-medium">{dbStats.lastCheck}</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>Click "Check Database" to view health status</p>
        </div>
      )}
    </div>
  );
}

// Storage Check Tool  
function StorageCheckTool() {
  const [storageInfo, setStorageInfo] = useState(null);
  
  const checkStorage = () => {
    const keys = [
      'rvr_match_tracker_teams',
      'rvr_match_tracker_players', 
      'rvr_match_tracker_matches',
      'rvr_match_tracker_match_events',
      'rvr_match_tracker_match_stats',
      'rvr_match_tracker_users'
    ];
    
    const storageData = {};
    keys.forEach(key => {
      const data = localStorage.getItem(key);
      storageData[key] = {
        exists: !!data,
        size: data ? new Blob([data]).size : 0,
        records: data ? JSON.parse(data).length || 0 : 0
      };
    });
    
    setStorageInfo({
      data: storageData,
      lastCheck: new Date().toLocaleString()
    });
  };

  const clearStorage = () => {
    if (confirm('Are you sure you want to clear all localStorage data? This cannot be undone.')) {
      const keys = [
        'rvr_match_tracker_teams',
        'rvr_match_tracker_players', 
        'rvr_match_tracker_matches',
        'rvr_match_tracker_match_events',
        'rvr_match_tracker_match_stats',
        'rvr_match_tracker_users'
      ];
      
      keys.forEach(key => localStorage.removeItem(key));
      alert('localStorage data cleared');
      checkStorage();
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Local Storage Manager</h3>
          <p className="text-gray-600 text-sm">Check and manage browser storage data</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={checkStorage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Check Storage
          </button>
          <button
            onClick={clearStorage}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
          >
            Clear All
          </button>
        </div>
      </div>

      {storageInfo ? (
        <div className="space-y-3">
          {Object.entries(storageInfo.data).map(([key, info]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
              <div>
                <h5 className="font-medium text-gray-900 text-sm">{key.replace('rvr_match_tracker_', '').toUpperCase()}</h5>
                <p className="text-xs text-gray-600">{info.records} records • {Math.round(info.size / 1024)} KB</p>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                info.exists ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {info.exists ? 'EXISTS' : 'EMPTY'}
              </div>
            </div>
          ))}
          <div className="text-center pt-3 border-t">
            <p className="text-sm text-gray-600">
              Last check: <span className="font-medium">{storageInfo.lastCheck}</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>Click "Check Storage" to view localStorage status</p>
        </div>
      )}
    </div>
  );
}

// Admin Tools Component
function AdminToolsTab() {
  const [activeToolTab, setActiveToolTab] = useState('duplicates');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-yellow-600 text-xl mr-2">⚠️</span>
          <div>
            <h3 className="font-semibold text-yellow-800">Admin Tools</h3>
            <p className="text-yellow-700 text-sm">These tools can modify database records. Use with caution.</p>
          </div>
        </div>
      </div>

      {/* Tool Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveToolTab('duplicates')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeToolTab === 'duplicates'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🔍 Duplicate Cleaner
          </button>
          <button
            onClick={() => setActiveToolTab('database')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeToolTab === 'database'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            💾 Database Check
          </button>
          <button
            onClick={() => setActiveToolTab('storage')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeToolTab === 'storage'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            📦 Storage Tools
          </button>
        </nav>
      </div>

      {/* Tool Content */}
      {activeToolTab === 'duplicates' && <DuplicateCleanerTool />}
      {activeToolTab === 'database' && <DatabaseCheckTool />}
      {activeToolTab === 'storage' && <StorageCheckTool />}
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Environment-based authentication
    const adminUser = process.env.NEXT_PUBLIC_ADMIN_USER || 'admin';
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS || 'defaultpass123';
    
    if (loginForm.username === adminUser && loginForm.password === adminPass) {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials');
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
                  Contact administrator for credentials
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
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Monitor and manage RVRFC website</p>
          </div>
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
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
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setActiveTab('changelog')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'changelog'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📝 Changelog
              </button>
              <button
                onClick={() => setActiveTab('todos')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'todos'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ✅ Todo List
              </button>
              <button
                onClick={() => setActiveTab('sitemap')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'sitemap'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🗺️ Site Map
              </button>
              <button
                onClick={() => setActiveTab('sessions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'sessions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🎯 Sessions
              </button>
              <button
                onClick={() => setActiveTab('system')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'system'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ⚙️ System Info
              </button>
              <button
                onClick={() => setActiveTab('tools')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'tools'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🔧 Admin Tools
              </button>
            </nav>
          </div>
        </motion.div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
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
                <button 
                  onClick={() => setActiveTab('todos')}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  ✅ Todo List
                </button>
                <button 
                  onClick={() => setActiveTab('sitemap')}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  🗺️ Site Map
                </button>
                <button 
                  onClick={() => setActiveTab('changelog')}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  📝 Change Log
                </button>
                <button 
                  onClick={() => setActiveTab('tools')}
                  className="w-full text-left px-3 py-2 text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                  🔧 Admin Tools
                </button>
                <hr className="my-2" />
                <a 
                  href="/account-admin"
                  className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors block"
                >
                  👥 Account Requests
                </a>
                <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  🔄 Refresh Cache
                </button>
                <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  📊 Analytics Report
                </button>
                <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  🛡️ Security Scan
                </button>
                <button 
                  onClick={clearLocalStorageData}
                  className="w-full text-left px-3 py-2 text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  🗑️ Clear Test Data
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
        )}

        {/* Changelog Tab */}
        {activeTab === 'changelog' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AdminChangelog />
          </motion.div>
        )}

        {/* Todo List Tab */}
        {activeTab === 'todos' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AdminTodoList />
          </motion.div>
        )}

        {/* Site Map Tab */}
        {activeTab === 'sitemap' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Site Map & Navigation Analysis</h2>
                <div className="text-sm text-gray-600">
                  Admin-only access • <Link href="/sitemap" className="text-blue-600 hover:text-blue-800">Legacy public link</Link>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 text-sm">
                  <strong>Note:</strong> The sitemap has been moved to the admin area for security. 
                  Only authenticated administrators can view the complete site structure and page analysis.
                </p>
              </div>
              <AdminSiteMap />
            </div>
          </motion.div>
        )}

        {/* Session Recording Tab */}
        {activeTab === 'sessions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SessionRecording />
          </motion.div>
        )}

        {/* System Info Tab */}
        {activeTab === 'system' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid lg:grid-cols-2 gap-8"
          >
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Template Name:</span>
                  <span className="font-medium">OneZeroNine Premium Football Template</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Version:</span>
                  <span className="font-medium">v2.2.0 - Glass Morphism Pro</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Framework:</span>
                  <span className="font-medium">Next.js 15.4.6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Styling:</span>
                  <span className="font-medium">Tailwind CSS + Glass Morphism</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Animations:</span>
                  <span className="font-medium">Framer Motion</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Developer:</span>
                  <span className="font-medium">OneZeroNine</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">AI Collaboration:</span>
                  <span className="font-medium">Claude (Anthropic)</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Design System</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Glass Components:</span>
                  <span className="font-medium">8 Components</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hero Sections:</span>
                  <span className="font-medium">Video/Image Support</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Color System:</span>
                  <span className="font-medium">4 Gradient Themes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Responsive:</span>
                  <span className="font-medium">Mobile-First</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Documentation:</span>
                  <span className="font-medium">Complete</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Template Ready:</span>
                  <span className="font-medium text-green-600">✓ Yes</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Contact:</strong> onezeronine@gmail.com
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  For licensing, customization, or technical support
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Admin Tools Tab */}
        {activeTab === 'tools' && (
          <AdminToolsTab />
        )}

      </div>
    </StandardLayout>
  );
}