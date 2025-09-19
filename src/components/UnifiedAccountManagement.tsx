/**
 * Unified Account Management Component
 * Combines account requests (pending users) and user management (existing users)
 * Complete Active Directory-like user account management system
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from './SecureAuth';

interface AccountRequest {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  requested_role: 'coach' | 'manager' | 'editor' | 'admin';
  team_interest: string[];
  experience?: string;
  status: 'pending' | 'approved' | 'denied';
  requested_at: string;
  reviewed_at?: string;
  reviewer_notes?: string;
}

interface UserAccount {
  id: string;
  email: string;
  full_name: string;
  username: string;
  role: 'admin' | 'editor' | 'coach' | 'manager' | 'parent' | 'volunteer';
  teams: string[];
  permissions: string[];
  is_active: boolean;
  account_status?: 'active' | 'inactive' | 'suspended' | 'locked' | 'pending';
  failed_login_attempts?: number;
  account_locked_until?: string | null;
  password_reset_required?: boolean;
  last_password_change?: string | null;
  last_sign_in_at?: string | null;
  last_activity?: string | null;
  created_at: string;
  updated_at: string;
  admin_notes?: string;
}

interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  lockedUsers: number;
  adminUsers: number;
  recentLogins: number;
  pendingRequests: number;
}

export default function UnifiedAccountManagement() {
  const [activeView, setActiveView] = useState<'requests' | 'users'>('requests');
  const [requests, setRequests] = useState<AccountRequest[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [statistics, setStatistics] = useState<UserStatistics>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    lockedUsers: 0,
    adminUsers: 0,
    recentLogins: 0,
    pendingRequests: 0
  });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AccountRequest | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tempPassword, setTempPassword] = useState<string>('');
  const { user: currentUser } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load account requests
      const { data: requestData, error: requestError } = await supabase
        .from('account_requests')
        .select('*')
        .order('requested_at', { ascending: false });

      if (!requestError) {
        setRequests(requestData || []);
      }

      // Load existing users
      const { data: userData, error: userError } = await supabase
        .from('tracker_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (!userError) {
        setUsers(userData || []);
      }

      // Calculate statistics
      const pendingRequests = requestData?.filter(r => r.status === 'pending')?.length || 0;
      const stats = {
        totalUsers: userData?.length || 0,
        activeUsers: userData?.filter(u => u.is_active)?.length || 0,
        inactiveUsers: userData?.filter(u => !u.is_active)?.length || 0,
        lockedUsers: userData?.filter(u => u.account_status === 'locked')?.length || 0,
        adminUsers: userData?.filter(u => u.role === 'admin')?.length || 0,
        recentLogins: userData?.filter(u => u.last_sign_in_at && new Date(u.last_sign_in_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))?.length || 0,
        pendingRequests
      };
      setStatistics(stats);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestApproval = async (requestId: string, decision: 'approved' | 'denied', reviewNotes: string = '') => {
    if (!currentUser) return;

    setProcessing(true);
    try {
      const response = await fetch('/api/admin/approve-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          decision,
          reviewNotes,
          currentUserId: currentUser.id
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to process request');
      }

      if (decision === 'approved' && result.tempPassword) {
        setTempPassword(result.tempPassword);
      }

      await loadData();
      setSelectedRequest(null);
      alert(`Request ${decision} successfully`);
    } catch (error) {
      console.error('Error processing request:', error);
      alert('Error: ' + (error as Error).message);
    } finally {
      setProcessing(false);
    }
  };

  const handleUserAction = async (action: string, userId: string, data?: any) => {
    if (!currentUser) return;

    setProcessing(true);
    try {
      const response = await fetch('/api/admin/user-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          userId,
          adminUserId: currentUser.id,
          data
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Action failed');
      }

      if (action === 'reset_password' && result.tempPassword) {
        setTempPassword(result.tempPassword);
      }

      await loadData();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading account data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">👥 Account Management System</h2>
            <p className="text-blue-100">Manage account requests and existing user accounts</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={loadData}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{statistics.pendingRequests}</div>
          <div className="text-sm text-yellow-800">Pending Requests</div>
        </div>
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
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-indigo-600">{statistics.recentLogins}</div>
          <div className="text-sm text-indigo-800">Recent</div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveView('requests')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeView === 'requests'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📝 Account Requests ({statistics.pendingRequests})
        </button>
        <button
          onClick={() => setActiveView('users')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeView === 'users'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          🔐 User Management ({statistics.totalUsers})
        </button>
      </div>

      {/* Account Requests View */}
      {activeView === 'requests' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Account Requests</h3>
            <p className="text-sm text-gray-600">Review and approve new user registrations</p>
          </div>
          
          {requests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📭</div>
              <p>No account requests found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role & Teams</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {request.first_name} {request.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{request.email}</div>
                          {request.phone && (
                            <div className="text-xs text-gray-400">{request.phone}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getRoleColor(request.requested_role)}`}>
                            {request.requested_role}
                          </span>
                          {request.team_interest && request.team_interest.length > 0 && (
                            <div className="text-xs text-gray-600">
                              Teams: {request.team_interest.join(', ')}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(request.requested_at).toLocaleDateString('en-IE')}
                      </td>
                      <td className="px-6 py-4">
                        {request.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleRequestApproval(request.id, 'approved')}
                              disabled={processing}
                              className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 disabled:opacity-50"
                            >
                              ✅ Approve
                            </button>
                            <button
                              onClick={() => handleRequestApproval(request.id, 'denied')}
                              disabled={processing}
                              className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 disabled:opacity-50"
                            >
                              ❌ Deny
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* User Management View */}
      {activeView === 'users' && (
        <div>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center bg-gray-50 p-4 rounded-lg mb-4">
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
            </select>
          </div>

          {/* User Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">👤</div>
                <p>No users found matching your criteria</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Activity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                              user.is_active ? 'bg-green-500' : 'bg-gray-400'
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
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.is_active ? 'active' : 'inactive')}`}>
                            {user.is_active ? '✅ ACTIVE' : '⭕ INACTIVE'}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {user.last_sign_in_at 
                            ? new Date(user.last_sign_in_at).toLocaleDateString('en-IE')
                            : 'Never'
                          }
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {user.is_active ? (
                              <button
                                onClick={() => handleUserAction('deactivate', user.id)}
                                className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200"
                                disabled={user.id === currentUser?.id || processing}
                              >
                                Disable
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUserAction('activate', user.id)}
                                className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                                disabled={processing}
                              >
                                Enable
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleUserAction('reset_password', user.id)}
                              className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200"
                              disabled={processing}
                            >
                              Reset Pwd
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Temporary Password Modal */}
      {tempPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🔑 Temporary Password</h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">New Password:</p>
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
    </div>
  );
}