import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { getChangeLog, ChangeLogRecord } from '@/lib/changeLog';
import { checkAdminAccess } from '@/lib/adminAuth';
import { motion } from 'framer-motion';

export default function AdminChangeLog() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [changes, setChanges] = useState<ChangeLogRecord[]>([]);
  const [filteredChanges, setFilteredChanges] = useState<ChangeLogRecord[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Filters
  const [tableFilter, setTableFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');

  const checkAdminAccessLocal = useCallback(async () => {
    try {
      const adminCheck = await checkAdminAccess();
      
      if (!adminCheck.isAdmin) {
        router.push('/');
        return;
      }

      setIsAdmin(true);
      await fetchChangeLog();
      
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchChangeLog = async () => {
    try {
      const logData = await getChangeLog(500); // Get last 500 changes
      setChanges(logData);
    } catch (error) {
      console.error('Error fetching change log:', error);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...changes];

    if (tableFilter) {
      filtered = filtered.filter(change => 
        change.table_name.toLowerCase().includes(tableFilter.toLowerCase())
      );
    }

    if (actionFilter) {
      filtered = filtered.filter(change => change.action === actionFilter);
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter(change => {
        const changeDate = new Date(change.changed_at);
        return changeDate.toDateString() === filterDate.toDateString();
      });
    }

    if (userFilter) {
      filtered = filtered.filter(change => 
        change.user?.email?.toLowerCase().includes(userFilter.toLowerCase()) ||
        change.changed_by?.toLowerCase().includes(userFilter.toLowerCase())
      );
    }

    setFilteredChanges(filtered);
  }, [changes, tableFilter, actionFilter, dateFilter, userFilter]);

  useEffect(() => {
    checkAdminAccessLocal();
  }, [checkAdminAccessLocal]);

  useEffect(() => {
    applyFilters();
  }, [changes, tableFilter, actionFilter, dateFilter, userFilter, applyFilters]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'INSERT':
        return 'bg-green-100 text-green-800';
      case 'UPDATE':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const uniqueTables = [...new Set(changes.map(c => c.table_name))].sort();
  const uniqueActions = [...new Set(changes.map(c => c.action))].sort();

  if (loading) {
    return (
      <Layout currentSection="admin">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading change log...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout currentSection="admin">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600">You need administrator privileges to view this page.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentSection="admin">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-sm p-6 mb-8"
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-heading font-bold text-gray-900">
                  📋 Change Control Log
                </h1>
                <p className="text-gray-600 mt-1">
                  System audit trail for all database changes
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Total Changes: {changes.length} | Filtered: {filteredChanges.length}
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6 mb-8"
          >
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Table
                </label>
                <select
                  value={tableFilter}
                  onChange={(e) => setTableFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Tables</option>
                  {uniqueTables.map(table => (
                    <option key={table} value={table}>{table}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Action
                </label>
                <select
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Actions</option>
                  {uniqueActions.map(action => (
                    <option key={action} value={action}>{action}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User
                </label>
                <input
                  type="text"
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  placeholder="Search by user email..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            
            {(tableFilter || actionFilter || dateFilter || userFilter) && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    setTableFilter('');
                    setActionFilter('');
                    setDateFilter('');
                    setUserFilter('');
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </motion.div>

          {/* Change Log Table */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            {filteredChanges.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Changes Found</h3>
                <p className="text-gray-600">No changes match your current filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Table
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Summary
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredChanges.map((change) => (
                      <tr key={change.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(change.changed_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(change.action)}`}>
                            {change.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                          {change.table_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {change.change_summary}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {change.user?.email || change.changed_by || 'System'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {change.record_id && (
                            <span className="text-gray-500 font-mono text-xs">
                              ID: {change.record_id.slice(0, 8)}...
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}