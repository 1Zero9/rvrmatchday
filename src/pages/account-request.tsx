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
  reason: string;
  garda_vetting: boolean;
  safeguarding_course: boolean;
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
    experience: '',
    reason: '',
    garda_vetting: false,
    safeguarding_course: false
  });

  const availableTeams = [
    'U10 Boys', 'U12 Boys', 'U14 Boys', 'U16 Boys', 'U18 Boys',
    'U12 Girls', 'U14 Girls', 'U16 Girls',
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
    setSubmitting(true);

    try {
      // Create account request record
      const { error } = await supabase
        .from('account_requests')
        .insert({
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          requested_role: formData.role,
          team_interest: formData.teamInterest,
          experience: formData.experience,
          reason: formData.reason,
          garda_vetting: formData.garda_vetting,
          safeguarding_course: formData.safeguarding_course,
          status: 'pending',
          requested_at: new Date().toISOString()
        });

      if (error) throw error;

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Error submitting request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <StandardLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Request Submitted!</h1>
            <p className="text-gray-600 mb-6">
              Your account request has been submitted successfully. A club administrator will review your request and contact you within 2-3 business days.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/match-central')}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                Continue to Match Central
              </button>
              <button
                onClick={() => router.push('/home')}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
              >
                Back to Home
              </button>
            </div>
          </motion.div>
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Account Access</h1>
            <p className="text-gray-600">Join the RVR Match Central system to access team management tools</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Personal Information */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-3">👤</span>
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="+353 xx xxx xxxx"
                    />
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-3">🎯</span>
                  Role & Access Level
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { value: 'coach', label: 'Coach', desc: 'Full team management and match recording', icon: '🧑‍🏫' },
                    { value: 'manager', label: 'Team Manager', desc: 'Match recording and team coordination', icon: '📋' },
                    { value: 'parent', label: 'Parent/Guardian', desc: 'View matches and statistics for your child', icon: '👨‍👩‍👧‍👦' },
                    { value: 'volunteer', label: 'Club Volunteer', desc: 'Help with match day operations', icon: '🤝' }
                  ].map((role) => (
                    <label key={role.value} className="cursor-pointer">
                      <div className={`border-2 rounded-lg p-4 transition-all ${
                        formData.role === role.value 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="role"
                            value={role.value}
                            checked={formData.role === role.value}
                            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                            className="text-green-600"
                          />
                          <div className="text-2xl">{role.icon}</div>
                          <div>
                            <div className="font-medium text-gray-900">{role.label}</div>
                            <div className="text-sm text-gray-600">{role.desc}</div>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Team Interest */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-3">⚽</span>
                  Team Interest
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableTeams.map((team) => (
                    <label key={team} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.teamInterest.includes(team)}
                        onChange={(e) => handleTeamInterestChange(team, e.target.checked)}
                        className="text-green-600 rounded"
                      />
                      <span className="text-sm text-gray-700">{team}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience & Reason */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Football Experience/Background
                  </label>
                  <textarea
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                    placeholder="Tell us about your football background, coaching experience, or involvement with youth football..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why do you want access to Match Central? *
                  </label>
                  <textarea
                    required
                    value={formData.reason}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                    placeholder="Explain how you plan to use the system and your connection to RVR FC..."
                  />
                </div>
              </div>

              {/* Compliance (for coaches/managers) */}
              {(formData.role === 'coach' || formData.role === 'manager') && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <span className="mr-3">🛡️</span>
                    Compliance & Safety
                  </h2>
                  
                  <div className="space-y-3">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.garda_vetting}
                        onChange={(e) => setFormData(prev => ({ ...prev, garda_vetting: e.target.checked }))}
                        className="text-green-600 rounded mt-1"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">Garda Vetting Completed</span>
                        <p className="text-xs text-gray-600">Required for all coaching and management roles</p>
                      </div>
                    </label>
                    
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.safeguarding_course}
                        onChange={(e) => setFormData(prev => ({ ...prev, safeguarding_course: e.target.checked }))}
                        className="text-green-600 rounded mt-1"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">Safeguarding Course Completed</span>
                        <p className="text-xs text-gray-600">Child protection training certification</p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Submit */}
              <div className="border-t pt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Your request will be reviewed by a club administrator</li>
                    <li>• You'll receive an email within 2-3 business days</li>
                    <li>• If approved, you'll get login credentials and system access</li>
                    <li>• Coaches may require additional verification and training</li>
                  </ul>
                </div>
                
                <button
                  type="submit"
                  disabled={submitting || !formData.email || !formData.firstName || !formData.lastName || !formData.reason}
                  className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg font-bold transition-colors"
                >
                  {submitting ? 'Submitting Request...' : 'Submit Account Request'}
                </button>
              </div>
            </form>
          </motion.div>

        </div>
      </div>
    </StandardLayout>
  );
}