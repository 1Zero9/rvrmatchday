/**
 * User Notification Component
 * Shows logged-in user info in header
 */

import React from 'react';
import { useAuth } from './SecureAuth';

export default function UserNotification() {
  const { user, profile, signOut } = useAuth();

  if (!user || !profile) {
    return null;
  }

  const getRoleConfig = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return {
          label: 'ADMIN',
          color: 'bg-red-500 text-white',
          icon: '🛡️',
          description: 'Site Administrator'
        };
      case 'editor':
        return {
          label: 'EDITOR',
          color: 'bg-purple-500 text-white',
          icon: '✏️',
          description: 'Content Editor'
        };
      case 'coach':
        return {
          label: 'COACH',
          color: 'bg-green-500 text-white',
          icon: '⚽',
          description: 'Team Coach'
        };
      case 'manager':
        return {
          label: 'MANAGER',
          color: 'bg-blue-500 text-white',
          icon: '📋',
          description: 'Team Manager'
        };
      case 'parent':
        return {
          label: 'PARENT',
          color: 'bg-orange-500 text-white',
          icon: '👨‍👩‍👧‍👦',
          description: 'Parent/Guardian'
        };
      case 'volunteer':
        return {
          label: 'VOLUNTEER',
          color: 'bg-teal-500 text-white',
          icon: '🤝',
          description: 'Club Volunteer'
        };
      default:
        return {
          label: 'USER',
          color: 'bg-gray-500 text-white',
          icon: '👤',
          description: 'Club Member'
        };
    }
  };

  const roleConfig = getRoleConfig(profile.role);
  const firstName = profile.full_name?.split(' ')[0] || profile.username || 'User';

  return (
    <div className="flex items-center space-x-3">
      {/* Enhanced Role Badge */}
      <div className={`${roleConfig.color} px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 shadow-lg border-2 border-white/20`}>
        <span className="text-lg">{roleConfig.icon}</span>
        <span className="hidden sm:inline">{roleConfig.label}</span>
        <span className="sm:hidden">{roleConfig.icon}</span>
      </div>

      {/* User Info */}
      <div className="hidden sm:flex items-center space-x-3">
        <div className="text-right">
          <div className="text-sm font-bold text-white drop-shadow-sm">{firstName}</div>
          <div className="text-xs text-white/80">{roleConfig.description}</div>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={signOut}
          className="ml-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1 border border-white/30 shadow-md"
          title="Secure Logout"
        >
          <span>🔓</span>
          <span className="hidden md:inline">LOGOUT</span>
        </button>
      </div>

      {/* Mobile - Enhanced logout */}
      <div className="sm:hidden">
        <button
          onClick={signOut}
          className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg text-sm transition-colors border border-white/30"
          title="Logout"
        >
          🔓
        </button>
      </div>
    </div>
  );
}