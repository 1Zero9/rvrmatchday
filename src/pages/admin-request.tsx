/**
 * Admin Account Request Form - Administrative Role Access
 * Allows users to request admin/editor access to the system
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import StandardLayout from '../components/StandardLayout';
import { supabase } from '../lib/supabase';

interface AdminRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'admin' | 'editor';
  teamInterest: string[];
  experience: string;
}

export default function AdminRequest() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<AdminRequest>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'editor',
    teamInterest: [],
    experience: ''
  });

  const availableTeams = [
    'U8 Boys', 'U9 Boys', 'U10 Boys', 'U12 Boys', 'U14 Boys', 'U16 Boys', 'U18 Boys',
    'U8 Girls', 'U9 Girls', 'U12 Girls', 'U14 Girls', 'U16 Girls',
    'Junior Academy U8s', 'Junior Academy U9s',
    'Senior Men', 'Senior Women', 'Veterans (O35)',
    'Inclusive Football', 'All Teams (Admin Only)'
  ];

  const handleTeamInterestChange = (team: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        teamInterest: [...prev.teamInterest, team]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        teamInterest: prev.teamInterest.filter(t => t !== team)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate mandatory fields
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.phone || !formData.role) {
      alert('Please fill in all mandatory fields (highlighted in purple)');
      return;
    }

    setSubmitting(true);

    try {
      // Create admin account request record
      const requestData = {
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        requested_role: formData.role,
        team_interest: formData.teamInterest,
        experience: formData.experience || null,
        status: 'pending'
      };

      const { data: insertData, error } = await supabase
        .from('account_requests')
        .insert(requestData)
        .select()
        .single();

      if (error) {
        console.error('Database error details:', error);
        alert(`Database error: ${error.message || 'Unknown error'}. Please check console for details.`);
        throw error;
      }

      // Send email notification to admins
      try {
        const response = await fetch('/api/email/send-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'account_request_admin',
            data: {
              requestId: insertData.id,
              applicantName: `${formData.firstName} ${formData.lastName}`,
              applicantEmail: formData.email,
              requestedRole: formData.role,
              teamInterest: formData.teamInterest,
              isAdminRequest: true
            }
          })
        });

        if (!response.ok) {
          console.warn('Email notification failed:', await response.text());
        }
      } catch (emailError) {
        console.warn('Failed to send admin notification email:', emailError);
        // Don't fail the request if email fails
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Error submitting request. Please try again. If the problem persists, please contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <StandardLayout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">✓</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Request Submitted!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your interest in administrative access to Rivervalley Rangers AFC. Your request has been submitted for review.
              </p>
              <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-purple-700">
                      <strong>What happens next:</strong>
                    </p>
                    <ul className="mt-2 text-sm text-purple-600 space-y-1">
                      <li>• Senior administrators will review your application</li>
                      <li>• You may be contacted for additional verification</li>
                      <li>• Admin requests typically take 3-5 business days</li>
                      <li>• If approved, you'll receive login credentials and admin training</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/match-central')}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Return to Match Central
                </button>
                <button
                  onClick={() => router.push('/home')}
                  className="ml-3 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Return to Homepage
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </StandardLayout>
    );
  }

  // Check if all mandatory fields are filled
  const mandatoryFieldsFilled = formData.email && formData.firstName && formData.lastName && formData.phone && formData.role;

  return (
    <StandardLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="text-6xl mb-6">🔑</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Request Administrative Access</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Apply for admin or editor privileges to manage club content and operations.
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Mandatory Fields Notice */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">⚠️</span>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900">Administrative Access Requirements</h3>
                    <p className="text-purple-700 text-sm mt-1">
                      All fields marked with a <span className="text-purple-600 font-bold">purple label</span> are mandatory. Admin access requires additional verification.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                
                {/* First Name */}
                <div>
                  <label className="block text-sm font-bold text-purple-600 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter your first name"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-bold text-purple-600 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter your last name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-purple-600 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-bold text-purple-600 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+353 87 123 4567"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-bold text-purple-600 mb-2">
                    Requested Access Level *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                  >
                    <option value="editor">Content Editor</option>
                    <option value="admin">System Administrator</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Editor: Manage content and news. Admin: Full system access.
                  </p>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relevant Experience (Required for Admin)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    placeholder="Describe your technical or administrative experience, previous roles, qualifications..."
                  />
                </div>
              </div>

              {/* Team Interest */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Team/Area Interest (Optional)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableTeams.map((team) => (
                    <label key={team} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        checked={formData.teamInterest.includes(team)}
                        onChange={(e) => handleTeamInterestChange(team, e.target.checked)}
                      />
                      <span className="text-sm text-gray-700">{team}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Admin Access Disclaimer */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">🛡️</span>
                  <div>
                    <h3 className="text-lg font-semibold text-red-900 mb-2">Administrative Access Policy</h3>
                    <div className="text-red-800 text-sm space-y-2">
                      <p>
                        <strong>Enhanced Verification Required:</strong> Administrative access requires additional security checks:
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Enhanced Garda Vetting clearance</li>
                        <li>References from current club officials</li>
                        <li>Technical competency assessment (admin role)</li>
                        <li>Signed confidentiality and data protection agreement</li>
                        <li>Regular access reviews and training requirements</li>
                      </ul>
                      <p className="mt-3">
                        <strong>Data Protection:</strong> Admin access involves handling sensitive club and member data. Full GDPR compliance training is mandatory.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={submitting || !mandatoryFieldsFilled}
                  className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all ${
                    mandatoryFieldsFilled && !submitting
                      ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting Request...
                    </span>
                  ) : mandatoryFieldsFilled ? (
                    'Submit Admin Access Request'
                  ) : (
                    'Please Complete All Mandatory Fields'
                  )}
                </button>
              </div>

              {/* Form Status */}
              {!mandatoryFieldsFilled && (
                <div className="text-center text-sm text-gray-500">
                  Please fill in all fields marked with purple labels to submit your request
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </StandardLayout>
  );
}