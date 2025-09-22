/**
 * 🏢 User Management Module - Main Component
 * 1Zero9.com - OneZeronine Studio
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
import { RequireAuth, useAuth } from '../../../components/SecureAuth';
import { supabase } from '../../../lib/supabase';
import StandardLayout from '../../../components/StandardLayout';
import { User, AccountRequest, AuditLog, SecurityEvent } from '../types';

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
      setLoading(true);
      
      // Load mock data for demonstration
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'admin@rvrfc.ie',
          username: 'admin',
          full_name: 'System Administrator',
          role: 'admin',
          teams: ['Senior Men', 'Youth'],
          permissions: ['all'],
          is_active: true,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-09-22T00:00:00Z',
          last_login: '2025-09-22T09:00:00Z',
          login_count: 156,
          failed_login_attempts: 0
        },
        {
          id: '2',
          email: 'coach.smith@rvrfc.ie',
          username: 'coach_smith',
          full_name: 'John Smith',
          role: 'coach',
          teams: ['U18 Boys'],
          permissions: ['team_management', 'match_recording'],
          is_active: true,
          created_at: '2025-02-15T00:00:00Z',
          updated_at: '2025-09-20T00:00:00Z',
          last_login: '2025-09-21T18:30:00Z',
          login_count: 89,
          failed_login_attempts: 1
        },
        {
          id: '3',
          email: 'parent.jones@email.com',
          username: 'parent_jones',
          full_name: 'Mary Jones',
          role: 'parent',
          teams: ['U12 Girls'],
          permissions: ['view_child_stats'],
          is_active: true,
          created_at: '2025-03-10T00:00:00Z',
          updated_at: '2025-09-18T00:00:00Z',
          last_login: '2025-09-19T19:15:00Z',
          login_count: 45,
          failed_login_attempts: 0
        }
      ];

      const mockRequests: AccountRequest[] = [
        {
          id: '1',
          email: 'new.volunteer@email.com',
          first_name: 'Sarah',
          last_name: 'Williams',
          phone: '+353-86-123-4567',
          requested_role: 'volunteer',
          team_interest: ['U10 Boys', 'U12 Girls'],
          experience: 'Previous coaching experience with local school',
          status: 'pending',
          requested_at: '2025-09-21T14:30:00Z',
          legal_agreement_accepted: true,
          privacy_policy_accepted: true,
          data_usage_accepted: true,
          club_disclaimer_accepted: true
        },
        {
          id: '2',
          email: 'coach.candidate@email.com',
          first_name: 'Michael',
          last_name: 'Murphy',
          requested_role: 'coach',
          team_interest: ['U16 Boys'],
          experience: 'UEFA B License, 5 years coaching experience',
          status: 'pending',
          requested_at: '2025-09-20T10:15:00Z',
          legal_agreement_accepted: true,
          privacy_policy_accepted: true,
          data_usage_accepted: true,
          club_disclaimer_accepted: true
        }
      ];

      setUsers(mockUsers);
      setRequests(mockRequests);
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = async (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
    
    // Load user-specific audit logs and security events
    // In real implementation, this would fetch from database
    setSelectedUserAuditLogs([]);
    setSelectedUserSecurityEvents([]);
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'approved' as const, reviewed_at: new Date().toISOString() }
          : req
      ));
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleDenyRequest = async (requestId: string, notes: string) => {
    try {
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { 
              ...req, 
              status: 'denied' as const, 
              reviewed_at: new Date().toISOString(),
              reviewer_notes: notes
            }
          : req
      ));
    } catch (error) {
      console.error('Error denying request:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <StandardLayout title="User Management" currentPage="/user-management">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-club-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading user management system...</p>
          </div>
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout title="User Management" currentPage="/user-management">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="mt-2 text-gray-600">Manage user accounts, permissions, and access controls</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{users.length}</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{users.filter(u => u.is_active).length}</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.is_active).length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{requests.filter(r => r.status === 'pending').length}</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{requests.filter(r => r.status === 'pending').length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">0</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Security Alerts</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search users by name, email, or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-club-primary"
                  />
                </div>
                <button className="px-4 py-2 bg-club-primary text-white rounded-md hover:bg-club-primary-dark transition-colors">
                  Add User
                </button>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">User Directory</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teams</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleUserClick(user)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-club-primary flex items-center justify-center">
                            <span className="text-white font-bold">
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
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'coach' ? 'bg-blue-100 text-blue-800' :
                          user.role === 'manager' ? 'bg-green-100 text-green-800' :
                          user.role === 'parent' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.teams.slice(0, 2).join(', ')}
                        {user.teams.length > 2 && ` +${user.teams.length - 2} more`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUserClick(user);
                          }}
                          className="text-club-primary hover:text-club-primary-dark"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Account Requests */}
          {requests.filter(r => r.status === 'pending').length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Pending Account Requests</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {requests.filter(r => r.status === 'pending').map((request) => (
                  <div key={request.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {request.first_name} {request.last_name}
                        </h3>
                        <p className="text-sm text-gray-500">{request.email}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Requesting <span className="font-medium">{request.requested_role}</span> access
                        </p>
                        <p className="text-sm text-gray-600">
                          Interested in: {request.team_interest.join(', ')}
                        </p>
                        {request.experience && (
                          <p className="text-sm text-gray-600 mt-2">
                            <span className="font-medium">Experience:</span> {request.experience}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleApproveRequest(request.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDenyRequest(request.id, 'Request denied')}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          Deny
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </StandardLayout>
  );
}

export default UserManagementApp;