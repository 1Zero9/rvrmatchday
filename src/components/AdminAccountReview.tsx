/**
 * Admin Account Review Component
 * Manage user account requests from the main admin dashboard
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from './SecureAuth';
import '../styles/admin-grid.css';

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

interface PermissionSet {
  match_central: boolean;
  editor: boolean;
  admin: boolean;
}

export default function AdminAccountReview() {
  const [requests, setRequests] = useState<AccountRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<AccountRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showApprovalDetails, setShowApprovalDetails] = useState(false);
  const [tempPassword, setTempPassword] = useState('');
  const [permissions, setPermissions] = useState<PermissionSet>({
    match_central: false,
    editor: false,
    admin: false
  });
  
  const { user } = useAuth();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('account_requests')
        .select('*')
        .order('requested_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Set default permissions based on requested role
  useEffect(() => {
    if (selectedRequest) {
      const defaultPerms = getDefaultPermissions(selectedRequest.requested_role);
      setPermissions(defaultPerms);
    }
  }, [selectedRequest]);

  const getDefaultPermissions = (role: string): PermissionSet => {
    switch (role) {
      case 'admin':
        return { match_central: true, editor: true, admin: true };
      case 'editor':
        return { match_central: false, editor: true, admin: false };
      case 'coach':
      case 'manager':
        return { match_central: true, editor: false, admin: false };
      default:
        return { match_central: false, editor: false, admin: false };
    }
  };

  const handleReview = async (requestId: string, decision: 'approved' | 'denied') => {
    if (!selectedRequest || !user) return;
    
    setProcessing(true);
    try {
      const response = await fetch('/api/admin/approve-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          decision,
          reviewNotes,
          permissions,
          currentUserId: user.id
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to process request');
      }

      if (decision === 'approved' && result.tempPassword) {
        setTempPassword(result.tempPassword);
        setShowApprovalDetails(true);
      }

      // Refresh the requests list
      await loadRequests();
      setSelectedRequest(null);
      setReviewNotes('');
      setPermissions({ match_central: false, editor: false, admin: false });

    } catch (error) {
      console.error('Error processing request:', error);
      alert('Error processing request: ' + (error as Error).message);
    } finally {
      setProcessing(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      editor: 'bg-purple-100 text-purple-800',
      coach: 'bg-green-100 text-green-800',
      manager: 'bg-blue-100 text-blue-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      denied: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading account requests...</span>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const reviewedRequests = requests.filter(r => r.status !== 'pending');

  return (
    <div className="space-y-6">
      
      {/* Success Modal */}
      {showApprovalDetails && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Approved!</h3>
              <p className="text-gray-600 mb-4">User account created successfully.</p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Temporary Password:</p>
                <p className="font-mono text-lg text-blue-600 bg-white px-3 py-2 rounded border">
                  {tempPassword}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  User should change this password on first login
                </p>
              </div>
              
              <button 
                onClick={() => {
                  setShowApprovalDetails(false);
                  setTempPassword('');
                }}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Header with Summary Dashboard */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Account Requests</h2>
            <p className="text-gray-600">Review and approve new user account requests</p>
          </div>
        </div>
        
        {/* Summary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">⏳</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-800">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-900">{pendingRequests.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✅</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Approved</p>
                <p className="text-2xl font-bold text-green-900">
                  {reviewedRequests.filter(r => r.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">❌</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">Denied</p>
                <p className="text-2xl font-bold text-red-900">
                  {reviewedRequests.filter(r => r.status === 'denied').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📊</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">Total Requests</p>
                <p className="text-2xl font-bold text-blue-900">{requests.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Requests - Excel-like Grid */}
      {pendingRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm mr-3">
              {pendingRequests.length} Pending
            </span>
            Pending Requests
          </h3>
          
          <div className="excel-grid bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="grid-header">
              <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-medium text-gray-700">
                <div className="col-span-2">👤 Name</div>
                <div className="col-span-2">📧 Email</div>
                <div className="col-span-1">🏷️ Role</div>
                <div className="col-span-2">⚽ Teams</div>
                <div className="col-span-1">📞 Phone</div>
                <div className="col-span-2">📅 Requested</div>
                <div className="col-span-2">⚡ Actions</div>
              </div>
            </div>
            
            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {pendingRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  className={`grid-row grid grid-cols-12 gap-4 px-6 py-4 hover:bg-yellow-50 transition-colors cursor-pointer ${
                    index % 2 === 0 ? 'bg-white' : 'bg-yellow-25'
                  }`}
                  whileHover={{ backgroundColor: '#fefce8', x: 2 }}
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="col-span-2">
                    <div className="font-medium text-gray-900">
                      {request.first_name} {request.last_name}
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <div className="text-sm text-gray-600 truncate">
                      {request.email}
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(request.requested_role)}`}>
                      {request.requested_role.charAt(0).toUpperCase() + request.requested_role.slice(1)}
                    </span>
                  </div>
                  
                  <div className="col-span-2">
                    <div className="text-sm text-gray-600 truncate">
                      {request.team_interest?.join(', ') || 'None'}
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <div className="text-sm text-gray-600">
                      {request.phone?.replace(/^\+353-?/, '') || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <div className="text-sm text-gray-600">
                      {new Date(request.requested_at).toLocaleDateString('en-IE')}
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequest(request);
                        }}
                        className="grid-action-btn grid-action-btn-primary"
                      >
                        📝 Review
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequest(request);
                        }}
                        className="grid-action-btn grid-action-btn-success"
                      >
                        ✅ Quick Approve
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No Pending Requests */}
      {pendingRequests.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Requests</h3>
          <p className="text-gray-600">All account requests have been reviewed.</p>
        </div>
      )}

      {/* Review Modal */}
      {selectedRequest && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 max-h-screen overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Review Account Request</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Applicant</label>
                <p className="text-gray-900">{selectedRequest.first_name} {selectedRequest.last_name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{selectedRequest.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Requested Role</label>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(selectedRequest.requested_role)}`}>
                  {selectedRequest.requested_role.charAt(0).toUpperCase() + selectedRequest.requested_role.slice(1)}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Team Interest</label>
                <p className="text-gray-900">{selectedRequest.team_interest?.join(', ') || 'None specified'}</p>
              </div>
              
              {selectedRequest.experience && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Experience</label>
                  <p className="text-gray-900">{selectedRequest.experience}</p>
                </div>
              )}
              
              {/* Permission Checkboxes */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <label className="block text-sm font-medium text-gray-700 mb-3">Access Permissions</label>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.match_central}
                      onChange={(e) => setPermissions(prev => ({ ...prev, match_central: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm">
                      <span className="font-medium text-gray-900">⚽ Match Central Access</span>
                      <span className="block text-gray-500">View and record match data, team information</span>
                    </span>
                  </label>
                  
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.editor}
                      onChange={(e) => setPermissions(prev => ({ ...prev, editor: e.target.checked }))}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm">
                      <span className="font-medium text-gray-900">✏️ Editor Access</span>
                      <span className="block text-gray-500">Create and publish content, manage news articles</span>
                    </span>
                  </label>
                  
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.admin}
                      onChange={(e) => setPermissions(prev => ({ ...prev, admin: e.target.checked }))}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm">
                      <span className="font-medium text-gray-900">🛡️ Admin Access</span>
                      <span className="block text-gray-500">Full system access, user management, all features</span>
                    </span>
                  </label>
                </div>
                
                <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                  💡 <strong>Tip:</strong> You can grant multiple permissions. Admin access includes all other permissions.
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Review Notes</label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add notes about this decision..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => handleReview(selectedRequest.id, 'approved')}
                disabled={processing}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {processing ? 'Processing...' : '✅ Approve'}
              </button>
              <button
                onClick={() => handleReview(selectedRequest.id, 'denied')}
                disabled={processing}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {processing ? 'Processing...' : '❌ Deny'}
              </button>
              <button
                onClick={() => {
                  setSelectedRequest(null);
                  setReviewNotes('');
                  setPermissions({ match_central: false, editor: false, admin: false });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Recently Reviewed - Excel-like Grid */}
      {reviewedRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm mr-3">
              {reviewedRequests.length} Reviewed
            </span>
            Recently Reviewed
          </h3>
          
          <div className="excel-grid bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="grid-header">
              <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-medium text-gray-700">
                <div className="col-span-2">👤 Name</div>
                <div className="col-span-2">📧 Email</div>
                <div className="col-span-1">🏷️ Role</div>
                <div className="col-span-1">✅ Status</div>
                <div className="col-span-2">📅 Reviewed</div>
                <div className="col-span-4">📝 Notes</div>
              </div>
            </div>
            
            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {reviewedRequests.slice(0, 8).map((request, index) => (
                <div
                  key={request.id}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 transition-colors ${
                    request.status === 'approved' 
                      ? index % 2 === 0 ? 'bg-green-25 hover:bg-green-50' : 'bg-green-50 hover:bg-green-75'
                      : index % 2 === 0 ? 'bg-red-25 hover:bg-red-50' : 'bg-red-50 hover:bg-red-75'
                  }`}
                >
                  <div className="col-span-2">
                    <div className="font-medium text-gray-900">
                      {request.first_name} {request.last_name}
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <div className="text-sm text-gray-600 truncate">
                      {request.email}
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(request.requested_role)}`}>
                      {request.requested_role.charAt(0).toUpperCase() + request.requested_role.slice(1)}
                    </span>
                  </div>
                  
                  <div className="col-span-1">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(request.status)}`}>
                      {request.status === 'approved' ? '✅ Approved' : '❌ Denied'}
                    </span>
                  </div>
                  
                  <div className="col-span-2">
                    <div className="text-sm text-gray-600">
                      {request.reviewed_at ? new Date(request.reviewed_at).toLocaleDateString('en-IE') : 'N/A'}
                    </div>
                  </div>
                  
                  <div className="col-span-4">
                    <div className="text-sm text-gray-600 truncate">
                      {request.reviewer_notes || 'No notes provided'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Show More Button */}
            {reviewedRequests.length > 8 && (
              <div className="bg-gray-50 border-t border-gray-200 px-6 py-3">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View all {reviewedRequests.length} reviewed requests →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}