import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { 
  checkAdminAccess, 
  getPendingCoachApprovals, 
  getAllUsers,
  AdminUser 
} from '@/lib/adminAuth';
import { getChangeLog, ChangeLogRecord } from '@/lib/changeLog';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  totalUsers: number;
  pendingCoaches: number;
  recentChanges: number;
  totalTeams: number;
  totalMatches: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    pendingCoaches: 0,
    recentChanges: 0,
    totalTeams: 0,
    totalMatches: 0
  });
  const [recentActivity, setRecentActivity] = useState<ChangeLogRecord[]>([]);

  const initializeAdminDashboard = useCallback(async () => {
    try {
      // Check admin access first
      const adminCheck = await checkAdminAccess();
      
      if (!adminCheck.isAdmin) {
        router.push('/');
        return;
      }

      setAdminUser(adminCheck.user!);

      // Load dashboard data in parallel
      const [
        usersData,
        pendingCoaches,
        recentChanges,
        teamsCount,
        matchesCount
      ] = await Promise.all([
        getAllUsers(1, 0).catch(() => ({ total: 0 })),
        getPendingCoachApprovals().catch(() => []),
        getChangeLog(10).catch(() => []),
        supabase.from('teams').select('id', { count: 'exact' }).then(r => r.count || 0),
        supabase.from('matches').select('id', { count: 'exact' }).then(r => r.count || 0)
      ]);

      setStats({
        totalUsers: usersData.total,
        pendingCoaches: pendingCoaches.length,
        recentChanges: recentChanges.length,
        totalTeams: teamsCount,
        totalMatches: matchesCount
      });

      setRecentActivity(recentChanges.slice(0, 5));

    } catch (error) {
      console.error('Error initializing admin dashboard:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    initializeAdminDashboard();
  }, [initializeAdminDashboard]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout currentSection="admin">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying admin access...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!adminUser) {
    return (
      <Layout currentSection="admin">
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-md mx-auto text-center bg-red-50 p-8 rounded-lg">
            <div className="text-red-600 text-4xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">Access Denied</h2>
            <p className="text-red-600 mb-4">Administrator privileges required to access this area.</p>
            <Link href="/" className="text-blue-600 hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentSection="admin">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="container mx-auto px-4 py-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {adminUser.first_name || adminUser.email}
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
          >
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-blue-600 text-2xl mr-3">👥</div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  <p className="text-gray-600 text-sm">Total Users</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-yellow-600 text-2xl mr-3">⏳</div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingCoaches}</p>
                  <p className="text-gray-600 text-sm">Pending Coaches</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-green-600 text-2xl mr-3">⚽</div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTeams}</p>
                  <p className="text-gray-600 text-sm">Teams</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-purple-600 text-2xl mr-3">🏟️</div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalMatches}</p>
                  <p className="text-gray-600 text-sm">Matches</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="text-red-600 text-2xl mr-3">📝</div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.recentChanges}</p>
                  <p className="text-gray-600 text-sm">Recent Changes</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-4">
                <Link 
                  href="/admin/approvals"
                  className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
                >
                  <div className="text-yellow-600 text-xl mr-3">⏳</div>
                  <div>
                    <p className="font-semibold text-gray-900">Review Coach Applications</p>
                    <p className="text-gray-600 text-sm">{stats.pendingCoaches} pending approvals</p>
                  </div>
                </Link>

                <Link 
                  href="/admin/users"
                  className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="text-blue-600 text-xl mr-3">👥</div>
                  <div>
                    <p className="font-semibold text-gray-900">Manage Users</p>
                    <p className="text-gray-600 text-sm">View and edit user roles</p>
                  </div>
                </Link>

                <Link 
                  href="/admin/changelog"
                  className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <div className="text-green-600 text-xl mr-3">📋</div>
                  <div>
                    <p className="font-semibold text-gray-900">View Change Log</p>
                    <p className="text-gray-600 text-sm">Track all system changes</p>
                  </div>
                </Link>

                <Link 
                  href="/admin/teams"
                  className="flex items-center p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <div className="text-purple-600 text-xl mr-3">⚽</div>
                  <div>
                    <p className="font-semibold text-gray-900">Manage Teams</p>
                    <p className="text-gray-600 text-sm">Create and edit teams</p>
                  </div>
                </Link>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-lg shadow"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                {recentActivity.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No recent activity</p>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={activity.id || index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            activity.action === 'INSERT' ? 'bg-green-500' :
                            activity.action === 'UPDATE' ? 'bg-blue-500' :
                            'bg-red-500'
                          }`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 truncate">
                            {activity.change_summary}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.table_name} • {formatDate(activity.changed_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-gray-200">
                      <Link 
                        href="/admin/changelog"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View all changes →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}