/**
 * Admin Tools Portal
 * Dedicated page for database management and system utilities
 */

import MasterAdminLayout from '../../components/admin/MasterAdminLayout';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { RequireAuth } from '../../components/SecureAuth';

// Import the AdminToolsTab component from admin.tsx
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
    </div>
  );
}

function AdminToolsPortal() {
  return (
    <MasterAdminLayout
      currentSection="tools"
      pageTitle="🛠️ System Tools"
      pageDescription="Database management, system utilities, and maintenance tools"
    >

      {/* Admin Tools Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-6">
          <AdminToolsTab />
        </div>
      </motion.div>
    </MasterAdminLayout>
  );
}

// Secure wrapper for admin tools portal
export default function AdminToolsPage() {
  return (
    <RequireAuth>
      <AdminToolsPortal />
    </RequireAuth>
  );
}