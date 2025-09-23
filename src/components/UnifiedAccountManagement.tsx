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
  role: 'admin' | 'editor' | 'coach' | 'parent';
  teams: string[];
  permissions: string[];
  is_active: boolean;
  failed_login_attempts?: number;
  account_locked_until?: string | null;
  password_reset_required?: boolean;
  last_password_change?: string | null;
  last_sign_in_at?: string | null;
  last_activity?: string | null;
  created_at: string;
  updated_at: string;
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
  const [activeView, setActiveView] = useState<'requests' | 'users' | 'logs'>('requests');
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
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [eventLogs, setEventLogs] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({
    email: '',
    full_name: '',
    username: '',
    role: 'parent' as 'admin' | 'editor' | 'coach' | 'parent',
    is_active: true
  });
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

      // Load event logs
      try {
        const { data: logData, error: logError } = await supabase
          .from('user_management_log')
          .select(`
            *,
            admin_user:tracker_users!admin_user_id(full_name, email),
            target_user:tracker_users!target_user_id(full_name, email)
          `)
          .order('created_at', { ascending: false })
          .limit(100);

        if (!logError && logData) {
          setEventLogs(logData);
        }
      } catch (logError) {
        console.log('Event logs table not available:', logError);
        setEventLogs([]);
      }

      // Calculate statistics
      const pendingRequests = requestData?.filter(r => r.status === 'pending')?.length || 0;
      const stats = {
        totalUsers: userData?.length || 0,
        activeUsers: userData?.filter(u => u.is_active)?.length || 0,
        inactiveUsers: userData?.filter(u => !u.is_active)?.length || 0,
        lockedUsers: 0, // Account status column doesn't exist yet
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

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.full_name || !newUser.username) {
      alert('Please fill in all required fields');
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newUser,
          adminUserId: currentUser?.id
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create user');
      }

      if (result.tempPassword) {
        setTempPassword(result.tempPassword);
      }

      await loadData();
      setShowCreateUser(false);
      setNewUser({
        email: '',
        full_name: '',
        username: '',
        role: 'volunteer',
        is_active: true
      });
      alert('User created successfully!');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error: ' + (error as Error).message);
    } finally {
      setProcessing(false);
    }
  };

  const handleSaveUserChanges = async (user: UserAccount) => {
    if (!currentUser) return;

    setProcessing(true);
    try {
      const response = await fetch('/api/admin/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          updates: {
            full_name: user.full_name,
            username: user.username,
            role: user.role,
            is_active: user.is_active
          },
          adminUserId: currentUser.id
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update user');
      }

      await loadData();
      setSelectedUser(null);
      alert('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error: ' + (error as Error).message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!currentUser) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete user "${userName}"?\n\nThis will:\n- Deactivate their account\n- Remove their access\n- Log the deletion for audit purposes\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) return;

    setProcessing(true);
    try {
      const response = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          adminUserId: currentUser.id,
          reason: 'Admin initiated deletion'
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete user');
      }

      await loadData();
      setSelectedUser(null);
      alert('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error: ' + (error as Error).message);
    } finally {
      setProcessing(false);
    }
  };

  const setupEventLogging = async () => {
    if (!currentUser) return;

    const confirmSetup = window.confirm(
      'This will create the event logging database table.\n\nThis is required for the Event Logs feature to work.\n\nProceed with setup?'
    );

    if (!confirmSetup) return;

    setProcessing(true);
    try {
      const response = await fetch('/api/admin/setup-event-logging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to setup event logging');
      }

      await loadData();
      alert(`Event logging setup complete!\n\nTable created successfully with ${result.testLogsCount} test logs.`);
    } catch (error) {
      console.error('Error setting up event logging:', error);
      alert('Error: ' + (error as Error).message);
    } finally {
      setProcessing(false);
    }
  };

  const checkRoleConstraint = async () => {
    if (!currentUser) return;

    setProcessing(true);
    try {
      const response = await fetch('/api/admin/check-role-constraint', {
        method: 'GET'
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to check role constraint');
      }

      // Format the results for display
      const roleResults = Object.entries(result.roleTestResults)
        .map(([role, status]) => `${role}: ${status}`)
        .join('\n');

      alert(`Role Constraint Analysis:\n\nExisting roles in database: ${result.existingRoles.join(', ')}\n\nRole validation tests:\n${roleResults}\n\nRecommendation: ${result.recommendation}`);
    } catch (error) {
      console.error('Error checking role constraint:', error);
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
              onClick={() => setShowCreateUser(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
            >
              ➕ Add New User
            </button>
            <button
              onClick={setupEventLogging}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
            >
              🔧 Setup Event Logs
            </button>
            <button
              onClick={checkRoleConstraint}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
            >
              🔍 Check Roles
            </button>
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

      {/* Enhanced Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveView('requests')}
            className={`flex-1 py-4 px-6 rounded-lg text-lg font-bold transition-all duration-300 ${
              activeView === 'requests'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">📝</span>
              <div className="text-left">
                <div className="text-lg font-bold">Account Requests</div>
                <div className={`text-sm ${activeView === 'requests' ? 'text-orange-100' : 'text-gray-500'}`}>
                  {statistics.pendingRequests} pending approval
                </div>
              </div>
              {statistics.pendingRequests > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                  {statistics.pendingRequests}
                </span>
              )}
            </div>
          </button>
          
          <button
            onClick={() => setActiveView('users')}
            className={`flex-1 py-4 px-6 rounded-lg text-lg font-bold transition-all duration-300 ${
              activeView === 'users'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">👥</span>
              <div className="text-left">
                <div className="text-lg font-bold">User Management</div>
                <div className={`text-sm ${activeView === 'users' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {statistics.totalUsers} total users
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveView('logs')}
            className={`flex-1 py-4 px-6 rounded-lg text-lg font-bold transition-all duration-300 ${
              activeView === 'logs'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">📋</span>
              <div className="text-left">
                <div className="text-lg font-bold">Event Logs</div>
                <div className={`text-sm ${activeView === 'logs' ? 'text-purple-100' : 'text-gray-500'}`}>
                  {eventLogs.length} recent events
                </div>
              </div>
            </div>
          </button>
        </div>
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
              <option value="parent">Parents</option>
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
                      <tr key={user.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedUser(user)}>
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
                            
                            <button
                              onClick={() => handleDeleteUser(user.id, user.full_name)}
                              className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                              disabled={user.id === currentUser?.id || processing}
                            >
                              Delete
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

      {/* Event Logs View */}
      {activeView === 'logs' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">User Management Event Logs</h3>
            <p className="text-sm text-gray-600">Audit trail of all user management actions</p>
          </div>
          
          {eventLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📝</div>
              <p>No event logs found</p>
              <p className="text-xs mt-1">User management actions will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {eventLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(log.created_at).toLocaleString('en-IE')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          log.action === 'create_user' ? 'bg-green-100 text-green-800' :
                          log.action === 'delete_user' ? 'bg-red-100 text-red-800' :
                          log.action === 'update_user' ? 'bg-blue-100 text-blue-800' :
                          log.action === 'reset_password' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {log.action.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {log.admin_user?.full_name || 'Unknown'}
                        <div className="text-xs text-gray-500">{log.admin_user?.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {log.target_user?.full_name || log.details?.deleted_user?.full_name || 'Unknown'}
                        <div className="text-xs text-gray-500">
                          {log.target_user?.email || log.details?.deleted_user?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {log.details?.reason && (
                          <div className="mb-1">
                            <span className="font-medium">Reason:</span> {log.details.reason}
                          </div>
                        )}
                        {log.details?.changed_fields && (
                          <div className="text-xs">
                            <span className="font-medium">Changed:</span> {log.details.changed_fields.join(', ')}
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

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">👤 User Account Management</h2>
                  <p className="text-blue-100">{selectedUser.full_name} ({selectedUser.email})</p>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Account Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Account Information</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Full Name</label>
                      <input
                        type="text"
                        value={selectedUser.full_name}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onChange={(e) => setSelectedUser({...selectedUser, full_name: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Username</label>
                      <input
                        type="text"
                        value={selectedUser.username}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onChange={(e) => setSelectedUser({...selectedUser, username: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Role</label>
                      <select
                        value={selectedUser.role}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value as any})}
                      >
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="coach">Coach</option>
                        <option value="parent">Parent</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Account Status & Security */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Account Status & Security</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Account Active</span>
                      <button
                        onClick={() => setSelectedUser({...selectedUser, is_active: !selectedUser.is_active})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          selectedUser.is_active ? 'bg-green-600' : 'bg-gray-400'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          selectedUser.is_active ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    
                  </div>
                </div>

                {/* Activity Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Activity Information</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">{new Date(selectedUser.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium">{new Date(selectedUser.updated_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Sign In:</span>
                      <span className="font-medium">
                        {selectedUser.last_sign_in_at ? new Date(selectedUser.last_sign_in_at).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Failed Login Attempts:</span>
                      <span className="font-medium">{selectedUser.failed_login_attempts || 0}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-200 mt-6 pt-6">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      handleUserAction('reset_password', selectedUser.id);
                      setSelectedUser(null);
                    }}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    disabled={processing}
                  >
                    🔑 Reset Password
                  </button>
                  
                  <button
                    onClick={() => {
                      handleUserAction(selectedUser.is_active ? 'deactivate' : 'activate', selectedUser.id);
                      setSelectedUser(null);
                    }}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedUser.is_active 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                    disabled={processing}
                  >
                    {selectedUser.is_active ? '🚫 Disable Account' : '✅ Enable Account'}
                  </button>
                  
                  <button
                    onClick={() => handleSaveUserChanges(selectedUser)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={processing}
                  >
                    💾 Save Changes
                  </button>
                  
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">➕ Create New User</h2>
                  <p className="text-green-100">Add a new user account to the system</p>
                </div>
                <button
                  onClick={() => setShowCreateUser(false)}
                  className="text-green-200 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newUser.full_name}
                    onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="parent">Parent</option>
                    <option value="coach">Coach</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Account Active</span>
                    <button
                      onClick={() => setNewUser({...newUser, is_active: !newUser.is_active})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        newUser.is_active ? 'bg-green-600' : 'bg-gray-400'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        newUser.is_active ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <div className="text-blue-500 mr-3">ℹ️</div>
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">Important Notes:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• A temporary password will be generated automatically</li>
                      <li>• The user will be required to change their password on first login</li>
                      <li>• An email notification will be sent to the user (if email service is configured)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={handleCreateUser}
                  disabled={processing || !newUser.email || !newUser.full_name || !newUser.username}
                  className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? '⏳ Creating...' : '✅ Create User'}
                </button>
                <button
                  onClick={() => setShowCreateUser(false)}
                  className="flex-1 bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}