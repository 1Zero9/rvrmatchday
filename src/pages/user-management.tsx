/**
 * User Management Dashboard - Complete User Administration
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Comprehensive user management interface for admins
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StandardLayout from '../components/StandardLayout';
import { supabase } from '../lib/supabase';
import { checkAdminAccess } from '../lib/adminAuth';

interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: 'admin' | 'coach' | 'manager' | 'parent' | 'volunteer';
  teams: string[];
  permissions: string[];
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

interface AccountRequest {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  requested_role: string;
  team_interest: string[];
  status: 'pending' | 'approved' | 'denied';
  requested_at: string;
}

type TabType = 'users' | 'requests' | 'roles' | 'teams';

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState<TabType>('requests');
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<AccountRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<Partial<User>>({});

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const adminCheck = await checkAdminAccess();
    if (adminCheck.isAdmin) {
      setIsAdmin(true);
      await loadData();
    } else {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      // Load users
      const { data: usersData, error: usersError } = await supabase
        .from('tracker_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData || []);

      // Load requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('account_requests')
        .select('*')
        .order('requested_at', { ascending: false });

      if (requestsError) throw requestsError;
      setRequests(requestsData || []);

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

  const tabs = [
    { id: 'requests', label: 'Account Requests', count: requests.filter(r => r.status === 'pending').length },
    { id: 'users', label: 'Active Users', count: users.filter(u => u.is_active).length },
    { id: 'roles', label: 'Role Management', count: users.length },
    { id: 'teams', label: 'Team Assignments', count: 0 }
  ];

  return (
    <StandardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">Manage user accounts, roles, and permissions</p>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                      activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Account Requests Tab */}
          {activeTab === 'requests' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Pending Account Requests
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Review and approve user account requests
                  </p>
                </div>
                <ul className="divide-y divide-gray-200">
                  {requests.filter(r => r.status === 'pending').map((request) => (
                    <li key={request.id}>
                      <div className="px-4 py-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {request.first_name[0]}{request.last_name[0]}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {request.first_name} {request.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{request.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadge(request.requested_role)}`}>
                            {request.requested_role}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(request.status)}`}>
                            {request.status}
                          </span>
                          <div className="flex space-x-2">
                            <a
                              href="/account-admin"
                              className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                            >
                              Review
                            </a>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                {requests.filter(r => r.status === 'pending').length === 0 && (
                  <div className="px-4 py-8 text-center text-gray-500">
                    No pending requests
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Active Users Tab */}
          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white shadow overflow-hidden sm:rounded-md"
            >
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Active Users
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Manage user accounts and permissions
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {user.full_name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-0 ${getRoleBadge(user.role)}`}
                          >
                            <option value="admin">Admin</option>
                            <option value="coach">Coach</option>
                            <option value="manager">Manager</option>
                            <option value="parent">Parent</option>
                            <option value="volunteer">Volunteer</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleUserStatusToggle(user.id, user.is_active)}
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.is_active 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {user.is_active ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleUserStatusToggle(user.id, user.is_active)}
                            className="text-red-600 hover:text-red-900"
                          >
                            {user.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Other tabs content would go here */}
          {activeTab === 'roles' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Role Management</h3>
              <p className="text-gray-600">Role-based permissions and access control settings.</p>
            </motion.div>
          )}

          {activeTab === 'teams' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Team Assignments</h3>
              <p className="text-gray-600">Assign users to specific teams and manage team access.</p>
            </motion.div>
          )}

        </div>
      </div>
    </StandardLayout>
  );
}