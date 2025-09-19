/**
 * Account Registration Page
 * Unified registration form with role selection and approval process
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import StandardLayout from '../components/StandardLayout';
import { supabase } from '../lib/supabase';

interface RegistrationData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'coach' | 'manager' | 'admin' | 'editor';
  teamInterest: string[];
  experience: string;
}

interface RegistrationStep {
  step: 'initial' | 'terms' | 'processing';
}

const roleOptions = [
  {
    id: 'coach',
    label: 'Coach',
    icon: '⚽',
    description: 'Team coaching and player development',
    color: 'green'
  },
  {
    id: 'manager',
    label: 'Team Manager',
    icon: '📋',
    description: 'Match organization and team administration',
    color: 'blue'
  },
  {
    id: 'admin',
    label: 'Site Administrator',
    icon: '🛡️',
    description: 'Full system access and user management',
    color: 'red'
  },
  {
    id: 'editor',
    label: 'Content Editor',
    icon: '✏️',
    description: 'Website content and news management',
    color: 'purple'
  }
];

const availableTeams = [
  'U8 Boys', 'U9 Boys', 'U10 Boys', 'U12 Boys', 'U14 Boys', 'U16 Boys', 'U18 Boys',
  'U8 Girls', 'U9 Girls', 'U12 Girls', 'U14 Girls', 'U16 Girls',
  'Junior Academy U8s', 'Junior Academy U9s',
  'Senior Men', 'Senior Women', 'Veterans (O35)',
  'Inclusive Football', 'All Teams (Admin/Editor Only)'
];

export default function Register() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<'initial' | 'terms' | 'processing'>('initial');
  const [formData, setFormData] = useState<RegistrationData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'coach',
    teamInterest: [],
    experience: ''
  });

  const handleRoleChange = (role: string) => {
    setFormData(prev => ({ 
      ...prev, 
      role: role as any,
      teamInterest: [] // Reset team selection when role changes
    }));
  };

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

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate mandatory fields (phone is now optional)
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.role) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate admin/editor experience requirement
    if ((formData.role === 'admin' || formData.role === 'editor') && !formData.experience) {
      alert('Experience description is required for administrative roles');
      return;
    }

    // Move to terms and conditions step
    setCurrentStep('terms');
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);

    try {
      // Create account request record
      const { data: insertData, error } = await supabase
        .from('account_requests')
        .insert({
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          requested_role: formData.role,
          team_interest: formData.teamInterest,
          experience: formData.experience || null,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
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
              isAdminRequest: formData.role === 'admin' || formData.role === 'editor'
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

      setCurrentStep('processing');
    } catch (error) {
      console.error('Error submitting registration:', error);
      alert('Error submitting registration. Please try again or contact the club administrator.');
    } finally {
      setSubmitting(false);
    }
  };

  // Terms and Conditions Step
  if (currentStep === 'terms') {
    return (
      <StandardLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">📋</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms & Conditions</h1>
              <p className="text-gray-600">Please read and agree to our terms before proceeding</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto text-sm">
              <h3 className="font-bold text-lg mb-4">Rivervalley Rangers AFC - System Access Agreement</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. Account Authorization</h4>
                  <p>Access to the Rivervalley Rangers AFC management system is restricted to authorized personnel only. By requesting access, you confirm that you are a legitimate member of the club community in an official capacity.</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">2. Data Protection & Privacy</h4>
                  <p>You agree to handle all player, member, and club information in accordance with GDPR and Irish data protection laws. Personal information accessed through this system must be kept confidential and used only for legitimate club activities.</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">3. System Use</h4>
                  <p>The system is to be used exclusively for Rivervalley Rangers AFC activities. Unauthorized use, sharing of login credentials, or misuse of the system will result in immediate account suspension.</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">4. Child Protection</h4>
                  <p>All users with access to youth team information must comply with FAI and club child protection policies. Any concerns must be reported through proper channels immediately.</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">5. Account Approval</h4>
                  <p>Account requests are subject to verification and approval by club administrators. False information or unauthorized requests will be rejected. The club reserves the right to revoke access at any time.</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">6. Security</h4>
                  <p>You are responsible for maintaining the security of your account credentials. Report any suspected security breaches immediately to club administrators.</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">7. Liability</h4>
                  <p>Users are responsible for the accuracy of information they input. The club is not liable for any errors or omissions in the system data.</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <span className="text-2xl mr-3">⚠️</span>
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-2">Important Notice</h3>
                  <p className="text-yellow-800 text-sm">
                    By proceeding, you acknowledge that you are an authorized member of Rivervalley Rangers AFC 
                    and agree to use this system responsibly and in accordance with club policies.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentStep('initial')}
                className="flex-1 py-3 px-6 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
              >
                Back to Registration
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={submitting}
                className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
              >
                {submitting ? 'Processing...' : 'I Agree - Submit Registration'}
              </button>
            </div>
          </motion.div>
        </div>
      </StandardLayout>
    );
  }

  // Processing Step
  if (currentStep === 'processing') {
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
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Registration Submitted!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for registering with Rivervalley Rangers AFC. Your account request has been submitted for review.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Next Steps:</strong>
                    </p>
                    <ul className="mt-2 text-sm text-blue-600 space-y-1">
                      <li>• Club administrators will review your application</li>
                      <li>• You'll receive an email within 2-3 business days</li>
                      <li>• Administrative roles may require additional verification</li>
                      <li>• If approved, you'll receive login credentials</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/match-central')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
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

  const selectedRole = roleOptions.find(r => r.id === formData.role);
  const mandatoryFieldsFilled = formData.email && formData.firstName && formData.lastName;
  const canSubmit = mandatoryFieldsFilled && ((formData.role === 'admin' || formData.role === 'editor') ? formData.experience : true);

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
            <div className="text-6xl mb-6">👥</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Account Registration</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Register for access to Rivervalley Rangers AFC management systems
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl p-8"
          >
            <form onSubmit={handleInitialSubmit} className="space-y-8">
              
              {/* Important Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">⚠️</span>
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-900 mb-2">Authorization Required</h3>
                    <p className="text-yellow-800 text-sm">
                      Accounts are only available to <strong>authorized coaches, team managers, and site administrators</strong>. 
                      All registrations require approval from club leadership.
                    </p>
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Your Role</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {roleOptions.map((role) => (
                    <motion.button
                      key={role.id}
                      type="button"
                      onClick={() => handleRoleChange(role.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        formData.role === role.id
                          ? `border-${role.color}-500 bg-${role.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{role.icon}</span>
                        <div>
                          <div className="font-semibold text-gray-900">{role.label}</div>
                          <div className="text-sm text-gray-600">{role.description}</div>
                        </div>
                        <div className="ml-auto">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            formData.role === role.id
                              ? `border-${role.color}-500 bg-${role.color}-500`
                              : 'border-gray-300'
                          }`}>
                            {formData.role === role.id && (
                              <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Enter your last name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+353 87 123 4567"
                    />
                  </div>
                </div>
              </div>

              {/* Team Interest (for coaches and managers) */}
              {(formData.role === 'coach' || formData.role === 'manager') && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Interest</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {availableTeams.filter(team => !team.includes('Admin/Editor')).map((team) => (
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
              )}

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience & Background {(formData.role === 'admin' || formData.role === 'editor') && '*'}
                </label>
                <textarea
                  rows={4}
                  required={formData.role === 'admin' || formData.role === 'editor'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  placeholder={
                    formData.role === 'admin' || formData.role === 'editor'
                      ? "Required: Describe your technical or administrative experience, qualifications, and why you're requesting this level of access..."
                      : "Optional: Brief description of your football background, coaching experience, or relevant qualifications..."
                  }
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={submitting || !canSubmit}
                  className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all ${
                    canSubmit && !submitting
                      ? `bg-${selectedRole?.color}-600 hover:bg-${selectedRole?.color}-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105`
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting Registration...
                    </span>
                  ) : canSubmit ? (
                    `Continue to Terms & Conditions`
                  ) : (
                    'Please Complete Required Fields'
                  )}
                </button>
              </div>

              {/* Form Status */}
              {!canSubmit && (
                <div className="text-center text-sm text-gray-500">
                  {!mandatoryFieldsFilled 
                    ? 'Please fill in all required fields (Name and Email)'
                    : 'Experience description required for administrative roles'
                  }
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </StandardLayout>
  );
}