/**
 * Secure Login Button Component
 * Redirects to secure authentication system
 */

import React from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useAuth } from './SecureAuth';

export default function LoginButton() {
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
      // Use stable profile for decisions
      const currentProfile = stableProfile || profile;
      // If admin is logged in, go to admin dashboard
      if (currentProfile?.role?.toLowerCase() === 'admin') {
        router.push('/admin');
      } else {
        // User is logged in but not admin - sign them out
        signOut();
      }
    } else {
      // User is not logged in - redirect to secure login
      router.push('/login?returnTo=/match-central');
    }
  };

  // Determine main button styling based on auth state
  const getMainButtonStyles = () => {
    const currentProfile = stableProfile || profile;
    if (user && currentProfile) {
      switch (currentProfile.role?.toLowerCase()) {
        case 'admin':
          return {
            gradient: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
            icon: '⚙️',
            label: 'Admin'
          };
        case 'editor':
          return {
            gradient: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
            icon: '✏️',
            label: 'Editor Logout'
          };
        case 'coach':
        case 'manager':
          return {
            gradient: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
            icon: '⚽',
            label: 'Coach Logout'
          };
        default:
          return {
            gradient: 'from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700',
            icon: '👤',
            label: 'Logout'
          };
      }
    }
    return {
      gradient: 'from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
      icon: '🔐',
      label: 'Login'
    };
  };

  const mainButtonStyles = getMainButtonStyles();
  const currentProfile = stableProfile || profile;
  const userName = currentProfile?.full_name?.split(' ')[0] || currentProfile?.username || 'User';

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={handleButtonClick}
      className={`bg-gradient-to-r ${mainButtonStyles.gradient} text-white font-medium px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      title={user ? 
        (currentProfile?.role?.toLowerCase() === 'admin' ? `Admin Dashboard - ${userName}` : `Logout ${userName} (${currentProfile?.role})`) 
        : 'Access secure login'}
    >
      <span className="text-base">{mainButtonStyles.icon}</span>
      <span className="text-sm">
        {mainButtonStyles.label}
      </span>
    </motion.button>
  );
}