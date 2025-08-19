import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { 
  checkAdminAccess,
  getPendingCoachApprovals,
  reviewCoachApproval,
  AdminUser 
} from '@/lib/adminAuth';

interface CoachApproval {
  id: string;
  status: string;
  requested_at: string;
  reviewed_at?: string;
  reviewer_notes?: string;
  coaches: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    experience_years?: number;
    qualifications?: string;
  };
}

export default function CoachApprovalsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [approvals, setApprovals] = useState<CoachApproval[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<{ [key: string]: string }>({});

  const initializePage = useCallback(async () => {
    try {
      // Check admin access
      const adminCheck = await checkAdminAccess();
      
      if (!adminCheck.isAdmin) {
        router.push('/');
        return;
      }

      setAdminUser(adminCheck.user!);

      // Load pending approvals
      const pendingApprovals = await getPendingCoachApprovals();
      setApprovals(pendingApprovals as unknown as CoachApproval[]);

    } catch (error) {
      console.error('Error initializing approvals page:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    initializePage();
  }, [initializePage]);

  const handleReviewDecision = async (approvalId: string, decision: 'approved' | 'denied') => {
    if (processingId) return; // Prevent multiple simultaneous requests

    try {
      setProcessingId(approvalId);
      
      const notes = reviewNotes[approvalId] || '';
      
      await reviewCoachApproval(approvalId, decision, notes);
      
      // Remove from local state
      setApprovals(prev => prev.filter(approval => approval.id !== approvalId));
      
      // Clear notes
      setReviewNotes(prev => {
        const newNotes = { ...prev };
        delete newNotes[approvalId];
        return newNotes;
      });

      // Show success message (you could add a toast notification here)
      console.log(`Coach application ${decision} successfully`);

    } catch (error) {
      console.error('Error processing approval:', error);
      alert(`Failed to ${decision === 'approved' ? 'approve' : 'deny'} application. Please try again.`);
    } finally {
      setProcessingId(null);
    }
  };

  const updateReviewNotes = (approvalId: string, notes: string) => {
    setReviewNotes(prev => ({
      ...prev,
      [approvalId]: notes
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
            <p className="text-gray-600">Loading coach applications...</p>
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
            <p className="text-red-600">Administrator privileges required.</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Coach Applications</h1>
              <p className="text-gray-600 mt-1">
                Review and approve coach registration requests
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {approvals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h2>
              <p className="text-gray-600 mb-6">
                There are no pending coach applications at this time.
              </p>
              <button
                onClick={() => router.push('/admin')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {approvals.map((approval, index) => (
                <motion.div
                  key={approval.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-6">
                    {/* Coach Info Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {approval.coaches.first_name} {approval.coaches.last_name}
                        </h3>
                        <p className="text-gray-600">{approval.coaches.email}</p>
                        <p className="text-sm text-gray-500">
                          Applied on {formatDate(approval.requested_at)}
                        </p>
                      </div>
                      <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                        Pending Review
                      </div>
                    </div>

                    {/* Coach Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Experience</h4>
                        <p className="text-gray-600">
                          {approval.coaches.experience_years 
                            ? `${approval.coaches.experience_years} years`
                            : 'Not specified'
                          }
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Qualifications</h4>
                        <p className="text-gray-600">
                          {approval.coaches.qualifications || 'Not specified'}
                        </p>
                      </div>
                    </div>

                    {/* Review Notes */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Review Notes (Optional)
                      </label>
                      <textarea
                        value={reviewNotes[approval.id] || ''}
                        onChange={(e) => updateReviewNotes(approval.id, e.target.value)}
                        placeholder="Add notes about this application (visible to the coach)..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        disabled={processingId === approval.id}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleReviewDecision(approval.id, 'approved')}
                        disabled={processingId !== null}
                        className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                          processingId === approval.id
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {processingId === approval.id ? (
                          <span className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </span>
                        ) : (
                          '✅ Approve Application'
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleReviewDecision(approval.id, 'denied')}
                        disabled={processingId !== null}
                        className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                          processingId === approval.id
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                      >
                        {processingId === approval.id ? (
                          <span className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </span>
                        ) : (
                          '❌ Deny Application'
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}