/**
 * Volunteer Signup Manager Component
 * Admin interface for viewing and verifying volunteer signups
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../SecureAuth';

interface VolunteerSignup {
  id: string;
  opportunity_id: string;
  volunteer_name: string;
  volunteer_email: string;
  volunteer_phone?: string;
  age_group?: string;
  previous_experience?: string;
  availability_notes?: string;
  motivation?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  admin_notes?: string;
  verified_by?: string;
  verified_at?: string;
  signed_up_at: string;
  updated_at: string;
  // Joined data from opportunity
  opportunity_title?: string;
  opportunity_category?: string;
  opportunity_date?: string;
  opportunity_location?: string;
}

const statusOptions = [
  { value: 'pending', label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  { value: 'approved', label: 'Approved', color: 'bg-green-100 text-green-800', icon: '✅' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800', icon: '❌' },
  { value: 'completed', label: 'Completed', color: 'bg-blue-100 text-blue-800', icon: '🎯' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-gray-100 text-gray-800', icon: '🚫' }
];

const ageGroups = [
  { value: 'under_16', label: 'Under 16' },
  { value: '16_25', label: '16-25' },
  { value: '26_35', label: '26-35' },
  { value: '36_50', label: '36-50' },
  { value: '51_65', label: '51-65' },
  { value: 'over_65', label: 'Over 65' }
];

export default function VolunteerSignupManager() {
  const { isAdmin, user } = useAuth();
  const [signups, setSignups] = useState<VolunteerSignup[]>([]);
  const [selectedSignup, setSelectedSignup] = useState<VolunteerSignup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'approved' | 'rejected'>('approved');
  const [adminNotes, setAdminNotes] = useState('');
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmTitle, setConfirmTitle] = useState('');

  useEffect(() => {
    if (isAdmin) {
      fetchSignups();
    }
  }, [isAdmin]);

  const fetchSignups = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('volunteer_signups')
        .select(`
          *,
          volunteer_opportunities (
            title,
            category,
            date,
            location
          )
        `)
        .order('signed_up_at', { ascending: false });

      if (error) {
        console.error('Error fetching volunteer signups:', error);
        setError('Database not connected. Using demo signups. To use real database, run the migration script.');
        // Create demo signups for development
        const demoSignups: VolunteerSignup[] = [
          {
            id: 'demo-signup-1',
            opportunity_id: 'demo-1',
            volunteer_name: 'John Doe',
            volunteer_email: 'john.doe@example.com',
            volunteer_phone: '+353 87 123 4567',
            age_group: '26_35',
            previous_experience: 'Coached youth team for 2 years at local club',
            motivation: 'Want to give back to the community and help develop young players',
            emergency_contact_name: 'Jane Doe',
            emergency_contact_phone: '+353 87 234 5678',
            status: 'pending',
            signed_up_at: '2025-09-20T14:30:00Z',
            updated_at: '2025-09-20T14:30:00Z',
            opportunity_title: 'Match Day Assistant Coach',
            opportunity_category: 'coaching',
            opportunity_date: '2025-10-05',
            opportunity_location: 'Home Ground'
          },
          {
            id: 'demo-signup-2',
            opportunity_id: 'demo-1',
            volunteer_name: 'Sarah Wilson',
            volunteer_email: 'sarah.wilson@example.com',
            volunteer_phone: '+353 86 987 6543',
            age_group: '36_50',
            previous_experience: 'Former player, current parent volunteer',
            motivation: 'My child plays for the club and I want to help out',
            status: 'approved',
            admin_notes: 'Excellent background, approved immediately',
            verified_by: 'admin',
            verified_at: '2025-09-20T15:00:00Z',
            signed_up_at: '2025-09-19T10:15:00Z',
            updated_at: '2025-09-20T15:00:00Z',
            opportunity_title: 'Match Day Assistant Coach',
            opportunity_category: 'coaching',
            opportunity_date: '2025-10-05',
            opportunity_location: 'Home Ground'
          }
        ];
        setSignups(demoSignups);
      } else {
        // Map the joined data
        const mappedSignups = (data || []).map(signup => ({
          ...signup,
          opportunity_title: signup.volunteer_opportunities?.title,
          opportunity_category: signup.volunteer_opportunities?.category,
          opportunity_date: signup.volunteer_opportunities?.date,
          opportunity_location: signup.volunteer_opportunities?.location
        }));
        setSignups(mappedSignups);
        setError(null);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load volunteer signups');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = (signup: VolunteerSignup, status: 'approved' | 'rejected') => {
    setSelectedSignup(signup);
    setVerificationStatus(status);
    setAdminNotes(signup.admin_notes || '');
    setShowVerificationModal(true);
  };

  const submitVerification = async () => {
    if (!selectedSignup) return;

    try {
      setLoading(true);

      const updateData = {
        status: verificationStatus,
        admin_notes: adminNotes,
        verified_by: user?.email || 'admin',
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Check if it's a demo signup
      if (selectedSignup.id.startsWith('demo-')) {
        setSignups(prevSignups =>
          prevSignups.map(s =>
            s.id === selectedSignup.id ? { ...s, ...updateData } : s
          )
        );
      } else {
        const { error } = await supabase
          .from('volunteer_signups')
          .update(updateData)
          .eq('id', selectedSignup.id);

        if (error) throw error;
        
        await fetchSignups();
      }

      setShowVerificationModal(false);
      setSelectedSignup(null);
      setAdminNotes('');
      
    } catch (err) {
      console.error('Error updating signup:', err);
      setError('Failed to update signup verification');
    } finally {
      setLoading(false);
    }
  };

  const showConfirmDialog = (title: string, message: string, action: () => void) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  const handleDelete = async (signupId: string) => {
    const signupToDelete = signups.find(s => s.id === signupId);
    if (!signupToDelete) return;
    
    const adminActions = (window as any).adminActions;
    
    if (adminActions && adminActions.addUndoableNotification) {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete ${signupToDelete.volunteer_name}'s signup?\n\n` +
        `This will:\n• Remove the signup permanently\n• Can be undone within 10 seconds\n\n` +
        `Opportunity: ${signupToDelete.opportunity_title}\n` +
        `Email: ${signupToDelete.volunteer_email}`
      );
      
      if (!confirmDelete) return;
      
      try {
        // Check if it's a demo signup
        if (signupId.startsWith('demo-')) {
          setSignups(prevSignups => prevSignups.filter(signup => signup.id !== signupId));
          return;
        }

        const { error } = await supabase
          .from('volunteer_signups')
          .delete()
          .eq('id', signupId);

        if (error) throw error;
        
        // Remove from local state immediately for responsive UI
        setSignups(prev => prev.filter(s => s.id !== signupId));
        
        // Create undo action
        const undoAction = {
          type: 'delete_signup' as const,
          data: signupToDelete,
          table: 'volunteer_signups',
          description: `Restored signup for ${signupToDelete.volunteer_name}`
        };
        
        // Add to unified undo system
        adminActions.addUndoableNotification(
          `🗑️ Volunteer signup for "${signupToDelete.volunteer_name}" has been deleted`,
          undoAction,
          10000
        );
        
      } catch (err) {
        console.error('Error deleting signup:', err);
        setError('Failed to delete signup');
      }
    } else {
      // Fallback to custom confirmation modal if admin actions not available
      const deleteAction = async () => {
        try {
          // Check if it's a demo signup
          if (signupId.startsWith('demo-')) {
            setSignups(prevSignups => prevSignups.filter(signup => signup.id !== signupId));
            return;
          }

          const { error } = await supabase
            .from('volunteer_signups')
            .delete()
            .eq('id', signupId);

          if (error) throw error;
          
          await fetchSignups();
        } catch (err) {
          console.error('Error deleting signup:', err);
          setError('Failed to delete signup');
        }
      };

      showConfirmDialog(
        '🗑️ Delete Signup',
        'Are you sure you want to delete this volunteer signup? This action cannot be undone.',
        deleteAction
      );
    }
  };

  const getStatusInfo = (status: string) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0];
  };

  const getAgeGroupLabel = (ageGroup: string) => {
    return ageGroups.find(ag => ag.value === ageGroup)?.label || ageGroup;
  };

  // Filter signups
  const filteredSignups = signups.filter(signup => {
    const matchesSearch = signup.volunteer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         signup.volunteer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         signup.opportunity_title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || signup.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (!isAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-700 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">📋 Volunteer Signup Management</h2>
            <p className="text-purple-100">Review and verify volunteer signups</p>
          </div>
          <div className="text-right">
            <div className="text-white/90 text-sm">
              <div>Total Signups: {signups.length}</div>
              <div>Pending: {signups.filter(s => s.status === 'pending').length}</div>
              <div>Approved: {signups.filter(s => s.status === 'approved').length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-6">
          <p className="text-yellow-800 font-semibold">{error}</p>
          <div className="mt-3 text-yellow-700 text-sm space-y-2">
            <p>To set up the database for volunteer signup management:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Open Supabase SQL Editor</li>
              <li>Run: <code className="bg-yellow-100 px-1 rounded">database/migrations/create_volunteer_system_tables.sql</code></li>
            </ol>
            <p className="text-xs text-yellow-600 mt-2">
              Current demo signups can be processed temporarily but won't persist.
            </p>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search signups..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={fetchSignups}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Signups List */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading signups...</p>
          </div>
        ) : filteredSignups.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Signups Found</h3>
            <p className="text-gray-600">No volunteer signups match your search criteria</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredSignups.map((signup) => {
              const statusInfo = getStatusInfo(signup.status);
              return (
                <motion.div
                  key={signup.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 bg-white border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{signup.volunteer_name}</h3>
                        
                        {/* Status Badge */}
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusInfo.color}`}>
                          {statusInfo.icon} {statusInfo.label}
                        </span>
                        
                        {/* Priority indicator for pending */}
                        {signup.status === 'pending' && (
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                            🔔 Needs Review
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">📧 {signup.volunteer_email}</p>
                          {signup.volunteer_phone && <p className="text-sm text-gray-600">📱 {signup.volunteer_phone}</p>}
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600"><strong>Opportunity:</strong> {signup.opportunity_title}</p>
                          {signup.opportunity_date && <p className="text-sm text-gray-600">📅 {new Date(signup.opportunity_date).toLocaleDateString()}</p>}
                          {signup.opportunity_location && <p className="text-sm text-gray-600">📍 {signup.opportunity_location}</p>}
                        </div>
                        
                        <div>
                          {signup.age_group && <p className="text-sm text-gray-600"><strong>Age:</strong> {getAgeGroupLabel(signup.age_group)}</p>}
                          <p className="text-sm text-gray-600"><strong>Signed up:</strong> {new Date(signup.signed_up_at).toLocaleDateString()}</p>
                          {signup.verified_at && <p className="text-sm text-gray-600"><strong>Verified:</strong> {new Date(signup.verified_at).toLocaleDateString()}</p>}
                        </div>
                      </div>
                      
                      {signup.motivation && (
                        <div className="mb-2">
                          <p className="text-sm text-gray-600"><strong>Motivation:</strong> {signup.motivation}</p>
                        </div>
                      )}
                      
                      {signup.previous_experience && (
                        <div className="mb-2">
                          <p className="text-sm text-gray-600"><strong>Experience:</strong> {signup.previous_experience}</p>
                        </div>
                      )}
                      
                      {signup.admin_notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded">
                          <p className="text-sm text-gray-700"><strong>Admin Notes:</strong> {signup.admin_notes}</p>
                          {signup.verified_by && <p className="text-xs text-gray-500">Verified by: {signup.verified_by}</p>}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      {signup.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleVerification(signup, 'approved')}
                            className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-sm font-medium transition-all"
                          >
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => handleVerification(signup, 'rejected')}
                            className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm font-medium transition-all"
                          >
                            ❌ Reject
                          </button>
                        </>
                      )}
                      
                      {signup.status === 'approved' && (
                        <button
                          onClick={() => {
                            const completeAction = async () => {
                              try {
                                const updateData = { 
                                  status: 'completed',
                                  updated_at: new Date().toISOString()
                                };
                                
                                if (signup.id.startsWith('demo-')) {
                                  setSignups(prevSignups =>
                                    prevSignups.map(s => s.id === signup.id ? { ...s, ...updateData } : s)
                                  );
                                } else {
                                  await supabase.from('volunteer_signups').update(updateData).eq('id', signup.id);
                                  await fetchSignups();
                                }
                              } catch (err) {
                                setError('Failed to mark as completed');
                              }
                            };
                            
                            showConfirmDialog(
                              '🎯 Mark as Completed',
                              `Mark ${signup.volunteer_name}'s volunteer opportunity as completed?`,
                              completeAction
                            );
                          }}
                          className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm font-medium transition-all"
                        >
                          🎯 Complete
                        </button>
                      )}
                      
                      <button
                        onClick={() => setSelectedSignup(selectedSignup === signup ? null : signup)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition-all"
                      >
                        {selectedSignup === signup ? 'Hide Details' : 'View Details'}
                      </button>
                      
                      <button
                        onClick={() => handleDelete(signup.id)}
                        className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm font-medium transition-all"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  {selectedSignup === signup && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-200"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {signup.availability_notes && (
                          <div>
                            <strong className="text-gray-700">Availability Notes:</strong>
                            <p className="text-gray-600">{signup.availability_notes}</p>
                          </div>
                        )}
                        
                        {signup.emergency_contact_name && (
                          <div>
                            <strong className="text-gray-700">Emergency Contact:</strong>
                            <p className="text-gray-600">{signup.emergency_contact_name}</p>
                            {signup.emergency_contact_phone && (
                              <p className="text-gray-600">📱 {signup.emergency_contact_phone}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Verification Modal */}
      <AnimatePresence>
        {showVerificationModal && selectedSignup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowVerificationModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`${verificationStatus === 'approved' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 
                              'bg-gradient-to-r from-red-500 to-pink-600'} text-white p-6`}>
                <h3 className="text-xl font-bold">
                  {verificationStatus === 'approved' ? '✅ Approve Volunteer' : '❌ Reject Volunteer'}
                </h3>
                <p className="text-white/90 mt-1">{selectedSignup.volunteer_name}</p>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-gray-700 mb-2">
                    <strong>Opportunity:</strong> {selectedSignup.opportunity_title}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Email:</strong> {selectedSignup.volunteer_email}
                  </p>
                  {selectedSignup.motivation && (
                    <p className="text-gray-700 mb-4">
                      <strong>Motivation:</strong> {selectedSignup.motivation}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Notes {verificationStatus === 'rejected' && <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    rows={4}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder={verificationStatus === 'approved' ? 
                      'Optional notes for approval...' : 
                      'Reason for rejection (required)...'
                    }
                    required={verificationStatus === 'rejected'}
                  />
                </div>
                
                {/* Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowVerificationModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitVerification}
                    disabled={verificationStatus === 'rejected' && !adminNotes.trim()}
                    className={`flex-1 px-4 py-3 ${verificationStatus === 'approved' ? 
                      'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' : 
                      'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'} 
                      text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50`}
                  >
                    {verificationStatus === 'approved' ? 'Approve' : 'Reject'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleCancel}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`${confirmTitle.includes('Delete') ? 'bg-gradient-to-r from-red-500 to-pink-600' : 
                              'bg-gradient-to-r from-blue-500 to-indigo-600'} text-white p-6`}>
                <h3 className="text-xl font-bold">{confirmTitle}</h3>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed mb-6">{confirmMessage}</p>
                
                {/* Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className={`flex-1 px-4 py-3 ${confirmTitle.includes('Delete') ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700' : 
                              'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'} text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl`}
                  >
                    {confirmTitle.includes('Delete') ? 'Delete' : 'Confirm'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}