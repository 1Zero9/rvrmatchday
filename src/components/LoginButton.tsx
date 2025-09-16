/**
 * Login Button Component
 * Floating login button that opens the login popup
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginPopup from './LoginPopup';

export default function LoginButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const demoAuth = localStorage.getItem('rvr_demo_auth');
      setIsLoggedIn(!!demoAuth);
    };

    checkAuth();
    // Check periodically for auth changes
    const interval = setInterval(checkAuth, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Don't show login button if already logged in
  if (isLoggedIn) return null;

  return (
    <>
      <AnimatePresence>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => setShowLoginPopup(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-lg">🔐</span>
          <span className="hidden sm:inline">Login</span>
        </motion.button>
      </AnimatePresence>

      <LoginPopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
      />
    </>
  );
}