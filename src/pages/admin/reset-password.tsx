import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function AdminResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    // Check if this is a valid password reset session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsValidSession(true);
        } else {
          setMessage('Invalid or expired reset link. Please request a new password reset.');
        }
      } catch (error) {
        console.error('Session check error:', error);
        setMessage('Error validating reset session.');
      }
    };

    checkSession();
  }, []);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setMessage('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage('Password updated successfully! Redirecting to admin login...');
        
        // Sign out and redirect to login after 2 seconds
        setTimeout(async () => {
          await supabase.auth.signOut();
          router.push('/admin/login');
        }, 2000);
      }

    } catch (error) {
      console.error('Password reset error:', error);
      setMessage('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isValidSession && !message.includes('successfully')) {
    return (
      <Layout currentSection="">
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Reset Link</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <Link
                href="/admin/login"
                className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                Back to Admin Login
              </Link>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentSection="">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6 text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="text-white text-4xl mb-2">🔐</div>
                <h1 className="text-2xl font-bold text-white">Reset Admin Password</h1>
                <p className="text-red-100 text-sm">Create a new secure password</p>
              </motion.div>
            </div>

            {/* Form */}
            <div className="px-8 py-8">
              <form onSubmit={handlePasswordReset} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    minLength={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 8 characters long
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    minLength={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  />
                </motion.div>

                {message && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 rounded-lg text-sm ${
                      message.includes('successfully')
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {message}
                  </motion.div>
                )}

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  type="submit"
                  disabled={loading || message.includes('successfully')}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-3 rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating Password...
                    </span>
                  ) : message.includes('successfully') ? (
                    'Redirecting...'
                  ) : (
                    'Update Password'
                  )}
                </motion.button>

                {!message.includes('successfully') && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-center"
                  >
                    <Link 
                      href="/admin/login"
                      className="text-gray-600 hover:text-gray-800 text-sm transition-colors"
                    >
                      ← Back to Admin Login
                    </Link>
                  </motion.div>
                )}
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}