/**
 * Admin User Management Component
 * Comprehensive Active Directory-like user management system
 * Full CRUD operations, audit logging, session management
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from './SecureAuth';

interface UserAccount {
  id: string;
  email: string;
  full_name: string;
  username: string;
  role: 'admin' | 'editor' | 'coach' | 'manager' | 'parent' | 'volunteer';
  teams: string[];
  permissions: string[];
  is_active: boolean;
  account_status: 'active' | 'inactive' | 'suspended' | 'locked' | 'pending';
  failed_login_attempts: number;
  account_locked_until: string | null;
  password_reset_required: boolean;
  last_password_change: string | null;
  last_sign_in_at: string | null;
  last_activity: string | null;
  created_at: string;
  updated_at: string;
  created_by_name?: string;
  last_login: string | null;
  last_login_ip: string | null;
  admin_notes?: string;
}

interface UserAction {
  type: 'activate' | 'deactivate' | 'lock' | 'unlock' | 'reset_password' | 'force_password_change' | 'clear_login_attempts' | 'terminate_sessions' | 'delete' | 'edit_permissions' | 'add_note';
  userId: string;
  data?: any;
}

interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  lockedUsers: number;
  adminUsers: number;
  recentLogins: number;
}

export default function AdminUserManagement() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [statistics, setStatistics] = useState<UserStatistics>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    lockedUsers: 0,
    adminUsers: 0,
    recentLogins: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [actionModal, setActionModal] = useState<UserAction | null>(null);
  const [processing, setProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [tempPassword, setTempPassword] = useState<string>('');
  const { user: currentUser } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/user-management');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load users');
      }

      setUsers(data.users || []);
      setStatistics(data.statistics || statistics);
    } catch (error) {
      console.error('Error loading users:', error);
      // Fallback to direct Supabase query if API fails
      const { data, error: supabaseError } = await supabase
        .from('tracker_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (!supabaseError) {
        setUsers(data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.is_active) ||
                         (statusFilter === 'inactive' && !user.is_active);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUserAction = async (action: UserAction) => {
    if (!currentUser) {
      alert('You must be logged in to perform this action');
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch('/api/admin/user-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: action.type,
          userId: action.userId,
          adminUserId: currentUser.id,
          data: action.data
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Action failed');
      }

      // Show temporary password if it was a reset
      if (action.type === 'reset_password' && result.tempPassword) {
        setTempPassword(result.tempPassword);
      }

      await loadUsers();
      setActionModal(null);
      setSelectedUser(null);

      alert(result.message || 'Action completed successfully');
    } catch (error) {
      console.error('Error performing action:', error);
      alert('Error: ' + (error as Error).message);
    } finally {
      setProcessing(false);
    }
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800 border-red-200',
      editor: 'bg-purple-100 text-purple-800 border-purple-200',
      coach: 'bg-green-100 text-green-800 border-green-200',
      manager: 'bg-blue-100 text-blue-800 border-blue-200',
      parent: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      volunteer: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-orange-100 text-orange-800',
      locked: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      active: '✅',
      inactive: '⭕',
      suspended: '⚠️',
      locked: '🔒',
      pending: '⏳'
    };
    return icons[status as keyof typeof icons] || '❓';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">🔐 User Management System</h2>
            <p className="text-blue-100">Active Directory-like user account management with full audit trails</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowAuditLog(!showAuditLog)}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              📋 Audit Log
            </button>
            <button
              onClick={loadUsers}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{statistics.totalUsers}</div>
          <div className="text-sm text-blue-800">Total Users</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{statistics.activeUsers}</div>
          <div className="text-sm text-green-800">Active</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">{statistics.inactiveUsers}</div>
          <div className="text-sm text-gray-800">Inactive</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{statistics.lockedUsers}</div>
          <div className="text-sm text-red-800">Locked</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{statistics.adminUsers}</div>
          <div className="text-sm text-purple-800">Admins</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{statistics.recentLogins}</div>
          <div className="text-sm text-yellow-800">Recent</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center bg-gray-50 p-4 rounded-lg">
        <div className="flex-1 min-w-64">
          <input
            type="text"
            placeholder="Search users by name, email, or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Roles</option>
          <option value="admin">Administrators</option>
          <option value="editor">Editors</option>
          <option value="coach">Coaches</option>
          <option value="manager">Managers</option>
          <option value="parent">Parents</option>
          <option value="volunteer">Volunteers</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="locked">Locked</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Security</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                  whileHover={{ backgroundColor: '#f9fafb' }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        user.account_status === 'active' ? 'bg-green-500' : 
                        user.account_status === 'locked' ? 'bg-red-500' :
                        'bg-gray-400'
                      }`}>
                        {user.full_name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getRoleColor(user.role)}`}>
                      {user.role?.charAt(0)?.toUpperCase()}{user.role?.slice(1)}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.account_status || (user.is_active ? 'active' : 'inactive'))}`}>
                        {getStatusIcon(user.account_status || (user.is_active ? 'active' : 'inactive'))} {(user.account_status || (user.is_active ? 'ACTIVE' : 'INACTIVE')).toUpperCase()}
                      </span>
                      {user.password_reset_required && (
                        <div className="text-xs text-orange-600">🔄 Password Reset Required</div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-sm">
                    <div className="space-y-1">
                      <div className="text-gray-900">
                        Failed: <span className={(user.failed_login_attempts || 0) > 3 ? 'text-red-600 font-bold' : 'text-gray-600'}>
                          {user.failed_login_attempts || 0}
                        </span>
                      </div>
                      {user.account_locked_until && new Date(user.account_locked_until) > new Date() && (
                        <div className="text-xs text-red-600">
                          🔒 Locked until {new Date(user.account_locked_until).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="space-y-1">
                      <div>
                        {user.last_login 
                          ? new Date(user.last_login).toLocaleDateString('en-IE')
                          : 'Never'
                        }
                      </div>
                      {user.last_login_ip && (
                        <div className="text-xs text-gray-500">IP: {user.last_login_ip}</div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                      >
                        View
                      </button>
                      
                      {(user.account_status === 'active' || user.is_active) ? (
                        <button
                          onClick={() => setActionModal({ type: 'deactivate', userId: user.id })}
                          className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200"
                          disabled={user.id === currentUser?.id}
                        >
                          Disable
                        </button>
                      ) : (
                        <button
                          onClick={() => setActionModal({ type: 'activate', userId: user.id })}
                          className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                        >
                          Enable
                        </button>
                      )}
                      
                      {user.account_status === 'locked' ? (
                        <button
                          onClick={() => setActionModal({ type: 'unlock', userId: user.id })}
                          className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                        >
                          Unlock
                        </button>
                      ) : (
                        <button
                          onClick={() => setActionModal({ type: 'lock', userId: user.id })}
                          className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                          disabled={user.id === currentUser?.id}
                        >
                          Lock
                        </button>
                      )}
                      
                      <button
                        onClick={() => setActionModal({ type: 'reset_password', userId: user.id })}
                        className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200"
                      >
                        Reset Pwd
                      </button>
                      
                      {user.failed_login_attempts > 0 && (
                        <button
                          onClick={() => setActionModal({ type: 'clear_login_attempts', userId: user.id })}
                          className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No users found matching your criteria
          </div>
        )}
      </div>

      {/* Temporary Password Modal */}
      {tempPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🔑 Password Reset Complete</h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Temporary Password:</p>
              <p className="font-mono text-lg text-blue-600 bg-white px-3 py-2 rounded border break-all">
                {tempPassword}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                User will be required to change this password on next login
              </p>
            </div>
            <button 
              onClick={() => setTempPassword('')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Action Confirmation Modal */}
      {actionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Confirm {actionModal.type.replace('_', ' ').toUpperCase()}
            </h3>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to {actionModal.type.replace('_', ' ')} this user account?
              {actionModal.type === 'delete' && ' This action cannot be undone.'}
              {actionModal.type === 'lock' && ' User will be unable to login.'}
              {actionModal.type === 'reset_password' && ' A new temporary password will be generated.'}
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => handleUserAction(actionModal)}
                disabled={processing}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Confirm'}
              </button>
              <button
                onClick={() => setActionModal(null)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}