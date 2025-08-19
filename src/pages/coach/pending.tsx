import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

interface CoachApproval {
  status: string;
  requested_at: string;
  notes?: string;
}

export default function CoachPending() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [coachName, setCoachName] = useState('');
  const [approval, setApproval] = useState<CoachApproval | null>(null);

  const checkPendingStatus = useCallback(async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        router.push('/coach/login');
        return;
      }

      // Get coach details
      const { data: coachData, error: coachError } = await supabase
        .from('coaches')
        .select('first_name, last_name, is_approved')
        .eq('user_id', user.id)
        .single();

      if (coachError || !coachData) {
        router.push('/coach/login');
        return;
      }

      // If already approved, redirect to dashboard
      if (coachData.is_approved) {
        router.push('/coach/dashboard');
        return;
      }

      setCoachName(`${coachData.first_name} ${coachData.last_name}`);

      // Get approval status
      const { data: approvalData, error: approvalError } = await supabase
        .from('coach_approvals')
        .select('status, requested_at, notes')
        .eq('coach_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!approvalError && approvalData) {
        setApproval(approvalData);
      }

    } catch (error) {
      console.error('Error checking pending status:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkPendingStatus();
  }, [checkPendingStatus]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <Layout currentSection="public">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking your status...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentSection="public">
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <div className="text-center mb-8">
              {/* Pending Icon */}
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <h1 className="text-3xl font-display text-gray-900 mb-4">
                Application Under Review
              </h1>
              <p className="text-xl text-gray-700">
                Welcome, {coachName}!
              </p>
            </div>

            {/* Status Information */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                Your Coach Application Status
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-yellow-700">Status:</span>
                  <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-medium capitalize">
                    {approval?.status || 'Pending'}
                  </span>
                </div>
                
                {approval?.requested_at && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-yellow-700">Applied:</span>
                    <span className="text-sm text-yellow-600">
                      {new Date(approval.requested_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {approval?.notes && (
                <div className="mt-4 pt-4 border-t border-yellow-200">
                  <p className="text-sm text-yellow-700">
                    <strong>Notes:</strong> {approval.notes}
                  </p>
                </div>
              )}
            </div>

            {/* What Happens Next */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What Happens Next?</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Application Review</h4>
                    <p className="text-sm text-gray-600">Club administrators will review your application and qualifications.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-bold text-blue-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Background Check</h4>
                    <p className="text-sm text-gray-600">We may conduct background checks as required by FAI guidelines.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-bold text-blue-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Approval & Access</h4>
                    <p className="text-sm text-gray-600">Once approved, you&apos;ll gain access to the coach dashboard and team management tools.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Need Help?</h3>
              <p className="text-blue-700 mb-3">
                If you have questions about your application or need to update any information, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-blue-800">Email:</span>
                  <span className="text-blue-600 ml-2">coaches@rivervalleyrangers.ie</span>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Phone:</span>
                  <span className="text-blue-600 ml-2">+353 123 456 789</span>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Response Time:</span>
                  <span className="text-blue-600 ml-2">Usually within 3-5 business days</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleSignOut}
                className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Sign Out
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Refresh Status
              </button>
            </div>

            {/* Footer Note */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                This page will automatically redirect you to the coach dashboard once your application is approved.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}