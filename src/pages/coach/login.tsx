import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

export default function CoachLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) throw error;

      if (data.user) {
        // Check if user is a coach and approved
        const { data: coachData, error: coachError } = await supabase
          .from('coaches')
          .select('is_approved, first_name, last_name')
          .eq('user_id', data.user.id)
          .single();

        if (coachError) {
          setMessage('Account not found. Please register as a coach first.');
          await supabase.auth.signOut();
          return;
        }

        if (!coachData.is_approved) {
          setMessage('Your coach account is pending approval. Please contact the club administrator.');
          await supabase.auth.signOut();
          return;
        }

        // Success - redirect to coach dashboard
        router.push('/coach/dashboard');
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      if (error && typeof error === 'object' && 'message' in error) {
        setMessage(error.message as string);
      } else {
        setMessage('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!formData.email) {
      setMessage('Please enter your email address first, then click "Reset Password".');
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email);
      if (error) throw error;
      
      setMessage('Password reset email sent! Check your inbox and spam folder.');
    } catch (error) {
      console.error('Password reset error:', error);
      setMessage('Failed to send password reset email. Please try again.');
    }
  };

  return (
    <Layout currentSection="public">
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto px-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display text-gray-900 mb-4">
                Coach Login
              </h1>
              <p className="text-gray-700">
                Access your coaching dashboard
              </p>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-lg text-sm ${
                message.includes('sent') || message.includes('success') ? 
                'bg-green-50 text-green-700 border border-green-200' : 
                'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
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
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 rounded-md font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Password Reset */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={handlePasswordReset}
                className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
              >
                Forgot your password?
              </button>
            </div>

            {/* Registration Link */}
            <div className="mt-8 text-center bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 text-sm">
                Not registered as a coach yet?
              </p>
              <Link 
                href="/coach/register" 
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Apply to become a coach
              </Link>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">First Time Logging In?</h4>
              <p className="text-xs text-blue-700">
                After registering, you&apos;ll need to verify your email and wait for admin approval. 
                Contact the club if you have issues accessing your account.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}