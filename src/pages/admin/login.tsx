import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { checkAdminAccess } from '@/lib/adminAuth';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const checkExistingSession = useCallback(async () => {
    try {
      const adminCheck = await checkAdminAccess();
      if (adminCheck.isAdmin) {
        router.push('/admin');
      }
    } catch {
      // Not logged in as admin, stay on login page
    }
  }, [router]);

  useEffect(() => {
    // Check if user is already logged in as admin
    checkExistingSession();
  }, [checkExistingSession]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setMessage('Invalid email or password. Please check your credentials.');
        } else {
          setMessage(error.message);
        }
        return;
      }

      if (data.user) {
        // Check if user has admin privileges
        const adminCheck = await checkAdminAccess();
        
        if (!adminCheck.isAdmin) {
          // Sign out the user since they don't have admin access
          await supabase.auth.signOut();
          setMessage('Access denied. This account does not have administrator privileges.');
          return;
        }

        // Success! Redirect to admin dashboard
        router.push('/admin');
      }

    } catch (error) {
      console.error('Login error:', error);
      setMessage('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/admin/reset-password`
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage('Password reset instructions have been sent to your email.');
        setShowResetForm(false);
        setResetEmail('');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setMessage('Failed to send password reset email. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <Layout currentSection="">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          {/* Admin Login Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6 text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="text-white text-4xl mb-2">🔐</div>
                <h1 className="text-2xl font-bold text-white">Admin Access</h1>
                <p className="text-red-100 text-sm">Rivervalley Rangers AFC</p>
              </motion.div>
            </div>

            {/* Form Content */}
            <div className="px-8 py-8">
              {!showResetForm ? (
                /* Login Form */
                <form onSubmit={handleLogin} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@rvrafc.ie"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    />
                  </motion.div>

                  {message && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`p-4 rounded-lg text-sm ${
                        message.includes('sent') || message.includes('Success')
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
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-3 rounded-lg hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Signing In...
                      </span>
                    ) : (
                      'Access Admin Panel'
                    )}
                  </motion.button>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-center space-y-3"
                  >
                    <button
                      type="button"
                      onClick={() => setShowResetForm(true)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                    >
                      Forgot your password?
                    </button>
                    
                    <div className="border-t border-gray-200 pt-3">
                      <Link 
                        href="/"
                        className="text-gray-600 hover:text-gray-800 text-sm transition-colors"
                      >
                        ← Back to Main Site
                      </Link>
                    </div>
                  </motion.div>
                </form>
              ) : (
                /* Password Reset Form */
                <form onSubmit={handlePasswordReset} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Reset Password</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Enter your admin email address and we&apos;ll send you instructions to reset your password.
                    </p>
                    
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="admin@rvrafc.ie"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </motion.div>

                  {message && (
                    <div className={`p-4 rounded-lg text-sm ${
                      message.includes('sent')
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {message}
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-all duration-200 disabled:opacity-50"
                    >
                      {resetLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowResetForm(false);
                        setMessage('');
                        setResetEmail('');
                      }}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-6 text-center"
          >
            <p className="text-white/70 text-xs">
              🔒 Secure admin access • All actions are logged and monitored
            </p>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}