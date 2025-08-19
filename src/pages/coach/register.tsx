import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { ChangeLogger } from '@/lib/changeLog';
import { motion } from 'framer-motion';

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  coaching_qualifications: string[];
  emergency_contact_name: string;
  emergency_contact_phone: string;
  bio: string;
}

export default function CoachRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    coaching_qualifications: [],
    emergency_contact_name: '',
    emergency_contact_phone: '',
    bio: ''
  });

  const qualificationOptions = [
    'FAI Grassroots Certificate',
    'FAI Club Coaching Certificate',
    'UEFA C License',
    'UEFA B License', 
    'UEFA A License',
    'First Aid Certified',
    'Safeguarding Children Certificate',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQualificationChange = (qualification: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      coaching_qualifications: checked
        ? [...prev.coaching_qualifications, qualification]
        : prev.coaching_qualifications.filter(q => q !== qualification)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // First sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: 'temporary-password-12345', // They'll need to reset this
        options: {
          data: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            role: 'coach'
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create the coach profile
        const coachData = {
          user_id: authData.user.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          coaching_qualifications: formData.coaching_qualifications,
          emergency_contact_name: formData.emergency_contact_name,
          emergency_contact_phone: formData.emergency_contact_phone,
          bio: formData.bio,
          is_approved: false
        };

        const { error: coachError, data: coachResult } = await supabase
          .from('coaches')
          .insert(coachData)
          .select()
          .single();

        if (coachError) throw coachError;

        // Log the coach creation
        await ChangeLogger.created(
          'coaches', 
          coachResult.id, 
          coachData,
          `New coach registration: ${formData.first_name} ${formData.last_name} (${formData.email})`
        );

        // Create approval request
        const approvalData = {
          coach_id: coachResult.id,
          status: 'pending',
          notes: 'New coach registration'
        };

        const { error: approvalError, data: approvalResult } = await supabase
          .from('coach_approvals')
          .insert(approvalData)
          .select()
          .single();

        if (approvalError) throw approvalError;

        // Log the approval request
        await ChangeLogger.created(
          'coach_approvals',
          approvalResult.id,
          approvalData,
          `Coach approval request created for ${formData.first_name} ${formData.last_name}`
        );

        setMessage('Registration successful! Please check your email to verify your account. Your application will be reviewed by club administrators.');
        
        // Redirect after success
        setTimeout(() => {
          router.push('/coach/login');
        }, 3000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Registration failed. Please try again or contact the club administrator.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout currentSection="public">
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-display text-gray-900 mb-4">
                Coach Registration
              </h1>
              <p className="text-xl text-gray-700">
                Join our coaching team at Rivervalley Rangers AFC
              </p>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.includes('successful') ? 'bg-green-50 text-green-700 border border-green-200' : 
                'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      required
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      required
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="+353 123 456 789"
                    />
                  </div>
                </div>
              </div>

              {/* Coaching Qualifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Coaching Qualifications</h3>
                <p className="text-sm text-gray-600 mb-3">Select all that apply (at least one required):</p>
                <div className="grid md:grid-cols-2 gap-3">
                  {qualificationOptions.map((qualification) => (
                    <label key={qualification} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.coaching_qualifications.includes(qualification)}
                        onChange={(e) => handleQualificationChange(qualification, e.target.checked)}
                        className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{qualification}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      name="emergency_contact_name"
                      required
                      value={formData.emergency_contact_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Emergency contact name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      name="emergency_contact_phone"
                      required
                      value={formData.emergency_contact_phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="+353 123 456 789"
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  About You (Optional)
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Tell us about your coaching experience, philosophy, or what you hope to bring to the club..."
                />
              </div>

              {/* Submit */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading || formData.coaching_qualifications.length === 0}
                  className="w-full bg-primary-600 text-white py-3 rounded-md font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Registering...' : 'Submit Application'}
                </button>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  Your application will be reviewed by club administrators. You&apos;ll receive an email confirmation and further instructions.
                </p>
              </div>
            </form>

            {/* Already have account */}
            <div className="mt-8 text-center bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700">
                Already registered as a coach?{' '}
                <Link href="/coach/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                  Sign in here
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}