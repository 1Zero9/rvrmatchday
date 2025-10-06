/**
 * 📱 Mobile Login Page
 * Optimized for mobile devices with clean, modern design
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Head from 'next/head';
import { SecureLogin, useAuth, AuthProvider } from '../components/SecureAuth';
import { ThemeProvider, useRVRTheme } from '../utils/rvr-themes';
import { ArrowLeft, Shield, Users, Trophy } from 'lucide-react';

function MobileLoginContent() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const { currentTheme } = useRVRTheme();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (user && profile && !loading && !redirecting) {
      setRedirecting(true);
      const returnTo = router.query.returnTo as string || '/mobile-wow';
      
      setTimeout(() => {
        router.replace(returnTo);
      }, 100);
    }
  }, [user, profile, loading, router, redirecting]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: currentTheme.colors.primary }}
          ></div>
          <p className="text-lg font-medium text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (user && profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: currentTheme.colors.primary }}
          ></div>
          <p className="text-lg font-medium text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Sign In - Rivervalley Rangers AFC</title>
        <meta name="description" content="Sign in to your RVR AFC account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <motion.div 
          className="relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.headerGradient.from}, ${currentTheme.colors.headerGradient.via}, ${currentTheme.colors.headerGradient.to})`
          }}
          initial={{ height: 0 }}
          animate={{ height: 200 }}
          transition={{ duration: 0.6 }}
        >
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-20 h-20 bg-white/5 rounded-full"></div>
            <div className="absolute top-8 left-6 w-12 h-12 bg-white/5 rounded-full"></div>
          </div>

          {/* Header Content */}
          <div className="relative z-10 pt-12 px-6">
            {/* Back Button and Logo */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => router.back()}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
              >
                <ArrowLeft size={20} className="text-white" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Image src="/images/logo.png" alt="RVR AFC" width={32} height={32} className="rounded-full" />
                </div>
                <div>
                  <div className="text-white font-bold text-lg">RVR AFC</div>
                  <div className="text-white/80 text-sm">Mobile App</div>
                </div>
              </div>
              
              <div className="w-10 h-10"></div> {/* Spacer */}
            </div>

            {/* Welcome Text */}
            <div className="text-center">
              <h1 className="text-white text-2xl font-bold mb-2">Welcome Back</h1>
              <p className="text-white/80 text-sm">Sign in to access your club features</p>
            </div>
          </div>
        </motion.div>

        {/* Login Form */}
        <div className="flex-1 px-6 -mt-6 relative z-10">
          <motion.div
            className="bg-white rounded-t-3xl shadow-xl min-h-[500px] p-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Benefits */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Member Benefits</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: currentTheme.colors.primary + '20' }}>
                    <Shield size={16} style={{ color: currentTheme.colors.primary }} />
                  </div>
                  <span className="text-gray-700 text-sm">Access exclusive member content</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: currentTheme.colors.primary + '20' }}>
                    <Users size={16} style={{ color: currentTheme.colors.primary }} />
                  </div>
                  <span className="text-gray-700 text-sm">Connect with team members</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: currentTheme.colors.primary + '20' }}>
                    <Trophy size={16} style={{ color: currentTheme.colors.primary }} />
                  </div>
                  <span className="text-gray-700 text-sm">Track matches and achievements</span>
                </div>
              </div>
            </div>

            {/* Login Component */}
            <SecureLogin />

            {/* Footer Links */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-3">
                Don't have an account?
              </p>
              <button
                onClick={() => router.push('/mobile-join')}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Join RVR AFC
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default function MobileLoginPage() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MobileLoginContent />
      </ThemeProvider>
    </AuthProvider>
  );
}