/**
 * Secure Login Page
 * Unified authentication entry point
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Image from 'next/image';
import StandardLayout from '../components/StandardLayout';
import { SecureLogin, useAuth } from '../components/SecureAuth';

function LoginPageContent() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [redirecting, setRedirecting] = React.useState(false);
  const [hasTriedRedirect, setHasTriedRedirect] = React.useState(false);

  useEffect(() => {
    console.log('Login page state:', { user: !!user, profile: !!profile, loading, redirecting, hasTriedRedirect });
    
    // Only try to redirect once
    if (user && profile && !loading && !redirecting && !hasTriedRedirect) {
      console.log('User is authenticated, redirecting...');
      setRedirecting(true);
      setHasTriedRedirect(true);
      
      const returnTo = router.query.returnTo as string || '/welcome';
      
      // Use router.replace instead of push to prevent back navigation issues
      router.replace(returnTo);
    }
  }, [user, profile, loading, redirecting, hasTriedRedirect]); // Add hasTriedRedirect to dependencies

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (user && profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Already Signed In</h1>
          <p className="text-gray-600 mb-4">
            {redirecting ? 'Redirecting...' : 'Redirecting you to your dashboard...'}
          </p>
          {redirecting && (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mt-4"></div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden" style={{ minHeight: 'calc(100vh - 120px)' }}>
      {/* Hero Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/images/hero/astro-ward.png" 
          alt="Rivervalley Rangers AFC Astro Pitch"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center px-4 py-16" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Glass morphism login card - matching home page style */}
          <div className="bg-white/15 backdrop-blur-md border border-white/30 rounded-xl shadow-2xl">
            <SecureLogin />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <StandardLayout>
      <LoginPageContent />
    </StandardLayout>
  );
}