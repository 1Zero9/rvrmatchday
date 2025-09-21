/**
 * 🏢 Enterprise User Management System
 * Comprehensive user administration dashboard inspired by Microsoft Entra ID
 * 
 * Features:
 * - Account Request Management
 * - User Directory & Profiles  
 * - Role & Permission Management
 * - Audit Trail & Event Logs
 * - Security & Compliance
 * - Team Assignments
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { RequireAuth, useAuth } from '../components/SecureAuth';
import { supabase } from '../lib/supabase';
import StandardLayout from '../components/StandardLayout';

interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: 'admin' | 'coach' | 'manager' | 'editor' | 'parent' | 'volunteer';
  teams: string[];
  permissions: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
  last_ip_address?: string;
  login_count?: number;
  failed_login_attempts?: number;
}

interface AccountRequest {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  requested_role: string;
  team_interest: string[];
  experience?: string;
  status: 'pending' | 'approved' | 'denied';
  requested_at: string;
  reviewed_at?: string;
  reviewer_notes?: string;
  legal_agreement_accepted: boolean;
  privacy_policy_accepted: boolean;
  data_usage_accepted: boolean;
  club_disclaimer_accepted: boolean;
}

interface AuditLog {
  id: string;
  user_id: string;
  user_email: string;
  action: string;
  target_user?: string;
  target_user_email?: string;
  details: any;
  timestamp: string;
  ip_address?: string;
  user_agent?: string;
  success: boolean;
}

interface SecurityEvent {
  id: string;
  event_type: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'PASSWORD_RESET' | 'ACCOUNT_LOCKED' | 'PERMISSION_DENIED';
  user_id?: string;
  user_email?: string;
  ip_address?: string;
  details: any;
  timestamp: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

function UserManagementApp() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<AccountRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUserAuditLogs, setSelectedUserAuditLogs] = useState<AuditLog[]>([]);
  const [selectedUserSecurityEvents, setSelectedUserSecurityEvents] = useState<SecurityEvent[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load users
      const { data: usersData, error: usersError } = await supabase
        .from('tracker_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData || []);

      // Load account requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('account_requests')
        .select('*')
        .order('requested_at', { ascending: false });

      if (requestsError) throw requestsError;
      setRequests(requestsData || []);

      // Load audit logs (simulate for now - would need audit_logs table)
      setAuditLogs([
        {
          id: '1',
          user_id: profile?.id || '',
          user_email: profile?.email || '',
          action: 'USER_LOGIN',
          timestamp: new Date().toISOString(),
          success: true,
          details: { location: 'Dublin, Ireland' }
        }
      ]);

      // Load security events (simulate for now)
      setSecurityEvents([
        {
          id: '1',
          event_type: 'LOGIN_SUCCESS',
          user_email: profile?.email || '',
          timestamp: new Date().toISOString(),
          risk_level: 'LOW',
          details: { browser: 'Chrome', os: 'macOS' }
        }
      ]);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatusToggle = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('tracker_users')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status');
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('tracker_users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  };

  const isAdmin = profile?.role === 'admin';

  const loadUserSpecificData = (user: User) => {
    // Filter audit logs for the selected user
    const userAuditLogs = auditLogs.filter(log => 
      log.user_id === user.id || log.target_user === user.id
    );
    setSelectedUserAuditLogs(userAuditLogs);

    // Filter security events for the selected user
    const userSecurityEvents = securityEvents.filter(event => 
      event.user_id === user.id || event.user_email === user.email
    );
    setSelectedUserSecurityEvents(userSecurityEvents);

    setSelectedUser(user);
  };

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      denied: 'bg-red-100 text-red-800'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-800',
      coach: 'bg-blue-100 text-blue-800',
      manager: 'bg-green-100 text-green-800',
      parent: 'bg-orange-100 text-orange-800',
      volunteer: 'bg-gray-100 text-gray-800'
    };
    return styles[role as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <StandardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading user management...</p>
          </div>
        </div>
      </StandardLayout>
    );
  }

  if (!isAdmin) {
    return (
      <StandardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600">You need admin privileges to access user management.</p>
          </div>
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage user accounts, roles, and permissions</p>
            
            {/* Statistics Overview */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-xl">👥</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-xl">✅</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-green-600">{users.filter(u => u.is_active).length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <span className="text-xl">📝</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                    <p className="text-2xl font-bold text-yellow-600">{requests.filter(r => r.status === 'pending').length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <span className="text-xl">🔒</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Security Events</p>
                    <p className="text-2xl font-bold text-red-600">{securityEvents.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
                <input
                  type="text"
                  placeholder="Search members by name, email, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-club-primary focus:border-transparent"
                />
              </div>
              
              {/* Quick Role Filters */}
              <div className="flex flex-wrap gap-2">
                {['all', 'admin', 'coach', 'manager', 'parent', 'volunteer'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setSearchTerm(role === 'all' ? '' : role)}
                    className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                      (role === 'all' && searchTerm === '') || searchTerm === role
                        ? 'bg-club-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {role === 'all' ? 'All Members' : role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="text-xl mr-2">👥</span>
                Users Directory
                <span className="ml-2 bg-gray-500 text-white text-sm font-medium px-2 py-1 rounded-full">
                  {filteredUsers.length}
                </span>
              </h3>
              <p className="text-gray-600 mt-1">Click on any user to view details and manage their account</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Teams
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Member Since
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Last Active
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => loadUserSpecificData(user)}
                      className={`cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:shadow-md ${
                        selectedUser?.id === user.id ? 'bg-club-primary/5 border-l-4 border-club-primary' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="relative">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                              user.role === 'admin' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                              user.role === 'coach' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                              user.role === 'manager' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                              user.role === 'parent' ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
                              'bg-gradient-to-br from-gray-500 to-gray-600'
                            }`}>
                              {user.full_name.split(' ').map(n => n[0]).join('')}
                            </div>
                            {user.role === 'admin' && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                                <span className="text-xs">👑</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-gray-900">{user.full_name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getRoleBadge(user.role)}`}>
                          {user.role === 'admin' ? '🛡️ Administrator' :
                           user.role === 'coach' ? '⚽ Coach' :
                           user.role === 'manager' ? '📋 Manager' :
                           user.role === 'parent' ? '👨‍👩‍👧‍👦 Parent' :
                           '🤝 Volunteer'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          user.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? '✅ Active' : '❌ Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.teams && user.teams.length > 0 ? (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {user.teams.length} team{user.teams.length > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-gray-400">No teams</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <span className="text-4xl mb-2 block">🔍</span>
                          <p className="text-lg font-medium">No members found</p>
                          <p className="text-sm">Try adjusting your search or filters</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Detail Modal/Card */}
          {selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="bg-gray-800 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className={`h-16 w-16 rounded-full flex items-center justify-center font-bold text-xl ${
                          selectedUser.role === 'admin' ? 'bg-purple-600' :
                          selectedUser.role === 'coach' ? 'bg-blue-600' :
                          selectedUser.role === 'manager' ? 'bg-green-600' :
                          selectedUser.role === 'parent' ? 'bg-orange-600' :
                          'bg-gray-600'
                        }`}>
                          {selectedUser.full_name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {selectedUser.role === 'admin' && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                            <span className="text-xs">👑</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedUser.full_name}</h2>
                        <p className="text-gray-300">{selectedUser.email}</p>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 mt-2">
                          {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                  
                  {/* User Edit Form */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit User Account</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Information */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            defaultValue={selectedUser.full_name}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                          <input
                            type="email"
                            defaultValue={selectedUser.email}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                          <input
                            type="text"
                            defaultValue={selectedUser.username}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      
                      {/* Role & Security */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">User Role</label>
                          <select
                            value={selectedUser.role}
                            onChange={(e) => handleRoleChange(selectedUser.id, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="admin">Administrator</option>
                            <option value="coach">Coach</option>
                            <option value="manager">Manager</option>
                            <option value="parent">Parent</option>
                            <option value="volunteer">Volunteer</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleUserStatusToggle(selectedUser.id, selectedUser.is_active)}
                              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                selectedUser.is_active 
                                  ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                                  : 'bg-green-100 text-green-800 hover:bg-green-200'
                              }`}
                            >
                              {selectedUser.is_active ? 'Deactivate Account' : 'Activate Account'}
                            </button>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              selectedUser.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {selectedUser.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Reset Password</label>
                          <div className="flex space-x-2">
                            <button className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-sm">
                              Send Reset Email
                            </button>
                            <button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm">
                              Generate Temp Password
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                      <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
                        Cancel
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Save Changes
                      </button>
                    </div>
                  </div>

                  {/* User Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Account Details */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">📋</span>
                        Account Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">User ID</label>
                          <p className="text-sm text-gray-900 font-mono">{selectedUser.id}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Username</label>
                          <p className="text-sm text-gray-900">@{selectedUser.username}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Email Address</label>
                          <p className="text-sm text-gray-900">{selectedUser.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Full Name</label>
                          <p className="text-sm text-gray-900">{selectedUser.full_name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Club Teams</label>
                          <p className="text-sm text-gray-900">
                            {selectedUser.teams && selectedUser.teams.length > 0 
                              ? selectedUser.teams.join(', ') 
                              : 'No team assignments'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Activity & Statistics */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">📊</span>
                        Activity Statistics
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Member Since</label>
                          <p className="text-sm text-gray-900">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Last Updated</label>
                          <p className="text-sm text-gray-900">{new Date(selectedUser.updated_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Last Login</label>
                          <p className="text-sm text-gray-900">
                            {selectedUser.last_login ? new Date(selectedUser.last_login).toLocaleDateString() : 'Never logged in'}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Login Count</label>
                          <p className="text-sm text-gray-900">{selectedUser.login_count || 0} times</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Failed Attempts</label>
                          <p className="text-sm text-gray-900">{selectedUser.failed_login_attempts || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Audit Trail */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <span className="mr-2">📝</span>
                      Recent Activity Logs
                    </h3>
                    <div className="space-y-2">
                      {selectedUserAuditLogs.length > 0 ? (
                        selectedUserAuditLogs.slice(0, 5).map((log) => (
                          <div key={log.id} className="flex items-center justify-between py-2 px-3 bg-white rounded-lg">
                            <div>
                              <span className="text-sm font-medium text-gray-900">{log.action}</span>
                              <span className="text-xs text-gray-500 ml-2">by {log.user_email}</span>
                            </div>
                            <span className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleDateString()}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No recent activity logs found</p>
                      )}
                    </div>
                  </div>

                  {/* Security Events */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <span className="mr-2">🛡️</span>
                      Security Events
                    </h3>
                    <div className="space-y-2">
                      {selectedUserSecurityEvents.length > 0 ? (
                        selectedUserSecurityEvents.slice(0, 5).map((event) => (
                          <div key={event.id} className="flex items-center justify-between py-2 px-3 bg-white rounded-lg">
                            <div>
                              <span className="text-sm font-medium text-gray-900">{event.event_type.replace('_', ' ')}</span>
                              <span className={`ml-2 px-2 py-1 text-xs font-bold rounded-full ${
                                event.risk_level === 'LOW' ? 'bg-green-100 text-green-800' :
                                event.risk_level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                event.risk_level === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {event.risk_level}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleDateString()}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No security events recorded</p>
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            </div>
          )}

          {/* Pending Account Requests */}
          {requests.filter(r => r.status === 'pending').length > 0 && (
            <div className="bg-white rounded-lg shadow border border-gray-200 mt-8">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="text-xl mr-2">📝</span>
                  Pending Account Requests
                  <span className="ml-2 bg-yellow-500 text-white text-sm font-medium px-2 py-1 rounded-full">
                    {requests.filter(r => r.status === 'pending').length}
                  </span>
                </h3>
                <p className="text-gray-600 mt-1">Review and approve new account requests</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Requested Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Applied Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requests.filter(r => r.status === 'pending').map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold">
                              <span className="text-sm">
                                {request.first_name[0]}{request.last_name[0]}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-gray-900">
                                {request.first_name} {request.last_name}
                              </div>
                              <div className="text-sm text-gray-500">{request.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getRoleBadge(request.requested_role)}`}>
                            {request.requested_role === 'coach' ? '⚽ Team Coach' :
                             request.requested_role === 'manager' ? '📋 Team Manager' :
                             request.requested_role === 'parent' ? '👨‍👩‍👧‍👦 Parent/Guardian' :
                             '🤝 Club Volunteer'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(request.requested_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a
                            href="/account-admin"
                            className="bg-club-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-club-secondary transition-colors"
                          >
                            Review Application →
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </StandardLayout>
  );
}

export default function UserManagement() {
  return (
    <>
      <Head>
        <title>User Management | RVR FC</title>
        <meta name="description" content="RVR Football Club user management system" />
      </Head>
      
      <RequireAuth>
        <UserManagementApp />
      </RequireAuth>
    </>
  );
}
