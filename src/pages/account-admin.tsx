/**
 * Account Administration - Manage User Account Requests
 * Admin interface for reviewing and approving account requests
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StandardLayout from '../components/StandardLayout';
import { supabase } from '../lib/supabase';
import { checkAdminAccess } from '../lib/adminAuth';

interface AccountRequest {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  requested_role: 'coach' | 'manager' | 'parent' | 'volunteer';
  team_interest: string[];
  experience?: string;
  reason: string;
  garda_vetting: boolean;
  safeguarding_course: boolean;
  status: 'pending' | 'approved' | 'denied';
  requested_at: string;
  reviewed_at?: string;
  reviewer_notes?: string;
}

export default function AccountAdmin() {
  const [requests, setRequests] = useState<AccountRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AccountRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const adminCheck = await checkAdminAccess();
    if (adminCheck.isAdmin) {
      setIsAdmin(true);
      loadRequests();
    } else {
      setLoading(false);
    }
  };

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

  const handleReview = async (requestId: string, decision: 'approved' | 'denied') => {
    if (!selectedRequest) return;
    
    setProcessing(true);
    try {
      // Update request status
      const { error: updateError } = await supabase
        .from('account_requests')
        .update({
          status: decision,
          reviewed_at: new Date().toISOString(),
          reviewer_notes: reviewNotes
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // If approved, create user account
      if (decision === 'approved') {
        // Generate temporary password
        const tempPassword = `RVR${Math.random().toString(36).substring(2, 8).toUpperCase()}!`;
        
        // Create auth account
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: selectedRequest.email,
          password: tempPassword,
          email_confirm: true
        });

        if (authError) throw authError;

        // Create user profile
        const { error: profileError } = await supabase
          .from('tracker_users')
          .insert({
            id: authData.user.id,
            email: selectedRequest.email,
            username: selectedRequest.email.split('@')[0],
            full_name: `${selectedRequest.first_name} ${selectedRequest.last_name}`,
            role: selectedRequest.requested_role,
            teams: [], // Will be assigned by admin later
            permissions: getDefaultPermissions(selectedRequest.requested_role),
            is_active: true
          });

        if (profileError) throw profileError;

        // TODO: Send welcome email with temporary password
        console.log(`User approved - temp password: ${tempPassword}`);
      }

      // Refresh the list
      await loadRequests();
      setSelectedRequest(null);
      setReviewNotes('');
      
    } catch (error) {
      console.error('Error processing request:', error);
      alert('Error processing request. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const getDefaultPermissions = (role: string): string[] => {
    switch (role) {
      case 'coach':
        return ['view_matches', 'create_matches', 'record_events', 'manage_teams', 'view_stats'];
      case 'manager':
        return ['view_matches', 'create_matches', 'record_events', 'view_stats'];
      case 'parent':
        return ['view_matches', 'view_stats'];
      case 'volunteer':
        return ['view_matches'];
      default:
        return ['view_matches'];
    }
  };

  if (loading) {
    return (
      <StandardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-600">Loading Account Requests...</p>
          </div>
        </div>
      </StandardLayout>
    );
  }

  if (!isAdmin) {
    return (
      <StandardLayout>
        <div className="min-h-screen bg-red-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-red-900 mb-2">Access Denied</h1>
            <p className="text-red-600">You need administrator privileges to access this page.</p>
          </div>
        </div>
      </StandardLayout>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const reviewedRequests = requests.filter(r => r.status !== 'pending');

  return (
    <StandardLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Administration</h1>
            <p className="text-gray-600">Review and manage user account requests</p>
          </div>

          {/* Pending Requests */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3 text-2xl">📋</span>
              Pending Requests ({pendingRequests.length})
            </h2>
            
            {pendingRequests.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-gray-500">No pending account requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {request.first_name} {request.last_name}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            request.requested_role === 'coach' ? 'bg-blue-100 text-blue-800' :
                            request.requested_role === 'manager' ? 'bg-green-100 text-green-800' :
                            request.requested_role === 'parent' ? 'bg-purple-100 text-purple-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {request.requested_role}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(request.requested_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>📧 {request.email}</div>
                          {request.phone && <div>📞 {request.phone}</div>}
                          {request.team_interest.length > 0 && (
                            <div>⚽ Teams: {request.team_interest.join(', ')}</div>
                          )}
                        </div>
                        
                        <div className="mt-2 text-sm">
                          <p className="font-medium text-gray-700">Reason:</p>
                          <p className="text-gray-600">{request.reason}</p>
                        </div>
                        
                        {request.experience && (
                          <div className="mt-2 text-sm">
                            <p className="font-medium text-gray-700">Experience:</p>
                            <p className="text-gray-600">{request.experience}</p>
                          </div>
                        )}
                        
                        {(request.requested_role === 'coach' || request.requested_role === 'manager') && (
                          <div className="mt-2 flex space-x-4 text-sm">
                            <span className={`flex items-center ${request.garda_vetting ? 'text-green-600' : 'text-red-600'}`}>
                              {request.garda_vetting ? '✅' : '❌'} Garda Vetting
                            </span>
                            <span className={`flex items-center ${request.safeguarding_course ? 'text-green-600' : 'text-red-600'}`}>
                              {request.safeguarding_course ? '✅' : '❌'} Safeguarding Course
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reviewed Requests */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3 text-2xl">📝</span>
              Reviewed Requests ({reviewedRequests.length})
            </h2>
            
            {reviewedRequests.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📝</div>
                <p className="text-gray-500">No reviewed requests yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviewedRequests.slice(0, 10).map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900">
                          {request.first_name} {request.last_name}
                        </span>
                        <span className="ml-2 text-sm text-gray-600">({request.email})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          request.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(request.reviewed_at!).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {request.reviewer_notes && (
                      <p className="text-sm text-gray-600 mt-1">Notes: {request.reviewer_notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Review Account Request
                </h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Applicant Details</h3>
                  <div className="space-y-1 text-sm">
                    <div><strong>Name:</strong> {selectedRequest.first_name} {selectedRequest.last_name}</div>
                    <div><strong>Email:</strong> {selectedRequest.email}</div>
                    {selectedRequest.phone && <div><strong>Phone:</strong> {selectedRequest.phone}</div>}
                    <div><strong>Requested Role:</strong> {selectedRequest.requested_role}</div>
                    <div><strong>Teams:</strong> {selectedRequest.team_interest.join(', ') || 'None specified'}</div>
                    <div><strong>Requested:</strong> {new Date(selectedRequest.requested_at).toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Reason for Access</h3>
                  <p className="text-sm text-gray-700">{selectedRequest.reason}</p>
                </div>
                
                {selectedRequest.experience && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Experience/Background</h3>
                    <p className="text-sm text-gray-700">{selectedRequest.experience}</p>
                  </div>
                )}
                
                {(selectedRequest.requested_role === 'coach' || selectedRequest.requested_role === 'manager') && (
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Compliance Status</h3>
                    <div className="space-y-1 text-sm">
                      <div className={selectedRequest.garda_vetting ? 'text-green-600' : 'text-red-600'}>
                        {selectedRequest.garda_vetting ? '✅' : '❌'} Garda Vetting Completed
                      </div>
                      <div className={selectedRequest.safeguarding_course ? 'text-green-600' : 'text-red-600'}>
                        {selectedRequest.safeguarding_course ? '✅' : '❌'} Safeguarding Course Completed
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Notes
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Add notes about this decision..."
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => handleReview(selectedRequest.id, 'approved')}
                  disabled={processing}
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg font-medium"
                >
                  {processing ? 'Processing...' : '✅ Approve'}
                </button>
                <button
                  onClick={() => handleReview(selectedRequest.id, 'denied')}
                  disabled={processing}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white rounded-lg font-medium"
                >
                  {processing ? 'Processing...' : '❌ Deny'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </StandardLayout>
  );
}