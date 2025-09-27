/**
 * Header Login Button Component
 * Displays user info and logout option in main site header
 */

import React from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useAuth } from './SecureAuth';

export default function HeaderLoginButton() {
  const router = useRouter();
  const [stableProfile, setStableProfile] = React.useState(null);
  
  // Safely try to use auth context, fallback if not available
  let user = null;
  let profile = null;
  let signOut = () => {};
  
  try {
    const authContext = useAuth();
    user = authContext.user;
    profile = authContext.profile;
    signOut = authContext.signOut;
  } catch (error) {
    // AuthProvider not available, continue with fallback values
  }

  // Update stable profile only when we have a valid profile
  React.useEffect(() => {
    if (profile && profile.role) {
      setStableProfile(profile);
    }
  }, [profile]);

  const handleButtonClick = () => {
    if (user) {
      // User is logged in - sign them out
      signOut();
    } else {
      // User is not logged in - redirect to secure login
      router.push('/login');
    }
  };

  const currentProfile = stableProfile || profile;
  const userName = currentProfile?.full_name?.split(' ')[0] || currentProfile?.username || 'User';

  if (user && currentProfile) {
    // User is logged in - show user info and logout
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center space-x-2"
      >
        {/* User Info */}
        <div className="text-right">
          <div className="text-sm font-medium text-white">
            {userName}
          </div>
          <div className="text-xs text-white/70 capitalize">
            {currentProfile.role}
          </div>
        </div>
        
        {/* Logout Button */}
        <motion.button
          onClick={handleButtonClick}
          className="bg-white/20 hover:bg-white/30 text-white font-medium px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          title={`Logout ${userName}`}
        >
          <span className="text-sm">🚪</span>
          <span className="text-sm">Logout</span>
        </motion.button>
      </motion.div>
    );
  }

  // User is not logged in - show login button
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={handleButtonClick}
      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      title="Login to access Match Central"
    >
      <span className="text-base">🔒</span>
      <span className="text-sm">Login</span>
    </motion.button>
  );
}