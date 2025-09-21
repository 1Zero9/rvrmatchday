/**
 * Multi-Step Registration Wizard
 * Professional registration process with legal agreements and step-by-step flow
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import StandardLayout from '../components/StandardLayout';

interface RegistrationData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'coach' | 'manager' | 'admin' | 'editor';
  teamInterest: string[];
  experience: string;
  legalAgreements: {
    legal_agreement_accepted: boolean;
    privacy_policy_accepted: boolean;
    data_usage_accepted: boolean;
    club_disclaimer_accepted: boolean;
  };
}

type WizardStep = 'personal' | 'role' | 'legal' | 'confirmation' | 'processing';

// Hero background with football image
function HeroBackground() {
  return (
    <div className="absolute inset-0">
      <img 
        src="/images/hero/training-hero.png" 
        alt="Rivervalley Rangers AFC Astro Pitch"
        className="w-full h-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-black/40"></div>
    </div>
  );
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
  'Inclusive Football'
];

// Progress Indicator Component - Compact version
function ProgressIndicator({ currentStep }: { currentStep: WizardStep }) {
  const steps = [
    { id: 'personal', label: 'Personal', icon: '👤' },
    { id: 'role', label: 'Role', icon: '⚽' },
    { id: 'legal', label: 'Legal', icon: '📋' },
    { id: 'confirmation', label: 'Confirm', icon: '✓' }
  ];

  const getStepIndex = (step: WizardStep) => {
    const index = steps.findIndex(s => s.id === step);
    return index === -1 ? 0 : index;
  };

  const currentIndex = getStepIndex(currentStep);

  return (
    <div>
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              index <= currentIndex 
                ? 'bg-white text-club-primary' 
                : 'bg-white/20 text-white/60'
            }`}>
              {index < currentIndex ? '✓' : step.icon}
            </div>
            {index < steps.length - 1 && (
              <div className={`h-0.5 w-12 mx-1 transition-all ${
                index < currentIndex ? 'bg-white' : 'bg-white/20'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="text-center mt-2">
        <h2 className="text-lg font-bold text-white">
          Step {currentIndex + 1}: {steps[currentIndex]?.label}
        </h2>
      </div>
    </div>
  );
}

// Navigation Buttons Component
function NavigationButtons({ 
  currentStep, 
  onNext, 
  onBack, 
  onCancel, 
  canNext = true, 
  isSubmitting = false 
}: {
  currentStep: WizardStep;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
  canNext?: boolean;
  isSubmitting?: boolean;
}) {
  const isFirstStep = currentStep === 'personal';
  const isLastStep = currentStep === 'confirmation';

  return (
    <div className="flex justify-between pt-4 border-t border-white/20 mt-4">
      <div className="flex space-x-2">
        {!isFirstStep && (
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white font-semibold rounded-lg transition-all text-sm"
          >
            ← Back
          </motion.button>
        )}
        <motion.button
          onClick={onCancel}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-red-500/20 backdrop-blur-sm border border-red-400/30 hover:bg-red-500/30 text-red-200 hover:text-red-100 font-semibold rounded-lg transition-all text-sm"
        >
          Cancel
        </motion.button>
      </div>

      <motion.button
        onClick={onNext}
        disabled={!canNext || isSubmitting}
        whileHover={canNext ? { scale: 1.05 } : {}}
        whileTap={canNext ? { scale: 0.95 } : {}}
        className={`px-6 py-2 font-semibold rounded-lg transition-all text-sm ${
          canNext && !isSubmitting
            ? 'bg-club-primary hover:bg-club-secondary text-white shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/20'
            : 'bg-white/10 text-white/50 cursor-not-allowed backdrop-blur-sm border border-white/20'
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </span>
        ) : isLastStep ? (
          'Submit Registration'
        ) : (
          'Next →'
        )}
      </motion.button>
    </div>
  );
}

export default function Register() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<WizardStep>('personal');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<RegistrationData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'coach',
    teamInterest: [],
    experience: '',
    legalAgreements: {
      legal_agreement_accepted: false,
      privacy_policy_accepted: false,
      data_usage_accepted: false,
      club_disclaimer_accepted: false,
    }
  });

  const handleNext = () => {
    const stepOrder: WizardStep[] = ['personal', 'role', 'legal', 'confirmation'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    } else if (currentStep === 'confirmation') {
      handleFinalSubmit();
    }
  };

  const handleBack = () => {
    const stepOrder: WizardStep[] = ['personal', 'role', 'legal', 'confirmation'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel registration? All progress will be lost.')) {
      router.push('/login');
    }
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 'personal':
        return !!(formData.email && formData.firstName && formData.lastName);
      case 'role':
        return !!(formData.role && (
          (formData.role === 'admin' || formData.role === 'editor') 
            ? formData.experience 
            : true
        ));
      case 'legal':
        return Object.values(formData.legalAgreements).every(agreed => agreed);
      case 'confirmation':
        return true;
      default:
        return false;
    }
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    setCurrentStep('processing');

    try {
      const now = new Date().toISOString();
      
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
          status: 'pending',
          legal_agreement_accepted: formData.legalAgreements.legal_agreement_accepted,
          legal_agreement_timestamp: now,
          privacy_policy_accepted: formData.legalAgreements.privacy_policy_accepted,
          privacy_policy_timestamp: now,
          data_usage_accepted: formData.legalAgreements.data_usage_accepted,
          data_usage_timestamp: now,
          club_disclaimer_accepted: formData.legalAgreements.club_disclaimer_accepted,
          club_disclaimer_timestamp: now,
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
      }

      // Show success message
      setTimeout(() => {
        router.push('/login?message=registration-submitted');
      }, 3000);

    } catch (error) {
      console.error('Error submitting registration:', error);
      alert('Error submitting registration. Please try again or contact the club administrator.');
      setCurrentStep('confirmation');
    } finally {
      setSubmitting(false);
    }
  };

  // Processing Step
  if (currentStep === 'processing') {
    return (
      <StandardLayout>
        <div className="relative overflow-hidden min-h-screen bg-gray-900">
          <HeroBackground />
          
          <div className="relative z-10 flex items-center justify-center px-4 py-8 min-h-screen">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white/15 backdrop-blur-md border border-white/30 rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4 text-white text-center"
            >
              <motion.div 
                className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 relative"
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                <span className="text-3xl text-white relative z-10">✓</span>
              </motion.div>
              <h1 className="text-3xl font-bold mb-4">Registration Submitted!</h1>
              <p className="text-white/80 mb-6">
                Thank you for registering with Rivervalley Rangers AFC. Your account request has been submitted for review.
              </p>
              <div className="bg-blue-500/20 backdrop-blur-sm border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg">
                <div className="text-left">
                  <p className="text-sm text-blue-200 font-semibold mb-2">Next Steps:</p>
                  <ul className="text-sm text-blue-100 space-y-1">
                    <li>• Club administrators will review your application</li>
                    <li>• You&apos;ll receive an email within 2-3 business days</li>
                    <li>• Administrative roles may require additional verification</li>
                    <li>• If approved, you&apos;ll receive login credentials</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-white/60">Redirecting to login page...</p>
            </motion.div>
          </div>
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout>
      <div className="relative overflow-hidden min-h-screen bg-gray-900">
        <HeroBackground />
        
        <div className="relative z-10 flex items-center justify-center px-4 py-6 min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-xl flex flex-col"
          >
            <div className="bg-white/15 backdrop-blur-md border border-white/30 rounded-xl shadow-2xl p-8 text-white flex flex-col">
              
              {/* Header */}
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">👥</div>
                <h1 className="text-2xl font-bold mb-1">Account Registration</h1>
                <p className="text-white/80 text-sm">Join Rivervalley Rangers AFC</p>
              </div>

              {/* Progress Indicator */}
              <div className="mb-4">
                <ProgressIndicator currentStep={currentStep} />
              </div>

              {/* Step Content */}
              <div>
                {/* Step 1: Personal Information */}
                {currentStep === 'personal' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-lg p-3">
                      <div className="flex items-start">
                        <span className="text-xl mr-2">⚠️</span>
                        <div>
                          <h3 className="font-semibold text-yellow-200 mb-1">Authorization Required</h3>
                          <p className="text-yellow-100 text-xs">
                            Accounts require approval from club leadership.
                          </p>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-3">Personal Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/70"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="First Name *"
                      />
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/70"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Last Name *"
                      />
                    </div>

                    <input
                      type="email"
                      required
                      className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/70 text-sm"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Email Address *"
                    />

                    <input
                      type="tel"
                      className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/70 text-sm"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Phone Number (Optional)"
                    />
                  </motion.div>
                )}

                {/* Step 2: Role & Team Selection */}
                {currentStep === 'role' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    <h3 className="text-lg font-semibold text-white mb-3">Select Your Role</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {roleOptions.map((role) => (
                        <motion.button
                          key={role.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ 
                            ...prev, 
                            role: role.id as any,
                            teamInterest: [] 
                          }))}
                          className={`p-4 rounded-lg border transition-all duration-200 text-left backdrop-blur-sm ${
                            formData.role === role.id
                              ? 'bg-white/30 border-white/50 shadow-lg'
                              : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-lg">{role.icon}</span>
                            <div className="flex-1">
                              <div className="font-semibold text-white text-sm">{role.label}</div>
                              <div className="text-xs text-white/70">{role.description}</div>
                            </div>
                            <div className="ml-auto">
                              <div className={`w-3 h-3 rounded-full border ${
                                formData.role === role.id
                                  ? 'border-white bg-white'
                                  : 'border-white/40'
                              }`}>
                                {formData.role === role.id && (
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full m-0.5"></div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Team Interest (for coaches and managers) */}
                    {(formData.role === 'coach' || formData.role === 'manager') && (
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-2">Team Interest</h3>
                        <div className="grid grid-cols-2 gap-1 max-h-32 overflow-y-auto">
                          {availableTeams.map((team) => (
                            <label key={team} className="flex items-center space-x-2 cursor-pointer p-2 rounded bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
                              <input
                                type="checkbox"
                                className="h-3 w-3 text-blue-400 focus:ring-blue-400 bg-white/20 border-white/30 rounded"
                                checked={formData.teamInterest.includes(team)}
                                onChange={(e) => {
                                  if (e.target.checked) {
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
                                }}
                              />
                              <span className="text-xs text-white/90">{team}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Experience */}
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-2">
                        Why are you requesting this role? {(formData.role === 'admin' || formData.role === 'editor') && '*'}
                      </h3>
                      <textarea
                        rows={3}
                        required={formData.role === 'admin' || formData.role === 'editor'}
                        className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/70"
                        value={formData.experience}
                        onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                        placeholder={
                          formData.role === 'admin' || formData.role === 'editor'
                            ? "Required: Explain why you need this administrative role and your relevant experience..."
                            : "Optional: Tell us why you're interested in this role and what you hope to contribute..."
                        }
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Legal Disclaimers & Agreements */}
                {currentStep === 'legal' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-5"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">Legal Agreements</h3>
                    
                    <div className="space-y-4">
                      {/* Legal Agreement */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                        <label className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-400 focus:ring-blue-400 bg-white/20 border-white/30 rounded mt-0.5"
                            checked={formData.legalAgreements.legal_agreement_accepted}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              legalAgreements: {
                                ...prev.legalAgreements,
                                legal_agreement_accepted: e.target.checked
                              }
                            }))}
                          />
                          <div>
                            <h4 className="font-semibold text-white text-sm flex items-center">
                              <span className="mr-2">📋</span>
                              Terms of Service
                            </h4>
                            <p className="text-xs text-white/80 mt-1">
                              I agree to use the system responsibly and comply with club policies.
                            </p>
                          </div>
                        </label>
                      </div>

                      {/* Privacy Policy */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                        <label className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-400 focus:ring-blue-400 bg-white/20 border-white/30 rounded mt-0.5"
                            checked={formData.legalAgreements.privacy_policy_accepted}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              legalAgreements: {
                                ...prev.legalAgreements,
                                privacy_policy_accepted: e.target.checked
                              }
                            }))}
                          />
                          <div>
                            <h4 className="font-semibold text-white text-sm flex items-center">
                              <span className="mr-2">🔒</span>
                              Privacy Policy
                            </h4>
                            <p className="text-xs text-white/80 mt-1">
                              I accept GDPR-compliant data processing for club administration.
                            </p>
                          </div>
                        </label>
                      </div>

                      {/* Data Usage */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                        <label className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-400 focus:ring-blue-400 bg-white/20 border-white/30 rounded mt-0.5"
                            checked={formData.legalAgreements.data_usage_accepted}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              legalAgreements: {
                                ...prev.legalAgreements,
                                data_usage_accepted: e.target.checked
                              }
                            }))}
                          />
                          <div>
                            <h4 className="font-semibold text-white text-sm flex items-center">
                              <span className="mr-2">📧</span>
                              Email Communications
                            </h4>
                            <p className="text-xs text-white/80 mt-1">
                              I consent to receive club-related emails and notifications.
                            </p>
                          </div>
                        </label>
                      </div>

                      {/* Club Disclaimer */}
                      <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-4 border border-red-400/30">
                        <label className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-red-400 focus:ring-red-400 bg-white/20 border-red-400/30 rounded mt-0.5"
                            checked={formData.legalAgreements.club_disclaimer_accepted}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              legalAgreements: {
                                ...prev.legalAgreements,
                                club_disclaimer_accepted: e.target.checked
                              }
                            }))}
                          />
                          <div>
                            <h4 className="font-semibold text-red-200 text-sm flex items-center">
                              <span className="mr-2">⚠️</span>
                              Liability Disclaimer
                            </h4>
                            <p className="text-xs text-red-100 mt-1">
                              I participate at my own risk and waive club liability for injuries.
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Confirmation */}
                {currentStep === 'confirmation' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-5"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">Confirm Registration</h3>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <h4 className="font-semibold text-white mb-3 text-sm">Summary</h4>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-white/70">Name:</span>
                          <div className="text-white font-medium">{formData.firstName} {formData.lastName}</div>
                        </div>
                        <div>
                          <span className="text-white/70">Email:</span>
                          <div className="text-white font-medium">{formData.email}</div>
                        </div>
                        <div>
                          <span className="text-white/70">Role:</span>
                          <div className="text-white font-medium">{roleOptions.find(r => r.id === formData.role)?.label}</div>
                        </div>
                        <div>
                          <span className="text-white/70">Phone:</span>
                          <div className="text-white font-medium">{formData.phone || 'Not provided'}</div>
                        </div>
                        {formData.teamInterest.length > 0 && (
                          <div className="col-span-2">
                            <span className="text-white/70">Teams:</span>
                            <div className="text-white font-medium">{formData.teamInterest.join(', ')}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-4 border border-green-400/30">
                      <h4 className="font-semibold text-green-200 mb-2 flex items-center text-sm">
                        <span className="mr-2">✅</span>
                        Legal Agreements Confirmed
                      </h4>
                      <div className="text-xs text-green-100 grid grid-cols-2 gap-1">
                        <div>✓ Terms accepted</div>
                        <div>✓ Privacy accepted</div>
                        <div>✓ Email consent</div>
                        <div>✓ Liability waiver</div>
                      </div>
                    </div>

                    <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-4 border border-blue-400/30">
                      <p className="text-blue-200 text-xs">
                        <strong>Next:</strong> Admin review within 2-3 business days.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Navigation */}
              <NavigationButtons
                currentStep={currentStep}
                onNext={handleNext}
                onBack={handleBack}
                onCancel={handleCancel}
                canNext={validateCurrentStep()}
                isSubmitting={submitting}
              />

              {/* Sign In Link */}
              <div className="text-center border-t border-white/20 pt-3">
                <a
                  href="/login"
                  className="inline-flex items-center gap-2 bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 hover:bg-blue-600/30 text-blue-200 hover:text-blue-100 font-semibold px-4 py-2 rounded-lg transition-all duration-300 text-sm"
                >
                  <span>🔑</span>
                  <span>Sign In Instead</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </StandardLayout>
  );
}