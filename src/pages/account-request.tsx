/**
 * Account Request Form - User Account Registration Workflow
 * Allows users to request access to the Match Central system
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import StandardLayout from '../components/StandardLayout';
import { supabase } from '../lib/supabase';

interface AccountRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'coach' | 'manager' | 'parent' | 'volunteer';
  teamInterest: string[];
  experience: string;
}

export default function AccountRequest() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<AccountRequest>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'parent',
    teamInterest: [],
    experience: ''
  });

  const availableTeams = [
    'U8 Boys', 'U9 Boys', 'U10 Boys', 'U12 Boys', 'U14 Boys', 'U16 Boys', 'U18 Boys',
    'U8 Girls', 'U9 Girls', 'U12 Girls', 'U14 Girls', 'U16 Girls',
    'Junior Academy U8s', 'Junior Academy U9s',
    'Senior Men', 'Senior Women', 'Veterans (O35)',
    'Inclusive Football'
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
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.phone || !formData.role || formData.teamInterest.length === 0) {
      alert('Please fill in all mandatory fields (highlighted in blue)');
      return;
    }

    setSubmitting(true);

    try {
      // Create account request record
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
              teamInterest: formData.teamInterest
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
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">✓</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Request Submitted!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your interest in joining Rivervalley Rangers AFC. Your account request has been submitted successfully.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>What happens next:</strong>
                    </p>
                    <ul className="mt-2 text-sm text-blue-600 space-y-1">
                      <li>• Our administrators will review your application</li>
                      <li>• You'll receive an email within 2-3 business days</li>
                      <li>• If approved, you'll get login credentials and welcome information</li>
                    </ul>
                  </div>
                </div>
              </div>
              <button
                onClick={() => router.push('/home')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Return to Homepage
              </button>
            </div>
          </motion.div>
        </div>
      </StandardLayout>
    );
  }

  // Check if all mandatory fields are filled
  const mandatoryFieldsFilled = formData.email && formData.firstName && formData.lastName && formData.phone && formData.role && formData.teamInterest.length > 0;

  return (
    <StandardLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="text-6xl mb-6">⚽</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Rivervalley Rangers AFC</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Request access to our club management system. Complete the form below and we'll review your application.
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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">ℹ️</span>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Required Information</h3>
                    <p className="text-blue-700 text-sm mt-1">
                      All fields marked with a <span className="text-blue-600 font-bold">blue label</span> are mandatory and must be completed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                
                {/* First Name */}
                <div>
                  <label className="block text-sm font-bold text-blue-600 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter your first name"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-bold text-blue-600 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter your last name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-blue-600 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-bold text-blue-600 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+353 87 123 4567"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-bold text-blue-600 mb-2">
                    Role *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                  >
                    <option value="parent">Parent/Guardian</option>
                    <option value="coach">Coach</option>
                    <option value="manager">Team Manager</option>
                    <option value="volunteer">Volunteer</option>
                  </select>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Football Experience (Optional)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    placeholder="Brief description of your football background or experience with youth teams..."
                  />
                </div>
              </div>

              {/* Team Interest */}
              <div>
                <label className="block text-sm font-bold text-blue-600 mb-4">
                  Team Interest * (Select at least one)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableTeams.map((team) => (
                    <label key={team} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={formData.teamInterest.includes(team)}
                        onChange={(e) => handleTeamInterestChange(team, e.target.checked)}
                      />
                      <span className="text-sm text-gray-700">{team}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">⚠️</span>
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-900 mb-2">Important Information</h3>
                    <div className="text-yellow-800 text-sm space-y-2">
                      <p>
                        <strong>Additional Requirements:</strong> Depending on your role, we may require additional documentation including:
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Garda Vetting (for coaches and volunteers working with children)</li>
                        <li>Safeguarding course completion certificate</li>
                        <li>Coaching qualifications (for coaching roles)</li>
                        <li>References from previous clubs or organizations</li>
                      </ul>
                      <p className="mt-3">
                        <strong>Data Protection:</strong> Your information will be used solely for club administration and communication purposes in accordance with GDPR regulations.
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
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
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
                    'Submit Account Request'
                  ) : (
                    'Please Complete All Mandatory Fields'
                  )}
                </button>
              </div>

              {/* Form Status */}
              {!mandatoryFieldsFilled && (
                <div className="text-center text-sm text-gray-500">
                  Please fill in all fields marked with blue labels to submit your request
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </StandardLayout>
  );
}