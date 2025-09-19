/**
 * DEPRECATED: Insecure Match Central Login
 * This page has been replaced by secure authentication
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import StandardLayout from '../../components/StandardLayout';

export default function MatchCentralLogin() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to secure login immediately
    router.push('/login?returnTo=/match-central');
  }, [router]);

  return (
    <StandardLayout>
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">🚨</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Security Update</h1>
            <p className="text-gray-600">Redirecting to secure authentication...</p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">🔐 Enhanced Security</h3>
              <p className="text-sm text-blue-700">
                Match Central now uses secure database authentication. You'll be redirected to the new login system automatically.
              </p>
            </div>

            <div className="text-center">
              <a
                href="/login?returnTo=/match-central"
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-6 rounded-lg font-bold transition-all"
              >
                Continue to Secure Login
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </StandardLayout>
  );
}